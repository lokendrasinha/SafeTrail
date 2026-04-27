import { useState, useRef } from "react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const errorTimeoutRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      // ✅ Show success message
      setMessage("Login successful ✅ Redirecting...");

      login(res.data.token, res.data.username);

      setTimeout(() => {
        navigate("/planner");
      }, 1200);

    } catch {
      setError("Invalid username or password ❌");

      // 🔥 Auto clear error after 3 sec
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      errorTimeoutRef.current = setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-4">

      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-sm shadow-lg">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mb-4 bg-green-600 px-4 py-2 rounded text-sm text-center">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 bg-red-600 px-4 py-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        {/* USERNAME */}
        <label className="block text-sm mb-1 text-gray-300">
          Username
        </label>
        <input
          placeholder="Enter your username"
          onChange={(e) => {
            setUsername(e.target.value);
            setError(""); // 🔥 clears error while typing
          }}
          className="w-full p-3 rounded-lg bg-white text-black placeholder-gray-500 mb-4 outline-none focus:ring-2 focus:ring-teal-500"
        />

        {/* PASSWORD */}
        <label className="block text-sm mb-1 text-gray-300">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full p-3 rounded-lg bg-white text-black pr-12 mb-6 outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* 👁 PROFESSIONAL ICON */}
          <button
            type="button"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
            className={`absolute right-3 top-1/3 -translate-y-1/2 transition ${
              showPassword ? "text-teal-500" : "text-gray-500 hover:text-black"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5
                   c4.477 0 8.268 2.943 9.542 7
                   -1.274 4.057-5.065 7-9.542 7
                   -4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-teal-500 py-3 rounded-lg hover:bg-teal-600 transition font-semibold"
        >
          Login
        </button>

        {/* SIGNUP PROMPT */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-teal-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}