import Navbar from "../../components/layout/Navbar";
import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, setCurrentUser } from "../../services/users";
import Toast from "../../components/ui/Toast";
import ToastContainer from "../../components/ui/ToastContainer";

function Register() {
  const [role, setRole] = useState("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen">
      <Navbar />

      {toast && (
        <ToastContainer>
          <Toast message={toast.message} type={toast.type} />
        </ToastContainer>
      )}

      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-lg">

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Create Account
          </h2>

          {/* Role Selector */}
          <div className="flex gap-4 mb-6">
            
            <button
              type="button"
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
              type="button"
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

          <p className="text-sm text-gray-400 mb-6 text-center">
            Selected role: <span className="capitalize text-white">{role}</span>
          </p>

          <div className="space-y-4">
            <Input
              type="text"
              placeholder={role === "company" ? "Company Name" : "Full Name"}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <Button
            className="w-full mt-6"
            variant="primary"
            onClick={async () => {
              const result = await registerUser({
                name: name.trim(),
                email: email.trim(),
                password,
                role,
              });

              if (!result.success) {
                setToast({ message: result.message, type: "error" });
                return;
              }

              setCurrentUser(result.user || { name: name.trim(), email: email.trim(), role });
              setToast({ message: "Account created successfully", type: "success" });
              navigate(role === "company" ? "/company/dashboard" : "/dashboard");
            }}
          >
            Register
          </Button>

          <div className="text-center text-sm text-gray-400 mt-3">
            Already have an account? <Link to="/login" className="text-indigo-400">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;