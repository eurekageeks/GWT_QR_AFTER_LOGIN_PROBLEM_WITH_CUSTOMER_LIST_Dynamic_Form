import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;
  if (role && role !== userRole)
    return <Navigate to="/" state={{ error: "You are not authenticated for this role" }} />;

  return children;
};

export default ProtectedRoute;
