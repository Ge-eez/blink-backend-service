const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model

// The middleware function
const auth = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header("Authorization").replace("Bearer ", "");
    // Verify and decode the token
    const data = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user
    const user = await User.findOne({ _id: data.userId });
    if (!user) {
      throw new Error("User not found");
    }
    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};

module.exports = auth;
