// src/App.tsx (Vendor in Admin folder)
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Vendor components
import VendorDashboard from "./components/Dashboard"; // main vendor dashboard layout
import VendorProfile from "./components/VendorProfile";
import FoodCategoryApp from "./components/page";
import Orders from "./components/Orders";
import CustomerList from "./components/CustomerList";

// Public pages
import Login from "./components/Login"; // Admin login page
import Signup from "./components/Signup";


export default function App() {
  return (
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* VENDOR DASHBOARD */}
      <Route
        path="/dashboard/vendor/*"
        element={
          <PrivateRoute>
            <VendorDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<VendorProfile />} />
        <Route path="profile" element={<VendorProfile />} />
        <Route path="menu" element={<FoodCategoryApp />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customerlist" element={<CustomerList />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
