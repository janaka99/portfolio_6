import { StateGraph, END, MessagesAnnotation } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { getChatOpenAI } from "@/lib/llms/openai";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { LangChainAdapter } from "ai";
import {
  variationOutputShema,
  variationPrompt,
} from "@/data/prompts/variationPrompt";
import { findRelevantContent } from "@/lib/findRelevantContent";
import { chatSystemPrompt } from "@/data/prompts/chatSystemPrompt";

// Define your GraphState more explicitly
interface AgentStateType {
  messages: BaseMessage[] | AIMessage[] | HumanMessage[];
}

export async function POST(req: Request) {
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
  const model = await getChatOpenAI();

  const AgentState: AgentStateType = {
    messages: [],
  };

  // TOOL - get Knowledge (with internal query building)
  const getKnowledgeTool = tool(
    async ({ query }: { query: string }) => {
      try {
        // Step 1: Generate variations internally (not exposed to frontend)
        const combinedQuery = await (async () => {
          const variationMessages = [
            new SystemMessage(variationPrompt),
            new HumanMessage(query),
          ];
          const variationModel =
            model.withStructuredOutput(variationOutputShema);
          const res = await variationModel.invoke(variationMessages, {
            metadata: {
              name: "variationModel",
            },
          });
          // Step 2: Combine variations for search
          const combinedQuery = res.variations.join(" ");
          return combinedQuery;
        })();

        // Step 3: Search for relevant content
        const relevantContent = await findRelevantContent(combinedQuery);
        if (!relevantContent || relevantContent.length === 0) {
          return "No relevant content found in knowledge base";
        }

        const formattedContext = relevantContent
          .map((item: any) => item.text)
          .join("\n\n");
        return (
          formattedContext || "No relevant content found in knowledge base"
        );
      } catch (error) {
        console.error("Error in getKnowledgeTool:", error);
        return "Sorry, I encountered an error while searching for relevant information";
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

  // define tools array
  const tools = [getKnowledgeTool];

  // bind the tools with llm
  const chatModelWithTools = model.bindTools(tools);

  // get the prompt
  const prompt = chatSystemPrompt;

  // Create the chain with prompt
  const modelWithPrompt = prompt.pipe(chatModelWithTools);

  // create the tool node
  const toolNode = new ToolNode(tools);

  // const queryAgent = async (state: AgentStateType) => {
  //   const lastHumanMessage = messages
  //     .slice()
  //     .reverse()
  //     .find((msg) => msg instanceof HumanMessage);

  //   if (!lastHumanMessage) {
  //     return null;
  //   }

  //   const combinedQuery = await (async () => {
  //     const variationMessages = [
  //       new SystemMessage(variationPrompt),
  //       lastHumanMessage,
  //     ];
  //     const variationModel = (
  //       await getChatGoogleGenerativeAI()
  //     ).withStructuredOutput(variationOutputShema);
  //     const res = await variationModel.invoke(variationMessages, {
  //       metadata: {
  //         name: "variationModel",
  //       },
  //     });
  //     // Step 2: Combine variations for search
  //     const combinedQuery = res.variations.join(" ");
  //     return res.variations;
  //   })();

  //   console.log("Generated combined search query:", combinedQuery);

  //   return {
  //     searchQuery: combinedQuery,
  //     originalQuery: lastHumanMessage.content,
  //   };
  // };

  // Agent function - decide whether to use tools or response
  async function callModel(
    state: AgentStateType
  ): Promise<Partial<AgentStateType>> {
    const messages = state.messages;

    console.log("CallModel invoked with messages:", messages.length);
    const modelWithConfig = modelWithPrompt.withConfig({
      runName: "Main Model Call",
      tags: ["main_llm"],
    });
    // Format the prompt with current context
    const response = await modelWithConfig.invoke({
      messages: messages,
      tool_names: tools.map((tool) => tool.name).join(", "),
      time: new Date().toISOString(),
    });
    return {
      messages: [response],
    };
  }

  // Condition function - determines next step
  function shouldContinue(state: AgentStateType): "tools" | typeof END {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    // If there are tool calls, continue to tools
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      console.log("Continuing to tools");
      return "tools";
    }
    // Otherwise, end the conversation
    console.log("Ending conversation");
    return "__end__";
  }

  // build the workflow
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent") // Start with callModel
    .addConditionalEdges("agent", shouldContinue, {
      tools: "tools",
      __end__: "__end__",
    })
    .addEdge("tools", "agent"); // After tools, go back to agent

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

  const app = workflow.compile();

  // Execute the workflow
  const events = await app.streamEvents(
    { messages: langchainMessages },
    { version: "v2" },
    {
      includeTags: ["main_llm"],
    }
  );

  return LangChainAdapter.toDataStreamResponse(events);
}
