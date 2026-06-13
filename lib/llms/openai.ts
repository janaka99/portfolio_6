import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

interface GetOpenAIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  maxRetries?: number;
  streamUsage?: boolean;
  streaming?: boolean;
}

/**
 * Primary orchestrator model — gpt-4o.
 * Used for: final response synthesis, tool calling decisions.
 * Cost tier: HIGH — use sparingly, only for orchestrator node.
 */
export function getChatOpenAI({
  model = "gpt-4o",
  temperature = 0.7,
  maxTokens = 2048,
  maxRetries = 2,
  streamUsage = false,
  streaming = true,
}: GetOpenAIOptions = {}) {
  return new ChatOpenAI({
    model,
    temperature,
    maxTokens,
    maxRetries,
    streamUsage,
    streaming,
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Helper / sub-agent model — gpt-4o-mini.
 * Used for: query variation generation, intent classification, critic evaluation.
 * Cost tier: LOW (~10x cheaper than gpt-4o). Always use this for internal, non-user-facing calls.
 */
export function getMiniOpenAI({
  model = "gpt-4o-mini",
  temperature = 0,
  maxTokens = 512,
  maxRetries = 2,
  streamUsage = false,
  streaming = false,
}: GetOpenAIOptions = {}) {
  return new ChatOpenAI({
    model,
    temperature,
    maxTokens,
    maxRetries,
    streamUsage,
    streaming,
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface GetOpenAIEmbeddingsOptions {
  model?: string;
}

/**
 * OpenAI embedding model — text-embedding-3-small.
 * Used for: query embedding in vector search.
 * 1536 dimensions, cost-efficient.
 */
export function getOpenAIEmbeddings({
  model = "text-embedding-3-small",
}: GetOpenAIEmbeddingsOptions = {}) {
  return new OpenAIEmbeddings({
    model,
    apiKey: process.env.OPENAI_API_KEY,
  });
}
