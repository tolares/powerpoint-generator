import { BaseCallbackHandler } from "langchain/callbacks";
import { Serialized } from "langchain/load/serializable";
import {
  AgentAction,
  AgentFinish,
  BaseChatMessage,
  ChainValues,
  LLMResult,
  MessageType,
} from "langchain/schema";
import { Dispatch, SetStateAction } from "react";

export class MyCallbackHandler extends BaseCallbackHandler {
  name = "MyCallbackHandler";

  setChat: Dispatch<SetStateAction<{ text: string; type: MessageType }[]>>;
  constructor(
    setChat: Dispatch<SetStateAction<{ text: string; type: MessageType }[]>>
  ) {
    super();
    this.setChat = setChat;
  }

  async handleChainStart(_chain: Serialized, inputs: ChainValues) {
    this.setChat((previousValue) =>
      previousValue.concat({ text: inputs["input"], type: "human" })
    );
  }
  async handleChatModelStart(llm: Serialized, prompts: BaseChatMessage[][]) {
    console.log(`🧠 ChatModelStart: ${llm.id}: ${prompts}`);
    this.setChat((previousValue) =>
      previousValue.concat({ text: prompts.toString(), type: "ai" })
    );
  }
  async handleLLMStart(llm: Serialized) {
    console.log(`🧠 llmStart: ${llm.id}`);
    this.setChat((previousValue) =>
      previousValue.concat({ text: llm.id.toString(), type: "ai" })
    );
  }
  async handleLLMEnd(output: LLMResult) {
    console.log(`🧠: ${output.generations}`);
    this.setChat((previousValue) =>
      previousValue.concat({ text: output.generations.toString(), type: "ai" })
    );
  }

  async handleChainEnd(_output: ChainValues) {
    //console.log("Finished chain.");
  }

  async handleToolStart(tool: Serialized) {
    console.log(`🤖: Calling ${tool.id}`);
  }

  async handleAgentAction(action: AgentAction) {
    this.setChat((previousValue) =>
      previousValue.concat({ text: action.tool, type: "function" })
    );
  }

  async handleToolEnd(_output: string) {
    //console.log(`🤖 toolEnd: ${output}`);
  }

  async handleText(text: string) {
    console.log(text);
  }

  async handleAgentEnd(action: AgentFinish) {
    this.setChat((previousValue) =>
      previousValue.concat({ text: action.log, type: "ai" })
    );
  }
}
