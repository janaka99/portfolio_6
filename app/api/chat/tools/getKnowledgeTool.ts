/**
 * Tool: getKnowledge
 *
 * Searches Janaka's vector knowledge base to answer factual questions.
 *
 * Token strategy:
 * - Uses gpt-4o-mini internally for query expansion (NOT gpt-4o)
 * - Only returns raw context back to the orchestrator (gpt-4o synthesizes)
 *
 * Flow:
 *   user query
 *     → gpt-4o-mini: generate 4-5 search query variations
 *     → MongoDB + AstraDB: vector similarity search
 *     → return top 5 chunks as context string
 */

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getMiniOpenAI } from "@/lib/llms/openai";
import { variationOutputSchema, variationPrompt } from "@/data/prompts/variationPrompt";
import { findRelevantContent } from "@/lib/findRelevantContent";

const helperModel = getMiniOpenAI();

export const getKnowledgeTool = tool(
  async ({ query }: { query: string }) => {
    try {
      // Step 1: Expand the query into keyword variations using gpt-4o-mini
      const miniModelWithSchema = helperModel.withStructuredOutput(variationOutputSchema);
      const variationRes = await miniModelWithSchema.invoke([
        new SystemMessage(variationPrompt),
        new HumanMessage(query),
      ]);
      const combinedQuery = variationRes.variations.join(" ");

      // Step 2: Vector search the knowledge base
      const relevantContent = await findRelevantContent(combinedQuery);
      if (!relevantContent || relevantContent.length === 0) {
        return "No relevant information found in the knowledge base for this query.";
      }

      return relevantContent.map((item: any) => item.text).join("\n\n---\n\n");
    } catch (error) {
      console.error("[getKnowledge] Error:", error);
      return "I encountered an error while searching the knowledge base.";
    }
  },
  {
    name: "getKnowledge",
    description:
      "Search Janaka's knowledge base to answer factual questions about his experience, skills, background, or education. Always call this before answering factual questions about Janaka.",
    schema: z.object({
      query: z
        .string()
        .describe("The user's question to search for in the knowledge base"),
    }),
  }
);
