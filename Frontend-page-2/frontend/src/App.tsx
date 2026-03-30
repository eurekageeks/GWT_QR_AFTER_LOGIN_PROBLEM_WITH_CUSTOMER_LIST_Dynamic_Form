import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddCategory from "./pages/AddCategory";
import AddSubCategory from "./pages/AddSubCategory";
import AddBusiness from "./pages/AddBusiness";
import Frontend from "./pages/Frontend";   // ✅ ADD THIS

export default function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 20, flex: 1 }}>
        <Routes>
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/add-sub-category" element={<AddSubCategory />} />
          <Route path="/add-business" element={<AddBusiness />} />

          {/* ✅ NEW */}
          <Route path="/frontend" element={<Frontend />} />
        </Routes>
      </div>
    </div>
  );
}
