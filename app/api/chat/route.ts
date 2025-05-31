import { AppPropertise } from "@/config";
import { findRelevantContent } from "@/lib/findRelevantContent";
import { google } from "@ai-sdk/google";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const client = new DataAPIClient(AppPropertise.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(AppPropertise.ASTRADB_ENDPOINT as string);

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!messages && !Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ error: "Invalid request: Try again later." }),
      { status: 400 }
    );
  }
  const result = streamText({
    model: google("gemini-1.5-flash"),
    messages,
    system: AppPropertise.RAG_BOT_SYSTEM_PROMPT,
    tools: {
      getInformation: tool({
        description:
          "get information from your knowledge base to answer questions.",
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toDataStreamResponse();
}
