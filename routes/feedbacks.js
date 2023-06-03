const express = require("express");
const Feedback = require("../models/Feedback");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const hasPermission = require("../middlewares/hasPermission");
const auth = require("../middlewares/auth");

// Create feedback
router.post(
  "/",
  auth,
  [
    body("message")
      .isString()
      .notEmpty()
      .withMessage("Feedback message is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let feedback = new Feedback({
        message: req.body.message,
        user: req.user._id,
      });
      await feedback.save();
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Read all feedbacks
router.get("/", auth, hasPermission("admin"), async (req, res) => {
  try {
    let feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read a specific feedback by id
router.get("/:id", auth, async (req, res) => {
  try {
    let feedback = await Feedback.findById(req.params.id);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a feedback
router.put("/:id", auth, async (req, res) => {
  try {
    let updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedFeedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a feedback
router.delete("/:id", auth, hasPermission("admin"), async (req, res) => {
  try {
    await Feedback.findByIdAndRemove(req.params.id);
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});
module.exports = router;
