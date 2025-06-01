// backend/routes/task.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController"); // Ensure this path is correct
const authMiddleware = require("../middleware/authMiddleware"); // Assuming you have an auth middleware

// Corrected Order for GET routes
router.get("/", taskController.getAllTasks); // Handle fetching ALL tasks first
router.get("/:id", taskController.getTasksByUser); // Then handle fetching tasks by a specific ID

// Other routes (order for these typically doesn't cause conflicts like GETs)
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
