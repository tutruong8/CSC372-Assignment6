# CSC372-Assignment-6: Triviabook
Trivia REST API built with Node.js, Express, and PostgreSQL (using Neon Console). Uses a Model/Controller/Router design artitechture

**Live API:** https://csc372-assignment6-pqck.onrender.com/triviabook/topics

Try it in the browser:
- All topics: https://csc372-assignment6-pqck.onrender.com/triviabook/topics
- Science questions: https://csc372-assignment6-pqck.onrender.com/triviabook/topic/science
- Random question: https://csc372-assignment6-pqck.onrender.com/triviabook/random

This is hosted on Render's free tier, so if the API is idle for 15 minutes, the first request can take about a minute waiting for the server to wakes up.

## Database Schema
Two tables with a one-to-many relationship: one topic has many questions.
 
### `topics`
| Column | Type | Constraints |
|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` |
| `name` | `TEXT` | `NOT NULL`, `UNIQUE` |
 
### `questions`
| Column | Type | Constraints |
|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` |
| `topic_id` | `INTEGER` | `NOT NULL`, `REFERENCES topics(id)` |
| `question` | `TEXT` | `NOT NULL` |
| `answer` | `TEXT` | `NOT NULL` |
| `difficulty` | `TEXT` | `NOT NULL` (`easy`, `medium`, or `hard`, checked in the controller) |

Both of these tables are automatically created when the server starts (Refer to db.js in 'CREATE TABLE IF NOT EXIST'. If  the 'topics' table is empty, it's seeded with starter questions in 4 topics: science, geography, gaming, and kpop.

## Setup
1. **Clone repo and install dependencies**
```bash
git clone <this-repo-url>
cd <repo-folder>
npm install
```
2. **Create a Neon Postgres project** at [neon.tech](https://neon.tech) and copy its connection string.
3. **Create a `.env` file** in the project root:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=verify-full&channel_binding=require"
```
4. **Start the server** (requires Node.js 20.6 or newer for `--env-file`):
```bash
npm run dev     # restarts on file changes
# or
npm start
```
The server runs at `http://localhost:3000`. On first start, the tables are created and seeded.

## Endpoints
All endpoints are under `/triviabook`.
 
| Method | Endpoint | Description |
|---|---|---|
| GET | `/triviabook/topics` | List all topics available |
| GET | `/triviabook/topic/:topic` | List questions for a topic (with optional `limit` and `difficulty` filters) |
| GET | `/triviabook/random` | One random question, without its answer |
| POST | `/triviabook/answer` | Check a guess against the answer of a question |
| POST | `/triviabook/question/add` | Add a question (also creates the topic if it doesn't exist) |
