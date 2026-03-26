import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/ui/Card";
import { getApplications } from "../../data/applications";

function Dashboard() {
  const applications = getApplications();

  return (
    <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen flex">

      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold mb-8">
          Dashboard
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <Card>
            <p className="text-gray-400">Applications</p>
            <h2 className="text-2xl font-bold mt-2">{applications.length}</h2>
          </Card>

          <Card>
            <p className="text-gray-400">Interviews</p>
            <h2 className="text-2xl font-bold mt-2">2</h2>
          </Card>

          <Card>
            <p className="text-gray-400">Offers</p>
            <h2 className="text-2xl font-bold mt-2">1</h2>
          </Card>

        </div>

        {/* Recent Applications */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">
            Recent Applications
          </h2>

          <div className="space-y-4">
            {applications.length === 0 ? (
              <p className="text-gray-400">
                No applications yet.
              </p>
            ) : (
              applications.slice(0, 3).map((app, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-gray-800 pb-3"
                >
                  <div>
                    <p className="font-medium">{app.title}</p>
                    <p className="text-sm text-gray-400">{app.company}</p>
                  </div>

                  <span className="text-indigo-400 text-sm">
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
        
      </div>

    </div>
  );
}

export default Dashboard;