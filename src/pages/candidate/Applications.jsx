import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/ui/Card";
import { getApplications } from "../../services/applications";
import { getCurrentUser } from "../../services/users";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Applications() {
  const [applications, setApplications] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    getApplications()
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];
        const userApps = safeData.filter(
          (app) => app.userEmail === user?.email
        );
        setApplications(userApps);
      })
      .catch(() => setApplications([]));
  }, [user]);

  const statusClass = (status) => {
    if (status === "Accepted") return "bg-green-500/20 text-green-300";
    if (status === "Interview") return "bg-yellow-500/20 text-yellow-300";
    if (status === "Rejected") return "bg-red-500/20 text-red-300";
    return "bg-gray-500/20 text-gray-300";
  };

  return (
    <AppLayout>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-gray-400 mt-1">Follow the status of each application.</p>
        </div>
        <Link
          to="/jobs"
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition text-sm font-medium"
        >
          Apply to More Jobs
        </Link>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <div className="text-center py-10 border border-dashed border-gray-700 rounded-xl">
              <p className="text-gray-300">No applications yet.</p>
              <p className="text-gray-500 text-sm mt-1">Browse jobs and submit your first application.</p>
            </div>
          </Card>
        ) : (
          applications.map((app) => (
            <Card
              key={app.id}
              className="flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{app.title}</p>
                <p className="text-sm text-gray-400">{app.company}</p>
                <p className="text-xs text-gray-500 mt-1">Applied as {app.userEmail}</p>
              </div>

              <span className={`text-sm px-3 py-1 rounded-full ${statusClass(app.status)}`}>
                {app.status}
              </span>
            </Card>
          ))
        )}
      </div>
    </AppLayout>
  );
}

export default Applications;