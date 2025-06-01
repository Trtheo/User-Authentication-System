// backend/models/Task.js
const db = require("../db"); // Assuming db is the same db.js you provided

const Task = {
  createTask: async (userId, title) => {
    const result = await db.query(
      `INSERT INTO public.tasks (user_id, title) VALUES ($1, $2) RETURNING id`,
      [userId, title]
    );
    return result.rows[0].id;
  },

  getTasksByUser: async (userId) => {
    const result = await db.query(
      `SELECT id, title FROM public.tasks WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  },

  updateTask: async (taskId, title, userId) => {
    const result = await db.query(
      `UPDATE public.tasks SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING id`,
      [title, taskId, userId]
    );
    return result;
  },

  // NEW FUNCTION: Get all tasks (without filtering by user)
  getAllTasks: async () => {
    const result = await db.query(
      `SELECT id, title, user_id FROM public.tasks` // Select all relevant columns
    );
    return result.rows;
  },

  deleteTask: async (taskId, userId) => {
    const result = await db.query(
      `DELETE FROM public.tasks WHERE id = $1 AND user_id = $2 RETURNING id`,
      [taskId, userId]
    );
    return result;
  },
};

module.exports = Task;
