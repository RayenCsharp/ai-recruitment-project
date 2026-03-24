import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  return (
    <div className="bg-[#0f172a] text-[#e5e7eb] min-h-screen flex">
      <Sidebar />

      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}

export default AppLayout;