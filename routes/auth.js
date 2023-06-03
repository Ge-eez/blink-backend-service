const express = require("express");
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

router.post(
  "/register",
  [
    body("firstName").not().isEmpty().withMessage("First Name is required"),
    body("lastName").not().isEmpty().withMessage("Last Name is required"),
    body("username").not().isEmpty().withMessage("Username is required"),
    body("phone").not().isEmpty().withMessage("Phone number is required"),
    // username must be an email
    body("email").isEmail().withMessage("Email is not valid"),
    // password must be at least 5 chars long
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
      let user = new User(req.body);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.json({ token: token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;


module.exports = router;
