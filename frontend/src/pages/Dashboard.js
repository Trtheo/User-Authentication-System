// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import API from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import TaskItem from "../components/TaskItem";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/tasks");
      setTasks(res.data);
      console.log("Fetched tasks from backend:", res.data.data); // For frontend console debugging
    } catch (err) {
      // The API interceptor now handles 401 token expiration,
      // so this specific toast might be redundant or for other types of errors.
      if (err.response && err.response.status !== 401) {
        toast.error(err.response?.data?.error || "Failed to fetch tasks.");
      }
      // If the interceptor handles logout, no need to navigate here.
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) {
      toast.warn("Task title cannot be empty.");
      return;
    }
    try {
      await API.post("/api/tasks", { title: newTask });
      toast.success("Task added successfully!");
      setNewTask("");
      fetchTasks(); // Refresh tasks after adding
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add task.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/api/tasks/${id}`);
        toast.success("Task deleted successfully!");
        fetchTasks(); // Refresh tasks after deleting
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to delete task.");
      }
    }
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setEditText(task.title);
  };

  const handleUpdate = async () => {
    if (!editText.trim()) {
      toast.warn("Task title cannot be empty.");
      return;
    }
    try {
      await API.put(`/api/tasks/${editId}`, { title: editText });
      toast.success("Task updated successfully!");
      setEditId(null); // Exit edit mode
      setEditText("");
      fetchTasks(); // Refresh tasks after updating
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update task.");
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully.");
    // Use navigate with replace to prevent going back to dashboard
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    fetchTasks();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-blue-200">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
            My Tasks
          </h2>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto text-base bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 text-gray-800 placeholder-gray-400 text-lg"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
          />
          <button
            onClick={handleAddTask}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 text-lg font-semibold"
          >
            Add Task
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-blue-600 text-xl font-medium">
            <p>Loading tasks...</p>
            <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-600 text-lg">
            <p>No tasks yet. Start by adding one above!</p>
            <p className="mt-2 text-sm text-gray-400">
              Your productivity journey begins here.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onCancelEdit={handleCancelEdit}
                isEditing={editId === task.id}
                currentEditText={editText}
                onTextChange={(e) => setEditText(e.target.value)}
              />
            ))}
          </ul>
        )}

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default Dashboard;
