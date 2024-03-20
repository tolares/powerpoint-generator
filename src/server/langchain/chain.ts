// @@ts-nocheck
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { DynamicStructuredTool, DynamicTool } from "langchain/tools";
import { Serper } from "@langchain/community/tools/serper";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { generatePPT, schema } from "./powerpoint.js";
import { ChatCallbackHandler } from "./callback.js";
import { Dispatch, SetStateAction } from "react";
import { BufferMemory } from "langchain/memory";
import { MessageType } from "langchain/schema";

const systemMessage = SystemMessagePromptTemplate.fromTemplate(`
As an expert in educational content creation, your task is to develop a comprehensive PowerPoint presentation on a given topic. This presentation should be suitable for a school teaching environment and tailored to provide a detailed yet engaging learning experience for students.
You won't ask any questions and will generate a powerpoint presentation based on the user's input.
### Instructions:

1. **Research Phase**: Utilize the 'search_serper' tool to conduct thorough research on the provided topic. Ensure that your research is detailed and covers various aspects of the subject matter. Make a research plan and include the links to your sources.

2. **Presentation Structure**:
   - **Introduction**: Craft a compelling introduction that sets the stage for the topic.
   - **Main Content**: Divide the main content into four distinct sections, each focusing on a different facet of the topic.
   - **Conclusion**: Conclude with a summary that encapsulates the key points and leaves a lasting impression.

3. **Content Development**:
   - For each section (including the introduction and conclusion), provide a clear title.
   - Under each title, list 3-5 bullet points summarizing the key elements of that section.
   - Elaborate on each bullet point with at least 150 words, incorporating relevant figures, contextual information, and source citations.
   - Be precise and ensure that the content is educational and engaging for students.

4. **PowerPoint Creation**:
   - Using the 'powerpoint_generator' tool, transform the researched information into a visually appealing PowerPoint presentation.
   - Include links to your sources and relevant images within the presentation to enhance credibility and engagement.
   - Ensure the presentation is well-organized, with a logical flow from one section to the next.
   - Be as precise and informative as possible, catering to the educational needs of students.

5. **Final Delivery**:
   - Provide the completed PowerPoint presentation, ensuring it aligns with the topic "{input}" and adheres to the guidelines above.
   - You must provide the powerpoint file generated with the 'powerpoint_generator' tool.

------
Remember, your goal is to create an informative, engaging, and visually compelling presentation that will captivate and educate students on the chosen topic.
  `);
const introSentence = `I would like to create a powerpoint presentation on the topic {input}.`;
const promptIntro = HumanMessagePromptTemplate.fromTemplate(introSentence);

type ChainProps = {
  theme: string;
  setChat: Dispatch<
    SetStateAction<{ text: React.ReactNode; type: MessageType }[]>
  >;
};

export const chain = async ({ theme, setChat }: ChainProps) => {
  const serper = new Serper(import.meta.env.VITE_SERPER_API_KEY);
  //Define the tools

  const search = new DynamicTool({
    name: "search_serper",
    description:
      "useful for when you need to ask with search. input should be a string of the search term",
    func: (input) => serper.call(input),
  });
  const powerpoint = new DynamicStructuredTool({
    name: "powerpoint_generator",
    description:
      "usefull to generates a powerpoint presentation, it doesn't provide links and images.",
    func: async (toolInput) => generatePPT({ content: toolInput }),
    schema,
  });

  // Define the chat prompt
  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemMessage,
    new MessagesPlaceholder("chat_history"),
    promptIntro,
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0613",
    temperature: 0,
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });

  // Create the agent
  const agent = await createOpenAIFunctionsAgent({
    tools: [powerpoint, search],
    llm: model,
    prompt: chatPrompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools: [powerpoint, search],
    callbacks: [new ChatCallbackHandler(setChat)],
    memory: new BufferMemory({
      memoryKey: "chat_history",
      returnMessages: true,
    }),
  });

  // Invoke the agent
  await agentExecutor.invoke({ input: theme, chat_history: [] });
};

/**
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { DynamicStructuredTool, DynamicTool } from "langchain/tools";
import { Serper } from "@langchain/community/tools/serper";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { generatePPT } from "./powerpoint.js";
import { MyCallbackHandler } from "./callback.js";
import { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { BufferMemory } from "langchain/memory";
import { MessageType } from "langchain/schema";

const systemMessage = SystemMessagePromptTemplate.fromTemplate(`
As an expert in educational content creation, your task is to develop a comprehensive PowerPoint presentation on a given topic. This presentation should be suitable for a school teaching environment and tailored to provide a detailed yet engaging learning experience for students.
You won't ask any questions and will generate a powerpoint presentation based on the user's input.
### Instructions:

1. **Research Phase**: Utilize the 'search_serper' tool to conduct thorough research on the provided topic. Ensure that your research is detailed and covers various aspects of the subject matter. Make a research plan and include the links to your sources.

2. **Presentation Structure**:
   - **Introduction**: Craft a compelling introduction that sets the stage for the topic.
   - **Main Content**: Divide the main content into four distinct sections, each focusing on a different facet of the topic.
   - **Conclusion**: Conclude with a summary that encapsulates the key points and leaves a lasting impression.

3. **Content Development**:
   - For each section (including the introduction and conclusion), provide a clear title.
   - Under each title, list 3-5 bullet points summarizing the key elements of that section.
   - Elaborate on each bullet point with at least 150 words, incorporating relevant figures, contextual information, and source citations.
   - Be precise and ensure that the content is educational and engaging for students.

4. **PowerPoint Creation**:
   - Using the 'powerpoint_generator' tool, transform the researched information into a visually appealing PowerPoint presentation.
   - Include links to your sources and relevant images within the presentation to enhance credibility and engagement.
   - Ensure the presentation is well-organized, with a logical flow from one section to the next.
   - Be as precise and informative as possible, catering to the educational needs of students.

5. **Final Delivery**: 
   - Provide the completed PowerPoint presentation, ensuring it aligns with the topic "{input}" and adheres to the guidelines above.
   - You must provide the powerpoint file generated with the 'powerpoint_generator' tool.

------
Remember, your goal is to create an informative, engaging, and visually compelling presentation that will captivate and educate students on the chosen topic.
  `);
const introSentence = `I would like to create a powerpoint presentation on the topic {input}.`;
const promptIntro = HumanMessagePromptTemplate.fromTemplate(introSentence);

type ChainProps = {
  theme: string;
  setChat: Dispatch<
    SetStateAction<{ text: React.ReactNode; type: MessageType }[]>
  >;
};
const schema = z.object({
  mainTitle: z.string(),
  sections: z.array(
    z.object({
      title: z.string(),
      content: z.array(z.string()),
      images: z.array(z.string()),
      sources: z.array(
        z.object({
          url: z.string().url(),
          title: z.string(),
        })
      ),
    })
  ),
});
export const chain = async ({ theme, setChat }: ChainProps) => {
  const serper = new Serper(import.meta.env.VITE_SERPER_API_KEY);
  // Define the tools
  const search = new DynamicTool({
    name: "search_serper",
    description:
      "useful for when you need to ask with search. input should be a string of the search term",
    func: (input) => serper.call(input),
  });

  const powerpoint = new DynamicStructuredTool({
    name: "powerpoint_generator",
    description:
      "usefull to generates a powerpoint presentation, it doesn't provide links and images.",
    func: async (toolInput) => generatePPT({ content: toolInput }),
    schema,
  });

  // Define the chat prompt
  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemMessage,
    promptIntro,
    new MessagesPlaceholder("agent_scratchpad"),
  ]);
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0613",
    temperature: 0,
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });

  // Create the agent
  const agent = await createOpenAIFunctionsAgent({
    tools: [powerpoint, search],
    llm: model,
    prompt: chatPrompt,
  });
  const client = new Client({
    apiUrl: "https://api.smith.langchain.com",
    apiKey: import.meta.env.VITE_LANGSMITH_API_KEY,
  });

  const tracer = new LangChainTracer({
    projectName: "ppt-generator",
    client,
  });

  // Create the agent executor
  const agentExecutor = new AgentExecutor({
    agent,
    tools: [powerpoint, search],
    callbacks: [new ChatCallbackHandler(setChat), tracer],
    verbose: true,
    memory: new BufferMemory({
      memoryKey: "chat_history",
      returnMessages: true,
    }),
  });

  // Invoke the agent
  await agentExecutor.invoke({ input: theme });
};
 */
