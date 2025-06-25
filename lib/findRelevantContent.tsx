"use server";
import { AppPropertise } from "@/config";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { DataAPIClient } from "@datastax/astra-db-ts";
import Embedding from "@/models/vector";
import { connectToDatabase } from "./mongodb/mongodb";

const client = new DataAPIClient(AppPropertise.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(AppPropertise.ASTRADB_ENDPOINT as string);

export const findRelevantContent = async (query: string) => {
  if (!query) {
    return null;
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
      return null;
    }
    try {
      await connectToDatabase();
      const result = await Embedding.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: embedding,
            numCandidates: 100,
            limit: 5,
          },
        },
        {
          $project: {
            text: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ]);

      return result;
    } catch (dbError) {
      return null;
    }
  } catch (error) {
    return null;
  }
};
