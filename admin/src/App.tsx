import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";

// Layout
import DashboardVendor from "../../vendor/src/components/DashboardVendor";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardCustomer from "../../customer/src/components/DashboardCustomer";

// Admin
import DashboardHome from "./components/DashboardHome";
import Frontend from "./components/Frontend";
import VendorList from "./components/VendorList";
import CustomerList from "./components/CustomerList";
import EmployeeList from "./components/EmployeeList";
import AddCategory from "../../Frontend-page-2/frontend/src/pages/AddCategory";
import AddSubCategory from "../../Frontend-page-2/frontend/src/pages/AddSubCategory";
import AddBusiness from "../../Frontend-page-2/frontend/src/pages/AddBusiness";
import HealthcareDirectory from "./components/HealthcareDirectory";
import HospitalDetails from "./components/HospitalDetails";
import HospitalGallery from "./pages/HospitalGallery";
import HospitalDetails2 from "./components/HospitalDetails2";
import ViewVendor from "./components/ViewVendor";
import ViewCustomer from "./components/ViewCustomer";
import EditCustomer from "./components/EditCustomer";
// Customer
import RestaurantMenu from "../../customer/src/components/RestaurantMenu";

// Vendor
import VendorProfile from "../../vendor/src/components/VendorProfile";
import FoodCategoryApp from "../../vendor/src/components/page";
import Orders from "../../vendor/src/components/Orders";
import CustomerLists from "../../vendor/src/components/CustomerList";
import EditVendor from "./components/EditVendor";
import DynamicForm from "./components/DynamicForm";
// Auth
import Login from "./components/Login";
import Signup from "./components/Signup";
import ClinicDashboard from "./components/ClinicDashboard";
import ClinicDetails from "./components/ClinicDetails";

export default function App() {
  return (
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<Frontend />} />

      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/healthcare-directory" element={<HealthcareDirectory />} />
      
      <Route path="/hospital-gallery" element={<HospitalGallery />} />
      <Route path="/hospital/:slug" element={<HospitalDetails2 />} />
      {/* ADMIN DASHBOARD */}
      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <DashboardAdmin />
            </RoleRoute>
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="vendorlist" element={<VendorList />} />
        <Route path="/dashboard/admin/editvendor/:id" element={<EditVendor />} />
        <Route
 path="/dashboard/admin/viewvendor/:id"
 element={<ViewVendor />}
/>
<Route path="/dashboard/admin/viewcustomer/:id" element={<ViewCustomer />} />
<Route path="/dashboard/admin/editcustomer/:id" element={<EditCustomer />} />
        <Route path="customerlist" element={<CustomerList />} />
        <Route path="employeelist" element={<EmployeeList />} />
        <Route path="addcategory" element={<AddCategory />} />
        <Route path="addsubcategory" element={<AddSubCategory />} />
        <Route path="addbusiness" element={<AddBusiness />} />
        
<Route path="healthcare-directory" element={<HealthcareDirectory />} />
      </Route>

      {/* VENDOR DASHBOARD */}
      <Route
        path="/dashboard/vendor"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["vendor"]}>
              <DashboardVendor />
            </RoleRoute>
          </PrivateRoute>
        }
      >
        <Route index element={<VendorProfile />} />
        <Route path="profile" element={<VendorProfile />} />
        <Route path="menu" element={<FoodCategoryApp />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customerlists" element={<CustomerLists />} />
         <Route path="dynamic-form" element={<DynamicForm />} />
         <Route path="clinic/:id" element={<ClinicDetails />} />
      </Route>

      {/* CUSTOMER DASHBOARD */}
      <Route
        path="/dashboard/customer"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["customer"]}>
              <DashboardCustomer />
            </RoleRoute>
          </PrivateRoute>
        }
      >
        <Route index element={<RestaurantMenu />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}