// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const Task = require('../models/Task'); // <--- REMOVE THIS LINE! It does not belong in authController

const db = require("../db");

// REGISTER
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO public.users (name, email, password) VALUES ($1, $2, $3) RETURNING id`,
      [name, email, hashedPassword]
    );

    const newUserId = result.rows[0].id;

    res.status(201).json({
      id: newUserId,
      name,
      email,
    });
  } catch (err) {
    if (err.code === "23505" && err.detail.includes("email")) {
      return res.status(400).json({ error: "Email already exists." });
    }
    console.error("Error during registration:", err.message);
    res.status(500).json({ error: "Server error during registration." });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      `SELECT * FROM public.users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error during login." });
  }
};

// GET ALL USERS (Protected)
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, email FROM public.users");
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch users error:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
