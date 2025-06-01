// backend/models/Task.js
const db = require('../db');

// ---
// CREATE TASK
// ---
const createTask = async (userId, title) => {
    try {
        const query = `INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING id`;
        const result = await db.query(query, [title, userId]);
        console.log(`INFO: Task created successfully for user_id: ${userId}, task_id: ${result.rows[0].id}`);
        return { status: 'success', message: 'Task created successfully', data: { id: result.rows[0].id } };
    } catch (error) {
        console.error(`ERROR: Failed to create task for user_id: ${userId}, title: ${title}. Details:`, error);
        throw { status: 'error', message: 'Failed to create task due to a database error.', error: error.message };
    }
};

// ---
// GET TASKS FOR USER
// ---
const getTasksByUser = async (userId) => {
    try {
        const query = `SELECT id, title, user_id FROM tasks WHERE user_id = $1`;
        const result = await db.query(query, [userId]);
        console.log(`INFO: Fetched ${result.rows.length} tasks for user_id: ${userId}`);
        return { status: 'success', message: 'Tasks retrieved successfully', data: result.rows };
    } catch (error) {
        console.error(`ERROR: Failed to retrieve tasks for user_id: ${userId}. Details:`, error);
        throw { status: 'error', message: 'Failed to retrieve tasks due to a database error.', error: error.message };
    }
};

// ---
// UPDATE TASK
// ---
const updateTask = async (taskId, title, userId) => {
    try {
        const query = `UPDATE tasks SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING id`; // Added RETURNING id
        const result = await db.query(query, [title, taskId, userId]);
        const success = result.rows.length > 0;

        success
            ? console.log(`INFO: Task updated successfully: task_id: ${taskId}, user_id: ${userId}`)
            : console.warn(`WARN: Attempted to update non-existent or unauthorized task: task_id: ${taskId}, user_id: ${userId}`);

        return success
            ? { status: 'success', message: 'Task updated successfully', data: { id: result.rows[0].id } }
            : { status: 'fail', message: 'Task not found or unauthorized' };
    } catch (error) {
        console.error(`ERROR: Failed to update task task_id: ${taskId}, user_id: ${userId}. Details:`, error);
        throw { status: 'error', message: 'Failed to update task due to a database error.', error: error.message };
    }
};

// ---
// GET ALL TASKS (Re-added based on previous conversation)
// ---
const getAllTasks = async () => {
    try {
        const query = `SELECT id, title, user_id FROM public.tasks`;
        const result = await db.query(query);
        console.log(`INFO: Fetched all tasks. Total: ${result.rows.length}`);
        return { status: 'success', message: 'All tasks retrieved successfully', data: result.rows };
    } catch (error) {
        console.error(`ERROR: Failed to retrieve all tasks. Details:`, error);
        throw { status: 'error', message: 'Failed to retrieve all tasks due to a database error.', error: error.message };
    }
};

// ---
// DELETE TASK
// ---
const deleteTask = async (taskId, userId) => {
    try {
        const query = `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id`; // Added RETURNING id
        const result = await db.query(query, [taskId, userId]);
        const success = result.rows.length > 0;

        success
            ? console.log(`INFO: Task deleted successfully: task_id: ${taskId}, user_id: ${userId}`)
            : console.warn(`WARN: Attempted to delete non-existent or unauthorized task: task_id: ${taskId}, user_id: ${userId}`);

        return success
            ? { status: 'success', message: 'Task deleted successfully', data: { id: result.rows[0].id } }
            : { status: 'fail', message: 'Task not found or unauthorized' };
    } catch (error) {
        console.error(`ERROR: Failed to delete task task_id: ${taskId}, user_id: ${userId}. Details:`, error);
        throw { status: 'error', message: 'Failed to delete task due to a database error.', error: error.message };
    }
};

module.exports = {
    createTask,
    getTasksByUser,
    updateTask,
    deleteTask,
    getAllTasks // Make sure to export this function too!
};