const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const db = require("../db");

const resetTokens = {}; // NOTE: For production, use Redis or DB for token storage

// 🔐 POST /api/password/forgot-password
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const result = await db.query("SELECT id, email FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = result.rows[0];
        const token = crypto.randomBytes(32).toString("hex");
        resetTokens[token] = {
            userId: user.id,
            email: user.email,
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        };

        console.log(`[DEV ONLY] Password reset link: http://localhost:3000/reset-password?token=${token}`);

        return res.json({
            message: "If the email exists, a password reset link has been sent.",
            token // For dev/testing only — don't return in production
        });

    } catch (err) {
        console.error("Forgot password error:", err.message);
        return res.status(500).json({ error: "Server error while processing request." });
    }
});

// 🔄 POST /api/password/reset-password
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required." });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const data = resetTokens[token];
    if (!data || data.expires < Date.now()) {
        return res.status(400).json({ error: "Token expired or invalid" });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await db.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [hashedPassword, data.userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found for password reset." });
        }

        delete resetTokens[token]; // Clear the used token

        return res.json({
            message: "Password updated successfully",
            email: data.email
        });

    } catch (err) {
        console.error("Reset password error:", err.message);
        return res.status(500).json({ error: "Server error during password reset." });
    }
});

module.exports = router;
