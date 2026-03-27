import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { getJobsByCompany } from "../../services/jobs";
import {
  getApplicationsForCompanyJobs,
  updateApplicationStatus,
} from "../../services/applications";
import { getCurrentUser } from "../../services/users";
import { useSearchParams } from "react-router-dom";
import Toast from "../../components/ui/Toast";
import ToastContainer from "../../components/ui/ToastContainer";

function Applicants() {
  const company = getCurrentUser();
  const [searchParams] = useSearchParams();
  const queryJobId = searchParams.get("job");

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(() => queryJobId || "all");
  const [loading, setLoading] = useState(Boolean(company?.email));
  const [savingId, setSavingId] = useState("");
  const [toast, setToast] = useState(null);

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

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredApplications = useMemo(() => {
    const data =
      selectedJobId === "all"
        ? applications
        : applications.filter((app) => String(app.jobId) === String(selectedJobId));

    return [...data].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
  }, [applications, selectedJobId]);

  const updateStatus = async (applicationId, status) => {
    setSavingId(String(applicationId));
    try {
      const updated = await updateApplicationStatus(applicationId, status);

      setApplications((prev) =>
        prev.map((app) => (String(app.id) === String(applicationId) ? updated : app))
      );
      setToast({ message: `Application moved to ${status}.`, type: "success" });
    } catch {
      setToast({ message: "Failed to update application status.", type: "error" });
    } finally {
      setSavingId("");
    }
  };

  const downloadCV = (cvText, candidateName) => {
    const element = document.createElement("a");
    const file = new Blob([cvText || "No CV content available"], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${candidateName || "candidate"}-cv.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const jobById = useMemo(() => {
    return jobs.reduce((acc, job) => {
      acc[String(job.id)] = job;
      return acc;
    }, {});
  }, [jobs]);

  return (
    <AppLayout>
      {toast && (
        <ToastContainer>
          <Toast message={toast.message} type={toast.type} />
        </ToastContainer>
      )}

      <h1 className="text-3xl font-bold mb-8">Applicants & AI Ranking</h1>

      <div className="mb-6">
        <label htmlFor="jobFilter" className="block text-sm text-gray-300 mb-2">
          Filter by job
        </label>
        <select
          id="jobFilter"
          value={selectedJobId}
          onChange={(event) => setSelectedJobId(event.target.value)}
          className="bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 w-full md:w-64"
        >
          <option value="all">All Jobs ({applications.length})</option>
          {jobs.map((job) => {
            const jobApplicants = applications.filter(
              (app) => String(app.jobId) === String(job.id)
            ).length;
            return (
              <option key={job.id} value={job.id}>
                {job.title} ({jobApplicants})
              </option>
            );
          })}
        </select>
      </div>

      {!companyEmail ? (
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <p className="text-gray-400">Company profile not found. Please sign in again.</p>
        </div>
      ) : loading ? (
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <p className="text-gray-400">Loading applicants...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-[#111827] border border-gray-800 p-12 rounded-2xl text-center">
          <p className="text-gray-400 text-lg">No applicants yet for the selected scope.</p>
          <p className="text-gray-500 text-sm mt-2">When candidates apply, they'll appear here ranked by AI match score.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app, index) => (
            <div
              key={app.id}
              className="bg-[#111827] border border-gray-800 p-5 rounded-2xl hover:border-indigo-500/50 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-lg">#{index + 1} {app.candidateName || app.userEmail}</p>
                  <p className="text-sm text-gray-400">
                    {jobById[String(app.jobId)]?.title || app.title} • {app.cvFile || "No CV"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-indigo-400 font-semibold text-lg">{app.aiScore || 0}%</p>
                  <p className="text-xs text-gray-400">AI Match</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {(app.matchedSkills || []).length > 0 && (
                  <>
                    {(app.matchedSkills || []).map((skill) => (
                      <span
                        key={`${app.id}-${skill}`}
                        className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </>
                )}
                {(app.missingSkills || []).length > 0 && (
                  <>
                    {(app.missingSkills || []).map((skill) => (
                      <span
                        key={`${app.id}-${skill}-missing`}
                        className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full"
                      >
                        ✗ {skill}
                      </span>
                    ))}
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="px-3 py-1 text-sm rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition"
                  disabled={savingId === String(app.id)}
                  onClick={() => updateStatus(app.id, "Accepted")}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition"
                  disabled={savingId === String(app.id)}
                  onClick={() => updateStatus(app.id, "Interview")}
                >
                  Interview
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                  disabled={savingId === String(app.id)}
                  onClick={() => updateStatus(app.id, "Rejected")}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition"
                  onClick={() => downloadCV(app.cvText, app.candidateName || app.userEmail)}
                >
                  Download CV
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

export default Applicants;
