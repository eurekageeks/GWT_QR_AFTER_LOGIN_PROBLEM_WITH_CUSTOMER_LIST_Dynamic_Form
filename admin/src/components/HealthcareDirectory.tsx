import React, { useState, useMemo, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../frontend-api/api";
import API from "../services/apiHospitals";
/* ---------------- CATEGORIES ---------------- */
const staticCategories = [
  { name: "Hospitals", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3" },
  { name: "Clinics", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3" },
  { name: "Dental Clinics", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3" },
  { name: "Eye Hospitals", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3" },
  { name: "Diagnostic Centers", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3" },
  { name: "Pathology Labs", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3" },
  { name: "Pharmacies", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3" },
  { name: "Physiotherapy Centers", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3" },
];

/* ---------------- REALISTIC NAMES ---------------- */
const namePool: Record<string, string[]> = {
 
  Clinics: [
    "Family Health Clinic",
    "Urban Care Clinic",
    "Wellness Clinic",
    "Prime Care Clinic",
    "Community Clinic",
  ],
  "Dental Clinics": [
    "Smile Dental Care",
    "Bright Tooth Clinic",
    "Happy Smiles Dental",
    "Perfect Teeth",
    "Advanced Dental Studio",
  ],
  "Eye Hospitals": [
    "Vision Eye Hospital",
    "Clear Sight Center",
    "Netra Care",
    "Focus Eye Institute",
    "Drishti Eye Hospital",
  ],
  "Diagnostic Centers": [
    "Accurate Diagnostics",
    "HealthScan Center",
    "Precision Labs",
    "Advance Imaging",
    "Trust Diagnostics",
  ],
  "Pathology Labs": [
    "Modern Path Lab",
    "Care Pathology",
    "Rapid Test Lab",
    "Prime Path Lab",
    "Reliable Diagnostics",
  ],
  Pharmacies: [
    "MedPlus Pharmacy",
    "Apollo Pharmacy",
    "WellMed Store",
    "City Medical",
    "Good Health Pharmacy",
  ],
  "Physiotherapy Centers": [
    "Active Life Physio",
    "Pain Relief Physio",
    "MoveWell Center",
    "Flex Physiotherapy",
    "Revive Rehab",
  ],
};

/* ---------------- CREATE DATA ---------------- */
const createBusinesses = () => {
  const list: {
    id: string;
    name: string;
    category: string;
    img: string;
    rating: number;
    homeVisit: boolean;
    isOpen: boolean;
  }[] = [];

  staticCategories.forEach((cat) => {

  // ❌ Skip Hospitals (we will use real API data instead)
  if (cat.name === "Hospitals") return;

  namePool[cat.name].forEach((name, i) => {
    list.push({
      id: `${cat.name}-${i}`,
      name,
      category: cat.name,
      img: cat.img,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      homeVisit: Math.random() > 0.6,
      isOpen: Math.random() > 0.5,
    });
  });
});
  return list;
};

export default function HealthcareDirectory() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
const [categories, setCategories] = useState<any[]>([]);
const [hospitals, setHospitals] = useState<any[]>([]);
  /* FILTERS */
  const [showOpen, setShowOpen] = useState(true);
  const [homeOnly, setHomeOnly] = useState(false);

  const allBusinesses = useMemo(() => createBusinesses(), []);
 const navigate = useNavigate();
const [showLoginPopup, setShowLoginPopup] = useState(false);
const [mode, setMode] = useState<"login" | "signup">("login");
const [confirmPassword, setConfirmPassword] = useState("");
const [mobile, setMobile] = useState("");
const categoryScrollRef = useRef<HTMLDivElement | null>(null);
const scrollCategories = (direction: "left" | "right") => {
  if (!categoryScrollRef.current) return;

  const amount = 200;

  categoryScrollRef.current.scrollBy({
    left: direction === "left" ? -amount : amount,
    behavior: "smooth",
  });
};
const fetchHospitals = async () => {
  try {
    const res = await API.get("/api/hospitals/");
    setHospitals(res.data);
  } catch (error) {
    console.error("Error fetching hospitals", error);
  }
};
/* ================= FETCH HEALTH SUBCATEGORIES ================= */
  useEffect(() => {
    const fetchHealthSubCategories = async () => {
      try {
        const catRes = await api.get("/admin/categories");
        const allCategories = catRes.data || [];

        const healthCategory = allCategories.find(
          (c: any) => c.name === "Health & Medical"
        );

        if (!healthCategory) return;

        const subRes = await api.get(
  `/admin/sub-categories/${healthCategory._id}`
);

        setCategories(subRes.data || []);
      } catch (err) {
        console.log("Error loading subcategories", err);
      }
    };

    fetchHealthSubCategories();
  }, []);
useEffect(() => {
  fetchHospitals();
}, []);
/* ✅ NEW STATES FOR LOGIN */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
let user: any = null;
let signIn: any = null;
let signUp: any = null;
let logout: any = null;

try {
  const auth = useAuth();
  user = auth?.user ?? null;
  signIn = auth?.signIn ?? null;
  signUp = auth?.signUp ?? null;   // ✅
  logout = auth?.logout ?? null;
} catch {
  user = null;
  signIn = null;
  signUp = null;
  logout = null;
}

  /* SCROLL REFS */
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scroll = (category: string, direction: "left" | "right") => {
    const el = scrollRefs.current[category];
    if (!el) return;

    const amount = 300;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  /* ---------------- FILTER ---------------- */
  /* ---------------- MERGE API + STATIC ---------------- */
const combinedBusinesses = useMemo(() => {
  const apiHospitalsFormatted = hospitals.map((h: any) => ({
    id: h._id,
    slug: h.slug,   // 👈 ADD THIS
    name: h.name,
    category: "Hospitals",
    img: h.image || staticCategories[0].img,
    rating: 4.5,
    homeVisit: false,
    isOpen: true,
  }));

  return [...apiHospitalsFormatted, ...allBusinesses];
}, [hospitals, allBusinesses]);

/* ---------------- FILTER LOGIC ---------------- */

const filtered = useMemo(() => {
  return combinedBusinesses.filter((b) => {
    const matchCategory =
      activeCategory === "All" || b.category === activeCategory;

    const matchSearch = b.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchOpen = showOpen ? b.isOpen : !b.isOpen;

    const matchHome = homeOnly ? b.homeVisit : true;

    return matchCategory && matchSearch && matchOpen && matchHome;
  });
}, [activeCategory, search, showOpen, homeOnly, combinedBusinesses]);
  /* ✅ LOGIN AS CUSTOMER */
  const handleCustomerLogin = async () => {
    setError("");
    const result = await signIn(email, password, "customer");

    if (result?.error) {
      setError(result.error);
      return;
    }

    setShowLoginPopup(false);
  };
const handleCustomerSignup = async () => {
  setError("");

  if (!email || !password || !confirmPassword || !mobile) {
    setError("All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (!signUp) {
    setError("Signup service unavailable");
    return;
  }

  const result = await signUp({
    role: "customer",
    email,
    mobile,
    password,
  });

  if (result?.error) {
    setError(result.error);
    return;
  }

  // Switch to login mode
  setMode("login");

  // Clear fields
  setPassword("");
  setConfirmPassword("");
  setMobile("");

  setError("Account created successfully. Please login.");
};


  return (
    <React.Fragment>
      <style>{`
        body {
        /* ================= FOOTER ================= */

footer {
  border-top: 1px solid #eee !important;
  font-size: 14px;
}

footer .row {
  align-items: center;
}

/* Links styling */
footer .col-md-6 span {
  cursor: pointer;
  transition: color 0.2s ease;
}

footer .col-md-6 span:hover {
  color: #0d6efd;
}

/* Social icons */
footer .col-md-3 span {
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

footer .col-md-3 span:hover {
  transform: translateY(-2px);
}


/* ================= MOBILE FOOTER FIX ================= */

@media (max-width: 768px) {

  footer {
    text-align: center !important;
  }

  footer .row {
    flex-direction: column !important;
    gap: 18px;
  }

  /* Brand */
  footer .col-md-3:first-child {
    font-size: 18px;
  }

  /* Links stacked vertically */
  footer .col-md-6 {
    flex-direction: column !important;
    gap: 10px !important;
  }

  /* Social icons center */
  footer .col-md-3:last-child {
    justify-content: center !important;
  }

  footer .col-md-3 span {
    font-size: 20px;
  }

  /* Copyright spacing */
  footer .text-muted.small {
    margin-top: 20px !important;
  }
}
          background: #f8fafc;
          font-family: Inter, system-ui, sans-serif;
        }

        .scroll-row {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .scroll-row::-webkit-scrollbar { display: none; }

        .health-card {
          min-width: 420px;
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,.08);
          flex-shrink: 0;
          display: flex;
        }

        .health-card img {
          width: 160px;
          height: auto;
          object-fit: cover;
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

        .cat-btn { white-space: nowrap; }
/* LOGIN POPUP NAVY BLUE THEME */
.navy-modal .modal-content {
  border-radius: 16px;
  overflow: hidden;
}

.navy-modal .modal-header {
  background: linear-gradient(45deg, #0b3d91, #0f52ba);
  color: white;
  border-bottom: none;
}

.navy-modal .modal-body {
  background: #eef2ff;
}

.navy-btn {
  background: linear-gradient(45deg, #0b3d91, #0f52ba);
  border: none;
  color: white;
  font-weight: 600;
}

.navy-btn:hover {
  opacity: 0.9;
  color: white;
}
/* ================= CATEGORY SLIDER ================= */

.category-slider {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f1f5f9;
  padding: 12px;
  border-radius: 999px;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.category-track {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  flex: 1;
  scrollbar-width: none;
}

.category-track::-webkit-scrollbar {
  display: none;
}

/* CATEGORY CHIP */
.cat-chip {
  white-space: nowrap;
  padding: 12px 22px;
  border-radius: 999px;
  border: none;
  background: #e5e7eb;
  color: #374151;
  font-weight: 500;
  transition: all 0.25s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.cat-chip:hover {
  transform: translateY(-2px);
  background: #dbeafe;
}

/* ACTIVE CHIP */
.cat-chip.active {
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
}

/* ARROW BUTTONS */
.nav-arrow {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-arrow:hover {
  background: #e0e7ff;
  transform: scale(1.05);
}
/* ================= RESPONSIVE SYSTEM ================= */

/* ---------- DESKTOP DEFAULT ---------- */
.health-card {
  min-width: 420px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0,0,0,.08);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  transition: 0.25s ease;
}

.health-card:hover {
  transform: translateY(-4px);
}

.health-card img {
  width: 160px;
  height: 100%;
  object-fit: cover;
}

.scroll-row {
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding: 10px 4px 14px 4px;
  scroll-snap-type: x mandatory;
}

.scroll-row::-webkit-scrollbar {
  display: none;
}

.health-card {
  scroll-snap-align: start;
}

/* ---------- TABLET (≤ 992px) ---------- */
@media (max-width: 992px) {

  .health-card {
    min-width: 340px;
  }

  .health-card img {
    width: 140px;
  }

  .cat-chip {
    padding: 10px 18px;
    font-size: 14px;
  }

}

/* ================= FILTER MOBILE FIX ================= */
@media (max-width: 768px) {

  /* Target ONLY filter section container */
  .filter-section .container.d-flex {
    flex-direction: column;
    align-items: stretch !important;
    gap: 12px;
  }

  /* Location dropdown full width */
  .filter-section select.form-select {
    width: 100%;
    height: 44px;
  }

  /* Search input group full width */
  .filter-section .input-group {
    width: 100% !important;
  }

  .filter-section .input-group input {
    height: 44px;
  }

  /* Search button full width */
  .filter-section .btn-outline-primary {
    width: 100%;
    height: 44px;
  }

}


/* ---------- SMALL MOBILE (≤ 480px) ---------- */
@media (max-width: 480px) {

  .health-card img {
    height: 180px;
  }

  .badge-home {
    font-size: 11px;
    padding: 5px 8px;
  }

  .cat-chip {
    padding: 6px 12px;
    font-size: 12px;
  }

}
  /* CARD BOTTOM SECTION STACK */
  .health-card .border-top {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 10px;
  }

  .health-card .btn {
    width: 100%;
    justify-content: center;
  }

  

}


/* ---------- SMALL MOBILE (≤ 480px) ---------- */
@media (max-width: 480px) {

  .health-card {
    min-width: 100%;
  }

  .health-card img {
    width: 95px;
  }

  .badge-home {
    font-size: 10px;
    padding: 4px 8px;
  }

  .cat-chip {
    padding: 6px 14px;
    font-size: 12px;
  }

  .nav-arrow {
    display: none; /* hide arrows on very small screens */
  }

}
`}</style>
      {/* ================= HEADER ================= */}
      <div className="border-bottom bg-white">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center gap-2">
            <img src="/src/assets/qr.png" alt="logo" width="28" />
            <h5 className="mb-0 fw-bold text-primary">GWT-QR</h5>
          </div>

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
  style={{ backgroundColor: "#0b3d91", borderColor: "#0b3d91" }}
  onClick={() => navigate("/login")}
>
  Login
</button>

)}



        </div>

        <div className="container py-2">
          <span
    className="text-muted"
    style={{ cursor: "pointer" }}
    onClick={() => navigate("/")}
  >
    Home
  </span>
          <span className="mx-2">{">"}</span>
          <span className="fw-semibold">Health & Medical</span>
        </div>
      </div>
      {/* ================= END HEADER ================= */}

      {/* ================= TOP FILTER BAR ================= */}
      <div className="bg-white border-bottom">
  <div className="container py-3">
    <div className="d-flex flex-wrap align-items-center gap-2">

      <div className="input-group" style={{ maxWidth: 320 }}>
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          className="form-control"
          placeholder="Search local clinics near you"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <button className="btn btn-light border">
        Location <i className="bi bi-chevron-down ms-1"></i>
      </button>

      <button className="btn btn-light border">
        Rating <i className="bi bi-chevron-down ms-1"></i>
      </button>

      <button className="btn btn-light border">
        <i className="bi bi-sliders me-1"></i>
        Filters
      </button>

      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showOpen}
          onChange={(e) => setShowOpen(e.target.checked)}
          id="openNowTop"
        />
        <label className="form-check-label" htmlFor="openNowTop">
          Open Now
        </label>
      </div>

      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={homeOnly}
          onChange={(e) => setHomeOnly(e.target.checked)}
          id="homeVisitTop"
        />
        <label className="form-check-label" htmlFor="homeVisitTop">
          Home Visit
        </label>
      </div>

      <button className="btn btn-outline-primary ms-auto">
        Clear All
      </button>

    </div>
  </div>
</div>
      {/* ================= END TOP FILTER BAR ================= */}
{/* CATEGORY SLIDER */}
<div className="container my-3">
  <div className="category-slider d-flex align-items-center">

    <button
      className="nav-arrow"
      onClick={() => scrollCategories("left")}
    >
      <i className="bi bi-chevron-left"></i>
    </button>

    {/* ✅ Fixed "All" Button */}
    <button
      className={`cat-chip me-2 ${
        activeCategory === "All" ? "active" : ""
      }`}
      onClick={() => setActiveCategory("All")}
      style={{ flex: "0 0 auto" }}
    >
      ✨ All
    </button>

    {/* ✅ Scrollable Categories */}
    <div
      className="category-track d-flex gap-2 overflow-auto"
      ref={categoryScrollRef}
      style={{ scrollBehavior: "smooth" }}
    >
      {categories.map((c) => (
        <button
          key={c._id}
          className={`cat-chip ${
            activeCategory === c.name ? "active" : ""
          }`}
          onClick={() => setActiveCategory(c.name)}
        >
          📌 {c.name}
        </button>
      ))}
    </div>

    <button
      className="nav-arrow"
      onClick={() => scrollCategories("right")}
    >
      <i className="bi bi-chevron-right"></i>
    </button>

  </div>
</div>
        {/* ROWS */}
        {categories
          .filter(
            (c) => activeCategory === "All" || c.name === activeCategory
          )
          .map((cat) => {
            const businesses = filtered.filter(
              (b) => b.category === cat.name
            );

            if (businesses.length === 0) return null;

            return (
  <div key={cat.name} className="container mb-5">
                {/* TITLE + ARROWS */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold m-0">{cat.name}</h5>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => scroll(cat.name, "left")}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>

                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => scroll(cat.name, "right")}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                </div>
{/* CARDS */}
<div
  className="scroll-row"
  ref={(el: HTMLDivElement | null) => {
    scrollRefs.current[cat.name] = el;
  }}
>
 {businesses.map((b) => (
  <div
    key={b.id}
    className="health-card position-relative flex-column"
    style={{ cursor: "pointer" }}
   onClick={() => {
  if (b.category === "Hospitals") {
    const slug = b.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    navigate(`/hospital/${slug}`);
  }
}}
  >

      {b.homeVisit && (
        <div className="badge-home">
          <i className="bi bi-house-door me-1"></i>
          Home Visit
        </div>
      )}

      {/* TOP SECTION */}
      <div className="d-flex">
        {/* IMAGE */}
        <img
          src={`${b.img}?auto=format&fit=crop&w=800&q=80`}
          alt={b.name}
        />

        {/* DETAILS */}
        <div className="p-3 flex-grow-1">
          <h5 className="fw-bold mb-1">{b.name}</h5>

          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="text-warning">⭐⭐⭐⭐⭐</span>
            <span className="fw-semibold">{b.rating}</span>
            <small className="text-muted">(105 reviews)</small>
          </div>

          <div className="text-muted mb-1">
            <i className="bi bi-geo-alt-fill me-1"></i>
            123 Main Street, Delhi
          </div>

          <div className={`${b.isOpen ? "text-success" : "text-danger"}`}>
            <i className="bi bi-check-circle-fill me-1"></i>
            {b.isOpen ? "Open Now · Closes at 8:00 PM" : "Closed"}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="border-top p-3 d-flex align-items-center justify-content-between">
        <div className="d-flex flex-wrap gap-2">
          <span className="badge bg-light text-primary border">
            General Consultation
          </span>
          <span className="badge bg-light text-dark border">₹500</span>
          <span className="badge bg-light text-primary border">
            Blood Tests
          </span>
          <span className="badge bg-light text-primary border">
            Vaccinations
          </span>
        </div>

        <button
  className="btn btn-light border d-flex align-items-center gap-2"
  onClick={(e) => {
    e.stopPropagation();   // ✅ prevents redirect
    setShowLoginPopup(true);
  }}
>

  <i className="bi bi-telephone"></i>
  Call
</button>

      </div>
    </div>
  ))}
</div>

              </div>
            );
          })}

    {/* ROWS */}
    {/* FOOTER */}
<footer className="container mt-5 py-4 border-top">
  <div className="row align-items-center text-center text-md-start">
    <div className="col-md-3 fw-bold text-primary">
      GWT-QR
    </div>

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
  
 {/* ================= LOGIN POPUP ================= */}
{showLoginPopup && (
  <div
    className="modal fade show"
    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered navy-modal">
      <div className="modal-content border-0 shadow-lg">
        <div className="modal-header">
          <h5 className="modal-title fw-bold">
            {mode === "login" ? "Customer Login" : "Customer Signup"}
          </h5>

          <button
            className="btn-close"
            onClick={() => setShowLoginPopup(false)}
          />
        </div>

        <div className="modal-body">
          {error && (
            <div className="text-danger small mb-2">{error}</div>
          )}

          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* SHOW ONLY IN SIGNUP */}
         {mode === "signup" && (
  <>
    <input
      type="password"
      className="form-control mb-2"
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />

    <input
      type="text"
      className="form-control mb-2"
      placeholder="Mobile"
      value={mobile}
      onChange={(e) => setMobile(e.target.value)}
    />
  </>
)}



          <button
            className="btn navy-btn w-100"
            onClick={
              mode === "login"
                ? handleCustomerLogin
                : handleCustomerSignup
            }
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>

          <div className="text-center mt-3">
            {mode === "login" ? (
              <small>
                Don’t have an account?{" "}
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setError("");
                    setMode("signup");
                  }}
                >
                  Sign Up
                </span>
              </small>
            ) : (
              <small>
                Already have an account?{" "}
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setError("");
                    setMode("login");
                  }}
                >
                  Login
                </span>
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{/* ================= END LOGIN POPUP ================= */}

      {/* ================= END LOGIN POPUP ================= */}

           
</React.Fragment>
  );
};

