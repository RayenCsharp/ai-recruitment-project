import Navbar from "../../components/layout/Navbar";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="text-center px-6 py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Hire Smarter with AI
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
          Analyze CVs, rank candidates, and streamline your hiring process
          using artificial intelligence.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/jobs"
            className="bg-indigo-500 hover:bg-indigo-800 px-6 py-3 rounded-xl text-white transition"
          >
            Browse Jobs
          </Link>

          <Link
            to="/register"
            className="border border-gray-700 px-6 py-3 rounded-xl hover:bg-white/5 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">AI CV Analysis</h3>
          <p className="text-gray-400">
            Automatically evaluate resumes and score candidates.
          </p>
        </div>

        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
          <p className="text-gray-400">
            Match candidates to jobs using intelligent algorithms.
          </p>
        </div>

        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">Faster Hiring</h3>
          <p className="text-gray-400">
            Reduce hiring time with automation and insights.
          </p>
        </div>

      </section>
    </div>
  );
}

export default Home;