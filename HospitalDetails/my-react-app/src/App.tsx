import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminHospitalForm from "./components/AdminHospitalForm";
import HospitalDetails from "./components/HospitalDetails";
import HospitalList from "./components/HospitalListPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminHospitalForm />} />
        <Route path="/" element={<Navigate to="/admin/create-hospital" />} />
        <Route path="/admin/create-hospital" element={<AdminHospitalForm />} />
        <Route path="/hospital/:id" element={<HospitalDetails />} />
        <Route path="/hospital-list" element={<HospitalList />} />
      </Routes>
    </Router>
  );
};

export default App;