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

  const isConfirmed = resume === true || resume === "yes";

  try {
    const events = agentApp.streamEvents(
      // LangGraph v0.3.x throws EmptyInputError if the resume value is falsy
      // (e.g. `false`). Use the string "cancel" so the value is always truthy.
      new Command({ resume: isConfirmed ? true : "cancel" }),
      {
        version: "v2",
        configurable: { thread_id: threadId },
      }
    );

    // ── Cancel path ────────────────────────────────────────────────────────────
    // When the user cancelled, there is no LLM call in the resumed graph path
    // (hitlNode just injects ToolMessages + an AIMessage and routes to END).
    // Piping zero LLM events through LangChainAdapter can produce a broken
    // stream. Instead, drain the events to let MemorySaver save state, then
    // return a plain 200. The frontend adds the cancel message itself.
    if (!isConfirmed) {
      for await (const _ of events) { /* drain to persist graph state */ }
      return new Response(JSON.stringify({ cancelled: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ── Confirm path ───────────────────────────────────────────────────────────
    // Stream the full graph execution (ToolNode + orchestrator follow-up) back
    // to the client via the AI SDK data-stream format.
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
