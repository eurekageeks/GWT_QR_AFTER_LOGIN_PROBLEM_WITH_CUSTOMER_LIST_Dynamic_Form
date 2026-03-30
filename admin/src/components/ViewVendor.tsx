import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../vendor-api/vendor-api";

export default function ViewVendor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    fetchVendor();
  }, []);

  const fetchVendor = async () => {
    try {
      const res = await api.get(`/auth/vendor/${id}`);
      setVendor(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!vendor) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Vendor Details</h2>

        <div style={styles.infoRow}>
          <span style={styles.label}>Email:</span>
          <span>{vendor.email}</span>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.label}>Mobile:</span>
          <span>{vendor.mobile}</span>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.label}>Category:</span>
          <span style={styles.badgeBlue}>
            {vendor.category_name || "N/A"}
          </span>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.label}>Sub Category:</span>
          <span style={styles.badgeGreen}>
            {vendor.sub_category_name || "N/A"}
          </span>
        </div>

        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "24px",
    fontWeight: "bold"
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    fontSize: "16px"
  },

  label: {
    fontWeight: "bold"
  },

  badgeBlue: {
    background: "#3b82f6",
    color: "white",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "12px"
  },

  badgeGreen: {
    background: "#10b981",
    color: "white",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "12px"
  },

  backBtn: {
    marginTop: "20px",
    width: "100%",
    background: "#4f46e5",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};