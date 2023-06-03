const express = require('express');
const Challenge = require('../models/Challenge');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        let challenge = await Challenge.findById(req.params.id).populate('questions.options').populate('questions.correctAnswer');
        res.json(challenge);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        let challenges = await Challenge.find().populate('questions.options').populate('questions.correctAnswer');
        res.json(challenges);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let newChallenge = new Challenge(req.body);
        await newChallenge.save();
        res.json(newChallenge);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        let updatedChallenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedChallenge);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Challenge.findByIdAndRemove(req.params.id);
        res.json({ message: "Challenge deleted" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
