import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleRouteProps {
  allowedRoles: string[];
  children: JSX.Element;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;

  return children;
}
