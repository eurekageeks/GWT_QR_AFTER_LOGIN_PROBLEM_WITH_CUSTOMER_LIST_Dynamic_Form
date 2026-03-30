import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Store,
  LogOut,
  UserCircle,
} from "lucide-react";

export default function DashboardAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
     ${
       isActive
         ? "bg-green-100 text-green-700 font-semibold shadow-sm"
         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
     }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* LOGO / TITLE */}
        <div className="h-16 flex items-center justify-center border-b">
          <LayoutDashboard className="w-6 h-6 text-green-600" />
          <span className="ml-2 text-lg font-bold">QR Admin</span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/dashboard/admin" end className={linkClass}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>

          <NavLink to="/dashboard/admin/vendorlist" className={linkClass}>
            <Store className="w-5 h-5" />
            Service Providers List
          </NavLink>

          <NavLink to="/dashboard/admin/customerlist" className={linkClass}>
            <Users className="w-5 h-5" />
            Customers List
          </NavLink>
           <NavLink to="/dashboard/admin/employeelist" className={linkClass}>
            <Users className="w-5 h-5" />
            Employee List
          </NavLink>
          <NavLink to="/dashboard/admin/addcategory" className={linkClass}>
            <Users className="w-5 h-5" />
            Add Category
          </NavLink>
          <NavLink to="/dashboard/admin/addsubcategory" className={linkClass}>
            <Users className="w-5 h-5" />
            Add Sub Category
          </NavLink>
          <NavLink to="/dashboard/admin/addbusiness" className={linkClass}>
            <Users className="w-5 h-5" />
            Add Business
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2
                       bg-red-500 hover:bg-red-600
                       text-white py-2 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-16 bg-white shadow-sm px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-gray-500" />
            <div className="text-sm">
              <p className="font-medium">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
