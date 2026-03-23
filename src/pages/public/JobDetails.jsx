import Navbar from "../../components/layout/Navbar";

function JobDetails() {
  return (
    <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Job Header */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Backend Developer
          </h1>

          <p className="text-gray-400 mb-4">
            TechSoft • Remote • Full-time
          </p>

          <button className="bg-indigo-500 hover:bg-indigo-600 hover:scale-105 px-6 py-3 rounded-xl transition">
            Apply Now
          </button>
        </div>

        {/* Description */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-semibold mb-3">
            Job Description
          </h2>

          <p className="text-gray-400 leading-relaxed">
            We are looking for a Backend Developer with experience in Node.js,
            REST APIs, and database systems. You will work with a team to build
            scalable applications and improve system performance.
          </p>
        </div>

        {/* Requirements */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-3">
            Requirements
          </h2>

          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Experience with Node.js</li>
            <li>Knowledge of REST APIs</li>
            <li>Database experience (SQL or NoSQL)</li>
            <li>Good problem-solving skills</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default JobDetails;