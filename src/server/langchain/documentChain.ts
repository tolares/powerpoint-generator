import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { VectorDBQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { loadConfluence } from "./confluence";
dotenv.config();
type ChainProps = {
  theme: string;
};
export const documentChain = async ({ theme }: ChainProps) => {
  if (
    !process.env.VITE_PINECONE_API_KEY ||
    !process.env.VITE_PINECONE_ENVIRONMENT ||
    !process.env.VITE_PINECONE_INDEX ||
    !process.env.VITE_OPENAI_API_KEY
  ) {
    throw new Error(
      "PINECONE_ENVIRONMENT and PINECONE_API_KEY and PINECONE_INDEX must be set"
    );
  }
  const docs = await loadConfluence();
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.VITE_PINECONE_API_KEY,
    environment: process.env.VITE_PINECONE_ENVIRONMENT,
  });
  const index = client.Index(process.env.VITE_PINECONE_INDEX);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.VITE_OPENAI_API_KEY,
  });
  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0613",
    temperature: 0,
    openAIApiKey: process.env.VITE_OPENAI_API_KEY,
  });
  const vectorStore = await PineconeStore.fromDocuments(
    docs ?? [],
    embeddings,
    {
      pineconeIndex: index,
    }
  );
  const prompt = PromptTemplate.fromTemplate("{topic}");
  const topic = await prompt.format({ topic: theme });

  const chain = VectorDBQAChain.fromLLM(llm, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });
  const response = await chain.call({ query: topic });
  return [
    {
      text: response.text,
      type: "ai",
      sourceDocuments: response.sourceDocuments,
    },
  ];
};
