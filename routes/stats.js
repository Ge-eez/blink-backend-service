const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const hasPermission = require("../middlewares/hasPermission");

const User = require("../models/User");
const Lesson = require("../models/Lesson");
const Challenge = require("../models/Challenge");
const Feedback = require("../models/Feedback");
const Symbol = require("../models/Symbol");

router.get("/", auth, hasPermission("admin"), async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const lessonsCount = await Lesson.countDocuments();
    const challengesCount = await Challenge.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    const symbolsCount = await Symbol.countDocuments();

    const users = await User.find();
    let startedCoursesCount = 0;

    for (let user of users) {
      startedCoursesCount += user.lesson_progress.length;
    }

    res.json({
      usersCount,
      lessonsCount,
      challengesCount,
      feedbackCount,
      symbolsCount,
      startedCoursesCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
