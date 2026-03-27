import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/ui/Card";
import { getJobById, updateJob, closeJob } from "../../services/jobs";
import { getCurrentUser } from "../../services/users";
import Toast from "../../components/ui/Toast";
import ToastContainer from "../../components/ui/ToastContainer";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = getCurrentUser();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    experience: "",
    location: "",
  });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const jobData = await getJobById(id);
        if (!jobData) {
          setToast({ message: "Job not found", type: "error" });
          setTimeout(() => navigate("/company/jobs"), 2000);
          return;
        }

        if (jobData.companyEmail !== company?.email) {
          setToast({ message: "You don't have permission to edit this job", type: "error" });
          setTimeout(() => navigate("/company/jobs"), 2000);
          return;
        }

        setJob(jobData);
        setForm({
          title: jobData.title,
          description: jobData.description,
          skills: jobData.skills.join(", "),
          experience: jobData.experience,
          location: jobData.location,
        });
      } catch {
        setToast({ message: "Failed to load job details", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (company?.email) {
      loadJob();
    }
  }, [id, company?.email, navigate]);

  const handleSave = async () => {
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
      await updateJob(id, {
        ...job,
        title: form.title,
        description: form.description,
        skills,
        experience: form.experience,
        location: form.location,
      });

      setToast({ message: "Job updated successfully.", type: "success" });
      setTimeout(() => navigate("/company/jobs"), 1500);
    } catch {
      setToast({ message: "Failed to update job", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseJob = async () => {
    setClosing(true);
    try {
      await closeJob(id);
      setJob((prev) => ({ ...prev, status: "Closed" }));
      setToast({ message: "Job closed successfully.", type: "success" });
      setTimeout(() => navigate("/company/jobs"), 1500);
    } catch {
      setToast({ message: "Failed to close job", type: "error" });
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading job details...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const isClosed = job?.status === "Closed";

  return (
    <AppLayout>
      {toast && (
        <ToastContainer>
          <Toast message={toast.message} type={toast.type} />
        </ToastContainer>
      )}

      <div className="mb-8">
        <button
          onClick={() => navigate("/company/jobs")}
          className="text-gray-400 hover:text-white transition mb-4 flex items-center gap-1"
        >
          ← Back to My Jobs
        </button>
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Edit Job Posting
            </h1>
            <p className="text-gray-400 mt-2">Update job details or close the posting</p>
          </div>
          {isClosed && (
            <span className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30">
              Closed
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Job Details</h2>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Senior React Developer"
                  disabled={isClosed}
                  className="w-full bg-[#0b1220] border border-gray-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none transition disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Location
                </label>
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                  placeholder="e.g., Remote, New York, Tunisia"
                  disabled={isClosed}
                  className="w-full bg-[#0b1220] border border-gray-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none transition disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Experience Level
                </label>
                <input
                  value={form.experience}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, experience: e.target.value }))
                  }
                  placeholder="e.g., 3+ years, Mid-level, Junior"
                  disabled={isClosed}
                  className="w-full bg-[#0b1220] border border-gray-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none transition disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Required Skills * (comma separated)
                </label>
                <input
                  value={form.skills}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, skills: e.target.value }))
                  }
                  placeholder="e.g., React, TypeScript, Node.js"
                  disabled={isClosed}
                  className="w-full bg-[#0b1220] border border-gray-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none transition disabled:opacity-50"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Job Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={7}
                placeholder="Write a detailed job description..."
                disabled={isClosed}
                className="w-full bg-[#0b1220] border border-gray-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none transition disabled:opacity-50"
              />
            </div>

            {!isClosed && (
              <div className="flex gap-3 pt-6 border-t border-gray-700">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 px-6 py-2 rounded-lg transition font-medium text-white"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => navigate("/company/jobs")}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card className="border-red-500/30 bg-red-500/5">
            <h3 className="font-semibold text-red-300 mb-4">Job Status</h3>
            <p className="text-sm text-gray-400 mb-4">
              {isClosed
                ? "This job is closed and candidates can no longer apply."
                : "This job is open and candidates can apply."}
            </p>

            {!isClosed ? (
              <button
                onClick={handleCloseJob}
                disabled={closing}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg py-2 font-medium transition disabled:opacity-50"
              >
                {closing ? "Closing..." : "Close This Job"}
              </button>
            ) : null}
          </Card>

          <Card className="bg-gray-800/50">
            <h3 className="font-semibold mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Job ID</p>
                <p className="text-indigo-300 font-mono">{id}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className={isClosed ? "text-red-300" : "text-green-300"}>
                  {isClosed ? "Closed" : "Open"}
                </p>
              </div>
              {job?.datePosted && (
                <div>
                  <p className="text-gray-400">Posted</p>
                  <p className="text-gray-300 text-xs">
                    {new Date(job.datePosted).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export default EditJob;
