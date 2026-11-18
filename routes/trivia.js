import { Router } from 'express';
import { listTopics } from '../controllers/trivia.js';

const router = Router();

router.get('/topics', listTopics);

export default router;