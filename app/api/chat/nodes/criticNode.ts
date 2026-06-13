/**
 * Critic Node — Phase 6
 *
 * Self-correction: Evaluates the orchestrator's response BEFORE streaming to the user.
 * Uses gpt-4o-mini (cheap) to check quality, grounding, and tone.
 *
 * If quality fails (max 2 retries):
 *   → Returns feedback back to the orchestrator with a correction request
 * If quality passes:
 *   → Allows the message to stream to the user
 */

import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getMiniOpenAI } from "@/lib/llms/openai";
import { criticSystemPrompt } from "@/data/prompts/chatSystemPrompt";
import { z } from "zod";

const MAX_RETRIES = 2;

const criticOutputSchema = z.object({
  pass: z.boolean().describe("Whether the response meets quality standards"),
  reason: z
    .string()
    .describe("Brief reason if the response failed quality check, or empty string if it passed"),
});

interface CriticState {
  messages: any[];
  retryCount?: number;
}

/**
 * Critic node function — evaluates the last assistant message.
 * Returns next node to route to: "orchestrator" (retry) or "__end__" (pass).
 */
export async function criticNode(
  state: CriticState
): Promise<{ messages: any[]; retryCount: number }> {
  const { messages, retryCount = 0 } = state;

  // If we've already retried too many times, just let it through
  if (retryCount >= MAX_RETRIES) {
    return { messages, retryCount };
  }

  const lastMessage = messages[messages.length - 1] as AIMessage;

  // Only critique final text responses (not tool calls)
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return { messages, retryCount };
  }

  const lastContent =
    typeof lastMessage.content === "string"
      ? lastMessage.content
      : JSON.stringify(lastMessage.content);

  if (!lastContent || lastContent.length < 20) {
    return { messages, retryCount };
  }

  try {
    const criticModel = getMiniOpenAI({ maxTokens: 256 });
    const modelWithSchema = criticModel.withStructuredOutput(criticOutputSchema);

    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m._getType?.() === "human" || m.role === "user");

    const userQuery = lastUserMessage
      ? typeof lastUserMessage.content === "string"
        ? lastUserMessage.content
        : ""
      : "unknown query";

    const evaluation = await modelWithSchema.invoke([
      new SystemMessage(criticSystemPrompt),
      new HumanMessage(
        `User asked: "${userQuery}"\n\nAssistant responded: "${lastContent}"\n\nEvaluate quality.`
      ),
    ]);

    if (!evaluation.pass) {
      console.log(`[Critic] Response failed (attempt ${retryCount + 1}): ${evaluation.reason}`);
      // Inject correction request back into message history
      const correctionRequest = new HumanMessage(
        `[SELF-CORRECTION REQUEST] Your previous response had an issue: ${evaluation.reason}. Please revise and provide a better answer.`
      );
      return {
        messages: [...messages, correctionRequest],
        retryCount: retryCount + 1,
      };
    }

    console.log(`[Critic] Response passed quality check.`);
    return { messages, retryCount };
  } catch (error) {
    // If critic itself fails, just let the response through
    console.warn("[Critic] Evaluation failed, passing through:", error);
    return { messages, retryCount };
  }
}

/**
 * Routing function for critic output.
 * Returns "orchestrator" to retry, or "__end__" to stream to user.
 */
export function criticShouldRetry(
  state: CriticState & { retryCount: number }
): "orchestrator" | "__end__" {
  const { messages, retryCount } = state;
  const lastMessage = messages[messages.length - 1];

  // If last message is a correction request (HumanMessage injected by critic), retry
  const lastContent =
    typeof lastMessage?.content === "string" ? lastMessage.content : "";

  if (
    lastContent.startsWith("[SELF-CORRECTION REQUEST]") &&
    retryCount < MAX_RETRIES
  ) {
    return "orchestrator";
  }

  return "__end__";
}
