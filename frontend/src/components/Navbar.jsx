import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const linkStyle = (path) =>
    `hover:text-teal-400 transition ${
      location.pathname === path ? "text-teal-400 font-semibold" : ""
    }`;

  return (
    <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-md">

      {/* LOGO */}
      <Link to="/" className="text-xl font-bold hover:text-teal-400 transition">
        ✈️ SafeTrail
      </Link>

      {/* NAV LINKS */}
      <div className="flex items-center gap-6">

        {/* Always visible */}
        <Link to="/planner" className={linkStyle("/planner")}>
          Planner
        </Link>

        {/* Only when logged in */}
        {user && (
          <Link to="/history" className={linkStyle("/history")}>
            History
          </Link>
        )}

        {/* AUTH SECTION */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">
              👤 {user.username}
            </span>

            <button
              onClick={logout}
              className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-teal-400 transition">
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-teal-500 px-4 py-1 rounded hover:bg-teal-600 transition"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}