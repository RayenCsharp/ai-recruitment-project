import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/ui/Card";

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
          <Card className="flex justify-between items-center">

            <div>
              <p className="font-semibold">Frontend Developer</p>
              <p className="text-sm text-gray-400">TechSoft</p>
            </div>

            <span className="text-sm px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
              Pending
            </span>

          </Card>

          <Card className="flex justify-between items-center">

            <div>
              <p className="font-semibold">Backend Developer</p>
              <p className="text-sm text-gray-400">DevCorp</p>
            </div>

            <span className="text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-400">
              Accepted
            </span>

          </Card>

          <Card className="flex justify-between items-center">

            <div>
              <p className="font-semibold">UI Designer</p>
              <p className="text-sm text-gray-400">DesignPro</p>
            </div>

            <span className="text-sm px-3 py-1 rounded-full bg-red-500/20 text-red-400">
              Rejected
            </span>

          </Card>

        </div>

      </div>
    </div>
  );
}

export default Applications;