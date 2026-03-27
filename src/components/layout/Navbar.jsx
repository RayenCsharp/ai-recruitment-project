import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { getCurrentUser, logout } from "../../services/users";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const dashboardPath =
    user?.role === "company" ? "/company/dashboard" : "/dashboard";

  return (
    <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Briefcase className="text-gray-300 hover:text-white transition" />
          <span>AI Recruit</span>
        </Link>

        {/* Middle Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <Link to="/jobs" className="hover:text-white transition">
            Jobs
          </Link>
          <Link to="/" className="hover:text-white transition">
            About
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to={dashboardPath}
                className="text-gray-300 hover:text-white transition"
              >
                Dashboard
              </Link>

              <button
                type="button"
                className="bg-red-500/20 text-red-300 hover:bg-red-500/30 px-4 py-2 rounded-lg transition"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-indigo-500 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg transition shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;