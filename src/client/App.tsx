import { useState } from 'react';
import pptLogo from '../../assets/ppt.svg';
import './App.css';
import { Button, Card, Grid, TextField, Typography } from '@mui/material';
import { chain } from '../server/langchain/chain';
import { MessageType } from 'langchain/schema';
import React from 'react';

const convertMessageTypeToEmoji = (type: MessageType) => {
  switch (type) {
    case 'ai':
      return '🧠';
    case 'human':
      return '🧑‍💻';
    case 'function':
      return '🤖';
    default:
      return 'ℹ️';
  }
};

function App() {
  const [theme, setTheme] = useState('');
  const [chat, setChat] = useState<
    { text: React.ReactNode; type: MessageType }[]
  >([]);

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <img src={pptLogo} className="logo" alt="Powerpoint logo" />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2" fontWeight={600}>
          Powerpoint Generator
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          placeholder="Type your subject here"
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
            chain({ theme, setChat });
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
          direction={item.type === 'human' ? 'row' : 'row-reverse'}
        >
          <Grid item xs={7}>
            <Card
              sx={{ mt: 2, pY: 2, textAlign: 'left', backgroundColor: 'grey' }}
            >
              {convertMessageTypeToEmoji(item.type)}
              <pre style={{ textWrap: 'wrap' }}>{item.text}</pre>
            </Card>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default App;
