import Navbar from "../../components/layout/Navbar";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useState } from "react";

function Register() {
  const [role, setRole] = useState("candidate");

  return (
    <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-lg">

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Create Account
          </h2>

          {/* Role Selector */}
          <div className="flex gap-4 mb-6">
            
            <button
              onClick={() => setRole("candidate")}
              className={`flex-1 p-4 rounded-xl border transition ${
                role === "candidate"
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              👤 Candidate
            </button>

            <button
              onClick={() => setRole("company")}
              className={`flex-1 p-4 rounded-xl border transition ${
                role === "company"
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              🏢 Company
            </button>

          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <Input type="text" placeholder="Name" />

            <Input type="email" placeholder="Email" />

            <Input type="password" placeholder="Password" />
          </div>
          
          {/* Button */}
          <Button className="w-full mt-6" variant="primary">
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Register;