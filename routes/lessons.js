const express = require("express");
const Lesson = require("../models/Lesson"); // Import the Lesson model
const router = express.Router();
const { body, validationResult } = require("express-validator");
const hasPermission = require("../middlewares/hasPermission");
const auth = require("../middlewares/auth");
const getSymbol = require("../utils/getSymbol");

// Read a specific lesson by id
router.get("/:id", auth, async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id).populate("symbols");
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all lessons
router.get("/", auth, async (req, res) => {
  try {
    let lessons = await Lesson.find()
      .populate("symbols")
      .populate("createdBy", 'username')
      .populate({
        path: "prerequisites",
        select: "name"
      });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new lesson
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
    body("symbols.*").isMongoId().withMessage("Symbols must be valid MongoIDs"),
    body("prerequisites.*")
      .isMongoId()
      .withMessage("All Prerequisites must be valid MongoIDs"),
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
router.put("/:id", auth, hasPermission("admin"), async (req, res) => {
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
router.delete("/:id", auth, hasPermission("admin"), async (req, res) => {
  try {
    await Lesson.findByIdAndRemove(req.params.id);
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = router;
