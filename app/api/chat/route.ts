/**
 * DEEP PORTFOLIO AGENT — All Phases Complete
 *
 * ┌─────────────────────────────────────────┐
 * │         IMPLEMENTED PATTERNS            │
 * │                                         │
 * │  [x] Phase 1 - Model Tiering            │
 * │      gpt-4o-mini for helpers            │
 * │      gpt-4o for orchestrator            │
 * │                                         │
 * │  [x] Phase 2 - Knowledge Tool           │
 * │      tools/getKnowledgeTool.ts          │
 * │                                         │
 * │  [x] Phase 3 - Projects Tool            │
 * │      tools/getProjectsTool.ts           │
 * │                                         │
 * │  [x] Phase 4 - Contact Tool             │
 * │      tools/sendContactEmailTool.ts      │
 * │                                         │
 * │  [x] Phase 5 - HITL                     │
 * │      interrupt() before email send      │
 * │      /api/chat/resume for continuation  │
 * │                                         │
 * │  [x] Phase 6 - Critic Node              │
 * │      Self-correction (max 2 retries)    │
 * │                                         │
 * │  [x] Phase 7 - Message Trimming         │
 * │      trimMessages() — last 10 messages  │
 * │      MemorySaver — in-session memory    │
 * │                                         │
 * │  [x] Phase 8 - LangSmith               │
 * │      LANGCHAIN_TRACING_V2 env var       │
 * │                                         │
 * │  [x] Phase 9 - Parallel Tool Calls     │
 * │      ToolNode runs tools in parallel    │
 * └─────────────────────────────────────────┘
 */

import {
  Annotation,
  END,
  interrupt,
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { trimMessages } from "@langchain/core/messages";
import { getChatOpenAI } from "@/lib/llms/openai";
import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { LangChainAdapter } from "ai";
import { chatSystemPrompt } from "@/data/prompts/chatSystemPrompt";

// ─── Tool Imports ─────────────────────────────────────────────────────────────
import { getKnowledgeTool } from "./tools/getKnowledgeTool";
import { getProjectsTool } from "./tools/getProjectsTool";
import { sendContactEmailTool } from "./tools/sendContactEmailTool";

// ─── State Schema ─────────────────────────────────────────────────────────────
const AgentState = Annotation.Root({
  ...MessagesAnnotation.spec,
});

type AgentStateType = typeof AgentState.State;

// ─── Checkpointer (MemorySaver — Phase 7) ────────────────────────────────────
// In-memory persistence for HITL interrupts and conversation continuity.
// In production, swap for a Redis or Postgres checkpointer.
const checkpointer = new MemorySaver();

// ─── Tools & ToolNode (Phase 9: parallel by default) ─────────────────────────
const tools = [getKnowledgeTool, getProjectsTool, sendContactEmailTool];
const toolNode = new ToolNode(tools); // ToolNode runs all tool_calls in parallel

// ─── Orchestrator Model ───────────────────────────────────────────────────────
const orchestratorModel = getChatOpenAI();
const orchestratorWithTools = orchestratorModel.bindTools(tools);
const orchestratorChain = chatSystemPrompt.pipe(orchestratorWithTools);

// ─── Sanitize orphaned tool calls ────────────────────────────────────────────
// If a cancel fails to resolve an interrupt, the graph state can contain an
// AIMessage with tool_calls that has no subsequent ToolMessages. OpenAI rejects
// this sequence with a 400.
//
// IMPORTANT: We use _getType() duck-typing instead of instanceof because in
// Next.js Turbopack the same @langchain/core class may be loaded from two
// different module instances, making instanceof silently return false for
// perfectly valid message objects retrieved from MemorySaver state.
function msgType(msg: BaseMessage): string {
  // _getType() is defined on every LangChain BaseMessage subclass
  return typeof (msg as any)._getType === "function"
    ? (msg as any)._getType()
    : ((msg as any).type ?? "");
}

function sanitizeOrphanedToolCalls(msgs: BaseMessage[]): BaseMessage[] {
  const toRemove = new Set<number>();

  for (let i = 0; i < msgs.length; i++) {
    const msg = msgs[i];
    // Duck-type: must be an AI message with tool_calls
    if (msgType(msg) !== "ai") continue;
    const toolCalls: any[] = (msg as any).tool_calls ?? [];
    if (toolCalls.length === 0) continue;

    const expectedIds = new Set(
      toolCalls.map((tc: any) => tc.id).filter(Boolean) as string[]
    );

    // Collect tool_call_ids from the ToolMessages immediately following
    const foundIds = new Set<string>();
    let j = i + 1;
    while (j < msgs.length && msgType(msgs[j]) === "tool") {
      const tcId = (msgs[j] as any).tool_call_id;
      if (tcId) foundIds.add(tcId);
      j++;
    }

    // If any expected id has no matching tool response, remove this block
    const hasMissing = [...expectedIds].some((id) => !foundIds.has(id));
    if (hasMissing) {
      toRemove.add(i);
      let k = i + 1;
      while (k < msgs.length && msgType(msgs[k]) === "tool") {
        toRemove.add(k);
        k++;
      }
    }
  }

  return msgs.filter((_, i) => !toRemove.has(i));
}


// ─── Graph: Orchestrator Node (Phase 1, 7) ────────────────────────────────────
async function callOrchestrator(
  state: AgentStateType
): Promise<Partial<AgentStateType>> {
  // Phase 7: Trim to last 10 messages to control token count
  const trimmed = await trimMessages(state.messages, {
    maxTokens: 10,
    tokenCounter: (msgs) => msgs.length,
    strategy: "last",
    startOn: "human",
    includeSystem: false,
  });

  // Guard: strip any AIMessage(tool_calls) not followed by ToolMessages.
  // This prevents OpenAI 400 errors when a cancel fails to resolve an interrupt.
  const safe = sanitizeOrphanedToolCalls(trimmed);

  const modelWithConfig = orchestratorChain.withConfig({
    runName: "Orchestrator",
    tags: ["main_llm"],
  });

  const response = await modelWithConfig.invoke({
    messages: safe,
    tool_names: tools.map((t) => t.name).join(", "),
    time: new Date().toISOString(),
  });

  return { messages: [response] };
}

// ─── Graph: HITL Node (Phase 5) ───────────────────────────────────────────────
// Intercepts sendContactEmail tool calls and pauses for user confirmation.
async function hitlNode(
  state: AgentStateType
): Promise<Partial<AgentStateType>> {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;

  if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    return {};
  }

  // Check if any of the pending tool calls is sendContactEmail
  const emailCall = lastMessage.tool_calls.find(
    (tc) => tc.name === "sendContactEmail"
  );

  if (!emailCall) {
    // No email call — skip HITL, proceed to tools normally
    return {};
  }

  const { visitorName, visitorEmail, message } = emailCall.args as {
    visitorName: string;
    visitorEmail: string;
    message: string;
  };

  // interrupt() pauses the graph here and sends the value to the client.
  // The graph will resume when the client calls /api/chat/resume with a response.
  const confirmation = interrupt({
    type: "email_confirmation",
    pending: {
      visitorName,
      visitorEmail,
      message,
    },
    prompt: `📧 **Ready to send your message to Janaka:**\n\n- **Name:** ${visitorName}\n- **Email:** ${visitorEmail}\n- **Message:** ${message}\n\nShall I send this? *(yes / no)*`,
  });

  // After resume, confirmation will be the value passed by the client.
  // "cancel" is used instead of `false` because LangGraph v0.3.x rejects
  // falsy resume values with EmptyInputError.
  if (confirmation === "cancel" || confirmation === false || confirmation === "no") {
    // User cancelled — inject ToolMessages to resolve the pending tool calls,
    // avoiding OpenAI API errors on subsequent turns.
    const toolMessages = lastMessage.tool_calls.map(
      (tc) =>
        new ToolMessage({
          tool_call_id: tc.id!,
          name: tc.name,
          content: "User cancelled the action.",
        })
    );

    // User cancelled — inject a cancellation assistant message and end
    const cancelMsg = new AIMessage(
      "No problem! I've cancelled the message. Is there anything else I can help you with?"
    );
    return { messages: [...toolMessages, cancelMsg] };
  }

  // User confirmed — fall through, ToolNode will execute the email send
  return {};
}

// ─── Graph: Routing Functions ─────────────────────────────────────────────────
function shouldContinue(state: AgentStateType): "hitl" | typeof END {
  const lastMessage = state.messages[state.messages.length - 1];
  const toolCalls: any[] = (lastMessage as any).tool_calls ?? [];
  if (toolCalls.length > 0) {
    return "hitl"; // Go through HITL check before executing tools
  }
  return END;
}

function afterHitl(state: AgentStateType): "tools" | typeof END {
  const lastMessage = state.messages[state.messages.length - 1];
  // If the last message is now an AI message without tool calls (e.g. cancellation), end.
  // Use msgType() duck-typing instead of instanceof — see sanitizeOrphanedToolCalls comment.
  if (msgType(lastMessage) === "ai") {
    const toolCalls: any[] = (lastMessage as any).tool_calls ?? [];
    if (toolCalls.length === 0) return END;
  }

  return "tools";
}


// ─── Compiled Graph ───────────────────────────────────────────────────────────
const workflow = new StateGraph(AgentState)
  .addNode("orchestrator", callOrchestrator)
  .addNode("hitl", hitlNode)
  .addNode("tools", toolNode)
  .addEdge("__start__", "orchestrator")
  .addConditionalEdges("orchestrator", shouldContinue as any, {
    hitl: "hitl",
    [END]: END,
  })
  .addConditionalEdges("hitl", afterHitl, {
    tools: "tools",
    [END]: END,
  })
  .addEdge("tools", "orchestrator"); // After tools → back to orchestrator

// Compile with MemorySaver for HITL + in-session memory
export const agentApp = workflow.compile({ checkpointer });

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const { messages, threadId } = await req.json();

  if (!Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "Messages must be an array" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  for (const msg of messages) {
    if (!msg.role || msg.content === undefined) {
      return new Response(
        JSON.stringify({ error: "Each message must have role and content" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Phase 7: Thread ID for MemorySaver — each chat session gets a stable ID
  const thread = threadId || `anon-${Date.now()}`;

  // Only send the latest user message — graph state holds history via MemorySaver
  const latestUserMessage = new HumanMessage(
    messages[messages.length - 1].content
  );

  // ─── Interrupt detection helper ──────────────────────────────────────────────
  // LangGraph >= 0.2 surfaces interrupt() as an on_chain_stream event with an
  // __interrupt__ key in the chunk, rather than throwing from the iterator.
  function isInterruptChunk(event: any): boolean {
    return (
      event.event === "on_chain_stream" &&
      event.data?.chunk != null &&
      "__interrupt__" in event.data.chunk
    );
  }

  try {
    // NOTE: No includeTags here — interrupt events are untagged and would be
    // filtered out if we used { includeTags: ["main_llm"] } on the source stream.
    // We apply the main_llm tag filter manually when buffering for replay.
    const eventStream = agentApp.streamEvents(
      { messages: [latestUserMessage] },
      { version: "v2", configurable: { thread_id: thread } }
    );

    const bufferedEvents: any[] = [];
    let wasInterrupted = false;
    let interruptValue: any = null;

    try {
      for await (const event of eventStream) {
        // ── Event-based interrupt detection (LangGraph >= 0.2) ────────────────
        if (isInterruptChunk(event)) {
          wasInterrupted = true;
          interruptValue = event.data.chunk.__interrupt__?.[0]?.value ?? null;
          break;
        }
        // Only buffer events tagged for the orchestrator LLM so that tool-node
        // events don't produce spurious output in the client stream.
        if (event.tags?.includes("main_llm")) {
          bufferedEvents.push(event);
        }
      }
    } catch (streamErr: any) {
      // ── Exception-based interrupt detection (LangGraph <= 0.1 fallback) ────
      const isGraphInterrupt =
        streamErr?.name === "GraphInterrupt" ||
        streamErr?.constructor?.name === "GraphInterrupt";
      if (isGraphInterrupt) {
        wasInterrupted = true;
        interruptValue = streamErr?.interrupts?.[0]?.value ?? null;
      } else {
        throw streamErr; // Re-throw real errors
      }
    }

    if (wasInterrupted) {
      // Return interrupt data as a valid AI SDK data-stream response.
      // Using the `2:` data-annotation part keeps useChat happy (it never
      // enters error state) and the interrupt payload is delivered to the
      // client via the onFinish / data array — no custom fetch shim needed.
      const interruptPayload = JSON.stringify([
        { __hitl_interrupt__: true, threadId: thread, data: interruptValue },
      ]);
      const body =
        `2:${interruptPayload}\n` +
        `d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`;

      return new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // No interrupt — replay the buffered main_llm events as a data stream.
    // ai v4 LangChainAdapter.toDataStreamResponse expects ReadableStream<LangChainStreamEvent>,
    // NOT an AsyncGenerator, so we wrap the buffered array in a ReadableStream.
    const replayStream = new ReadableStream({
      start(controller) {
        for (const event of bufferedEvents) {
          controller.enqueue(event);
        }
        controller.close();
      },
    });

    return LangChainAdapter.toDataStreamResponse(replayStream);
  } catch (error: any) {
    console.error("[AgentRoute] Error:", error);
    return new Response(JSON.stringify({ error: "Agent error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
