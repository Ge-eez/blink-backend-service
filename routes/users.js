const express = require('express');
const User = require('../models/User'); // Import the User model
const router = express.Router();


router.get('/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id).populate('lesson_progress.lesson').populate('challenge_progress.challenge');
        res.json(user);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        let users = await User.find().populate('lesson_progress.lesson').populate('challenge_progress.challenge');
        res.json(users);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let newUser = new User(req.body);
        await newUser.save();
        res.json(newUser);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        res.json({ message: "User deleted" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

