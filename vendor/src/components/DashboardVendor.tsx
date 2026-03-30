import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../admin/src/context/AuthContext";
import { LayoutDashboard, Package, LogOut, UserCircle } from "lucide-react";

export default function DashboardVendor() {
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* TOP */}
        <div className="h-16 flex items-center px-6 border-b flex-shrink-0">
          <LayoutDashboard className="w-6 h-6 text-green-600" />
          <span className="ml-2 text-lg font-bold">Service Provider</span>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          
          <SidebarItem icon={Package} label="Menu" to="/dashboard/vendor/menu" />
          <SidebarItem icon={Package} label="Orders" to="/dashboard/vendor/orders" />
          <SidebarItem icon={Package} label="Customers" to="/dashboard/vendor/customerlists" />
          <SidebarItem icon={Package} label="Dynamic Form" to="/dashboard/vendor/dynamic-form" />
        </nav>

        {/* BOTTOM LOGOUT (ALWAYS VISIBLE) */}
        <div className="p-4 border-t flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Service Provider</h1>

          <div className="flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-gray-600" />
            <div className="text-sm">
              <p className="font-medium">{user.email}</p>
              
            </div>

            {/* HEADER LOGOUT */}
            <button
              onClick={handleLogout}
             className="ml-3 flex items-center gap-2 !bg-red-600 !text-white px-3 py-2 rounded-lg shadow-md"





            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, to }: { icon: any; label: string; to: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
          isActive ? "bg-green-100 text-green-700" : "hover:bg-gray-100 text-gray-700"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      {label}
    </NavLink>
  );
}
