import Navbar from "../../components/layout/Navbar";

function Login() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="flex justify-center mt-20">
        <div className="bg-white p-8 rounded-xl shadow w-96">
          <h2 className="text-2xl font-bold mb-6">Login</h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;