const express = require("express");
const Challenge = require("../models/Challenge");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const hasPermission = require("../middlewares/hasPermission");
const auth = require("../middlewares/auth");

router.get("/:id", auth, async (req, res) => {
  try {
    let challenge = await Challenge.findById(req.params.id)
      .populate("symbols")
      .populate("requirements");
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    let challenges = await Challenge.find()
      .populate("symbols")
      .populate("requirements");
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/",
  auth,
  hasPermission("admin"),
  [
    body("name").isString().notEmpty().withMessage("Name is required"),
    body("description")
      .isString()
      .notEmpty()
      .withMessage("Description is required"),
    body("level")
      .isIn(["Beginner", "Intermediate", "Advanced"])
      .withMessage("Level is invalid"),
    body("requirements.*")
      .isMongoId()
      .withMessage("Requirements must be valid MongoIDs"),
    body("symbols.*").isMongoId().withMessage("Symbols must be valid MongoIDs"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let newChallenge = new Challenge({
        ...req.body,
        createdBy: req.user._id,
      });
      await newChallenge.save();
      res.json(newChallenge);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put("/:id", auth, hasPermission("admin"), async (req, res) => {
  try {
    let updatedChallenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedChallenge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, hasPermission("admin"), async (req, res) => {
  try {
    await Challenge.findByIdAndRemove(req.params.id);
    res.json({ message: "Challenge deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = router;
