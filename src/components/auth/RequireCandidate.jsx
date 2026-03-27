import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/users";

function RequireCandidate({ children }) {
  const user = getCurrentUser();

  if (!user || user.role !== "candidate") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireCandidate;