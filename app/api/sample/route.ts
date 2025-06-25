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
  variationOutputShema,
  variationPrompt,
} from "@/data/prompts/variationPrompt";
import { chatSystemPrompt } from "@/data/prompts/chatSystemPrompt";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import {
  StateGraph,
  END,
  START,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { getChatOpenAI } from "@/lib/llms/openai";

interface AgentStateType {
  messages: BaseMessage[] | HumanMessage[] | AIMessage[];
  toolCallCount?: number; // Track tool calls
  maxToolCalls?: number; // Max allowed tool calls
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

    // initialize  model
    const llm = await getChatOpenAI();

    // Convert messages to LangChain format
    const langchainMessages: BaseMessage[] = messages.map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role === "assistant" || msg.role === "ai") {
        return new AIMessage(msg.content);
      } else {
        // fallback to HumanMessage if role is unknown
        return new HumanMessage(msg.content);
      }
    });

    const AgentState: AgentStateType = {
      messages: [],
    };

    const getKnowledgeTool = tool(
      async ({ query }: { query: string }) => {
        try {
          console.log("Tool called");
          const combinedQuery = await (async () => {
            // Setup the messages array with system prompt
            const variationMessage = [
              new SystemMessage(variationPrompt),
              new HumanMessage(query),
            ];

            // Invoke the model
            const variationModel =
              llm.withStructuredOutput(variationOutputShema);

            const res = await variationModel.invoke(variationMessage);
            let combinedQuery = res.variations.join(" ");
            combinedQuery = `${combinedQuery} ${query}`;

            return combinedQuery;
          })();

          // search for relevant content in the vector database
          const context = await findRelevantContent(combinedQuery);

          return context;
        } catch (error) {
          return [];
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

    // Defining the tools array
    const tools = [getKnowledgeTool];

    // bind the tools with llm
    const llmWithTools = llm.bindTools(tools);

    // get the prompt
    const prompt = chatSystemPrompt;

    // Create the chain with prompt
    const modelWithPrompt = prompt.pipe(llmWithTools);

    // [Main model call] Model function
    async function callModel(
      state: AgentStateType
    ): Promise<Partial<AgentStateType>> {
      const messages = state.messages;
      console.log("Callin the model");
      const modelWithConfig = modelWithPrompt.withConfig({
        runName: "Chat_call",
        tags: ["chat_llm"],
      });
      console.log("Messages length ", messages.length);
      const response = await modelWithConfig.invoke({
        messages: messages,
        tool_names: tools.map((tool) => tool.name).join(", "),
        time: new Date().toISOString(),
      });
      return {
        messages: [response],
      };
    }

    // condition function  - determine next step after [Main model call]
    function shouldContinue(state: AgentStateType): "tools" | typeof END {
      const messages = state.messages;
      const lastMessage = messages[messages.length - 1] as AIMessage;

      // check the last AI messages contains any tool callings
      if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        return "tools";
      } else {
        return END;
      }
    }

    // creating the tool node
    const toolNode = new ToolNode(tools);

    // Creating the worlflow
    const workflow = new StateGraph(MessagesAnnotation)
      .addNode("agent", callModel)
      .addNode("tools", toolNode)
      .addEdge(START, "agent")
      .addConditionalEdges("agent", shouldContinue, {
        tools: "tools",
        [END]: END,
      })
      .addEdge("tools", "agent");

    // compile the workflow
    const app = workflow.compile();

    // run the workflow
    const events = await app.streamEvents(
      {
        messages: langchainMessages,
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
