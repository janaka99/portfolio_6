import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

interface GetOpenAIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  maxRetries?: number;
  streamUsage?: boolean;
  streaming?: boolean;
}

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
    streaming: streaming,
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export function getVariationModel({
  model = "gpt-4o",
  temperature = 0.7,
  maxTokens = 2048,
  maxRetries = 2,
  streamUsage = false,
}: GetOpenAIOptions = {}) {
  return new ChatOpenAI({
    model,
    temperature,
    maxTokens,
    maxRetries,
    streamUsage,
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface getOpenAIEmbeddingsOptions {
  model?: string;
}

export function getOpenAIEmbeddings({
  model = "text-embedding-3-small",
}: getOpenAIEmbeddingsOptions = {}) {
  return new OpenAIEmbeddings({
    model,
    apiKey: process.env.OPENAI_API_KEY,
  });
}
