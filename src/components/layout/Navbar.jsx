import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Briefcase className="text-blue-600" />
          <span>AI Recruit</span>
        </Link>

        {/* Middle Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-600">
          <Link to="/jobs" className="hover:text-black transition">
            Jobs
          </Link>
          <Link to="/" className="hover:text-black transition">
            About
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-black transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;