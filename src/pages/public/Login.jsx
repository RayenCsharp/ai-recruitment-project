import Navbar from "../../components/layout/Navbar";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function Login() {
  return (
    <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-lg">

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Welcome Back
          </h2>

          {/* Inputs */}
          <div className="space-y-4">
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
          </div>

          {/* Extra */}
          <div className="flex justify-between text-sm text-gray-400 mt-3">
            <span className="hover:text-white cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <Button className="w-full mt-6" variant="primary">
            Login
          </Button>

        </div>
      </div>
    </div>
  );
}

export default Login;