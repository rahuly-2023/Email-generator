const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY; 

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    // localStorage.setItem("token", token);
    res.status(200).json({ token: token, name: user.name, email: user.email }); // Return the token in the response body
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});




router.get('/user-exists', async (req, res) => {
  const  guestEmail = req.query.guestEmail;

  const user = await User.findOne({ email: guestEmail });
  res.json({ exists: user !== null });
});

module.exports = router;