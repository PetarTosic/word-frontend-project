import { useContext } from 'react';
import { API } from '../shared/api';
import WordContext from '../storage/WordContext';

const specialCharRegex = /[^a-zA-Z\s]/;

export const useWordChecker = () => {
  const { words, addError, addWord, setLoading } = useContext(WordContext);

  const handleCheckWord = async (word: string): Promise<number> => {
    addError('');
    setLoading(true);

    if (words.some((obj) => obj.word === word) && word) {
      addError('Word already used!');
      setLoading(false);
      return 0;
    }

    if (word.length < 2) {
      addError('Word must be longer than 2 characters!');
      setLoading(false);
      return 0;
    }

    if (specialCharRegex.test(word)) {
      addError(`Word can't contain numbers or special characters!`);
      setLoading(false);
      return 0;
    }

    const { data: response } = await API.get(`/word?word=${word}`);

    if (!response) {
      addWord(word, 0);
      addError('Invalid word!');
      setLoading(false);
      return 0;
    }
    
    addWord(word, response);
    setLoading(false);
    return response;
  };

  return { handleCheckWord };
};