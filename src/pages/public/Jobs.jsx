import Navbar from "../../components/layout/Navbar";
import AppLayout from "../../components/layout/AppLayout";
import { getUser } from "../../data/user";
import JobCard from "../../components/ui/JobCard";
import jobs from "../../data/jobs";

function Jobs() {
  const user = getUser();

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

  if (user?.isLogged && user.role === "candidate") {
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