import * as trivia from '../models/trivia.js';

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

export async function listTopics(req, res, next) {
  try {
    const topics = await trivia.getAllTopics();
    res.json(topics);
  } catch (err) {
    next(err);
  }
}

export async function listQuestionsForTopic(req, res, next) {
    try {
        const name = req.params.topic.toLowerCase();
        const { difficulty, limit } = req.query;

        if (difficulty && !DIFFICULTY_LEVELS.includes(difficulty)) {
            return res.status(400).send({ error: 'Invalid difficulty level, only easy, medium, or hard' });
        }

        if (limit !== undefined) {
            const n = Number(limit);
            if (!Number.isInteger(n) || n < 1) {
                return res.status(400).send({ error: 'Invalid limit, must be a positive integer' });
            }
        }

        const topic = await trivia.findTopicByName(name);
        if (!topic) {
            return res.status(404).send({ error: `Topic '${name}' not found` });
        }

        const questions = await trivia.getQuestionsByTopicId(topic.id, difficulty, limit);
        res.json(questions);
    } catch (err) {
        next(err);
    }
}

export async function randomQuestion(req, res, next) {
    try {
        const question = await trivia.getRandomQuestion();
        if (!question) {
            return res.status(404).send({ error: 'No questions found' });
        }
        res.json(question);
    } catch (err) {
        next(err);
    }
}

export async function checkAnswer(req, res, next) {
    try {
        if (!req.body) {
            return res.status(400).send({ error: 'No data provided in request body' });
        }
        const { id, guess } = req.body;
        if (!id || !guess) {
            return res.status(400).send({ error: 'Missing questionId or answer in request body' });
        }
        const questionId = Number(id);
        if (!Number.isInteger(questionId) || questionId < 1) {
            return res.status(400).send({ error: 'Invalid id, must be a positive integer' });
        }
        const result = await trivia.findQuestionById(id);
        if (!result) {
            return res.status(404).send({ error: `Question with id ${id} not found` });
        }
        const correct = String(guess).trim().toLowerCase() === result.answer.trim().toLowerCase();
        res.json({ correct, answer: result.answer });
    } catch (err) {
        next(err);
    }
}

export async function addQuestion(req, res, next) {
    try {
        if (!req.body) {
            return res.status(400).send({ error: 'No data provided in request body' });
        }
        const {topic, question, answer, difficulty} = req.body;
        if (!topic || !question || !answer || !difficulty) {
            return res.status(400).send({ error: 'Missing topic, question, answer, or difficulty in request body' });
        }
        if (!DIFFICULTY_LEVELS.includes(difficulty)) {
            return res.status(400).send({ error: 'Invalid difficulty level, only easy, medium, or hard' });
        }
        const name = topic.trim().toLowerCase();
        let topicRow = await trivia.findTopicByName(name);
        if (!topicRow) {
            topicRow = await trivia.createTopic(name);
        }
        await trivia.createQuestion(topicRow.id, question, answer, difficulty);
        const questions = await trivia.getQuestionsByTopicId(topicRow.id);
        res.status(201).json(questions);
    } catch (err) {
        next(err);
    }
}