import { pool } from '../db.js';

//GET
export async function getAllTopics() {
  const result = await pool.query('SELECT * FROM topics ORDER BY id');
  return result.rows;
}

export async function getRandomQuestion() {
    const result = await pool.query('SELECT * FROM questions ORDER BY RANDOM() LIMIT 1');
    return result.rows[0];
}


//GET and POST
export async function findTopicByName(name) {
    const result = await pool.query('SELECT * FROM topics WHERE name = $1', [name]);
    return result.rows[0];
}

export async function getQuestionsByTopicId(topicId, diffuculty, limit) {
    let sql = 'SELECT * FROM questions WHERE topic_id = $1';
    const params = [topicId];

    if (diffuculty) {
        params.push(diffuculty);
        sql += ` AND difficulty = $${params.length}`;
    }
    if (limit) {
        params.push(limit);
        sql += ` LIMIT $${params.length}`;
    }
    const result = await pool.query(sql, params);
    return result.rows;
}

//POST
export async function findQuestionById(id) {
    const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
    return result.rows[0];
}

export async function createTopic(name) {
    const result = await pool.query('INSERT INTO topics (name) VALUES ($1) RETURNING *', [name]);
    return result.rows[0];
}

export async function createQuestion(topicId, question, answer, difficulty) {
    const result = await pool.query('INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4) RETURNING *', [topicId, question, answer, difficulty]);
    return result.rows[0];
}