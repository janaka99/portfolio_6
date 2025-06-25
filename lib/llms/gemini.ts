import { AppPropertise } from "@/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

interface GetGeminiOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  maxRetries?: number;
  streamUsage?: boolean;
}

export function getChatGoogleGenerativeAI({
  model = "gemini-1.5-flash",
  temperature = 0.7,
  maxOutputTokens = 2048,
  maxRetries = 2,
}: GetGeminiOptions = {}) {
  return new ChatGoogleGenerativeAI({
    model,
    temperature,
    maxRetries,
    maxOutputTokens,
    apiKey: AppPropertise.GOOGLE_GEMINI_API_KEY,
  });
}
