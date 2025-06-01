// frontend/src/pages/ForgotPasswordPage.js
import React, { useState } from "react";
import { Link } from "react-router-dom"; // No useNavigate here for now
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../api";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [messageSent, setMessageSent] = useState(false); // New state to show message

    const handleReset = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!email.trim()) {
            toast.warn("Please enter your email.");
            return;
        }

        try {
            setLoading(true);
            await API.post("/password/forgot-password", { email });

            // IMPORTANT: In production, you would NOT get the token back here.
            // The backend would send it via email.
            // For local testing, we're mimicking a "sent email" scenario.
            // The backend's console.log will show the token to use.
            // The user would then manually go to the reset-password page.

            toast.success("If an account with that email exists, a password reset link has been sent to your email address.");
            setMessageSent(true); // Show a persistent message
            setEmail(""); // Clear the input

        } catch (error) {
            console.error("Forgot password error:", error);
            // Be generic for security: avoid indicating if email exists
            toast.error("Failed to send reset link. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl border border-purple-200">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-3">Forgot Password</h2>
                <p className="text-md text-gray-600 text-center mb-8">
                    Enter your registered email address below. We'll send you a link to reset your password.
                </p>

                <form onSubmit={handleReset}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-400 text-gray-800 placeholder-gray-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="Email address"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 text-lg font-semibold"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {messageSent && (
                    <p className="text-center text-sm text-green-700 mt-6 p-3 bg-green-50 rounded-md border border-green-200">
                        Please check your email for the password reset link.
                    </p>
                )}

                <p className="text-center text-sm text-gray-600 mt-6">
                    Remember your password?{' '}
                    <Link to="/login" className="text-purple-600 hover:underline font-medium">
                        Back to Login
                    </Link>
                </p>

                <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;