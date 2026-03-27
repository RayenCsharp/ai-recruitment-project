import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/ui/Card";
import { addJob, getJobsByCompany } from "../../services/jobs";
import { getApplicationsForCompanyJobs } from "../../services/applications";
import { getCurrentUser } from "../../services/users";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/ui/Toast";
import ToastContainer from "../../components/ui/ToastContainer";

function Dashboard() {
  const company = getCurrentUser();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    experience: "",
    location: "",
  });

  const companyEmail = company?.email || "";

  useEffect(() => {
    if (!companyEmail) {
      return;
    }

    const loadData = async () => {
      const jobData = await getJobsByCompany(companyEmail);
      setJobs(jobData);

      const apps = await getApplicationsForCompanyJobs(jobData.map((job) => job.id));
      setApplications(apps);
    };

    loadData().catch(() => {
      setJobs([]);
      setApplications([]);
    });
  }, [companyEmail]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const interviewCount = useMemo(
    () => applications.filter((app) => app.status === "Interview").length,
    [applications]
  );

  const openJobsCount = useMemo(
    () => jobs.filter((job) => job.status !== "Closed").length,
    [jobs]
  );

  const handlePostJob = async () => {
    const skills = form.skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!form.title || !form.description || skills.length === 0) {
      setToast({ message: "Please fill in all required fields", type: "error" });
      return;
    }

    setSaving(true);

    try {
      const newJob = await addJob({
        title: form.title,
        description: form.description,
        skills,
        experience: form.experience,
        location: form.location,
        status: "Open",
        company: company?.name || "Company",
        companyEmail,
        datePosted: new Date().toISOString(),
      });

      setJobs((prev) => [...prev, newJob]);
      setForm({
        title: "",
        description: "",
        skills: "",
        experience: "",
        location: "",
      });
      setShowPostForm(false);
      setToast({ message: "Job posted successfully!", type: "success" });
    } catch {
      setToast({ message: "Failed to post job", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      {toast && (
        <ToastContainer>
          <Toast message={toast.message} type={toast.type} />
        </ToastContainer>
      )}

      <div className="mb-10">
        <div className="flex justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Recruitment Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Manage jobs, applications, and hiring</p>
          </div>
          <button
            onClick={() => navigate("/company/jobs")}
            className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg transition font-medium whitespace-nowrap"
          >
            View All Jobs
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-400 text-sm font-medium">Open Jobs</p>
              <h2 className="text-3xl font-bold mt-2 text-indigo-400">{openJobsCount}</h2>
              <p className="text-xs text-gray-500 mt-1">Active postings</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-400 text-sm font-medium">Total Applicants</p>
              <h2 className="text-3xl font-bold mt-2 text-blue-400">{applications.length}</h2>
              <p className="text-xs text-gray-500 mt-1">All statuses</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-400 text-sm font-medium">Interviews</p>
              <h2 className="text-3xl font-bold mt-2 text-purple-400">{interviewCount}</h2>
              <p className="text-xs text-gray-500 mt-1">Scheduled</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Post Job Section */}
      {!showPostForm ? (
        <Card className="mb-10 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/30">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Post a New Job</h2>
              <p className="text-gray-400">Expand your team by creating new job openings</p>
            </div>
            <button
              onClick={() => setShowPostForm(true)}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 px-6 py-3 rounded-lg transition font-medium whitespace-nowrap"
            >
              + Create Job
            </button>
          </div>
        </Card>
      ) : (
        <Card className="mb-10 border-indigo-500/50">
          <h2 className="text-2xl font-semibold mb-6">Post a New Job</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="e.g., Senior React Developer"
                className="w-full bg-[#0b1220] border border-gray-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills * (comma separated)</label>
              <input
                value={form.skills}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, skills: event.target.value }))
                }
                placeholder="e.g., React, TypeScript, Node.js"
                className="w-full bg-[#0b1220] border border-gray-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
              <input
                value={form.experience}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, experience: event.target.value }))
                }
                placeholder="e.g., 3+ years, Mid-level"
                className="w-full bg-[#0b1220] border border-gray-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                value={form.location}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, location: event.target.value }))
                }
                placeholder="e.g., Remote, New York, Tunisia"
                className="w-full bg-[#0b1220] border border-gray-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Description *</label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={5}
              placeholder="Write a detailed job description..."
              className="w-full bg-[#0b1220] border border-gray-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handlePostJob}
              disabled={saving}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 px-6 py-2 rounded-lg transition font-medium"
            >
              {saving ? "Posting..." : "Post Job"}
            </button>
            <button
              type="button"
              onClick={() => setShowPostForm(false)}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition font-medium"
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

    </AppLayout>
  );
}

export default Dashboard;
