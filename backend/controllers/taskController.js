// backend/models/Task.js
const db = require("../db");

const Task = {
  createTask: async (userId, title) => {
    try {
      const result = await db.query(
        `INSERT INTO public.tasks (user_id, title) VALUES ($1, $2) RETURNING id`,
        [userId, title]
      );
      console.log(
        `INFO: Task created successfully for user_id: ${userId}, task_id: ${result.rows[0].id}`
      );
      return {
        status: "success",
        message: "Task created successfully",
        data: { id: result.rows[0].id },
      };
    } catch (error) {
      console.error(
        `ERROR: Failed to create task for user_id: ${userId}, title: ${title}. Details:`,
        error
      );
      throw {
        status: "error",
        message: "Failed to create task due to a database error.",
        error: error.message,
      };
    }
  },

  getTasksByUser: async (userId) => {
    try {
      const result = await db.query(
        `SELECT id, title FROM public.tasks WHERE user_id = $1`,
        [userId]
      );
      console.log(
        `INFO: Fetched ${result.rows.length} tasks for user_id: ${userId}`
      );
      return {
        status: "success",
        message: "Tasks retrieved successfully",
        data: result.rows,
      };
    } catch (error) {
      console.error(
        `ERROR: Failed to retrieve tasks for user_id: ${userId}. Details:`,
        error
      );
      throw {
        status: "error",
        message: "Failed to retrieve tasks due to a database error.",
        error: error.message,
      };
    }
  },

  updateTask: async (taskId, title, userId) => {
    try {
      const result = await db.query(
        `UPDATE public.tasks SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING id`,
        [title, taskId, userId]
      );
      const success = result.rows.length > 0;
      success
        ? console.log(
            `INFO: Task updated successfully: task_id: ${taskId}, user_id: ${userId}`
          )
        : console.warn(
            `WARN: Attempted to update non-existent or unauthorized task: task_id: ${taskId}, user_id: ${userId}`
          );

      return success
        ? {
            status: "success",
            message: "Task updated successfully",
            data: { id: result.rows[0].id },
          }
        : { status: "fail", message: "Task not found or unauthorized" };
    } catch (error) {
      console.error(
        `ERROR: Failed to update task task_id: ${taskId}, user_id: ${userId}. Details:`,
        error
      );
      throw {
        status: "error",
        message: "Failed to update task due to a database error.",
        error: error.message,
      };
    }
  },

  // This is the crucial part that was likely missing or malformed
  getAllTasks: async () => {
    try {
      const result = await db.query(
        `SELECT id, title, user_id FROM public.tasks`
      );
      console.log(`INFO: Fetched all tasks. Total: ${result.rows.length}`);
      return {
        status: "success",
        message: "All tasks retrieved successfully",
        data: result.rows,
      };
    } catch (error) {
      console.error(`ERROR: Failed to retrieve all tasks. Details:`, error);
      throw {
        status: "error",
        message: "Failed to retrieve all tasks due to a database error.",
        error: error.message,
      };
    }
  },

  deleteTask: async (taskId, userId) => {
    try {
      const result = await db.query(
        `DELETE FROM public.tasks WHERE id = $1 AND user_id = $2 RETURNING id`,
        [taskId, userId]
      );
      const success = result.rows.length > 0;
      success
        ? console.log(
            `INFO: Task deleted successfully: task_id: ${taskId}, user_id: ${userId}`
          )
        : console.warn(
            `WARN: Attempted to delete non-existent or unauthorized task: task_id: ${taskId}, user_id: ${userId}`
          );

      return success
        ? {
            status: "success",
            message: "Task deleted successfully",
            data: { id: result.rows[0].id },
          }
        : { status: "fail", message: "Task not found or unauthorized" };
    } catch (error) {
      console.error(
        `ERROR: Failed to delete task task_id: ${taskId}, user_id: ${userId}. Details:`,
        error
      );
      throw {
        status: "error",
        message: "Failed to delete task due to a database error.",
        error: error.message,
      };
    }
  },
};

module.exports = Task;
