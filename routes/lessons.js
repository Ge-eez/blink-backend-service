const express = require("express");
const Lesson = require("../models/Lesson"); // Import the Lesson model
const router = express.Router();
const { body, validationResult } = require('express-validator');


// Read a specific lesson by id
router.get("/:id", async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id).populate("symbols");
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all lessons
router.get("/", async (req, res) => {
  try {
    let lessons = await Lesson.find().populate("symbols");
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new lesson
router.post(
  "/",
  [
    body("name").isString().notEmpty().withMessage("Name is required"),
    body("description")
      .isString()
      .notEmpty()
      .withMessage("Description is required"),
    body("level").isNumeric().withMessage("Level must be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let newLesson = new Lesson({
        ...req.body,
        createdBy: req.user._id,
      });
      await newLesson.save();
      res.json(newLesson);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Update a lesson
router.put("/:id", async (req, res) => {
  try {
    let updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedLesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a lesson
router.delete("/:id", async (req, res) => {
  try {
    await Lesson.findByIdAndRemove(req.params.id);
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
