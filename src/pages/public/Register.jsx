import Navbar from "../../components/layout/Navbar";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/users";
import { setCurrentUser } from "../../services/users";

function Register() {
  const [role, setRole] = useState("candidate");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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
            <Input type="text" placeholder="Name" value={name}
              onChange={(e) => setName(e.target.value)}/>

            <Input type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}/>

            <Input type="password" placeholder="Password" />
          </div>
          
          {/* Button */}
          <Button className="w-full mt-6" variant="primary" 
            onClick={async () => {
              const result = await registerUser({
                name,
                email,
                role,
              });

              if (!result.success) {
                alert(result.message); // we’ll replace later with toast
                return;
              }

              setCurrentUser({ name, email, role });

              if (role === "candidate") {
                navigate("/dashboard");
              } else {
                navigate("/jobs");
              }
            }}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Register;