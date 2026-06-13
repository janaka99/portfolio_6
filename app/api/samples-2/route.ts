import { AppPropertise } from "@/config";
import { findRelevantContent } from "@/lib/findRelevantContent";
import { getChatGoogleGenerativeAI } from "@/lib/llms/gemini";
import { google } from "@ai-sdk/google";
import { DataAPIClient } from "@datastax/astra-db-ts";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { LangChainAdapter, streamText } from "ai";
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import {
  variationOutputSchema,
  variationPrompt,
} from "@/data/prompts/variationPrompt";
import { chatSystemPrompt } from "@/data/prompts/chatSystemPrompt";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { getChatOpenAI } from "@/lib/llms/openai";

// Define custom state annotation
const AgentStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  hasUsedTool: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
  toolCallCount: Annotation<number>({
    reducer: (x, y) => y ?? x,
    default: () => 0,
  }),
});

interface AgentStateType {
  messages: BaseMessage[];
  hasUsedTool?: boolean;
  toolCallCount?: number;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Validate input
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: "Messages must be an array",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return new Response(
          JSON.stringify({
            error: "Messages must have role and content",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // initialize model
    const llm = await getChatOpenAI();

    // Convert messages to LangChain format
    const langchainMessages: BaseMessage[] = messages.map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role === "assistant" || msg.role === "ai") {
        return new AIMessage(msg.content);
      } else {
        return new HumanMessage(msg.content);
      }
    });

    const getKnowledgeTool = tool(
      async ({ query }: { query: string }) => {
        try {
          console.log("Tool called with query:", query);
          const combinedQuery = await (async () => {
            const variationMessage = [
              new SystemMessage(variationPrompt),
              new HumanMessage(query),
            ];

            const variationModel =
              llm.withStructuredOutput(variationOutputSchema);
            const res = await variationModel.invoke(variationMessage);
            let combinedQuery = res.variations.join(" ");
            combinedQuery = `${combinedQuery} ${query}`;

            return combinedQuery;
          })();
          console.log("Combined Query ", combinedQuery);
          const context = await findRelevantContent(combinedQuery);
          console.log("Retrieved context:", context);
          return context || "No relevant content found in knowledge base";
        } catch (error) {
          console.error("Tool error:", error);
          return "No information were found";
        }
      },
      {
        name: "getKnowledge",
        description:
          "Get information from your knowledge base to answer questions. Provide the original user question and I'll search for relevant content.",
        schema: z.object({
          query: z
            .string()
            .describe(
              "The user's original question to search for in the knowledge base"
            ),
        }),
      }
    );

    const tools = [getKnowledgeTool];
    const llmWithTools = llm.bindTools(tools);
    const prompt = chatSystemPrompt;
    const modelWithPrompt = prompt.pipe(llmWithTools);

    // Initial model call - can use tools
    async function callModel(
      state: AgentStateType
    ): Promise<Partial<AgentStateType>> {
      const messages = state.messages;
      const toolCallCount = state.toolCallCount || 0;

      console.log("Calling the model, tool call count:", toolCallCount);

      const modelWithConfig = modelWithPrompt.withConfig({
        runName: "Chat_call",
        tags: ["chat_llm"],
      });

      const response = await modelWithConfig.invoke({
        messages: messages,
        tool_names: tools.map((tool) => tool.name).join(", "),
        time: new Date().toISOString(),
      });

      return {
        messages: [response],
        toolCallCount: toolCallCount,
      };
    }

    // Final model call without tools - forces a text response
    async function finalAnswer(
      state: AgentStateType
    ): Promise<Partial<AgentStateType>> {
      const messages = state.messages;
      console.log("Generating final answer without tools");

      // Use model without tools to force a final answer
      const finalModel = prompt.pipe(llm);

      const finalModelWithConfig = finalModel.withConfig({
        runName: "Final_answer",
        tags: ["chat_llm"],
      });

      const response = await finalModelWithConfig.invoke({
        messages: messages,
        tool_names: "",
        time: new Date().toISOString(),
      });

      return {
        messages: [response],
        hasUsedTool: true,
      };
    }

    // Condition function for routing
    function shouldContinue(
      state: AgentStateType
    ): "tools" | "final_answer" | "__end__" {
      const messages = state.messages;
      const lastMessage = messages[messages.length - 1] as AIMessage;
      const toolCallCount = state.toolCallCount || 0;

      // If there are tool calls and we haven't exceeded the limit
      if (
        lastMessage.tool_calls &&
        lastMessage.tool_calls.length > 0 &&
        toolCallCount < 2
      ) {
        console.log("Tool call detected, going to tools");
        return "tools";
      }
      // If we just came back from tools, generate final answer
      else if (state.hasUsedTool && !lastMessage.tool_calls) {
        console.log("Already used tools, going to end");
        return "__end__";
      }
      // If we have tool results in the conversation, generate final answer
      else if (messages.some((msg) => msg._getType() === "tool")) {
        console.log("Tool results found, generating final answer");
        return "final_answer";
      } else {
        console.log("No tool calls needed, going to end");
        return "__end__";
      }
    }

    // Custom tool node that updates tool call count
    async function toolsWithCounter(
      state: AgentStateType
    ): Promise<Partial<AgentStateType>> {
      const toolNode = new ToolNode(tools);
      const result = await toolNode.invoke(state);

      return {
        ...result,
        toolCallCount: (state.toolCallCount || 0) + 1,
        hasUsedTool: true,
      };
    }

    // Creating the workflow with proper flow control
    const workflow = new StateGraph(AgentStateAnnotation)
      .addNode("agent", callModel)
      .addNode("tools", toolsWithCounter)
      .addNode("final_answer", finalAnswer)
      .addEdge("__start__", "agent")
      .addConditionalEdges("agent", shouldContinue, {
        tools: "tools",
        final_answer: "final_answer",
        __end__: "__end__",
      })
      .addEdge("tools", "agent")
      .addEdge("final_answer", "__end__");

    // compile the workflow
    const app = workflow.compile();

    // run the workflow
    const events = await app.streamEvents(
      {
        messages: langchainMessages,
        hasUsedTool: false,
        toolCallCount: 0,
      },
      { version: "v2" },
      {
        includeTags: ["chat_llm"],
      }
    );

    return LangChainAdapter.toDataStreamResponse(events);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
