import express from "express";
import ViteExpress from "vite-express";
import { documentChain } from "../langchain/documentChain";
const app = express();

app.get("/documentation", async (req, res) => {
  const theme = req.query.theme || "oups";
  const result = await documentChain({ theme: theme as string });
  console.debug(result);
  res.send(result);
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
