"use server";
import { AppPropertise } from "@/config";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { DataAPIClient } from "@datastax/astra-db-ts";

const client = new DataAPIClient(AppPropertise.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(AppPropertise.ASTRADB_ENDPOINT as string);

export const generateEmbeddings = async (query: string) => {
  if (!query) {
    return "No content found";
  }
  try {
    const input = query.replaceAll("\\n", " ");

    const google = createGoogleGenerativeAI({
      apiKey: AppPropertise.GOOGLE_GEMINI_API_KEY,
    });

    const model = google.textEmbeddingModel("text-embedding-004");
    const embedding = await model.doEmbed({
      values: [query],
    });

    const collection = await db.collection(
      AppPropertise.ASTRA_DB_COLLECTION as string
    );

    const cursor = collection.find(
      {},
      {
        sort: {
          $vector: embedding.embeddings[0],
        },
        limit: 10,
      }
    );

    const documents = await cursor.toArray();

    const docsmap = documents?.map((doc) => doc.text);
    let docContext = "";
    docContext = JSON.stringify(docsmap);

    return docContext;
  } catch (error) {
    return "No content Found";
  }
};
