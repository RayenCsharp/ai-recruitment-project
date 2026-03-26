import AppLayout from "../../components/layout/AppLayout";
import { getUser } from "../../data/user";

function Profile() {
  const user = getUser();

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold mb-8">
        Profile
      </h1>

      <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl max-w-xl">

        <p className="text-gray-400 mb-2">Role</p>
        <p className="text-lg font-semibold capitalize mb-6">
          {user?.role || "Guest"}
        </p>

        <p className="text-gray-400 mb-2">Status</p>
        <p className="text-lg font-semibold">
          {user?.isLogged ? "Logged In" : "Guest"}
        </p>

      </div>
    </AppLayout>
  );
}

export default Profile;