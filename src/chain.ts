import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import * as dotenv from "dotenv";
import prompt from "prompt-sync";
import { DynamicTool, Serper } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { generatePPT } from "./powerpoint.js";
import { Calculator } from "langchain/tools/calculator";
import { MyCallbackHandler } from "./callback.js";

dotenv.config();

const introSentence = `I am a school teacher and I am wanting to create a powerpoint presentation on {subject}.
  Generate a powerpoint presentation, it will need at least an introduction, 4 sections and a conclusion.
  Provide titles and include 3-5 bullet points which give a brief explanation of each slide title, develop each dot point for at least 150 words by including things like figures, context, sources etc. I want you to be precise and concise.`;
const promptIntro = new PromptTemplate({
  template: introSentence,
  inputVariables: ["subject"],
});
export const chain = async () => {
  const powerpoint = new DynamicTool({
    name: "powerpoint_generator",
    description:
      "call this to Generates a powerpoint presentation. input should be a json string in the format of sections[] > title, content[]",
    func: async (toolInput) => generatePPT({ content: JSON.parse(toolInput) }),
  });
  const executor = await initializeAgentExecutorWithOptions(
    [powerpoint, new Calculator(), new Serper()],
    new ChatOpenAI({ modelName: "gpt-3.5-turbo-0613", temperature: 0 }),
    {
      agentType: "openai-functions",
      verbose: false,
      callbacks: [new MyCallbackHandler()],
    }
  );

  const readline = prompt({ sigint: true });
  const theme = readline(
    "🤖: Hello! What is the subject that you will want to present today?"
  );
  const subjectPlan = await promptIntro.format({ subject: theme });
  try {
    await executor.run(subjectPlan);
  } catch (e: any) {
    console.log(e.response.data.error);
  }
};
