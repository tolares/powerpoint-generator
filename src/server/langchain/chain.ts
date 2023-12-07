import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
} from "langchain/prompts";
import { DynamicStructuredTool, DynamicTool, Serper } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { generatePPT } from "./powerpoint.js";
import { MyCallbackHandler } from "./callback.js";
import { Dispatch, SetStateAction } from "react";
import { MessageType, SystemMessage } from "langchain/schema";
import { z } from "zod";
import { BufferMemory } from "langchain/memory";

const systemMessage = new SystemMessage(`
You are an assistant for a school teacher.
Search informations (you must include the links of your source) in order to create at least an introduction, 4 sections and a conclusion on the topic that the user will provide you.
  Provide titles and include 3-5 bullet points which give a brief explanation of each title, develop each dot point for at least 150 words by including things like figures, context, sources etc. I want you to be precise.
  Based on all the titles and dot points generate a powerpoint presentation you must include links to sources and links to images in the final powerpoint.
`);
const introSentence = `I would like to create a powerpoint presentation on the topic {subject}.`;
const promptIntro = new HumanMessagePromptTemplate(
  new PromptTemplate({
    template: introSentence,
    inputVariables: ["subject"],
  })
);

type ChainProps = {
  theme: string;
  setChat: Dispatch<
    SetStateAction<{ text: React.ReactNode; type: MessageType }[]>
  >;
};
const schema = z.object({
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
  const search = new Serper(import.meta.env.VITE_SERPER_API_KEY);
  const powerpoint = new DynamicStructuredTool({
    name: "powerpoint_generator",
    description:
      "call this to Generates a powerpoint presentation, it doesn't provide links and images.",
    func: async (toolInput) => generatePPT({ content: toolInput }),
    schema,
  });
  const searchTool = new DynamicTool({
    name: "search_serper",
    description:
      "useful for when you need to ask with search. input should be a string of the search term",
    func: (input) => search.call(input),
  });
  const searchImageTool = new DynamicTool({
    name: "search_serper_image",
    description:
      "useful for when you need to ask with search images. input should be a string of the search term",
    func: (input) => search.call(input),
  });

  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemMessage,
    promptIntro,
  ]);
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0613",
    temperature: 0,
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const executor = await initializeAgentExecutorWithOptions(
    [powerpoint, searchTool, searchImageTool],
    model,
    {
      agentType: "openai-functions",
      verbose: false,
      callbacks: [new MyCallbackHandler(setChat)],
      memory: new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
      }),
    }
  );

  const subjectPlan = await chatPrompt.format({ subject: theme });
  console.log(subjectPlan);
  await executor.run(subjectPlan);
};

/**


import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
} from "langchain/prompts";
import { DynamicStructuredTool, DynamicTool, Serper } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { generatePPT } from "./powerpoint.js";
import { MyCallbackHandler } from "./callback.js";
import { Dispatch, SetStateAction } from "react";
import { MessageType, SystemMessage } from "langchain/schema";
import { z } from "zod";
import { BufferMemory } from "langchain/memory";

const systemMessage = new SystemMessage(`
You are an assistant for a school teacher.
Search informations (you must include the links of your source) in order to create at least an introduction, 4 sections and a conclusion on the topic that the user will provide you.
  Provide titles and include 3-5 bullet points which give a brief explanation of each title, develop each dot point for at least 150 words by including things like figures, context, sources etc. I want you to be precise.
  Based on all the titles and dot points generate a powerpoint presentation you must include links to sources and links to images in the final powerpoint.
`);
const introSentence = `I would like to create a powerpoint presentation on the topic {subject}.`;
const promptIntro = new HumanMessagePromptTemplate(
  new PromptTemplate({
    template: introSentence,
    inputVariables: ["subject"],
  })
);

type ChainProps = {
  theme: string;
  setChat: Dispatch<
    SetStateAction<{ text: React.ReactNode; type: MessageType }[]>
  >;
};
const schema = z.object({
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
  const search = new Serper(import.meta.env.VITE_SERPER_API_KEY);
  const powerpoint = new DynamicStructuredTool({
    name: "powerpoint_generator",
    description:
      "call this to Generates a powerpoint presentation, it doesn't provide links and images.",
    func: async (toolInput) => generatePPT({ content: toolInput }),
    schema,
  });
  const searchTool = new DynamicTool({
    name: "search_serper",
    description:
      "useful for when you need to ask with search. input should be a string of the search term",
    func: (input) => search.call(input),
  });
  const searchImageTool = new DynamicTool({
    name: "search_serper_image",
    description:
      "useful for when you need to ask with search images. input should be a string of the search term",
    func: (input) => search.call(input),
  });

  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemMessage,
    promptIntro,
  ]);
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0613",
    temperature: 0,
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const executor = await initializeAgentExecutorWithOptions(
    [powerpoint, searchTool, searchImageTool],
    model,
    {
      agentType: "openai-functions",
      verbose: false,
      callbacks: [new MyCallbackHandler(setChat)],
      memory: new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
      }),
    }
  );

  const subjectPlan = await chatPrompt.format({ subject: theme });
  console.log(subjectPlan);
  await executor.run(subjectPlan);
};
 */
