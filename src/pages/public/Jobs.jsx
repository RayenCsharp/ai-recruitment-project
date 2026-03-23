import Navbar from "../../components/layout/Navbar";
import JobCard from "../../components/ui/JobCard";

function Jobs() {
  return (
    <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Title */}
        <h2 className="text-3xl font-bold mb-8">
          Available Jobs
        </h2>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <JobCard />
          <JobCard />
          <JobCard />
          <JobCard />
          <JobCard />
        </div>

      </div>
    </div>
  );
}

export default Jobs;