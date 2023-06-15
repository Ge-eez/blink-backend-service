const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const User = require("../models/User");

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          username: 1,
          lessonCount: { $size: "$lesson_progress" }
        },
      },
      {
        $sort: {
          lessonCount: -1,
        },
      },
    ]);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
