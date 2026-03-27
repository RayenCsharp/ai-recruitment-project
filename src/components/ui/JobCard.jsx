import { Link } from "react-router-dom";

function JobCard({ job }) {
  const isClosed = job.status === "Closed";

  return (
    <div className={`bg-[#111827] border border-gray-800 p-6 rounded-2xl hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition ${isClosed ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold flex-1">
          {job.title}
        </h3>
        {isClosed && (
          <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full whitespace-nowrap ml-2 border border-red-500/30">
            Closed
          </span>
        )}
      </div>

      <p className="text-gray-400 mb-4 text-sm">
        {job.company}
      </p>

      {job.location && (
        <p className="text-xs text-gray-500 mb-3">
          📍 {job.location}
        </p>
      )}

      {job.skills && job.skills.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {job.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-xs bg-gray-700/50 text-gray-400 px-2 py-1 rounded-full">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-gray-700">
        <span className="text-indigo-400 text-sm font-medium">
          {job.type || "Position"}
        </span>

        {isClosed ? (
          <span className="text-sm text-gray-500 px-4 py-2 rounded-lg bg-gray-800/50">
            No Longer Accepting
          </span>
        ) : (
          <Link
            to={`/jobs/${job.id}`}
            className="text-sm bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition font-medium"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}

export default JobCard;