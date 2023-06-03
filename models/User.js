const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.*@.*\..*/,
    },
    password: { type: String, required: true, minlength: 5 },
    lesson_progress: [
      {
        lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
        completionStatus: Boolean,
        lastVisited: Date,
      },
    ],
    challenge_progress: [
      {
        challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
        status: {
          type: String,
          enum: ["Not Started", "In Progress", "Completed"],
          default: "Not Started",
        },
        locked: { type: Boolean, default: true },
        lastAttempt: Date,
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
  },
  { timestamps: true } // Enable automatic timestamps
);

module.exports = mongoose.model("User", userSchema);
