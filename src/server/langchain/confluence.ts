import { ConfluencePagesLoader } from "langchain/document_loaders/web/confluence";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const splitDocs = (documents: any) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 20,
  });
  return textSplitter.splitDocuments(documents);
};

export const loadConfluence = async () => {
  const username = process.env.VITE_CONFLUENCE_USERNAME;
  const accessToken = process.env.VITE_CONFLUENCE_ACCESS_TOKEN;

  if (username && accessToken) {
    const loader = new ConfluencePagesLoader({
      baseUrl: "https://criteo.atlassian.net/wiki",
      spaceKey: "RELOOK",
      username,
      accessToken,
    });
    const documents = await loader.load();
    return splitDocs(documents);
  } else {
    console.log(
      "You must provide a username and access token to run this example."
    );
  }
};
