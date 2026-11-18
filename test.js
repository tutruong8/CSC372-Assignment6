import * as trivia from './models/trivia.js';

console.log('science topic:', await trivia.findTopicByName('science'));
console.log('fake topic:', await trivia.findTopicByName('nope'));
console.log('science, easy, limit 1:', await trivia.getQuestionsByTopicId(1, 'easy', 1));
console.log('random:', await trivia.getRandomQuestion());
console.log('question 1:', await trivia.findQuestionById(1));

process.exit();