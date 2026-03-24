import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/ui/Card";
import { getApplications } from "../../data/applications";

const applications = getApplications();

function Applications() {
  return (
    <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen flex">

      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold mb-8">
          My Applications
        </h1>

        <div className="space-y-4">

          {/* Application Item */}
          {applications.length === 0 ? (
              <p className="text-gray-400">No applications yet.</p>
            ) : (
              applications.map((app, index) => (
                <Card
                  key={index}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{app.title}</p>
                    <p className="text-sm text-gray-400">{app.company}</p>
                  </div>

                  <span className="text-sm px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                    {app.status}
                  </span>
                </Card>
              ))
            )}

        </div>

      </div>
    </div>
  );
}

export default Applications;