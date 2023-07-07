import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { VectorDBQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { MessageType } from "langchain/schema";
import { Dispatch, SetStateAction } from "react";
type ChainProps = {
  theme: string;
  setChat: Dispatch<
    SetStateAction<{ text: React.ReactNode; type: MessageType }[]>
  >;
};
export const documentChain = async ({ theme, setChat }: ChainProps) => {
  if (
    !import.meta.env.VITE_PINECONE_API_KEY ||
    !import.meta.env.VITE_PINECONE_ENVIRONMENT ||
    !import.meta.env.VITE_PINECONE_INDEX ||
    !import.meta.env.VITE_OPENAI_API_KEY
  ) {
    throw new Error(
      "PINECONE_ENVIRONMENT and PINECONE_API_KEY and PINECONE_INDEX must be set"
    );
  }
  const client = new PineconeClient();
  await client.init({
    apiKey: import.meta.env.VITE_PINECONE_API_KEY,
    environment: import.meta.env.VITE_PINECONE_ENVIRONMENT,
  });
  const index = client.Index(import.meta.env.VITE_PINECONE_INDEX);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0613",
    temperature: 0,
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });
  const prompt = PromptTemplate.fromTemplate("{topic}");
  const topic = await prompt.format({ topic: theme });

  const chain = VectorDBQAChain.fromLLM(llm, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });
  const response = await chain.call({ query: topic });
  setChat([{ text: response.answer, type: "ai" }]);
};
