import { createContext } from "react";

type WordObject = {
  word: string;
  points: number;
};

type WordContextType = {
  loading: boolean;
  words: WordObject[];
  error: string;
  addWord: (word: string, response: number) => void;
  addError: (error: string) => void;
  setLoading: (is: boolean) => void;
};

const WordContext = createContext<WordContextType>({
  loading: false,
  words: [],
  error: '',
  addWord: (word: string, response: number) => {},
  addError: (error: string) => {},
  setLoading: (is: boolean) => {}
})

export default WordContext;