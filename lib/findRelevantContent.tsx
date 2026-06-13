"use server";
import Embedding from "@/models/vector";
import { connectToDatabase } from "./mongodb/mongodb";
import { getOpenAIEmbeddings } from "./llms/openai";

/**
 * findRelevantContent
 *
 * Embeds the query using OpenAI text-embedding-3-small (1536 dimensions),
 * then runs a $vectorSearch against the MongoDB Atlas embeddings collection.
 *
 * NOTE: Your Atlas Search index must be configured with numDimensions: 1536
 */
export const findRelevantContent = async (query: string) => {
  if (!query) return null;

  try {
    const input = query.replaceAll("\\n", " ");

    // Embed using OpenAI text-embedding-3-small
    const embeddingModel = getOpenAIEmbeddings();
    const embeddingResult = await embeddingModel.embedQuery(input);
    // Vector search in MongoDB
    await connectToDatabase();
    const result = await Embedding.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: embeddingResult,
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
    return result.length > 0 ? result : null;
  } catch (error) {
    console.error("[findRelevantContent] Error:", error);
    return null;
  }
};
