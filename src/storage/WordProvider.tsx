import { useState } from "react";
import WordContext from "./WordContext";

type WordObject = {
  word: string;
  points: number;
};

const WordProvider = ({children}: any) => {
  const [wordsState, setWordState] = useState<WordObject[]>([]);
  const [errorState, setErrorState] = useState<string>('');
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const addWord = (word: string, response: number): void => {
    setWordState((prevState) => [{ word: word, points: response }, ...prevState])
  }

  const addError = (error: string): void => {
    setErrorState(error);
  }

  const setLoading = (is: boolean): void => {
    
    setLoadingState(is);
  } 

  const wordContext = {
    loading: loadingState,
    words: wordsState,
    error: errorState,
    addWord,
    addError,
    setLoading,
  };

  return (
    <WordContext.Provider value={wordContext}>{children}</WordContext.Provider>
  );
}

export default WordProvider;