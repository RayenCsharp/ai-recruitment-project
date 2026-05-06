import AppLayout from "../../components/layout/AppLayout";
import { getCurrentUser } from "../../services/users";
import { useState, useEffect } from "react";
import { getApplications } from "../../services/applications";

function Profile() {
  const user = getCurrentUser();
  const [applications, setApplications] = useState([]);
  

  useEffect(() => {
    const loadApplications = async () => {
      try {
        if (user?.email) {
          const apps = await getApplications();
          const userApps = apps.filter((app) => app.userEmail === user.email);
          setApplications(userApps);
        }
      } catch {
        setApplications([]);
      }
    };

    loadApplications();
  }, [user?.email]);

  if (!user) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-400">Please login to view your profile.</p>
        </div>
      </AppLayout>
    );
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  const pendingApps = applications.filter((app) => app.status === "Pending").length;
  const acceptedApps = applications.filter((app) => app.status === "Accepted").length;
  const rejectedApps = applications.filter((app) => app.status === "Rejected").length;

  return (
    <AppLayout>
      <div className="max-w-4xl">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-gray-700 p-8 rounded-2xl mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-indigo-500/30 border-2 border-indigo-500 flex items-center justify-center">
              <span className="text-4xl font-bold text-indigo-400">{initials}</span>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-gray-400 mb-1">{user.email}</p>
              <div className="mt-4 flex gap-4">
                <span className="px-3 py-1 bg-indigo-500/30 text-indigo-300 rounded-full text-sm border border-indigo-500/50">
                  {user.role === "candidate" ? "👤 Job Seeker" : "🏢 Company"}
                </span>
                <span className="px-3 py-1 bg-green-500/30 text-green-300 rounded-full text-sm border border-green-500/50">
                  ✓ Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111827] border border-gray-700 p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-2">Total Applications</p>
            <p className="text-3xl font-bold text-indigo-400">{applications.length}</p>
          </div>
          <div className="bg-[#111827] border border-gray-700 p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-2">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-400">{pendingApps}</p>
          </div>
          <div className="bg-[#111827] border border-gray-700 p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-2">Accepted</p>
            <p className="text-3xl font-bold text-green-400">{acceptedApps}</p>
          </div>
          <div className="bg-[#111827] border border-gray-700 p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-2">Rejected</p>
            <p className="text-3xl font-bold text-red-400">{rejectedApps}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-[#111827] border border-gray-700 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-400 text-sm mb-2">Full Name</p>
              <p className="text-xl font-semibold text-white">{user.name || "Not set"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Email Address</p>
              <p className="text-xl font-semibold text-white">{user.email || "Not set"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Account Type</p>
              <p className="text-xl font-semibold text-white capitalize">{user.role || "Guest"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Account Status</p>
              <p className="text-xl font-semibold text-green-400">✓ {user ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;