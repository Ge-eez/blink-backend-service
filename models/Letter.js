// letter.js
const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
    character: { type: String, unique: true },
  letter: String,
  form: String,
});

module.exports = mongoose.model('Letter', letterSchema);
