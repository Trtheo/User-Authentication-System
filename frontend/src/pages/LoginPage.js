// frontend/src/pages/LoginPage.js
import React, { useState } from "react";
import axios from "axios"; // Using axios directly for more control and consistency
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 1. API Configuration:
// Centralize your API base URL. This is crucial for hosting,
// as the URL will change from localhost to your deployed backend URL.
// It will read from .env.production (for build) or .env.development (for local)
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Create an Axios instance for cleaner API calls
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Added loading state
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Basic client-side validation
        if (!email.trim() || !password.trim()) {
            toast.error("Please enter both email and password.");
            return;
        }

        // Regex for basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true); // Set loading true before API call
        try {
            // Use the configured api instance
            const res = await api.post("/api/auth/login", { email, password }); // Corrected path to /api/auth/login

            // Store token and user data (optional, but good for displaying user info)
            localStorage.setItem("token", res.data.token);
            // If your backend sends user info, you might store it too:
            // localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success("Login successful! Redirecting...");
            setTimeout(() => navigate("/", { replace: true }), 1500); // Use replace to prevent back navigation to login
        } catch (err) {
            console.error("Login error:", err);
            // More robust error handling for different HTTP statuses
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (err.response.status === 400 || err.response.status === 401) {
                    toast.error(err.response.data.error || "Invalid credentials.");
                } else if (err.response.status === 500) {
                    toast.error("Server error. Please try again later.");
                } else {
                    toast.error(`Error: ${err.response.status} - ${err.response.data.error || 'Something went wrong.'}`);
                }
            } else if (err.request) {
                // The request was made but no response was received
                toast.error("No response from server. Please check your internet connection or try again later.");
            } else {
                // Something else happened in setting up the request that triggered an Error
                toast.error("Login failed. Please try again.");
            }
        } finally {
            setLoading(false); // Set loading false after API call
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl border border-blue-200">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-3">Welcome Back</h2>
                <p className="text-md text-gray-600 text-center mb-8">
                    Login to access your dashboard and manage your tasks.
                </p>

                <form onSubmit={handleLogin} noValidate> {/* Added noValidate to allow custom validation messages */}
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
                            required
                            aria-label="Email Address"
                            autoComplete="email" // Improve accessibility and user experience
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
                            required
                            aria-label="Password"
                            autoComplete="current-password" // Improve accessibility and user experience
                        />
                    </div>

                    <div className="text-right mb-6">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-blue-600 hover:underline font-medium"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading} // Disable button when loading
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 text-lg font-semibold"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <p className="text-center text-md text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline font-medium">
                        Register
                    </Link>
                </p>
            </div>
            {/* ToastContainer should typically be in your App.js or root component */}
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default LoginPage;