/**
 * Resume Endpoint — Phase 5 (HITL)
 *
 * Called by the frontend after the user responds to a HITL interrupt.
 * Resumes the paused LangGraph execution with the user's confirmation (true/false).
 *
 * Request body:
 *   { threadId: string, resume: boolean }
 *
 * Response:
 *   Streaming AI response (same as /api/chat POST)
 */

import { Command } from "@langchain/langgraph";
import { LangChainAdapter } from "ai";
import { agentApp } from "../route";

export async function POST(req: Request) {
  const { threadId, resume } = await req.json();

  if (!threadId) {
    return new Response(JSON.stringify({ error: "threadId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Resume the graph from where it was interrupted.
    // No includeTags filter here — we need to pass through the ToolNode events
    // and the orchestrator's follow-up response (tagged main_llm). Filtering by
    // main_llm would produce an empty stream on the confirm path because the
    // ToolNode itself is not tagged.
    const events = agentApp.streamEvents(
      new Command({ resume: resume === true || resume === "yes" }),
      {
        version: "v2",
        configurable: { thread_id: threadId },
      }
    );

    // ai v4 LangChainAdapter.toDataStreamResponse requires ReadableStream<LangChainStreamEvent>.
    // agentApp.streamEvents() returns an AsyncGenerator, so we bridge with a ReadableStream.
    const replayStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of events) {
            controller.enqueue(event);
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return LangChainAdapter.toDataStreamResponse(replayStream);
  } catch (error: any) {
    console.error("[ResumeRoute] Error:", error);
    return new Response(JSON.stringify({ error: "Failed to resume agent" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
