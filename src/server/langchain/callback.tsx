import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { Serialized } from "langchain/load/serializable";
import {
  AgentAction,
  AgentFinish,
  BaseMessage,
  ChainValues,
  LLMResult,
  MessageType,
} from "langchain/schema";
import React from "react";
import { Dispatch, SetStateAction } from "react";

export class ChatCallbackHandler extends BaseCallbackHandler {
  name = "ChatCallbackHandler";

  setChat: Dispatch<
    SetStateAction<{ text: React.ReactNode; type: MessageType }[]>
  >;
  constructor(
    setChat: Dispatch<
      SetStateAction<{ text: React.ReactNode; type: MessageType }[]>
    >
  ) {
    super();
    this.setChat = setChat;
  }

  async handleChainStart(_chain: Serialized, inputs: ChainValues) {
    this.setChat((previousValue) =>
      previousValue.concat({
        text: `I would like to create a powerpoint presentation on the topic ${inputs["input"]}.`,
        type: "human",
      })
    );
  }
  async handleChatModelStart(llm: Serialized, prompts: BaseMessage[][]) {
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

  async handleToolStart(tool: Serialized) {
    console.log(`🤖: Calling ${tool.id}`);
    this.setChat((previousValue) =>
      previousValue.concat({ text: `Calling ${tool.id}`, type: "function" })
    );
  }

  async handleAgentAction(action: AgentAction) {
    this.setChat((previousValue) =>
      previousValue.concat({
        text: (
          <>
            {action.tool}
            <pre style={{ textWrap: "wrap" }}>
              {JSON.stringify(action.toolInput)}
            </pre>
          </>
        ),
        type: "function",
      })
    );
  }

  async handleToolEnd(output: string) {
    console.log(`🤖 toolEnd: ${output}`);
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
