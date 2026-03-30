import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface Business {
  _id: string;
  image?: string | null;
  category: string;
  sub_category: string;
}

const Frontend: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/businesses"
      );
      setBusinesses(res.data);
    } catch (err) {
      setError("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(
    (item) =>
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sub_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-5">Loading businesses...</div>;
  if (error) return <div className="text-center text-danger py-5">{error}</div>;

  return (
    <div style={pageWrapper}>
      {/* NAVBAR */}
      <nav className="navbar navbar-light bg-white border-bottom sticky-top shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold text-primary fs-4">GWT-QR</span>
        </div>
      </nav>

      <div className="container">
        {/* HERO */}
        <div className="text-center py-5">
          <h1 className="display-5 fw-bold">Discover Local Gems</h1>
          <p className="text-muted mb-4">
            Find the best food, medical care, and shops near you.
          </p>

          <div style={searchWrapper} className="mx-auto">
            <span style={searchIcon}>🔍</span>
            <input
              className="form-control"
              placeholder="Search categories or sub-categories..."
              style={searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* GRID */}
        <div className="row g-4 mb-5">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((item) => (
              <div key={item._id} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm" style={card}>
                  <div style={imgWrapper}>
                    {item.image ? (
                      <img
                        src={`http://127.0.0.1:8000${item.image}`}
                        alt={item.sub_category}
                        style={img}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x200?text=No+Image";
                        }}
                      />
                    ) : (
                      <div style={noImage}>No Image</div>
                    )}
                  </div>

                  <div className="card-body p-4">
                    <span className="badge rounded-pill mb-2" style={badge}>
                      {item.category}
                    </span>
                    <h5 className="fw-bold">{item.sub_category}</h5>
                    <p className="text-muted">Explore trusted local services</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-muted">No businesses found</div>
          )}
        </div>
      </div>
    </div>
  );
};

/* STYLES */
const pageWrapper: React.CSSProperties = {
  backgroundColor: "#fcfcfd",
  minHeight: "100vh",
};

const searchWrapper: React.CSSProperties = {
  position: "relative",
  maxWidth: 600,
};

const searchInput: React.CSSProperties = {
  height: 60,
  borderRadius: 16,
  paddingLeft: 55,
  fontSize: "1.1rem",
};

const searchIcon: React.CSSProperties = {
  position: "absolute",
  left: 20,
  top: "50%",
  transform: "translateY(-50%)",
};

const card: React.CSSProperties = {
  borderRadius: 24,
  overflow: "hidden",
  cursor: "pointer",
  transition: "transform 0.3s ease",
};

const imgWrapper: React.CSSProperties = {
  height: 200,
  overflow: "hidden",
};

const img: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const noImage: React.CSSProperties = {
  width: "100%",
  height: 200,
  backgroundColor: "#f2f2f2",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#999",
  fontSize: 14,
};

const badge: React.CSSProperties = {
  backgroundColor: "#eef4ff",
  color: "#0d6efd",
};

export default Frontend;
