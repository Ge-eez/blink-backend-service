// user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, 
  lesson_progress: [{
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    completionStatus: Boolean, // whether the user has completed the lesson or not
    lastVisited: Date, // the last time the user visited this lesson
  }],
  challenge_progress: [{
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
    lastAttempt: Date,
  }],
  // other fields...
});

module.exports = mongoose.model("User", userSchema);
