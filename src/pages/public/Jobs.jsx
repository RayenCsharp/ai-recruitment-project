import Navbar from "../../components/layout/Navbar";

function Jobs() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-6">Available Jobs</h2>

        <div className="grid gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">Backend Developer</h3>
            <p className="text-gray-500">TechSoft</p>
            <button className="mt-2 text-blue-600">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;