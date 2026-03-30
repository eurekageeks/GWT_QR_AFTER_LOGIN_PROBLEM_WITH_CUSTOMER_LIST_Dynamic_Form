// src/components/PrivateRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();

  if (!user) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the children (protected route)
  return <>{children}</>;
}
