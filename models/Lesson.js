// lesson.js
const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: Number, required: true },
    symbols: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Symbol", required: true },
    ], // Array of related symbols
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // Enable automatic timestamps
);

module.exports = mongoose.model("Lesson", lessonSchema);
