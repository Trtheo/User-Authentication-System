// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware

// Import controller functions
const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/authController");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/users (Protected route - requires authentication)
router.get("/users", getAllUsers);

module.exports = router;
