import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models";
import { SerpAPI, Serper } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { chain } from "./chain.js";
import { generatePPT } from "./powerpoint.js";
import * as dotenv from "dotenv";

dotenv.config();
export const run = async () => {
  //const openAIResult = await chain();
  generatePPT({ content: undefined });
};

run();
