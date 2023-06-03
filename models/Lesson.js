// lesson.js
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  name: String,
  description: String,
  level: Number, // skill level required for the lesson
  letters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Letter' }], // Array of related signs
});

module.exports = mongoose.model('Lesson', lessonSchema);
