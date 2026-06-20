import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#111844] text-white border-b font-serif border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/dashboard" className="flex items-center gap-2">
        <span className=" text-xl md:text-3xl font-bold ">Mailto</span>
      </Link>

      <div className="flex items-center gap-8">
        <Link
          to="/dashboard"
          className={`text-lg font-medium transition ${
            isActive("/dashboard")
              ? "text-indigo-100 border-b-2 border-indigo-600 pb-1"
              : "text-sky-300 hover:text-indigo-400"
          }`}
        >
           Dashboard
        </Link>
        <Link
          to="/compose"
          className={`text-lg font-medium transition ${
            isActive("/compose")
              ? "text-indigo-100 border-b-2 border-indigo-600 pb-1"
              : "text-sky-300 hover:text-indigo-400"
          }`}
        >
           Compose
        </Link>
        <Link
          to="/history"
          className={`text-lg font-medium transition ${
            isActive("/history")
              ? "text-indigo-100 border-b-2 border-indigo-600 pb-1"
              : "text-sky-300 hover:text-indigo-600"
          }`}
        >
           History
        </Link>

        <div className="flex items-center gap-3 ml-4 border-l pl-4">
          <div className="w-8 h-8 rounded-full bg-[#FBF5DD] text-black font-bold text-sm flex items-center justify-center">
            {firstLetter}
          </div>
          <span className="text-sm text-white font-medium">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-300 hover:text-red-700 font-medium transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
