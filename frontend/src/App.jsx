import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "./api/axios";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HistoryPage from "./pages/HistoryPage";
import useAuth from "./hooks/useAuth";
import Footer from "./components/Footer";

/* =========================
   HOME PAGE
========================= */
function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-4">✈️ SafeTrail</h1>

      <p className="text-gray-300 mb-6">
        Plan your smart AI-powered trips
      </p>

      <button
        onClick={() => navigate("/planner")}
        className="bg-teal-500 px-6 py-3 rounded-lg hover:bg-teal-600 transition"
      >
        Start Planning
      </button>
    </div>
  );
}

/* =========================
   PLANNER PAGE
========================= */
function Planner() {
  const { user } = useAuth();

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    try {
      setLoading(true);

      const res = await api.post("/itinerary/generate", {
        destination,
        days,
        travel_style: "budget",
      });

      // 🔥 FIX: handle multiple response formats
      const data = res.data.itinerary || res.data;

      setResult(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-xl shadow-lg">

        {/* Greeting */}
        <h1 className="text-2xl font-bold mb-4 text-center">
          Welcome{user ? `, ${user.username}` : ""} 👋
        </h1>

        {/* Destination */}
        <input
          placeholder="Enter destination (e.g. Goa)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:ring-2 focus:ring-teal-400 focus:bg-white/20 transition mb-4"
        />

        {/* Days */}
        <input
          type="number"
          placeholder="Number of days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:ring-2 focus:ring-teal-400 focus:bg-white/20 transition mb-4"
        />

        {/* Button */}
        <button
          onClick={generate}
          className="w-full bg-teal-500 py-3 rounded-lg hover:bg-teal-600 transition flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            "Generate Itinerary"
          )}
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-6">

            <h2 className="text-xl font-semibold text-center mb-4">
              {result.destination} Trip
            </h2>

            {result?.days?.map((d) => (
              <div
                key={d.day}
                className="bg-slate-700 p-4 rounded-lg mb-3"
              >
                <p className="font-semibold mb-2">
                  Day {d.day}
                </p>

                <p>🌅 {d.morning?.activity || "N/A"}</p>
                <p>🌞 {d.afternoon?.activity || "N/A"}</p>
                <p>🌙 {d.evening?.activity || "N/A"}</p>
              </div>
            ))}

            {/* Budget (if exists) */}
            {result?.budget_summary && (
              <div className="bg-slate-700 p-4 rounded-lg mt-4">
                <h3 className="font-semibold mb-2">💰 Budget</h3>
                <p>Daily: {result.budget_summary.daily_avg}</p>
                <p>Total: {result.budget_summary.total_estimate}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   APP ROUTER + LAYOUT
========================= */
export default function App() {
  return (
    <BrowserRouter>

      <div className="flex flex-col min-h-screen bg-slate-900">

        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/planner"
              element={
                <ProtectedRoute>
                  <Planner />
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <Footer />

      </div>

    </BrowserRouter>
  );
}