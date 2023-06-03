const express = require('express');
const User = require('../models/User'); // Import the User model
const router = express.Router();

router.post('/register', async (req, res) => {
    // Register a new user
    try {
        let user = new User(req.body);
        user.password = await bcrypt.hash(user.password, 10); // Hash the password
        await user.save(); // Save the user in the database
        res.status(201).json({ message: "User registered successfully" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    // Authenticate a user
    try {
        let user = await User.findOne({ email: req.body.email });
        if(!user || !(await bcrypt.compare(req.body.password, user.password))) {
            // If the user is not found or the password is wrong, send an error
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Generate a token and send it in the response
        let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token: token });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;

