import pg from 'pg';

export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

await pool.query(`CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
)`);

await pool.query(`CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES topics(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty TEXT NOT NULL
)`);

let topics = ['science', 'geography', 'gaming', 'kpop'];

let scienceQuestions = [
  { question: 'What planet is known as the Red Planet?', answer: 'Mars', difficulty: 'easy' },
  { question: 'What is the chemical symbol for gold?', answer: 'Au', difficulty: 'medium' },
  { question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', difficulty: 'easy' }
];

let geographyQuestions = [
  { question: 'What is the capital of Australia?', answer: 'Canberra', difficulty: 'medium' },
  { question: 'Which river flows through Cairo?', answer: 'The Nile', difficulty: 'easy' }
];

let gamingQuestions = [
  { question: 'What is the mascot of the Pokemon franchise?', answer: 'Pikachu', difficulty: 'easy' },
  { question: 'Which platform plans on stopping the production of physical disk for their games starting January 2028?', answer: 'playstation', difficulty: 'medium' },
  { question: 'What is Tú\'s favorite game?', answer: 'Persona 3', difficulty: 'hard' }
];

let kpopQuestions = [
  { question: 'Which kpop group has the following 4 members: Karina, Winter, Giselle, and Ningning?', answer: 'aespa', difficulty: 'medium' },
  { question: 'Which member from kpop group i-dle released a extended play in January 2025?', answer: 'MINNIE', difficulty: 'hard' }
];

const existing = await pool.query('SELECT * FROM topics');
if (existing.rows.length === 0) {
    const questionsByTopic = {
        'science': scienceQuestions,
        'geography': geographyQuestions,
        'gaming': gamingQuestions,
        'kpop': kpopQuestions
    };

    for (const topic of topics) {
        const result = await pool.query('INSERT INTO topics (name) VALUES ($1) RETURNING *', [topic]);
        const topicId = result.rows[0].id;

        for (const q of questionsByTopic[topic]) {
            await pool.query('INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)', [topicId, q.question, q.answer, q.difficulty]);
        }
    }
    console.log('Database initialized with topics and questions.');
}