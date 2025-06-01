// frontend/src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // No useSearchParams for URL token
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../api";

const ResetPasswordPage = () => {
    // We now rely on localStorage for the token, not URL search params
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, setToken] = useState(""); // Will be loaded from localStorage
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // In a real production flow, the user would receive an email with a link like:
        // YOUR_FRONTEND_URL/reset-password?token=XYZ
        // And then the frontend would parse the token from the URL *if* it's designed that way.
        // HOWEVER, as per your request to *not* use token in URL, we assume:
        // 1. The user gets the token (e.g., from an email, or manually copied from backend console in dev).
        // 2. They paste it into an input field, OR we retrieve it from localStorage
        //    if the previous ForgotPassword flow set it there (less secure but matches previous code's intent).

        // For this revised version, we will assume the token is obtained via localStorage
        // from the previous `forgot-password` successful response.
        // This is still not the most secure way for production, but it fulfills the "no token in URL" requirement.
        // A truly secure flow would involve the backend *sending an email* with a unique link,
        // and that link would hit a backend route that *validates* the token and renders a reset form.
        // The frontend *should not* handle or store the reset token.
        const storedToken = localStorage.getItem("reset_token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            toast.error("No reset token found. Please request a new password reset.");
            navigate("/forgot-password", { replace: true });
        }
    }, [navigate]);

    const handleReset = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (!token) {
            toast.error("Reset token is missing. Please try again.");
            return;
        }

        if (password.length < 6) { // Client-side password policy
            toast.warn("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            toast.warn("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const res = await API.post("/password/reset-password", {
                token,
                newPassword: password,
            });

            toast.success("Password reset successful! Logging you in...");

            // Automatically log in the user after reset (as in your original code)
            const email = res.data.email; // Backend returns email on successful reset
            const loginRes = await API.post("/auth/login", { email, password });
            localStorage.setItem("token", loginRes.data.token);

            localStorage.removeItem("reset_token"); // Clean up the token from local storage

            setTimeout(() => navigate("/", { replace: true }), 1500);
        } catch (err) {
            console.error("Reset password error:", err);
            toast.error(err.response?.data?.error || "Failed to reset password. Token might be invalid or expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl border border-green-200">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-3">Set New Password</h2>
                <p className="text-md text-gray-600 text-center mb-8">
                    Enter your new password below.
                </p>

                <form onSubmit={handleReset}>
                    <div className="mb-5">
                        <label htmlFor="new-password" className="block text-gray-700 text-sm font-bold mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
                            required
                            aria-label="New Password"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
                            required
                            aria-label="Confirm New Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 text-lg font-semibold"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </div>
        </div>
    );
};

export default ResetPasswordPage;