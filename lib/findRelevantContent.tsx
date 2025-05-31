"use server";
import { AppPropertise } from "@/config";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { DataAPIClient } from "@datastax/astra-db-ts";

const client = new DataAPIClient(AppPropertise.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(AppPropertise.ASTRADB_ENDPOINT as string);

export const findRelevantContent = async (query: string) => {
  if (!query) {
    return [];
  }
  try {
    const input = query.replaceAll("\\n", " ");

    const google = createGoogleGenerativeAI({
      apiKey: AppPropertise.GOOGLE_GEMINI_API_KEY,
    });

    let embedding;
    try {
      const embeddingModel = google.textEmbeddingModel("text-embedding-004");
      const result = await embeddingModel.doEmbed({
        values: [input],
      });
      embedding = result.embeddings[0];
    } catch (embeddingError) {
      return [];
    }
    let contextDocuments: string[] = [];
    try {
      const collection = await db.collection(
        AppPropertise.ASTRA_DB_COLLECTION as string
      );
      const cursor = collection.find(
        {},
        {
          sort: {
            $vector: embedding,
          },
          limit: 10,
        }
      );
      const documents = await cursor.toArray();
      contextDocuments = documents?.map((doc) => doc.text) || [];

      return contextDocuments;
    } catch (dbError) {
      console.log("Reached here 4");
      return [];
    }
  } catch (error) {
    return [];
  }
};
