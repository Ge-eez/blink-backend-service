// challenge.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Letter' }], // Array of options, these are Letter Ids
  correctAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Letter' }, // Id of the correct answer Letter
});

const challengeSchema = new mongoose.Schema({
  name: String,
  description: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  locked: { type: Boolean, default: true }, // a challenge starts as locked
  questions: [questionSchema], // Array of related questions
});

module.exports = mongoose.model('Challenge', challengeSchema);
