"use server";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb/mongodb";
import Embedding from "@/models/vector";
import { getOpenAIEmbeddings } from "@/lib/llms/openai";

// Constants — OpenAI text-embedding-3-small = 1536 dimensions
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 80;

type ExtractResult =
  | { success: true; message: string; count: number }
  | { success: false; error: string };

const uploadSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, { message: "Invalid file" })
    .refine((f) => f.type === "application/pdf", { message: "Only PDF files" })
    .refine((f) => f.size <= MAX_FILE_SIZE, { message: "Max 10MB" }),
});

function sanitizeText(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

async function embedAndStore(
  chunks: string[],
  clearExisting: boolean
): Promise<number> {
  const embeddingModel = getOpenAIEmbeddings();
  await connectToDatabase();

  if (clearExisting) {
    await Embedding.deleteMany({});
  }

  let count = 0;
  const batchSize = 10;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const documents = [];

    for (const text of batch) {
      if (!text.trim()) continue;
      const embedding = await embeddingModel.embedQuery(text);
      documents.push({
        text,
        embedding,
        metadata: { processedAt: new Date() },
      });
    }

    if (documents.length > 0) {
      await Embedding.insertMany(documents);
      count += documents.length;
    }
  }

  return count;
}

/**
 * Train chatbot from a PDF file.
 * Extracts text, splits into chunks, embeds with OpenAI, stores in MongoDB.
 * clearExisting=true wipes all previous data before inserting.
 */
export async function extractPdfText(formData: FormData): Promise<ExtractResult> {
  try {
    const file = formData.get("file") as File;
    const validation = uploadSchema.safeParse({ file });
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message || "Invalid file" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfBlob = new Blob([arrayBuffer], { type: "application/pdf" });

    const loader = new WebPDFLoader(pdfBlob);
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
    });
    const chunkedDocs = await textSplitter.splitDocuments(docs);
    const chunks = chunkedDocs.map((d) => sanitizeText(d.pageContent)).filter(Boolean);

    const count = await embedAndStore(chunks, true);
    return { success: true, message: `Trained with ${count} chunks from PDF`, count };
  } catch (error) {
    console.error("[extractPdfText] Error:", error);
    return { success: false, error: "Failed to process PDF. Please try again." };
  }
}

/**
 * Train chatbot from raw text input (typed or pasted).
 * Splits, embeds with OpenAI, appends to MongoDB (does NOT clear existing).
 */
export async function trainFromText(
  text: string,
  label?: string
): Promise<ExtractResult> {
  try {
    if (!text || text.trim().length < 10) {
      return { success: false, error: "Text is too short. Add more content." };
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
    });
    const chunks = await textSplitter.splitText(text);
    const sanitized = chunks.map(sanitizeText).filter(Boolean);

    const count = await embedAndStore(sanitized, false);
    return {
      success: true,
      message: `Added ${count} chunks${label ? ` from "${label}"` : ""} to knowledge base`,
      count,
    };
  } catch (error) {
    console.error("[trainFromText] Error:", error);
    return { success: false, error: "Failed to process text. Please try again." };
  }
}

/**
 * Get stats about the current knowledge base.
 */
export async function getKnowledgeBaseStats() {
  try {
    await connectToDatabase();
    const count = await Embedding.countDocuments();
    const latest = await Embedding.findOne({}, { text: 1, metadata: 1 })
      .sort({ "metadata.processedAt": -1 })
      .lean();
    return {
      success: true,
      count,
      latestChunk: latest ? (latest as any).text?.substring(0, 100) + "..." : null,
      latestDate: latest ? (latest as any).metadata?.processedAt : null,
    };
  } catch (error) {
    return { success: true, count: 0, latestChunk: null, latestDate: null };
  }
}

/**
 * Delete all knowledge base data.
 */
export async function clearKnowledgeBase() {
  try {
    await connectToDatabase();
    await Embedding.deleteMany({});
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to clear knowledge base" };
  }
}
