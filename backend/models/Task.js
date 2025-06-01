const db = require('../db');

// CREATE TASK
const createTask = async (userId, title) => {
    const query = `INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING id`;
    const result = await db.query(query, [title, userId]);
    return result.rows[0].id;
};

// GET TASKS FOR USER
const getTasksByUser = async (userId) => {
    const query = `SELECT id, title, user_id FROM tasks WHERE user_id = $1`;
    const result = await db.query(query, [userId]);
    return result.rows;
};

// UPDATE TASK
const updateTask = async (taskId, title, userId) => {
    const query = `UPDATE tasks SET title = $1 WHERE id = $2 AND user_id = $3`;
    const result = await db.query(query, [title, taskId, userId]);
    return result;
};

// DELETE TASK
const deleteTask = async (taskId, userId) => {
    const query = `DELETE FROM tasks WHERE id = $1 AND user_id = $2`;
    const result = await db.query(query, [taskId, userId]);
    return result;
};

module.exports = {
    createTask,
    getTasksByUser,
    updateTask,
    deleteTask,
};
