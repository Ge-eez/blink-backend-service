const express = require("express");
const router = express.Router();
const Symbol = require("../models/Symbol");
const hasPermission = require("../middlewares/hasPermission");
const auth = require("../middlewares/auth");

// GET all symbols
router.get("/", auth, async (req, res) => {
  try {
    const symbols = await Symbol.find({});
    res.json(symbols);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new symbol (Create)
router.post("/", auth, hasPermission("admin"), async (req, res) => {
  try {
    const symbol = new Symbol(req.body);
    await symbol.save();
    res.json(symbol);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT an existing symbol (Update)
router.put("/:id", auth, hasPermission("admin"), async (req, res) => {
  try {
    const symbol = await Symbol.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!symbol) throw Error("No symbol found");
    res.json(symbol);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an existing symbol
router.delete("/:id", auth, hasPermission("admin"), async (req, res) => {
  try {
    const symbol = await Symbol.findByIdAndDelete(req.params.id);
    if (!symbol) throw Error("No symbol found");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = router;
