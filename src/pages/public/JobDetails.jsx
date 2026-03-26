import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import jobs from "../../data/jobs";
import { addApplication } from "../../data/applications";
import { getUser } from "../../data/user";
import AppLayout from "../../components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Toast from "../../components/ui/Toast";
import ToastContainer from "../../components/ui/ToastContainer";
import { useEffect } from "react";



function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);

  const job = jobs.find((j) => j.id === Number(id));

  const user = getUser();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleApply = () => {
    if (!user?.isLogged) {
      setToast({ message: "Please login first", type: "error" });
      return;
    }

    if (user.role !== "candidate") {
      setToast({ message: "Only candidates can apply", type: "error" });
      return;
    }

    const result = addApplication(job);

    setToast({
      message: result.message,
      type: result.success ? "success" : "error",
    });
  };

  if (!job) {
    return <div className="text-white p-10">Job not found</div>;
  }

  const content = (
      <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen">
        {toast && (
          <ToastContainer>
            <Toast message={toast.message} type={toast.type} />
          </ToastContainer>
        )}

        <div className="max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sm text-gray-400 hover:text-white transition"
          >
            ← Back
          </button>

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

export default JobDetails;