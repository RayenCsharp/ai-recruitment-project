import Navbar from "../../components/layout/Navbar";
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
        setJobs(Array.isArray(data) ? data : []);
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
      <h2 className="text-3xl font-bold mb-8">
        Available Jobs
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );

  if (user && user.role === "candidate") {
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