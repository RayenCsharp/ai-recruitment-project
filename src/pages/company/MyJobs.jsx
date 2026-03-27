import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/ui/Card";
import { getJobsByCompany, closeJob, reopenJob } from "../../services/jobs";
import { getApplicationsForCompanyJobs } from "../../services/applications";
import { getCurrentUser } from "../../services/users";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/ui/Toast";
import ToastContainer from "../../components/ui/ToastContainer";

function MyJobs() {
  const company = getCurrentUser();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(Boolean(company?.email));
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState({ message: "", type: "" });

  const companyEmail = company?.email || "";

  useEffect(() => {
    if (!companyEmail) {
      return;
    }

    const loadData = async () => {
      setLoading(true);
      const jobData = await getJobsByCompany(companyEmail);
      setJobs(jobData);

      const apps = await getApplicationsForCompanyJobs(jobData.map((job) => job.id));
      setApplications(apps);
      setLoading(false);
    };

    loadData().catch(() => {
      setJobs([]);
      setApplications([]);
      setLoading(false);
    });
  }, [companyEmail]);

  const applicantsByJobId = useMemo(() => {
    return applications.reduce((acc, app) => {
      const key = String(app.jobId);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(app);
      return acc;
    }, {});
  }, [applications]);

  const filteredJobs = useMemo(() => {
    if (filter === "open") {
      return jobs.filter((job) => job.status !== "Closed");
    }
    if (filter === "closed") {
      return jobs.filter((job) => job.status === "Closed");
    }
    return jobs;
  }, [jobs, filter]);

  const handleCloseJob = async (jobId) => {
    try {
      await closeJob(jobId);
      setJobs((prev) =>
        prev.map((job) =>
          String(job.id) === String(jobId)
            ? { ...job, status: "Closed" }
            : job
        )
      );
      setToast({ message: "Job closed successfully", type: "success" });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    } catch {
      setToast({ message: "Failed to close job", type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    }
  };

  const handleReopenJob = async (jobId) => {
    try {
      await reopenJob(jobId);

      setJobs((prev) =>
        prev.map((job) =>
          String(job.id) === String(jobId)
            ? { ...job, status: "Open" }
            : job
        )
      );
      setToast({ message: "Job reopened successfully", type: "success" });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    } catch {
      setToast({ message: "Failed to reopen job", type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    }
  };

  return (
    <AppLayout>
      {toast.message && (
        <ToastContainer>
          <Toast message={toast.message} type={toast.type} />
        </ToastContainer>
      )}

      <div className="mb-10">
        <div className="flex justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              My Job Postings
            </h1>
            <p className="text-gray-400 mt-2">Manage, edit, and monitor your job openings</p>
          </div>
          <button
            onClick={() => navigate("/company/dashboard")}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card className="mb-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-lg transition font-medium ${
              filter === "all"
                ? "bg-indigo-500 text-white"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
            }`}
          >
            All ({jobs.length})
          </button>
          <button
            onClick={() => setFilter("open")}
            className={`px-5 py-2 rounded-lg transition font-medium ${
              filter === "open"
                ? "bg-green-500 text-white"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
            }`}
          >
            Open ({jobs.filter((j) => j.status !== "Closed").length})
          </button>
          <button
            onClick={() => setFilter("closed")}
            className={`px-5 py-2 rounded-lg transition font-medium ${
              filter === "closed"
                ? "bg-red-500 text-white"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
            }`}
          >
            Closed ({jobs.filter((j) => j.status === "Closed").length})
          </button>
        </div>
      </Card>

      {/* Content */}
      {!companyEmail ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Company profile not found</p>
            <p className="text-gray-500 text-sm mt-2">Please sign in again</p>
          </div>
        </Card>
      ) : loading ? (
        <Card>
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
            <p className="text-gray-400 mt-4">Loading your jobs...</p>
          </div>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-700">
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl font-medium mb-2">
              {filter === "all"
                ? "No jobs posted yet"
                : `No ${filter} jobs`}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              {filter === "all"
                ? "Start growing your team by posting your first job!"
                : `Try adjusting your filters`}
            </p>
            {filter === "all" && (
              <button
                onClick={() => navigate("/company/dashboard")}
                className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg transition font-medium inline-block"
              >
                Post First Job
              </button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const applicants = applicantsByJobId[String(job.id)] || [];
            const isClosed = job.status === "Closed";

            return (
              <Card key={job.id} className={`transform transition ${isClosed ? "opacity-75 bg-gray-800/30" : ""}`}>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold">{job.title}</h3>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                          isClosed
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-green-500/20 text-green-300 border border-green-500/30"
                        }`}
                      >
                        {isClosed ? "Closed" : "Open"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">{job.location || "Location not specified"}</div>
                      <div className="flex items-center gap-1">{job.experience || "Any"}</div>
                    </div>

                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(job.skills || []).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Stats & Actions */}
                  <div className="lg:min-w-64 flex flex-col">
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-indigo-400 mb-1">{applicants.length}</p>
                        <p className="text-sm text-gray-400 mb-3">Applicants</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-yellow-500/10 rounded p-2">
                            <p className="text-yellow-300 font-semibold">
                              {applicants.filter((a) => a.status === "Pending").length}
                            </p>
                            <p className="text-gray-500">Pending</p>
                          </div>
                          <div className="bg-purple-500/10 rounded p-2">
                            <p className="text-purple-300 font-semibold">
                              {applicants.filter((a) => a.status === "Interview").length}
                            </p>
                            <p className="text-gray-500">Interviews</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {!isClosed ? (
                        <>
                          <button
                            onClick={() => navigate(`/company/jobs/${job.id}/edit`)}
                            className="w-full px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-sm font-medium transition border border-blue-500/30"
                          >
                            Edit Job
                          </button>
                          <button
                            onClick={() => handleCloseJob(job.id)}
                            className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm font-medium transition border border-red-500/30"
                          >
                            Close Job
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleReopenJob(job.id)}
                          className="w-full px-4 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 text-sm font-medium transition border border-green-500/30"
                        >
                          Reopen Job
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/company/applicants?job=${job.id}`)}
                        className="w-full px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-sm font-medium transition border border-indigo-500/30"
                      >
                        View Applicants
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}

export default MyJobs;
