import Navbar from "../../components/layout/NavBar";
import AppLayout from "../../components/layout/AppLayout";
import { getCurrentUser } from "../../services/users";
import JobCard from "../../components/ui/JobCard";
import { useEffect, useState } from "react";
import { getJobs } from "../../services/jobs";
  

function Jobs() {
  const user = getCurrentUser();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getJobs();
        const filteredJobs = Array.isArray(data) 
          ? data.filter((job) => job.status !== "Closed")
          : [];
        setJobs(filteredJobs);
      } catch {
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  if (loading) {
    return <div className="text-white p-10">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-white p-10">{error}</div>;
  }

  const content = (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-3">
          Available Jobs
        </h2>
        <p className="text-gray-400">Find your next opportunity</p>
      </div>

      {jobs.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6 opacity-50">📋</div>
            <h3 className="text-2xl font-bold mb-2">No Jobs Available</h3>
            <p className="text-gray-400 mb-8">
              There are currently no open job positions. Check back soon for new opportunities!
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-block bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-lg transition font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );

  if (user && (user.role === "candidate" || user.role === "company")) {
    return <AppLayout>{content}</AppLayout>;
  }

  return (
    <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen">
      <Navbar />
      {content}
    </div>
  );
}

export default Jobs;