import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button, Card, TextField } from "@mui/material";
import { chain } from "../langchain/chain";
import { MessageType } from "langchain/schema";

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

function App() {
  const [theme, setTheme] = useState("");
  const [chat, setChat] = useState<{ text: string; type: MessageType }[]>([]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <TextField
          placeholder="Type in here…"
          variant="outlined"
          onChange={(value) => setTheme(value.target.value)}
        />
        <Button
          variant="outlined"
          onClick={() => {
            setChat([]);
            chain({ theme, setChat });
          }}
        >
          Run generation
        </Button>
      </div>
      {chat.map((item) => (
        <Card sx={{ mt: 2, pY: 2, textAlign: "left" }}>
          <pre>
            {convertMessageTypeToEmoji(item.type)}:{item.text}
          </pre>
        </Card>
      ))}
    </>
  );
}

export default App;
