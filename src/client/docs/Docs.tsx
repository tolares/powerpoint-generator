/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import "./Docs.css";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { MessageType } from "langchain/schema";
import React from "react";
import { Document } from "langchain/dist/document";

const convertMessageTypeToEmoji = (type: MessageType) => {
  switch (type) {
    case "ai":
      return "🧠";
    case "human":
      return "🧑‍💻";
    case "function":
      return "🤖";
    default:
      return "ℹ️";
  }
};

function Docs() {
  const [theme, setTheme] = useState("");
  const [chat, setChat] = useState<
    { text: React.ReactNode; type: MessageType; sourceDocuments?: Document[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2" fontWeight={600}>
          Relook Documentation
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          placeholder="Type your question about relook here"
          variant="outlined"
          fullWidth
          onChange={(value) => setTheme(value.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          onClick={async () => {
            setIsLoading(true);
            setChat((previousValue) =>
              previousValue.concat({ text: theme, type: "human" })
            );
            const result = await fetch(
              `http://localhost:3000/documentation?theme=${theme}`
            ).then((res) => res.json());
            console.log(result.sourceDocuments);
            setChat((previousValue) => previousValue.concat(result));
            setIsLoading(false);
          }}
        >
          Run generation
        </Button>
      </Grid>
      {chat.map((item, index) => (
        <Grid
          key={index}
          container
          rowSpacing={2}
          direction={item.type === "human" ? "row" : "row-reverse"}
        >
          <Grid item xs={7}>
            <Card
              sx={{
                mt: 2,
                pY: 2,
                textAlign: "left",
                backgroundColor: "primary.light",
              }}
            >
              {convertMessageTypeToEmoji(item.type)}
              {/* @ts-ignore*/}
              <pre style={{ textWrap: "wrap" }}>{item.text}</pre>
              {item.sourceDocuments?.map((document, index) => {
                return (
                  <Link
                    color="success.dark"
                    key={index}
                    href={document.metadata.url}
                  >
                    {document.metadata.title} [From lines :{" "}
                    {document.metadata["loc.lines.from"]} to{" "}
                    {document.metadata["loc.lines.to"]}]
                  </Link>
                );
              })}
            </Card>
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12} justifyContent="center">
        {isLoading && <CircularProgress />}
      </Grid>
    </Grid>
  );
}

export default Docs;
