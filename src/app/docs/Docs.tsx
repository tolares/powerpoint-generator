/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import "./Docs.css";
import { Button, Card, Grid, TextField, Typography } from "@mui/material";
import { MessageType } from "langchain/schema";
import { documentChain } from "../../langchain/documentChain";

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
    { text: React.ReactNode; type: MessageType }[]
  >([]);

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
          onClick={() => {
            setChat([]);
            documentChain({ theme, setChat });
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
              sx={{ mt: 2, pY: 2, textAlign: "left", backgroundColor: "grey" }}
            >
              {convertMessageTypeToEmoji(item.type)}
              {/* @ts-ignore*/}
              <pre style={{ "text-wrap": "wrap" }}>{item.text}</pre>
            </Card>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default Docs;
