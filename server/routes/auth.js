const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res
      .status(201)
      .json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body; // include role
  try {
    // Find user by email AND role
    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ message: "User not found for this role" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
