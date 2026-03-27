import AppLayout from "../../components/layout/AppLayout";
import { getCurrentUser } from "../../services/users";

function Profile() {
  const user = getCurrentUser();

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl max-w-2xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 mb-1 text-sm">Name</p>
            <p className="text-lg font-semibold">{user?.name || "Not set"}</p>
          </div>

          <div>
            <p className="text-gray-400 mb-1 text-sm">Email</p>
            <p className="text-lg font-semibold">{user?.email || "Not set"}</p>
          </div>

          <div>
            <p className="text-gray-400 mb-1 text-sm">Role</p>
            <p className="text-lg font-semibold capitalize">{user?.role || "Guest"}</p>
          </div>

          <div>
            <p className="text-gray-400 mb-1 text-sm">Status</p>
            <p className="text-lg font-semibold">{user ? "Logged in" : "Guest"}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;