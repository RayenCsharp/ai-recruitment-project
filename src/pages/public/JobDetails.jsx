import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import jobs from "../../data/jobs";
import { addApplication } from "../../data/applications";
import { getUser } from "../../data/user";

function JobDetails() {
  const { id } = useParams();

  const job = jobs.find((j) => j.id === Number(id));

  const user = getUser();

  const handleApply = () => {
    if (!user.isLogged) {
      alert("Please login first");
      return;
    }

    if (user.role !== "candidate") {
      alert("Only candidates can apply");
      return;
    }

    addApplication(job);
  };

  if (!job) {
    return <div className="text-white p-10">Job not found</div>;
  }

  return (
    <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {job.title}
          </h1>

          <p className="text-gray-400 mb-4">
            {job.company} • {job.type}
          </p>

          <button className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-xl transition"
            onClick={handleApply}
          >
            Apply Now
          </button>
        </div>

        {/* Description */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-semibold mb-3">
            Job Description
          </h2>

          <p className="text-gray-400">
            This is a great opportunity to work at {job.company} as a {job.title}.
          </p>
        </div>

        {/* Skills */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-3">
            Required Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-full bg-indigo-500/20 text-indigo-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;