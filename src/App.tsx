import { useState, useContext } from 'react';
import './App.css';
import Stack from '@mui/material/Stack';
import { Button, TextField, Typography } from '@mui/material';
import { API } from './shared/api';
import { useQuery } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import RenderWords from './components/RenderWords';
import WordContext from './storage/WordContext';

type WordObject = {
  word: string;
  points: number;
};

const specialCharRegex = /[^a-zA-Z\s]/;

function App(): JSX.Element {
  const [word, setWord] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const { loading, error, words, addError, addWord, setLoading } = useContext(WordContext);


  const handleCheckWord = async (): Promise<number> => {
    addError('');
    setLoading(true); 
    
    if (words.some((obj) => obj.word === word) && word) {
      addError('Word already used!');
      setWord('');
      setLoading(false);
      return 0;
    }

    if (word.length < 2) {
      addError('Word must be longer than 2 characters!');
      setWord('');
      setLoading(false);  
      return 0;
    }

    if (specialCharRegex.test(word)) {
      addError(`Word can't contain numbers or special characters!`);
      setWord('');
      setLoading(false);
      return 0;
    }

    const { data: response } = await API.get(`/word?word=${word}`);

    if (!response) {
      addWord(word, 0);
      addError('Invalid word!');
      setWord('');
      setLoading(false);
      return 0;
    }

    setPoints((prevState) => prevState + response);
    addWord(word, response);
    setWord('');
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
            {points === 0 ? 'NO' : points} POINTS
          </Typography>
          <Typography
            sx={{ borderBottom: 1, borderColor: 'red', width: 'fit-content' }}
            color="red"
          >
            {error}
          </Typography>
        </Stack>
        </Paper>
        <RenderWords words={words}/>
      </Stack>
    </Stack>
  );
}

export default App;
