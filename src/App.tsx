import React, { useState } from 'react';
import './App.css';
import Stack from '@mui/material/Stack';
import { Button, TextField, Typography } from '@mui/material';
import { API } from './shared/api';
import { useQuery } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';

type WordObject = {
  word: string;
  points: number;
}

const specialCharRegex = /[^a-zA-Z]/;

function App() {
  const [word, setWord] = useState<string>('');
  const [error, setError] = useState('');
  const [points, setPoints] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState<WordObject[]>([]);

  const checkLength = () => {
    if(words.length > 10) {
      setWords((prevState) => prevState.slice(0, -1));
    }
  }

  const fetchWord = async () => {
    setError('');
    setLoading(true);

    if(!word) {
      setError('You must enter a word!');
      setLoading(false);
      return 0;
    }

    if(specialCharRegex.test(word)) {
      setError(`Word can't contain numbers or a special character!`)
      setLoading(false);
      return 0;
    }

    const { data: response } = await API.get(`/word?word=${word}`);

    if(!response) {
      setWords((prevState) => [{word: word, points: 0}, ...prevState]);
      checkLength();
      setError('Invalid word!');
      setLoading(false);
      setWord('');
      return 0;
    }

    setPoints(prevState => prevState + response);
    setWords((prevState) => [{word: word, points: response}, ...prevState]);
    setWord('');
    setError('');
    setLoading(false);
    checkLength();
    return response;
  };

  const { isInitialLoading, isLoading, refetch } = useQuery({
    enabled: isEnabled,
    queryKey: ['word'],
    queryFn: async () => await fetchWord(),
    onSuccess: () => {setIsEnabled(false)},
  })

  return (
    <Stack direction="row" spacing={2} sx={{margin: 10, justifyContent: 'center'}}>
      <Stack spacing={2}>
        <Stack spacing={2} sx={{width: 'fit-content', border: 1, padding: 5, borderRadius: '20px'}}>
          <Typography variant="h2" component="h2">
            Enter word:
          </Typography>
          <TextField id="word" name="word" value={word} onChange={(event) => setWord(event.target.value)} variant="outlined" label="Word" onKeyDown={(e) => {if(e.code === "Enter") {setIsEnabled(true); refetch()}}} />
          {loading ? <Stack sx={{alignItems: 'center'}}><CircularProgress color="secondary" /></Stack> : <Button color="secondary" variant="contained" sx={{height: '40px'}} onClick={() => {setIsEnabled(true); refetch()}}>Check</Button>}
          <Typography sx={{fontSize: '50px', color: 'black', textAlign: 'center'}}>{points} POINTS</Typography>
          <Typography sx={{ borderBottom: 1, borderColor: 'red', width: 'fit-content' }} color="red" >{error}</Typography>
        </Stack>
        {words?.map((word, id) => {
          return (
            <Typography key={id} sx={{color: word.points == 0 ? 'red' : 'green'}}>Word <strong>{word.word}</strong> got you <strong>{word.points}</strong> points!</Typography>
          )
        })}
      </Stack>
    </Stack>
  );
}

export default App;
