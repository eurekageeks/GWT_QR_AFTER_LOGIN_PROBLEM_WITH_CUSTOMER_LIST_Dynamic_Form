import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

interface Hospital {
  _id: string;
  name: string;
  category?: string;
  address?: string;
}

const HospitalList: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);

        const res = await API.get("/api/hospitals");

        // Ensure backend returns array
        if (Array.isArray(res.data)) {
          setHospitals(res.data);
        } else {
          setHospitals([]);
        }

      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(
          err?.response?.data?.detail || "Failed to fetch hospitals."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Loading hospitals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        <h5>{error}</h5>
      </div>
    );
  }

  if (!hospitals.length) {
    return (
      <div className="text-center mt-5">
        <h5>No hospitals available.</h5>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h3 className="mb-4 fw-bold">Hospital Directory</h3>

      <div className="row">
        {hospitals.map((hospital) => (
          <div key={hospital._id} className="col-md-4 mb-4">
            <div
              className="card shadow-sm h-100"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/hospital/${hospital._id}`)}
            >
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
                alt="Hospital"
              />
              <div className="card-body">
                <h5 className="card-title">{hospital.name}</h5>
                <p className="text-muted small">
                  {hospital.category || "General"}
                </p>
                <p className="small">
                  {hospital.address || "Address not available"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalList;