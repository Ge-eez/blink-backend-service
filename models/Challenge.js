const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    requirements: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
    ],
    symbols: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Symbol", required: true },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // Enable automatic timestamps
);

module.exports = mongoose.model("Challenge", challengeSchema);
