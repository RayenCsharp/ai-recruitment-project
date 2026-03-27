import Navbar from "../../components/layout/NavBar";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loginUser, setCurrentUser } from "../../services/users";
import Toast from "../../components/ui/Toast";
import ToastContainer from "../../components/ui/ToastContainer";

function Login() {
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
          <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>

          <div className="space-y-4">
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
              const result = await loginUser(email.trim(), password);

              if (!result.success) {
                setToast({ message: result.message, type: "error" });
                return;
              }

              setCurrentUser(result.user);
              setToast({ message: "Logged in successfully", type: "success" });
              navigate(result.user.role === "company" ? "/company/dashboard" : "/dashboard");
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;