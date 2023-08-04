import React, { useState } from 'react';
import './App.css';
import Stack from '@mui/material/Stack';
import { Button, TextField, Typography } from '@mui/material';
import { API } from './shared/api';
import { useQuery } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

type WordObject = {
  word: string;
  points: number;
};

const specialCharRegex = /[^a-zA-Z\s]/;

function App(): JSX.Element {
  const [word, setWord] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [words, setWords] = useState<WordObject[]>([]);

  const resetWord = () => {
    setWord('');
    setError('');
  };

  const handleCheckWord = async (): Promise<number> => {
    setError('');
    setLoading(true);

    if (words.some((obj) => obj.word.includes(word))) {
      setError('Word already used!');
      resetWord();
      setLoading(false);
      return 0;
    }

    if (word.length < 2) {
      setError('Word must be longer than 2 characters!');
      resetWord();
      setLoading(false);
      return 0;
    }

    if (!word) {
      setError('You must enter a word!');
      resetWord();
      setLoading(false);
      return 0;
    }

    if (specialCharRegex.test(word)) {
      setError(`Word can't contain numbers or special characters!`);
      resetWord();
      setLoading(false);
      return 0;
    }

    const { data: response } = await API.get(`/word?word=${word}`);

    if (!response) {
      setWords((prevState) => [{ word: word, points: 0 }, ...prevState]);
      setError('Invalid word!');
      resetWord();
      setLoading(false);
      return 0;
    }

    setPoints((prevState) => prevState + response);
    setWords((prevState) => [{ word: word, points: response }, ...prevState]);
    resetWord();
    setLoading(false);
    return response;
  };

  const { refetch } = useQuery<number>({
    enabled: isEnabled,
    queryKey: ['word'],
    queryFn: async () => await handleCheckWord(),
    onSuccess: () => {
      setIsEnabled(false);
    },
  });

  const renderWords = (): JSX.Element[] => {
    return words.slice(0, 10).map((wordObj, id) => (
      <Typography
        key={id}
        sx={{ color: wordObj.points === 0 ? 'red' : 'green' }}
      >
        Word <strong>{wordObj.word}</strong> got you{' '}
        <strong>{wordObj.points}</strong> points!
      </Typography>
    ));
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ margin: 15, justifyContent: 'center' }}
    >
      <Stack spacing={2}>
      <Paper elevation={6}>
        <Stack
          spacing={2}
          sx={{
            width: 'fit-content',
            padding: 5,
          }}
        >
          <Typography variant="h2" component="h2">
            Enter word:
          </Typography>
          <TextField
            id="word"
            name="word"
            value={word}
            onChange={(event) => setWord(event.target.value)}
            variant="outlined"
            label="Word"
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                setIsEnabled(true);
                refetch();
              }
            }}
          />
          {loading ? (
            <Stack sx={{ alignItems: 'center' }}>
              <CircularProgress color="secondary" />
            </Stack>
          ) : (
            <Button
              color="secondary"
              variant="contained"
              sx={{ height: '40px' }}
              onClick={() => {
                setIsEnabled(true);
                refetch();
              }}
            >
              Check
            </Button>
          )}
          <Typography
            sx={{
              fontSize: '50px',
              color: 'black',
              textAlign: 'center',
            }}
          >
            {points} POINTS
          </Typography>
          <Typography
            sx={{ borderBottom: 1, borderColor: 'red', width: 'fit-content' }}
            color="red"
          >
            {error}
          </Typography>
        </Stack>
        </Paper>
        {renderWords()}
      </Stack>
    </Stack>
  );
}

export default App;
