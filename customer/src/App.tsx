import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import DashboardHome from "./components/DashboardHome";
import RestaurantMenu from "./components/RestaurantMenu";

import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Routes>
      {/* ---------- ROOT ---------- */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ---------- PUBLIC ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ---------- PROTECTED DASHBOARD ---------- */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        {/* Default dashboard home */}
        <Route index element={<DashboardHome />} />

        {/* Admin dashboard */}
        <Route path="customer" element={<RestaurantMenu />} />
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
