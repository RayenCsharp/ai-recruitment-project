import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/ui/Card";
import { getApplications } from "../../services/applications";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/users";
import { Link } from "react-router-dom";


function Dashboard() {
  const user = getCurrentUser();
  const [applications, setApplications] = useState([]);
  const userEmail = user?.email || "";

  const interviewsCount = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const offersCount = applications.filter(
    (application) => application.status === "Accepted"
  ).length;

  useEffect(() => {
    if (!userEmail) {
      return;
    }

    let isMounted = true;

    getApplications()
      .then((data) => {
        if (!isMounted) return;

        const safeData = Array.isArray(data) ? data : [];
        const userApps = safeData.filter((app) => app.userEmail === userEmail);
        setApplications(userApps);
      })
      .catch(() => {
        if (isMounted) {
          setApplications([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  return (
    <AppLayout>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
          <p className="text-gray-400 mt-1">Track your applications and interview progress.</p>
        </div>
        <Link
          to="/jobs"
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition text-sm font-medium"
        >
          Browse Jobs
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-gray-400">Applications</p>
          <h2 className="text-3xl font-bold mt-2 text-indigo-300">{applications.length}</h2>
        </Card>

        <Card>
          <p className="text-gray-400">Interviews</p>
          <h2 className="text-3xl font-bold mt-2 text-yellow-300">{interviewsCount}</h2>
        </Card>

        <Card>
          <p className="text-gray-400">Offers</p>
          <h2 className="text-3xl font-bold mt-2 text-green-300">{offersCount}</h2>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Applications</h2>
          <Link to="/applications" className="text-sm text-indigo-300 hover:text-indigo-200 transition">
            View all
          </Link>
        </div>

        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-700 rounded-xl">
              <p className="text-gray-300">No applications yet.</p>
              <p className="text-gray-500 text-sm mt-1">Start applying to jobs from the jobs page.</p>
            </div>
          ) : (
            applications.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="flex justify-between items-center border-b border-gray-800 pb-3"
              >
                <div>
                  <p className="font-medium">{app.title}</p>
                  <p className="text-sm text-gray-400">{app.company}</p>
                </div>

                <span className="text-indigo-300 text-sm bg-indigo-500/10 px-3 py-1 rounded-full">
                  {app.status}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </AppLayout>
  );
}

export default Dashboard;