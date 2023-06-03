// challenge.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Symbol", required: true },
  ],
  correctAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Symbol",
    required: true,
  },
});

const challengeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    sequence: {
      level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: true,
      },
      order: { type: Number, required: true },
    },
    order: { type: Number, required: true }, // This field defines the order of the challenge
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // Enable automatic timestamps
);

module.exports = mongoose.model("Challenge", challengeSchema);
