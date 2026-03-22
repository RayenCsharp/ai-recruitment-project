import Navbar from "../../components/layout/Navbar";

function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center justify-center text-center mt-20">
        <h1 className="text-5xl font-bold text-gray-800">
          AI Recruitment Platform
        </h1>

        <p className="mt-4 text-gray-500 text-lg">
          Find the best candidates with AI-powered screening
        </p>

        <div className="mt-6 flex gap-4">
          <a
            href="/jobs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
          >
            Browse Jobs
          </a>

          <a
            href="/register"
            className="border px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;