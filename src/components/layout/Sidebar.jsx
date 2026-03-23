import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, User } from "lucide-react";

function Sidebar() {
  const linkClass =
    "flex items-center gap-3 px-3 py-2 rounded-lg hover:border-indigo-500 transition text-gray-400";

  const activeClass =
    "bg-indigo-500/10 text-white border border-indigo-500/20";

  return (
    <div className="w-64 h-screen bg-[#111827] border-r border-gray-800 p-6 hidden md:flex flex-col">

      {/* Logo */}
      <h1 className="text-xl font-bold mb-10">
        AI Recruit
      </h1>

      {/* Links */}
      <nav className="flex flex-col gap-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : "hover:bg-white/5"}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/applications"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : "hover:bg-white/5"}`
          }
        >
          <FileText size={18} />
          Applications
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : "hover:bg-white/5"}`
          }
        >
          <User size={18} />
          Profile
        </NavLink>

      </nav>

    </div>
  );
}

export default Sidebar;