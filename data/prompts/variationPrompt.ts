import { z } from "zod";

/**
 * Variation Prompt — used by getMiniOpenAI() (gpt-4o-mini), NOT gpt-4o.
 * Generates keyword variations from a user query for vector search.
 * Keep this prompt TIGHT — token efficiency is critical here.
 */
export const variationPrompt = `Generate 4-5 short keyword variations of the user's query for vector search.
Rules:
- Output keywords/phrases, not full sentences
- Remove filler words ("I want to know", "can you tell me", etc.)
- Keep them semantically diverse to maximize recall
- No extra text, just the JSON

Example:
Input: "What is Janaka's work experience?"
Output: {"variations": ["work experience", "career history", "jobs held", "professional background", "employment"]}`;

export const variationOutputSchema = z.object({
  variations: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("Search query variations for vector retrieval"),
});
