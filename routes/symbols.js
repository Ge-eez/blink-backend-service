const express = require("express");
const router = express.Router();
const Symbol = require("../models/Symbol");

// GET all symbols
router.get("/", async (req, res) => {
  try {
    const symbols = await Symbol.find({});
    res.json(symbols);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
