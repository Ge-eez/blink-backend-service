const express = require("express");
const User = require("../models/User"); // Import the User model
const router = express.Router();
const Challenge = require("../models/Challenge");
const { body, validationResult } = require('express-validator');


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

router.get("/", async (req, res) => {
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
  "/",
  [
    body("email").isEmail().withMessage("Email is not valid"),
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
      await newUser.save();
      res.json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put("/:id", async (req, res) => {
  try {
    let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(
  "/:id/unlock_challenge",
  [body("challengeId").not().isEmpty().withMessage("Challenge ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.params.id);
      const challengeToUnlock = await Challenge.findById(req.body.challengeId);

      if (!challengeToUnlock) {
        return res.status(400).json({ error: "Challenge not found" });
      }
      if (
        challengeToUnlock.sequence.level == "Beginner" &&
        challengeToUnlock.sequence.order == 1
      ) {
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

        return res.json({ message: "Challenge unlocked successfully" });
      }

      const previousChallenge = await Challenge.findOne({
        "sequence.level": challengeToUnlock.sequence.level,
        "sequence.order": challengeToUnlock.sequence.order - 1,
      });

      if (!previousChallenge) {
        return res.status(400).json({ error: "Previous challenge not found" });
      }

      const previousUserChallengeProgress = user.challenge_progress.find(
        (progress) =>
          String(progress.challenge) === String(previousChallenge._id)
      );

      if (
        !previousUserChallengeProgress ||
        previousUserChallengeProgress.status !== "Completed"
      ) {
        return res
          .status(400)
          .json({ error: "Previous challenge is not completed" });
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

module.exports = router;
