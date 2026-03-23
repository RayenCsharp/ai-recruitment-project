import { Link } from "react-router-dom";

function JobCard() {
  return (
    <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl hover:border-indigo-500 hover:scale-[1.02] transition">
      
      <h3 className="text-xl font-semibold mb-1">
        Backend Developer
      </h3>

      <p className="text-gray-400 mb-3">
        TechSoft • Remote
      </p>

      <p className="text-gray-500 text-sm mb-4">
        Looking for a Node.js developer with experience in APIs and databases.
      </p>

      <div className="flex justify-between items-center">
        <span className="text-indigo-400 text-sm">
          Full-time
        </span>

        <Link
          to="/jobs/1"
          className="text-sm bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition"
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default JobCard;