import * as trivia from '../models/trivia.js';

export async function listTopics(req, res, next) {
  try {
    const topics = await trivia.getAllTopics();
    res.json(topics);
  } catch (err) {
    next(err);
  }
}