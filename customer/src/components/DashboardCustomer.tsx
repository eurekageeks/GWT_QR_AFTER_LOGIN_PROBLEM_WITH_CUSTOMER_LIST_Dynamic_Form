import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../admin/src/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  UserCircle,
  Store,
} from "lucide-react";
import qrLogo from "../assets/qr.png"; // <- go up one folder, then into assets

export default function DashboardCustomer() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const hasVendorProfile = Boolean(user.vendor_name && user.vendor_id);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <img
            src={qrLogo}
            alt="QR Logo"
            style={{ width: "50px", height: "50px" }}
          />
          <span className="ml-2 text-lg font-bold">GWT QR</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={Users} label="Customer Profile" to="/dashboard/customer" />
          <SidebarItem icon={Users} label="Orders" to="/dashboard/customer" />
        </nav>

        {/* SIDEBAR LOGOUT */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Customer Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-gray-600" />
            <div className="text-sm">
              {hasVendorProfile ? (
                <>
                  <p className="font-medium">{user.vendor_name}</p>
                  <p className="text-gray-500 text-xs">
                    Vendor ID: {user.vendor_id}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-gray-500 text-xs"></p>
                </>
              )}
            </div>

            {/* HEADER LOGOUT (NEW) */}
            <button
              onClick={handleLogout}
              className="ml-3 flex items-center gap-2 !bg-red-600 !text-white px-3 py-2 rounded-lg shadow-md"

            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ITEM ================= */

function SidebarItem({
  icon: Icon,
  label,
  to,
}: {
  icon: any;
  label: string;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
          isActive
            ? "bg-green-100 text-green-700"
            : "hover:bg-gray-100 text-gray-700"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      {label}
    </NavLink>
  );
}
