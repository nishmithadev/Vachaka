import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg font-medium transition ${
      location.pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-extrabold text-indigo-400 tracking-wide">
        🤟 Vachaka
      </Link>
      <div className="flex gap-3">
        <Link to="/sign-to-speech" className={linkClass("/sign-to-speech")}>
          Sign → Speech
        </Link>
        <Link to="/speech-to-sign" className={linkClass("/speech-to-sign")}>
          Speech → Sign
        </Link>
      </div>
    </nav>
  );
}