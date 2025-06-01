// backend/routes/task.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController"); // Ensure this path is correct
const authMiddleware = require("../middleware/authMiddleware"); // Assuming you have an auth middleware

// Example structure that could cause the error
router.post("/", authMiddleware, taskController.createTask); // Line 14 - this is likely the line causing the issue or similar
router.get("/", taskController.getTasksByUser); // This is line 9
router.get("/", taskController.getAllTasks); // This is line 9
router.put("/:id", authMiddleware, taskController.updateTask);
router.delete("/:id", authMiddleware, taskController.deleteTask);

module.exports = router;
