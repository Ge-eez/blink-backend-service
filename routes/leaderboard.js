const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const hasPermission = require("../middlewares/hasPermission");

const User = require("../models/User");

router.get("/", auth, hasPermission("admin"), async (req, res) => {
  try {
    let users = await User.find({}, "username lesson_progress") // only select the username and lesson_progress fields
      .sort((a, b) => b.lesson_progress.length - a.lesson_progress.length);

    // add the lessonCount field to each user
    users = users.map((user) => {
      return {
        ...user._doc, // _doc property contains the actual user document
        lessonCount: user.lesson_progress.length,
      };
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
