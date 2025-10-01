// src/pages/SignUp.jsx
import React, { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import signupImg from "../assets/signup.jpg";
import { API_BASE } from "../config";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

export default function SignUp({ setUser }) { // receive setUser from App.js
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Redirect logged-in users away from /signup
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      if (storedUser.role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, role: "student" }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to register");

      const loginRes = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) return setError(loginData.error || "Login failed");

      localStorage.setItem("token", loginData.token);
      localStorage.setItem("user", JSON.stringify(loginData.user));
      setUser(loginData.user);

      if (loginData.user.role === "admin") navigate("/admin/dashboard");
      else navigate("/");

    } catch (err) {
      setError("Server error");
      console.error("❌ Error:", err);
    }
  };

  // 🔹 Google Sign-In with account selection & detailed debug
  const handleGoogleSignIn = async () => {
    setError("");
    try {
      // Force account selection popup
      googleProvider.setCustomParameters({ prompt: "select_account" });
      console.log("🔹 Initiating Google Sign-In popup...");

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("✅ Google user info:", {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
      });

      // Pre-fill first & last name fields
      if (user.displayName) {
        const nameParts = user.displayName.split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
      }
      setEmail(user.email || "");

      // Debug: what we send to backend
      const payload = { email: user.email, name: user.displayName };
      console.log("🔹 Sending payload to backend /google-login:", payload);

      const res = await fetch(`${API_BASE}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("🔹 Raw response from backend:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response from backend");
      }

      if (!res.ok) {
        console.error("❌ Backend returned error:", data);
        return setError(data.error || "Google login failed");
      }

      // Store JWT & user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      console.log("✅ Logged in user from Google:", data.user);

      if (data.user.role === "admin") navigate("/admin/dashboard");
      else navigate("/");

    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Popup closed before sign-in completed");
      } else {
        setError(err.message || "Google sign-in failed");
      }
      console.error("❌ Google login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#7de0e6] via-[#f0f8ff] to-[#f4a6cd] flex items-center justify-center p-4 gap-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign Up</h1>
        <p className="text-gray-600 mb-8">Please register to continue to your account.</p>

        {error && (
          <div className="mb-4 text-red-600 text-sm bg-red-100 p-2 rounded">{error}</div>
        )}

        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your first name"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Keep me logged in */}
          <div className="flex items-center">
            <input
              id="keep-logged-in"
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="keep-logged-in" className="ml-2 block text-sm text-gray-700">
              Keep me logged in
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Sign Up
          </button>

          {/* Google Sign-Up button */}
          <button
            onClick={handleGoogleSignIn}
            className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Have an account? </span>
          <Link 
            to="/signin" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>

      <div className="hidden lg:block bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        <img
          src={signupImg}
          alt="Join us online - Laptop with welcome message"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
