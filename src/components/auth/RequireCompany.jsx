import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/users";

function RequireCompany({ children }) {
  const user = getCurrentUser();

  if (!user || user.role !== "company") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireCompany;
