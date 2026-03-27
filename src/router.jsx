import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Jobs from "./pages/public/Jobs";
import JobDetails from "./pages/public/JobDetails";
import Dashboard from "./pages/candidate/Dashboard";
import Applications from "./pages/candidate/Applications";
import Profile from "./pages/candidate/Profile.jsx";
import RequireCandidate from "./components/auth/RequireCandidate";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/jobs/:id",
    element: <JobDetails />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireCandidate>
        <Dashboard />
      </RequireCandidate>
    ),
  },
  {
    path: "/applications",
    element: (
      <RequireCandidate>
        <Applications />
      </RequireCandidate>
    ),
  },
  {
    path: "/profile",
    element: (
      <RequireCandidate>
        <Profile />
      </RequireCandidate>
    ),
  },
]);

export default router;