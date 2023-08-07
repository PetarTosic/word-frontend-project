import { Typography } from "@mui/material";

const RenderWords = ({words}: any) => {
  return words.slice(0, 10).map((wordObj: {word: string, points: number}, id: number) => (
    <Typography
      key={id}
      sx={{ color: wordObj.points === 0 ? 'red' : 'green' }}
    >
      Word <strong>{wordObj.word}</strong> got you{' '}
      <strong>{wordObj.points}</strong> points!
    </Typography>
  ));
};

export default RenderWords;