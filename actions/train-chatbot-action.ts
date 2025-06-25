"use server";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Collection, DataAPIClient } from "@datastax/astra-db-ts";
import { AppPropertise } from "@/config";
import { connectToDatabase } from "@/lib/mongodb/mongodb";
import Embedding from "@/models/vector";
// Constants

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const CHUNK_SIZE = 512;
const CHUNK_OVERLAP = 100;
const VECTOR_DIMENSION = 768;

type ExtractResult =
  | { success: true; message: string }
  | { success: false; error: string };

type EmbeddingDocument = {
  embedding: number[];
  text: string;
  metadata: {
    originalLength: number;
    processedAt: Date;
  };
};

// Server-side validation schema
const uploadSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, {
      message: "Invalid file type",
    })
    .refine((file) => file.type === "application/pdf", {
      message: "Only PDF files are allowed",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }),
});

const googleAI = createGoogleGenerativeAI({
  apiKey: AppPropertise.GOOGLE_GEMINI_API_KEY,
});

export async function extractPdfText(formData: FormData) {
  try {
    // Get file from form data
    const file = formData.get("file") as File;
    const validationResult = uploadSchema.safeParse({ file });

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Invalid file",
      };
    }

    // Create a buffer from the file
    const arrayBuffer = await file.arrayBuffer();
    const pdfBlob = new Blob([arrayBuffer], {
      type: "application/pdf",
    });

    // Load and split documents
    const loader = new WebPDFLoader(pdfBlob);
    const docs = await loader.load();

    // splite the text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
    });

    // get the chunks
    const chunkedDocs = await textSplitter.splitDocuments(docs);

    // Connect to MongoDB
    await connectToDatabase();

    // Clear existing embeddings if needed
    await Embedding.deleteMany({});

    // Process chunks in batches
    const model = googleAI.textEmbeddingModel("text-embedding-004");
    const batchSize = 5;
    let processedCount = 0;

    for (let i = 0; i < chunkedDocs.length; i += batchSize) {
      const batch = chunkedDocs.slice(i, i + batchSize);
      const documents: EmbeddingDocument[] = [];
      for await (const chunk of chunkedDocs) {
        const sanitizedText = await sanitizeText(chunk.pageContent);
        if (!sanitizedText.trim()) continue;

        const embedding = await model.doEmbed({
          values: [sanitizedText],
        });

        documents.push({
          embedding: embedding.embeddings[0],
          text: sanitizedText,
          metadata: {
            originalLength: chunk.pageContent.length,
            processedAt: new Date(),
          },
        });
      }
      // Insert batch
      if (documents.length > 0) {
        await Embedding.insertMany(documents);
        processedCount += documents.length;
      }
    }
    // TODO - Upload the pdf to cloudinary and shows the trained content
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("PDF extraction error:", error);
    return {
      success: false,
      error: "Failed to extract text from the PDF. Please try another file.",
    };
  }
}

function sanitizeText(text: string): string {
  // Remove potentially dangerous HTML/script tags
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<[^>]*>/g, "");
}

type SimilarityMetrics = "dot_product" | "cosien" | "euclidean";

// Helper functions
async function ensureCollection(
  db: ReturnType<DataAPIClient["db"]>
): Promise<Collection> {
  try {
    const collectionName = AppPropertise.ASTRA_DB_COLLECTION as string;
    const collections = await db.listCollections();
    const exists = collections.some((col) => col.name === collectionName);

    if (exists) {
      const collection = await db.collection(collectionName);
      await collection.deleteMany({});
      return collection;
    }

    return await db.createCollection(collectionName, {
      vector: {
        dimension: VECTOR_DIMENSION,
        metric: "cosine",
      },
    });
  } catch (error) {
    console.error("Collection management error:", error);
    throw new Error("Failed to initialize database collection");
  }
}
