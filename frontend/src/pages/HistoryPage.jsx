import { useEffect, useState } from "react";
import api from "../api/axios";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // FETCH HISTORY
  // =========================
  const fetchHistory = async () => {
    try {
      const res = await api.get("/itinerary/history");
      setHistory(res.data);
    } catch {
      setError("Failed to load history ❌");
      setTimeout(() => setError(""), 3000);
    }
  };

  // =========================
  // DELETE TRIP
  // =========================
  const deleteTrip = async (id) => {
    const prev = history;

    // 🔥 Instant UI update
    setHistory((prev) => prev.filter((item) => item.id !== id));

    // 🔥 Always clear selected (BEST FIX)
    setSelected(null);

    try {
      await api.delete(`/itinerary/${id}`);

      setMessage("Trip deleted successfully ✅");
      setError("");

      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Delete failed ❌");
      setMessage("");

      // rollback
      setHistory(prev);

      setTimeout(() => setError(""), 3000);
    }
  };

  // =========================
  // VIEW TRIP
  // =========================
  const viewTrip = async (id) => {
    try {
      const res = await api.get(`/itinerary/${id}`);

      // store id + data (IMPORTANT)
      setSelected({
        id: id,
        data: res.data.data,
      });
    } catch {
      setError("Failed to load trip ❌");
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">Your Trips</h1>

      {/* ✅ SUCCESS MESSAGE */}
      {message && (
        <div className="mb-4 bg-green-600 text-white px-4 py-2 rounded shadow">
          {message}
        </div>
      )}

      {/* ❌ ERROR MESSAGE */}
      {error && (
        <div className="mb-4 bg-red-600 text-white px-4 py-2 rounded shadow">
          {error}
        </div>
      )}

      {/* =========================
          HISTORY LIST
      ========================= */}
      {/* =========================
    HISTORY LIST / EMPTY STATE
========================= */}
{history.length === 0 ? (
  <div className="flex flex-col items-center justify-center mt-20 text-center">
    
    <h2 className="text-2xl font-semibold mb-2">
      No trips found 😔
    </h2>

    <p className="text-gray-400 mb-6">
      You haven’t planned any trips yet. Start exploring now!
    </p>

    <a
      href="/planner"
      className="bg-teal-500 px-6 py-3 rounded-lg hover:bg-teal-600 transition font-semibold"
    >
      Plan a Trip ✈️
    </a>
  </div>
) : (
  <div className="grid gap-4">
    {history.map((item) => (
      <div
        key={item.id}
        className="bg-slate-800 p-4 rounded-lg flex justify-between items-center"
      >
        <div>
          <h2 className="font-semibold">{item.destination}</h2>
          <p className="text-sm text-gray-400">
            {item.days} days
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => viewTrip(item.id)}
            className="bg-teal-500 px-3 py-1 rounded hover:bg-teal-600 transition"
          >
            View
          </button>

          <button
            onClick={() => deleteTrip(item.id)}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
)}

      

      {/* =========================
          SELECTED TRIP DETAILS
      ========================= */}
      {selected && selected.data && (
        <div className="mt-10 bg-slate-800 p-6 rounded-lg">

          {/* Close button */}
          <button
            onClick={() => setSelected(null)}
            className="mb-4 bg-gray-600 px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            Close
          </button>

          <h2 className="text-2xl mb-4">
            {selected.data.destination}
          </h2>

          {selected.data.days.map((d) => (
            <div key={d.day} className="mb-4">
              <h3 className="font-semibold">Day {d.day}</h3>
              <p>🌅 {d.morning.activity}</p>
              <p>🌞 {d.afternoon.activity}</p>
              <p>🌙 {d.evening.activity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}