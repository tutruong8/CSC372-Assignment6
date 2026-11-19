import { Router } from 'express';
import { listTopics, listQuestionsForTopic, randomQuestion, checkAnswer, addQuestion } from '../controllers/trivia.js';

const router = Router();

router.get('/topics', listTopics);
router.get('/topic/:topic', listQuestionsForTopic);
router.get('/random', randomQuestion);
router.post('/answer', checkAnswer);
router.post('/question/add', addQuestion);

export default router;