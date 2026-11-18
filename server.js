import express from 'express';
import triviaRouter from './routes/trivia.js';

const app = express();
app.use(express.json());
const port = 3000;

app.use('/triviabook', triviaRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500)({ error: 'Something went wrong on the server' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});