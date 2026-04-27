import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔥 Password validation function
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(password)) {
      return "Password must be 8+ chars, include letter, number & special character ❌";
    }
    return "";
  };

  const handleSignup = async () => {
    setError("");
    setMessage("");
    setPasswordError("");

    // 🔥 Password validation
    const pwdError = validatePassword(form.password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    // 🔥 Confirm password check
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match ❌");
      // 🔥 Auto clear after 3 sec
  setTimeout(() => {
    setError("");
  }, 3000);
      return;
    }

    try {
      await api.post("/auth/signup", form);

      setMessage("Signup successful ✅ Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-4">

      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-sm shadow-lg">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account 🚀
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
          placeholder="Choose a username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          className="w-full p-3 rounded-lg bg-white text-black mb-4 outline-none focus:ring-2 focus:ring-teal-500"
        />

        {/* PASSWORD */}
        <label className="block text-sm mb-1 text-gray-300">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-white text-black pr-12 outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* 👁 HOLD TO VIEW */}
          <button
  type="button"
  onMouseDown={() => setShowPassword(true)}
  onMouseUp={() => setShowPassword(false)}
  onMouseLeave={() => setShowPassword(false)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
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

        {/* 🔥 PASSWORD ERROR INLINE */}
        {passwordError && (
          <p className="text-red-400 text-xs mt-1 mb-3">
            {passwordError}
          </p>
        )}

        {/* CONFIRM PASSWORD */}
        <label className="block text-sm mb-1 text-gray-300">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Re-enter your password"
          value={form.confirm_password}
          onChange={(e) =>
            setForm({ ...form, confirm_password: e.target.value })
          }
          className="w-full p-3 rounded-lg bg-white text-black mb-6 outline-none focus:ring-2 focus:ring-teal-500"
        />

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          className="w-full bg-teal-500 py-3 rounded-lg hover:bg-teal-600 transition font-semibold"
        >
          Signup
        </button>

        {/* LOGIN PROMPT */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}