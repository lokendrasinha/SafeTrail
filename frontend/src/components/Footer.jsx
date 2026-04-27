import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/10 text-gray-300 mt-12">

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* 🔥 TOP SECTION */}
        <div className="flex flex-col md:flex-row md:justify-between gap-10">

          {/* LEFT */}
          <div className="text-center md:text-left max-w-sm mx-auto md:mx-0">
            <h2 className="text-xl font-bold text-white mb-2">
              ✈️ SafeTrail
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered travel planning for smarter, stress-free trips.
            </p>

            <Link
              to="/planner"
              className="inline-block mt-4 px-5 py-2 rounded-md 
                         bg-teal-500 hover:bg-teal-600 
                         text-white text-sm transition 
                         hover:scale-105 active:scale-95"
            >
              Plan a Trip ✨
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-10 text-center md:text-left">

            {/* LINKS */}
            <div className="flex flex-col gap-2 text-sm">
              <h3 className="text-white font-medium mb-1">Explore</h3>

              <Link to="/" className="hover:text-teal-400 transition">
                Home
              </Link>

              <Link to="/planner" className="hover:text-teal-400 transition">
                Planner
              </Link>

              <Link to="/history" className="hover:text-teal-400 transition">
                History
              </Link>
            </div>

            {/* CONNECT */}
            <div className="flex flex-col gap-2 text-sm">
              <h3 className="text-white font-medium mb-1">Connect</h3>

              <a
                href="https://github.com/lokendrasinha"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/lokendra-sinha-792909277/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition"
              >
                LinkedIn
              </a>

              <a
                href="mailto:lokendrasinha2003@gmail.com"
                onClick={() => {
                  window.open(
                    "https://mail.google.com/mail/?view=cm&fs=1&to=lokendrasinha2003@gmail.com",
                    "_blank"
                  );
                }}
                className="hover:text-teal-400 transition"
              >
                Email
              </a>
            </div>

          </div>
        </div>

        {/* 🔥 BOTTOM */}
        <div className="mt-8 pt-4 border-t border-white/10 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">

          <p>© {new Date().getFullYear()} SafeTrail</p>
          <p>Built with ❤️ by Lokendra</p>

        </div>
      </div>
    </footer>
  );
}