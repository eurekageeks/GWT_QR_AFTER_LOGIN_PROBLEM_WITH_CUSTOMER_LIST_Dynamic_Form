import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import API from "../services/apiHospitals";
import { ChevronLeft, Phone, Mail, Globe, MapPin, Clock, Star, Award, Users, Stethoscope, Heart, Shield, ChevronRight, Check } from "lucide-react";
const HospitalDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
 const [expanded, setExpanded] = useState(false);
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([
  {
    name: "Rahul Sharma",
    rating: 5,
    comment: "Excellent doctors and very clean hospital environment."
  },
  {
    name: "Priya Verma",
    rating: 4,
    comment: "Staff was polite and treatment was effective."
  }
]);

const [newReview, setNewReview] = useState({
  name: "",
  rating: 0,
  comment: ""
});
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  useEffect(() => {
  if (slug) {
    fetchHospital();
  }
}, [slug]);

  const fetchHospital = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/hospitals/slug/${slug}`);
      setHospital(res.data);
    } catch (err: any) {
      console.error("Error fetching hospital:", err);
      setError("Unable to fetch hospital details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (error || !hospital) return <div className="text-center mt-5 text-danger"><h5>{error || "No hospital found."}</h5></div>;

  return (
    <div className="bg-light min-vh-100">
      {/* --- NAVBAR --- */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
        <div className="container">
          <div className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src="/src/assets/qr.png" alt="logo" width="30" />
            <span className="fw-bold fs-4 text-dark">GWT-QR</span>
          </div>
      <div className="d-flex align-items-center gap-2">
  
  {/* Login */}
  <button
    className="btn d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-pill"onClick={() => navigate("/Login")}
    style={{
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      transition: "0.3s"
    }}
  >
    🔒 Login
  </button>

  <span className="fw-semibold text-muted">or</span>

  {/* Register */}
  <button
    className="btn d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-pill" onClick={() => navigate("/signup")}
    style={{
      backgroundColor: "#17a2b8",
      color: "white",
      border: "none",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      transition: "0.3s"
    }}
  >
    👤 Register
  </button>

</div>
        </div>
      </nav>

      <div className="container py-4">
        {/* --- BREADCRUMB --- */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"    style={{ cursor: "pointer", color: "#065f46" }} onClick={() => navigate(-1)}>
              {hospital.category || "Hospital"}
            </li>
            <li className="breadcrumb-item active">{hospital.name}</li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* ================= LEFT COLUMN: MAIN CONTENT ================= */}
          <div className="col-lg-8">
            {/* HERO IMAGE & GALLERY */}
            <div className="row g-2 mb-4">
              <div className="col-md-8">
  <div className="position-relative">

    <img
      src={
        hospital.images?.[0]
          ? `http://127.0.0.1:4000/${hospital.images[0]}`
          : "https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
      }
      className="img-fluid rounded-3 w-100"
      style={{ height: "400px", objectFit: "cover" }}
      alt={hospital.name}
    />

    {/* Green Name Badge */}
    <div
      className="position-absolute"
      style={{
        top: "20px",
        left: "20px",
        background: "linear-gradient(135deg, #059669, #0d9488)",
        color: "white",
        padding: "8px 18px",
        borderRadius: "30px",
        fontWeight: "600",
        fontSize: "15px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
      }}
    >
      <i className="bi bi-house-door me-1"></i>
      {hospital.name}
    </div>

  </div>
</div>
              <div className="col-md-4 d-flex flex-column gap-2">
                <img 
                  src={hospital.images?.[1] || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d"} 
                  className="img-fluid rounded-3 h-50" 
                  style={{ objectFit: "cover" }} 
                  alt="G1" 
                />
                <div className="position-relative h-50">
                  <img 
                    src={hospital.images?.[2] || "https://images.unsplash.com/photo-1579154204601-01588f351e67"} 
                    className="img-fluid rounded-3 h-100 w-100" 
                    style={{ objectFit: "cover" }} 
                    alt="G2" 
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 rounded-3 d-flex align-items-center justify-content-center text-white">
                    <span>+ More</span>
                  </div>
                </div>
              </div>
            </div>
{/* ================= ABOUT SECTION (THEME) ================= */}
<div
  className="mb-5 p-4 rounded-4 shadow-sm position-relative"
  style={{
    background: "linear-gradient(145deg, #ffffff, #f0fdfa)",
    borderLeft: "6px solid #059669"
  }}
>
  <div className="d-flex align-items-center mb-3">
    <div
      className="me-3 d-flex align-items-center justify-content-center"
      style={{
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        background: "#ecfdf5",
        color: "#059669",
        fontSize: "20px"
      }}
    >
      <Award size={20} />
    </div>

   <h4 className="fw-bold mb-0" style={{ color: "#065f46" }}>
    
  {hospital.name}
</h4>
  </div>

  {(() => {
    const fullText =
      hospital.about ||
      "This hospital is committed to delivering high-quality healthcare services with advanced medical technology, experienced doctors, and compassionate patient care. Our mission is to ensure safety, comfort, and excellence in every treatment we provide.";

    const shortText = fullText.substring(0, 180);

    return (
      <>
        <p
          className="mb-2"
          style={{
            lineHeight: "1.9",
            fontSize: "15px",
            textAlign: "justify",
            color: "#191c1b",
            transition: "all 0.3s ease"
          }}
        >
          {expanded ? fullText : `${shortText}${fullText.length > 180 ? "..." : ""}`}
        </p>

        {fullText.length > 180 && (
          <button
            className="btn btn-sm fw-semibold px-0"
            style={{
              color: "#1a1d1c",
              border: "none",
              background: "transparent"
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Read Less ▲" : "Read More ▼"}
          </button>
        )}
      </>
    );
  })()}
</div>
{/* ================= SERVICES SECTION (THEME) ================= */}
<div
  className="mb-5 p-4 rounded-4 shadow-sm"
  style={{
    background: "linear-gradient(145deg, #ffffff, #f0fdfa)",
    borderLeft: "6px solid #059669"
  }}
>
  <h5
    className="fw-bold mb-4 d-flex align-items-center gap-2"
    style={{ color: "#065f46" }}
  >
    <Stethoscope size={20} />
    Services Offered
  </h5>

  <div className="d-flex flex-wrap gap-3">
    {hospital.services?.map((s: string, i: number) => (
      <span
        key={i}
        className="px-4 py-2 rounded-pill fw-semibold"
        style={{
          background: "#ecfdf5",
          border: "1px solid #059669",
          color: "#171918",
          transition: "all 0.3s ease",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#059669";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(5,150,105,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ecfdf5";
          e.currentTarget.style.color = "#059669";
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {s}
      </span>
    ))}
  </div>
</div>
            {/* ================= DOCTORS SECTION ================= */}
            <section className="mb-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h5 className="fw-bold"   style={{ color: "#065f46" }}>Doctors</h5>
  </div>

  {hospital?.doctors?.length > 0 ? (
    hospital.doctors.map((doc: any, index: number) => (
      <div key={index} className="card border shadow-sm mb-3 p-3 rounded-3">
        <div className="row align-items-center">
          
          <div className="col-md-8 d-flex align-items-center gap-3">
          <div className="text-center mb-3">
 <img
      src={
        doc.images && doc.images.length > 0
          ? `http://127.0.0.1:4000/${doc.images[0]}`
          : DEFAULT_AVATAR
      }
      alt={doc.name}
      className="rounded-circle shadow"
      width="120"
      height="120"
      style={{ objectFit: "cover" }}
    />
</div>
            <div>
              <h6 className="mb-1 fw-bold">{doc.name}</h6>
              <p className="text-muted mb-0 small">
                {doc.specialization || "General"} •{" "}
                {doc.experience_years || 0} years experience
              </p>
            </div>
          </div>

         

        </div>
      </div>
    ))
  ) : (
    <div className="text-center py-4 bg-light rounded">
      <p className="text-muted mb-0">No doctor information available.</p>
    </div>
  )}
</section>
          </div>

         {/* ================= RIGHT COLUMN: SIDEBAR ================= */}
<div className="col-lg-4">
  <div className="sticky-top" style={{ top: "90px", zIndex: 1 }}>

    {/* ===== Modern Pricing Card ===== */}
    <div
      className="shadow-lg p-4 mb-4 rounded-4 text-white"
      style={{
        background: "linear-gradient(135deg, #059669, #0d9488)", // emerald → teal
        border: "none"
      }}
    >
      <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <span style={{ fontSize: "22px" }}>💰</span>
        Consultation Fees
      </h5>

      {/* OPD */}
      <div
        className="d-flex justify-content-between align-items-center pb-3 mb-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}
      >
        <span style={{ opacity: 0.9 }}>OPD Consultation</span>
        <span className="fw-bold fs-5">
          ₹{hospital.consultation_fees?.opd || 500}
        </span>
      </div>

      {/* Emergency */}
      <div
        className="d-flex justify-content-between align-items-center pb-3 mb-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}
      >
        <span style={{ opacity: 0.9 }}>Emergency</span>
        <span className="fw-bold fs-5">
          ₹{hospital.consultation_fees?.emergency || 1200}
        </span>
      </div>

      {/* ICU */}
      <div className="d-flex justify-content-between align-items-center">
        <span style={{ opacity: 0.9 }}>ICU per Day</span>
        <span className="fw-bold fs-5">
          ₹{hospital.consultation_fees?.icu_per_day || 5000}
        </span>
      </div>

  {/* Button */}
  <button
    className="btn w-100 mt-4 fw-semibold rounded-3"
    style={{
      backgroundColor: "white",
      color: "#059669",
      transition: "0.3s"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#ecfdf5";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "white";
    }}
  >
    Book Appointment
  </button>
</div>

{/* ===== Facilities Card (THEME STYLED) ===== */}
<div
  className="card border-0 shadow-sm p-4 rounded-4"
  style={{
    background: "linear-gradient(145deg, #ffffff, #f0fdfa)",
    borderLeft: "5px solid #059669"
  }}
>
  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: "#059669" }}>
    <Check size={18} />
    Facilities & Amenities
  </h6>

  <div className="d-flex flex-wrap gap-2">
    {(hospital.facilities?.length > 0
      ? hospital.facilities
      : ["Parking", "Pharmacy", "Ambulance"]
    ).map((f: string) => (
      <span
        key={f}
        className="px-3 py-2 rounded-pill fw-semibold"
        style={{
          background: "#ecfdf5",
          border: "1px solid #191e1c",
          color: "#191b1b",
          fontSize: "0.85rem",
          transition: "0.3s",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#222524";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ecfdf5";
          e.currentTarget.style.color = "#059669";
          e.currentTarget.style.transform = "translateY(0px)";
        }}
      >
        {f}
      </span>
    ))}
  </div>

  {/* ===== Timings (Styled) ===== */}
  <div
    className="mt-4 p-3 rounded-3"
    style={{
      background: "#ecfdf5",
      border: "1px solid #d1fae5"
    }}
  >
    <h6
      className="fw-bold mb-2 d-flex align-items-center gap-2"
      style={{ color: "#059669" }}
    >
      <Clock size={18} />
      Timings
    </h6>

    <p className="fw-bold mb-1" style={{ color: "#131413" }}>
      {hospital.timings?.open || "Open 24 Hours"}
    </p>

    <small style={{ color: "#151616" }}>
      {hospital.timings?.days || "Monday - Saturday : 9 AM - 8 PM"}
    </small>
  </div>
</div>
    {/* ===== Contact Information (THEME STYLED) ===== */}
<div
  className="card border-0 shadow-sm p-4 mb-4 rounded-4"
  style={{
    background: "linear-gradient(145deg, #ffffff, #f0fdfa)",
    borderLeft: "5px solid #059669"
  }}
>
  <h6
    className="fw-bold mb-4 d-flex align-items-center gap-2"
    style={{ color: "#059669" }}
  >
    <Phone size={18} />
    Contact Information
  </h6>

  {/* Phone */}
  <div className="d-flex align-items-center mb-3">
    <div
      className="me-3 d-flex align-items-center justify-content-center rounded-circle"
      style={{
        width: "35px",
        height: "35px",
        background: "#ecfdf5",
        color: "#059669"
      }}
    >
      <Phone size={16} />
    </div>
    <span className="small fw-semibold" style={{ color: "#111312" }}>
      {hospital.contact?.phone || "Not Available"}
    </span>
  </div>

  {/* Email */}
  <div className="d-flex align-items-center mb-3">
    <div
      className="me-3 d-flex align-items-center justify-content-center rounded-circle"
      style={{
        width: "35px",
        height: "35px",
        background: "#ecfdf5",
        color: "#059669"
      }}
    >
      <Mail size={16} />
    </div>
    <span className="small fw-semibold" style={{ color: "#111413" }}>
      {hospital.contact?.email || "Not Available"}
    </span>
  </div>

  {/* Website */}
  <div className="d-flex align-items-center">
    <div
      className="me-3 d-flex align-items-center justify-content-center rounded-circle"
      style={{
        width: "35px",
        height: "35px",
        background: "#ecfdf5",
        color: "#059669"
      }}
    >
      <Globe size={16} />
    </div>
    <span className="small fw-semibold" style={{ color: "#111212" }}>
      {hospital.contact?.website || "Not Available"}
    </span>
  </div>
</div>


  </div>
  </div>
        </div>
        {/* ================= REVIEWS SECTION ================= */}
<section className="mb-5">

  <div className="d-flex justify-content-between align-items-center mb-4">
    <h4 className="fw-bold"   style={{ color: "#065f46" }}>⭐ Patient Reviews</h4>
    <span className="badge bg-success fs-6 px-3 py-2">
      {reviews.length} Reviews
    </span>
  </div>

  {/* Reviews List */}
  {reviews.map((review, index) => (
    <div key={index} className="card border-0 shadow-sm mb-3 p-4 rounded-4">
      
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold mb-0">{review.name}</h6>
        <div>
          {[1,2,3,4,5].map((star) => (
            <span key={star} style={{ color: star <= review.rating ? "#ffc107" : "#e4e5e9", fontSize: "18px" }}>
              ★
            </span>
          ))}
        </div>
      </div>

      <p className="text-muted mb-0">{review.comment}</p>

    </div>
  ))}

  {/* Add Review Form */}
  <div className="card border-0 shadow-lg mt-4 p-4 rounded-4">
    <h5 className="fw-bold mb-3">Write a Review</h5>

    <input
      type="text"
      className="form-control mb-3"
      placeholder="Your Name"
      value={newReview.name}
      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
    />

    {/* Star Rating Selector */}
    <div className="mb-3">
      {[1,2,3,4,5].map((star) => (
        <span
          key={star}
          onClick={() => setNewReview({...newReview, rating: star})}
          style={{
            cursor: "pointer",
            fontSize: "28px",
            color: star <= newReview.rating ? "#ffc107" : "#e4e5e9",
            transition: "0.2s"
          }}
        >
          ★
        </span>
      ))}
    </div>

    <textarea
      className="form-control mb-3"
      rows={3}
      placeholder="Write your experience..."
      value={newReview.comment}
      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
    />

    <button
      className="btn btn-success w-100 fw-bold"
      onClick={() => {
        if(newReview.name && newReview.rating && newReview.comment){
          setReviews([...reviews, newReview]);
          setNewReview({ name: "", rating: 0, comment: "" });
        }
      }}
    >
      Submit Review
    </button>
  </div>

  </section>
      </div>
    </div>
  );
};

export default HospitalDetails;
