import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { DynamicTool, Serper } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { generatePPT } from "./powerpoint.js";
import { MyCallbackHandler } from "./callback.js";
import { Dispatch, SetStateAction } from "react";
import { MessageType } from "langchain/schema";
import * as dotenv from "dotenv";
dotenv.config();
const introSentence = `I am a school teacher.
  Search informations (you must include the links of your source) in order to create at least an introduction, 4 sections and a conclusion on the topic {subject}.
  Provide titles and include 3-5 bullet points which give a brief explanation of each title, develop each dot point for at least 150 words by including things like figures, context, sources etc. I want you to be precise.
  Based on all the titles and dot points generate a powerpoint presentation you must include links to sources and links to images in the final powerpoint.`;
const promptIntro = new PromptTemplate({
  template: introSentence,
  inputVariables: ["subject"],
});

type ChainProps = {
  theme: string;
  setChat: Dispatch<
    SetStateAction<{ text: React.ReactNode; type: MessageType }[]>
  >;
};

export const chain = async ({ theme, setChat }: ChainProps) => {
  const search = new Serper(process.env.VITE_SERPER_API_KEY);
  const powerpoint = new DynamicTool({
    name: "powerpoint_generator",
    description:
      "call this to Generates a powerpoint presentation, it doesn't provide links and images. input should be a json string follwing the format: {sections: {title: string, content: string[], images: string[], sources: {url:string, title: string}[]}[]}.Don't escape the characters and don't use new lines characters.",
    func: async (toolInput) => generatePPT({ content: JSON.parse(toolInput) }),
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
  const executor = await initializeAgentExecutorWithOptions(
    [powerpoint, searchTool, searchImageTool],
    new ChatOpenAI({
      modelName: "gpt-3.5-turbo-0613",
      temperature: 0,
      openAIApiKey: process.env.VITE_OPENAI_API_KEY,
    }),
    {
      agentType: "openai-functions",
      verbose: false,
      callbacks: [new MyCallbackHandler(setChat)],
    }
  );
  const subjectPlan = await promptIntro.format({ subject: theme });
  await executor.run(subjectPlan);
};
