import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const HospitalDetails = () => {
  const navigate = useNavigate();
  const user: { name?: string; email?: string } | null = null;
  const logout: (() => void) | null = null;

  return (
    <>
      <style>{`
        .blink-offer {
          background: #ffc107;
          color: #000;
          font-size: 10px;
          padding: 3px 6px;
          border-radius: 4px;
          margin-left: 6px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.2; }
          100% { opacity: 1; }
        }

        .badge-home {
          position: absolute;
          top: 10px;
          left: 10px;
          background: linear-gradient(45deg, #16a34a, #22c55e);
          color: white;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 20px;
          font-weight: 600;
        }
      `}</style>

      <div>
        {/* ================= HEADER ================= */}
        {/* ================= HEADER ================= */}
<div className="border-bottom">
  <div className="container py-3">

    {/* Top Row */}
    <div className="d-flex justify-content-between align-items-center">
      
      {/* Logo Section */}
      <div className="d-flex align-items-center gap-2">
        <img src="/src/assets/qr.png" alt="logo" width="28" />
        <h5 className="mb-0 fw-bold text-primary">GWT-QR</h5>
      </div>

      {/* Login Button */}
      {user ? (
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold text-primary">
            Hi, {user.name || user.email}
          </span>

          <button
            className="btn btn-danger"
            onClick={() => logout && logout()}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className="btn px-4 text-white"
          style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a" }}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </div>

    {/* Breadcrumb Row */}
    <div className="mt-3">
      <span
        className="text-muted"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/healthcare-directory")}
      >
        Health & Medical
      </span>

      <span className="mx-2 text-muted">{">"}</span>

      <span className="fw-semibold text-dark">
        City Care Hospital
      </span>
    </div>

  </div>
</div>


        {/* ================= BODY ================= */}
        <div className="container my-4">
          {/* ================= TOP IMAGES ================= */}
          <div className="row g-3">
            {/* LEFT BIG IMAGE / SLIDER */}
<div className="col-md-8 position-relative">
  <div
    id="hospitalTopSlider"
    className="carousel slide"
    data-bs-ride="carousel"
    data-bs-interval="2000"
  >
    {/* Indicators */}
    <div className="carousel-indicators">
      <button
        type="button"
        data-bs-target="#hospitalTopSlider"
        data-bs-slide-to="0"
        className="active"
      />
      <button
        type="button"
        data-bs-target="#hospitalTopSlider"
        data-bs-slide-to="1"
      />
      <button
        type="button"
        data-bs-target="#hospitalTopSlider"
        data-bs-slide-to="2"
      />
    </div>

    {/* Slides */}
    <div className="carousel-inner rounded">
      <div className="carousel-item active">
        <img
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
          className="d-block w-100"
          alt="Hospital 1"
          style={{ height: "260px", objectFit: "cover" }}
        />
      </div>

      <div className="carousel-item">
        <img
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118"
          className="d-block w-100"
          alt="Hospital 2"
          style={{ height: "260px", objectFit: "cover" }}
        />
      </div>

      <div className="carousel-item">
        <img
          src="https://images.unsplash.com/photo-1538108149393-fbbd81895907"
          className="d-block w-100"
          alt="Hospital 3"
          style={{ height: "260px", objectFit: "cover" }}
        />
      </div>
    </div>

    {/* Controls */}
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target="#hospitalTopSlider"
      data-bs-slide="prev"
    >
      <span className="carousel-control-prev-icon" />
    </button>

    <button
      className="carousel-control-next"
      type="button"
      data-bs-target="#hospitalTopSlider"
      data-bs-slide="next"
    >
      <span className="carousel-control-next-icon" />
    </button>
  </div>

  {/* Badge */}
  <div
    onClick={() => navigate("/hospital-gallery")}
    className="badge-home position-absolute"
  >
    <i className="bi bi-house-door me-1"></i>
    City Care Hospital
  </div>
</div>

            {/* RIGHT SMALL GALLERY */}
            <div className="col-md-4">
              <div className="row g-2">
                {[
                  "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
                  "https://images.unsplash.com/photo-1538108149393-fbbd81895907",
                  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
                  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
                ].map((img, i) => (
                  <div key={i} className="col-6 position-relative">
                    <img
                      src={img}
                      alt="Hospital"
                      className="img-fluid rounded"
                      style={{
                        height: "125px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />

                    {i === 3 && (
                      <div
                        onClick={() => navigate("/hospital-gallery")}
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          color: "white",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        + More
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= MAIN CONTENT ================= */}
          <div className="row mt-4">
            {/* LEFT SIDE */}
            <div className="col-lg-8">
              {/* About */}
              <div className="card p-3 mb-3">
                <h5>About Hospital</h5>
                <p className="text-muted mb-0">
                  City Care Hospital is a leading multispeciality healthcare
                  provider in Delhi, offering emergency services, diagnostics,
                  surgeries, and outpatient consultations with modern equipment
                  and experienced doctors.
                </p>
              </div>

              {/* Services */}
              <div className="card p-3 mb-3">
                <h5>Services Offered</h5>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {[
                    "General Consultation",
                    "Emergency",
                    "ICU",
                    "Surgery",
                    "Blood Test",
                    "Vaccination",
                    "X-Ray",
                    "MRI",
                    "Pharmacy",
                  ].map((s) => (
                    <span key={s} className="badge bg-light text-dark border p-2">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Doctors */}
              <div className="card p-3 mb-3">
                <div className="d-flex justify-content-between">
                  <h5>Doctors</h5>
                  <span className="text-primary">More</span>
                </div>

                {[
                  {
                    name: "Dr. Amit Sharma",
                    dept: "Cardiology",
                    exp: "15 years",
                    fee: 800,
                  },
                  {
                    name: "Dr. Priya Mehra",
                    dept: "Orthopedics",
                    exp: "12 years",
                    fee: 700,
                  },
                  {
                    name: "Dr. Rajesh Gupta",
                    dept: "Pediatrics",
                    exp: "10 years",
                    fee: 600,
                  },
                ].map((doc, i) => (
                  <div key={i} className="border rounded p-2 my-2">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex gap-3 align-items-center">
                        <img
                          src="https://randomuser.me/api/portraits/men/32.jpg"
                          width="55"
                          height="55"
                          className="rounded"
                        />
                        <div>
                          <h6 className="mb-0">{doc.name}</h6>
                          <small className="text-muted">
                            {doc.dept} • {doc.exp} experience
                          </small>
                        </div>
                      </div>

                      <div className="text-end">
                        <div>
                          ₹{doc.fee}
                          {doc.name === "Dr. Rajesh Gupta" && (
                            <span className="blink-offer">Limited Offer</span>
                          )}
                        </div>

                        <button className="btn btn-warning btn-sm mt-1">
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reviews */}
              <div className="card p-3 mb-3">
                <h5>Patients Reviews & Ratings</h5>
                <h3 className="mt-2">4.7 ⭐⭐⭐⭐⭐</h3>
                <p className="text-muted">105 Reviews</p>
                <p className="mb-0">📍 123 Main Street, Delhi</p>
              </div>

              {/* Map */}
              <div className="card p-3 mb-3">
                <h5>Map Location</h5>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span>123 Main Street, Delhi</span>
                  <button
                    className="btn btn-warning"
                    onClick={() =>
                      window.open(
                        "https://www.google.com/maps?q=28.6139,77.2090",
                        "_blank"
                      )
                    }
                  >
                    Get Direction
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-lg-4">
              <div className="card p-3 mb-3">
                <h5>Consultation Fees</h5>
                <div className="d-flex justify-content-between">
                  <span>OPD Consultation</span>
                  <span>₹500</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Emergency</span>
                  <span>₹1200</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>ICU per day</span>
                  <span>₹5000</span>
                </div>
              </div>

              <div className="card p-3 mb-3">
                <h5>Timings</h5>
                <p className="mb-1">Open 24 Hours</p>
                <small className="text-muted">
                  Monday - Saturday: 9 AM - 8 PM
                </small>
              </div>

              <div className="card p-3 mb-3">
                <h5>Facilities & Amenities</h5>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    "Parking",
                    "Pharmacy",
                    "Ambulance",
                    "Waiting Lounge",
                    "Online Payment",
                    "Insurance Accepted",
                  ].map((a) => (
                    <span key={a} className="badge bg-light text-dark border p-2">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card p-3 mb-3">
                <h5>Insurance & Payment</h5>
                <p className="mb-1">Cash</p>
                <p className="mb-1">Credit/Debit Cards</p>
                <p className="mb-0">UPI</p>
              </div>

              <div className="card p-3 mb-3">
                <h5>Contact Information</h5>
                <p className="mb-1">📞 +91 9876543210</p>
                <p className="mb-1">✉ info@citycarehospital.com</p>
                <p className="mb-0">🌐 www.citycarehospital.com</p>
              </div>

              <div className="card p-3 mb-3">
                <h5>Frequently Asked Questions</h5>
                <p className="mb-1">✔ Is emergency available?</p>
                <p className="mb-1">✔ Do they accept insurance?</p>
                <p className="mb-0">✔ Is parking available?</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <footer className="container mt-5 py-4 border-top">
          <div className="row align-items-center text-center text-md-start">
            <div className="col-md-3 fw-bold text-primary">GWT-QR</div>

            <div className="col-md-6 d-flex justify-content-center gap-4 text-muted small my-3 my-md-0">
              <span>About GWT-QR</span>
              <span>Contact</span>
              <span>Privacy Policy</span>
              <span>Terms</span>
            </div>

            <div className="col-md-3 d-flex justify-content-center justify-content-md-end gap-2">
              <span>📘</span>
              <span>🐦</span>
              <span>🔗</span>
            </div>
          </div>

          <div className="text-center text-muted small mt-3">
            © 2024 GWT-QR
          </div>
        </footer>
      </div>
    </>
  );
};

export default HospitalDetails;
