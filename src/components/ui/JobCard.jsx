import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl hover:border-indigo-500 transition">
      
      <h3 className="text-xl font-semibold mb-1">
        {job.title}
      </h3>

      <p className="text-gray-400 mb-3">
        {job.company}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-indigo-400 text-sm">
          {job.type}
        </span>

        <Link
          to={`/jobs/${job.id}`}
          className="text-sm bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition"
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default JobCard;