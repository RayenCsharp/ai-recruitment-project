import Navbar from "../../components/layout/Navbar";
import CustomSelect from "../../components/ui/costumSelect";

function Register() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="flex justify-center mt-20">
        <div className="bg-white p-8 rounded-xl shadow w-96 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-6">Register</h2>

          <input
            type="text"
            placeholder="Name"
            className="w-full bg-surface border border-border text-text p-3 rounded-xl
             focus:outline-none placeholder-subtext transition"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-surface border border-border text-text p-3 rounded-xl
             focus:outline-none placeholder-subtext transition"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-surface border border-border text-text p-3 rounded-xl
             focus:outline-none placeholder-subtext transition"
          />
          
          <CustomSelect options={["Candidate", "Company"]} />

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;