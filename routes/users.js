const express = require("express");
const User = require("../models/User"); // Import the User model
const router = express.Router();
const Challenge = require("../models/Challenge");
const { body, validationResult } = require("express-validator");
const hasPermission = require("../middlewares/hasPermission");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");

router.get("/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id)
      .populate("lesson_progress.lesson")
      .populate("challenge_progress.challenge");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    let users = await User.find()
      .populate("lesson_progress.lesson")
      .populate("challenge_progress.challenge");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/", auth, hasPermission("admin"),
  [
    body("firstName").not().isEmpty().withMessage("First Name is required"),
    body("lastName").not().isEmpty().withMessage("Last Name is required"),
    body("username").not().isEmpty().withMessage("Username is required"),
    body("phone").not().isEmpty().withMessage("Phone number is required"),
    // username must be an email
    body("email").isEmail().withMessage("Email is not valid"),
    // password must be at least 5 chars long
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let newUser = new User(req.body);
      newUser.password = await bcrypt.hash(newUser.password, 10);
      await newUser.save();
      res.json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.delete("/:id", auth, hasPermission("admin"), async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(
  "/unlock_challenge",
  auth,
  [body("challengeId").not().isEmpty().withMessage("Challenge ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user._id);
      const challengeToUnlock = await Challenge.findById(req.body.challengeId);

      if (!challengeToUnlock) {
        return res.status(400).json({ error: "Challenge not found" });
      }

      // Get the challenge progress for all of the challenges that are prerequisites for this one
      const prerequisiteProgresses = user.challenge_progress.filter(
        (progress) =>
          challengeToUnlock.requirements.includes(progress.challenge)
      );

      // If any of the prerequisite challenges have not been completed, then the challenge cannot be unlocked
      if (
        prerequisiteProgresses.some(
          (progress) => progress.status !== "Completed"
        )
      ) {
        return res
          .status(400)
          .json({ error: "All prerequisite challenges must be completed" });
      }

      const userChallengeProgressToUnlock = user.challenge_progress.find(
        (progress) =>
          String(progress.challenge) === String(challengeToUnlock._id)
      );

      if (!userChallengeProgressToUnlock) {
        user.challenge_progress.push({
          challenge: challengeToUnlock._id,
          status: "Not Started",
          locked: false,
        });
      } else {
        userChallengeProgressToUnlock.locked = false;
      }

      await user.save();

      res.json({ message: "Challenge unlocked successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put(
  "/start_challenge",
  auth,
  [body("challengeId").not().isEmpty().withMessage("Challenge ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user._id);
      const challengeToStart = await Challenge.findById(req.body.challengeId);

      if (!challengeToStart) {
        return res.status(400).json({ error: "Challenge not found" });
      }

      const userChallengeProgressToStart = user.challenge_progress.find(
        (progress) =>
          String(progress.challenge) === String(challengeToStart._id)
      );

      if (!userChallengeProgressToStart || userChallengeProgressToStart.locked) {
        return res.status(400).json({ error: "This challenge has not been unlocked yet." });
      } else {
        userChallengeProgressToStart.status = "In Progress";
      }

      await user.save();

      res.json({ message: "Challenge started successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put(
  "/complete_challenge",
  auth,
  [body("challengeId").not().isEmpty().withMessage("Challenge ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user._id);
      const challengeToComplete = await Challenge.findById(req.body.challengeId);

      if (!challengeToComplete) {
        return res.status(400).json({ error: "Challenge not found" });
      }

      const userChallengeProgressToComplete = user.challenge_progress.find(
        (progress) =>
          String(progress.challenge) === String(challengeToComplete._id)
      );

      if (!userChallengeProgressToComplete || userChallengeProgressToComplete.status !== "In Progress") {
        return res.status(400).json({ error: "This challenge is not in progress." });
      } else {
        userChallengeProgressToComplete.status = "Completed";
      }

      await user.save();

      res.json({ message: "Challenge completed successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put(
  "/start_lesson",
  auth,
  [body("lessonId").not().isEmpty().withMessage("Lesson ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user._id);
      const lessonToStart = await Lesson.findById(req.body.lessonId).populate(
        "prerequisites"
      );

      if (!lessonToStart) {
        return res.status(400).json({ error: "Lesson not found" });
      }

      // Check if all prerequisites are completed
      for (let prerequisite of lessonToStart.prerequisites) {
        const userLessonProgress = user.lesson_progress.find(
          (progress) => String(progress.lesson) === String(prerequisite._id)
        );

        if (!userLessonProgress || !userLessonProgress.completionStatus) {
          return res.status(400).json({
            error: `Prerequisite lesson ${prerequisite.name} is not completed`,
          });
        }
      }

      const userLessonProgressToStart = user.lesson_progress.find(
        (progress) => String(progress.lesson) === String(lessonToStart._id)
      );

      if (!userLessonProgressToStart) {
        user.lesson_progress.push({
          lesson: lessonToStart._id,
          completionStatus: false,
          lastVisited: Date.now(),
        });
      } else {
        userLessonProgressToStart.lastVisited = Date.now();
      }

      await user.save();

      return res.json({ message: "Lesson started successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put(
  "/finish_lesson",
  auth,
  [body("lessonId").not().isEmpty().withMessage("Lesson ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user._id);
      const lessonToFinish = await Lesson.findById(req.body.lessonId);

      if (!lessonToFinish) {
        return res.status(400).json({ error: "Lesson not found" });
      }

      const userLessonProgressToFinish = user.lesson_progress.find(
        (progress) => String(progress.lesson) === String(lessonToFinish._id)
      );

      if (!userLessonProgressToFinish) {
        return res.status(400).json({ error: "This lesson has not been started yet." });
      } else {
        userLessonProgressToFinish.completionStatus = true;
        userLessonProgressToFinish.lastVisited = Date.now();
      }

      await user.save();

      return res.json({ message: "Lesson finished successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put("/me", auth, async (req, res) => {
  try {
    let updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, hasPermission("admin"), async (req, res) => {
  try {
    let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = router;
