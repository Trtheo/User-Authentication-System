// frontend/src/pages/RegisterPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Centralize your API base URL
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (!name.trim() || !email.trim() || !password.trim()) {
            toast.error("Please fill in all fields.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/api/auth/register", { name, email, password }); // Corrected path

            // Assuming your register endpoint also returns a token upon successful registration
            // If it doesn't, you might redirect to login page instead,
            // or perform an automatic login request here.
            // Based on your backend authController.js, it DOES NOT return a token on register.
            // So, the user should be redirected to the login page after registration.

            toast.success("Registration successful! Please log in.");
            setTimeout(() => navigate("/login", { replace: true }), 1500); // Redirect to login page

        } catch (err) {
            console.error("Registration error:", err);
            if (err.response) {
                if (err.response.status === 400) {
                    toast.error(err.response.data.error || "Email already exists or invalid data.");
                } else if (err.response.status === 500) {
                    toast.error("Server error during registration. Please try again later.");
                } else {
                    toast.error(`Error: ${err.response.status} - ${err.response.data.error || 'Something went wrong.'}`);
                }
            } else if (err.request) {
                toast.error("No response from server. Please check your internet connection.");
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl border border-purple-200">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-3">Create Account</h2>
                <p className="text-md text-gray-600 text-center mb-8">
                    Join us to manage your tasks efficiently.
                </p>

                <form onSubmit={handleRegister} noValidate>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-400 text-gray-800 placeholder-gray-400"
                            required
                            aria-label="Full Name"
                            autoComplete="name"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-400 text-gray-800 placeholder-gray-400"
                            required
                            aria-label="Email Address"
                            autoComplete="email"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-400 text-gray-800 placeholder-gray-400"
                            required
                            aria-label="Password"
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 text-lg font-semibold"
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
                                Registering...
                            </span>
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>

                <p className="text-center text-md text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-600 hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </div>
            {/* ToastContainer is usually in App.js */}
            {/* <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover /> */}
        </div>
    );
};

export default RegisterPage;