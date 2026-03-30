import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";


interface Business {
  _id: string;
  image?: string | null;
  category: string;
  sub_category: string;
}




const Frontend: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const navigate = useNavigate();
  /* ---------------- RESPONSIVE CAROUSEL ---------------- */
  const getChipsPerSlide = () => {
    if (window.innerWidth < 576) return 1;
    if (window.innerWidth < 768) return 2;
    return 3;
  };
const [categories, setCategories] = useState<{ name: string; icon: string }[]>([
  { name: "All", icon: "✨" }, // default
]);
const visibleCount = 4;



const [startIndex, setStartIndex] = useState(0);
const otherCategories = categories.slice(1);


  const [chipsPerSlide, setChipsPerSlide] = useState(getChipsPerSlide());
  const [activeSlide, setActiveSlide] = useState(0);
  
  const fetchCategories = async () => {
  try {
    const res = await axios.get(`${ADMIN_BACKEND}/api/admin/categories`);

    // map icon (optional)
    const data = res.data.map((c: any) => ({
      name: c.name,
      icon: "📌", // you can customize per category later
    }));

    setCategories([{ name: "All", icon: "✨" }, ...data]);
  } catch (err) {
    console.log("Category fetch error");
  }
};

 useEffect(() => {
  fetchBusinesses();
  fetchCategories();   // ⭐ ADD THIS
}, []);

const goLeft = () => {
  setStartIndex((prev) => Math.max(prev - visibleCount, 0));
};

const goRight = () => {
  setStartIndex((prev) =>
    Math.min(
      prev + visibleCount,
      Math.max(otherCategories.length - visibleCount, 0)
    )
  );
};

  const slides: typeof categories[] = [];
  for (let i = 0; i < categories.length; i += chipsPerSlide) {
    slides.push(categories.slice(i, i + chipsPerSlide));
  }
  /* ---------------------------------------------------- */

  const ADMIN_BACKEND =
    import.meta.env.VITE_ADMIN_BACKEND_URL || "http://127.0.0.1:9000";

  const ADMIN_FRONTEND_LOGIN =
    import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173/login";

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get(`${ADMIN_BACKEND}/api/admin/businesses`);
      setBusinesses(res.data);
    } catch {
      setError("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };
const [navOpen, setNavOpen] = useState(false);

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sub_category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      b.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  if (loading)
    return <div className="text-center py-5">Loading businesses...</div>;

  if (error)
    return <div className="text-center text-danger py-5">{error}</div>;

  return (
    <div style={{ background: "#f7f9fc", minHeight: "100vh" }}>
     {/* NAVBAR */}
{/* NAVBAR */}
<nav className="navbar bg-white shadow-sm rounded-pill mx-2 mx-md-4 mt-3 px-3 px-md-4">
  <div className="container-fluid">

    {/* LEFT: BRAND */}
    <div className="d-flex align-items-center gap-2">
      <img
        src="src/assets/qr.png"
        alt="GWT-QR Logo"
        style={{ height: 32, width: 32 }}
      />
      <span className="fw-bold text-primary fs-4">GWT-QR</span>
    </div>

    {/* MOBILE TOGGLER */}
    <button
      className="btn d-md-none"
      onClick={() => setNavOpen(!navOpen)}
      aria-label="Toggle navigation"
    >
      ☰
    </button>

    {/* CENTER LINKS + RIGHT LOGIN */}
    <div
      className={`${
        navOpen ? "d-flex" : "d-none"
      } d-md-flex flex-column flex-md-row align-items-center gap-3 gap-md-4 ms-md-auto`}
    >
      

      {/* RIGHT: LOGIN */}
      <button
        className="btn btn-primary rounded-pill px-4 ms-md-3"
        onClick={() => (window.location.href = ADMIN_FRONTEND_LOGIN)}
      >
        Log in
      </button>
    </div>

  </div>
</nav>



      {/* HERO */}
      <div className="container text-center mt-5">
        <h1 className="fw-bold display-6">Find Trusted Services Near You</h1>
        <p className="text-muted">
          Healthcare, Home services, Education & Training & more — verified local businesses.
        </p>

        {/* SEARCH */}
        <div
          className="mx-auto bg-white shadow-sm rounded-pill d-flex align-items-center px-4"
          style={{ maxWidth: 700, height: 56 }}
        >
          🔍
          <input
            className="form-control border-0 ms-3"
            placeholder="Search Healthcare, Home services, Education & Training"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="ms-auto text-success fw-semibold text-nowrap d-none d-md-inline">
            📍 Near you
          </span>
        </div>

{/* CATEGORY SLIDER */}
{/* CATEGORY FILTER WITH ARROWS */}
{/* CATEGORY FILTER */}
{/* CATEGORY FILTER */}
<div
  className="bg-white position-sticky top-0 z-3 py-3 mt-4"
  style={{ borderBottom: "1px solid #eee" }}
>
  {/* ✅ MOBILE DROPDOWN */}
  <div className="mobile-category-dropdown">
    <select
      className="form-select rounded-pill"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      {categories.map((c) => (
        <option key={c.name} value={c.name}>
          {c.icon} {c.name}
        </option>
      ))}
    </select>
  </div>

  {/* ✅ DESKTOP SLIDER */}
  <div className="desktop-category-slider d-flex align-items-center justify-content-center">

    {/* ALL FIXED */}
    <button
      onClick={() => setSelectedCategory("All")}
      className="border-0 rounded-pill px-4 py-2 fw-semibold me-2"
      style={{
        background: selectedCategory === "All" ? "#0d6efd" : "#f1f3f5",
        color: selectedCategory === "All" ? "#fff" : "#333",
      }}
    >
      ✨ All
    </button>

    {/* LEFT */}
    <button
      onClick={goLeft}
      disabled={startIndex === 0}
      className="btn btn-light rounded-circle shadow me-2"
      style={{ width: 45, height: 45 }}
    >
      ‹
    </button>

    {/* CATEGORY BUTTONS */}
    <div className="d-flex gap-3 flex-nowrap overflow-hidden">
      {otherCategories
        .slice(startIndex, startIndex + visibleCount)
        .map((c) => (
          <button
            key={c.name}
            onClick={() => setSelectedCategory(c.name)}
            className="border-0 rounded-pill px-4 py-2 fw-semibold"
            style={{
              background:
                selectedCategory === c.name ? "#0d6efd" : "#f1f3f5",
              color: selectedCategory === c.name ? "#fff" : "#333",
            }}
          >
            <span className="me-2">{c.icon}</span>
            {c.name}
          </button>
        ))}
    </div>

    {/* RIGHT */}
    <button
      onClick={goRight}
      disabled={startIndex + visibleCount >= otherCategories.length}
      className="btn btn-light rounded-circle shadow ms-2"
      style={{ width: 45, height: 45 }}
    >
      ›
    </button>

  </div>
</div>

      {/* BUSINESS CARDS */}
      <div className="container mt-5">
        <div className="row g-4">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((b) => (
              <div key={b._id} className="col-6 col-sm-3 col-md-2">
                <div
  className="card border-0 shadow-sm rounded-4 h-100"
  style={{ cursor: "pointer" }}
  onClick={() => {
    if (b.category.toLowerCase() === "health & medical") {
      navigate("/healthcare-directory");
    }
  }}
>

                  <img
                    src={
                      b.image
                        ? `${ADMIN_BACKEND}${b.image}`
                        : "https://via.placeholder.com/400x220"
                    }
                    className="card-img-top rounded-top-4"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                 <div className="card-body">
  <span
    className="badge bg-light text-primary mb-2 align-self-start mx-auto text-wrap"
    style={{ maxWidth: "100%" }}
  >
    {b.category}
  </span>
</div>

                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted py-5">
              No businesses found
            </div>
          )}
        </div>
      </div>
      {/* HOW IT WORKS */}
<section className="container my-5">
  <h2 className="text-center fw-bold mb-4">How it Works</h2>

  <div className="row g-4">
    <div className="col-md-4">
      <div className="bg-white shadow-sm rounded-4 p-4 h-100">
        <div className="d-flex align-items-start gap-3">
          <div className="fs-3">🔍</div>
          <div>
            <h6 className="fw-semibold mb-1">Search a service</h6>
            <p className="text-muted small mb-0">
              Clinics, kendra, Agra, Shamli
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="bg-white shadow-sm rounded-4 p-4 h-100">
        <div className="d-flex align-items-start gap-3">
          <div className="fs-3">📋</div>
          <div>
            <h6 className="fw-semibold mb-1">Compare nearby options</h6>
            <p className="text-muted small mb-0">
              Find trusted services near you
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="bg-white shadow-sm rounded-4 p-4 h-100">
        <div className="d-flex align-items-start gap-3">
          <div className="fs-3">📞</div>
          <div>
            <h6 className="fw-semibold mb-1">Contact instantly</h6>
            <p className="text-muted small mb-0">
              Connect with businesses anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

   {/* TRUST SECTION */}
<section className="container my-5">
  <div className="bg-light rounded-4 p-5 shadow-sm">
    <div className="row text-center g-4">
      <div className="col-md-4">
        <div className="d-flex justify-content-center align-items-center gap-2">
          <span className="fs-4">✅</span>
          <span className="fw-semibold">Verified Businesses</span>
        </div>
      </div>

      <div className="col-md-4">
        <div className="d-flex justify-content-center align-items-center gap-2">
          <span className="fs-4">⭐</span>
          <span className="fw-semibold">Genuine Reviews</span>
        </div>
      </div>

      <div className="col-md-4">
        <div className="d-flex justify-content-center align-items-center gap-2">
          <span className="fs-4">📍</span>
          <span className="fw-semibold">Local & Reliable</span>
        </div>
      </div>
    </div>
  </div>
</section>


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
    </div>
   <style>{`
/* ================= MOBILE CATEGORY DROPDOWN ================= */

.mobile-category-dropdown {
  display: none;
  padding: 0 15px;
}

.mobile-category-dropdown select {
  height: 44px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* ================= RESPONSIVE SWITCH ================= */

@media (max-width: 768px) {

  /* Show dropdown */
  .mobile-category-dropdown {
    display: block;
  }

  /* Hide slider */
  .desktop-category-slider {
    display: none !important;
  }
}
/* ================= NAVBAR ================= */

.navbar {
  border-radius: 50px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* REMOVE COLLAPSE COMPLETELY ON MOBILE */
@media (max-width: 768px) {

  /* Hide hamburger button */
  .navbar button.d-md-none {
    display: none !important;
  }

  /* Always show login container */
  .navbar .d-none.d-md-flex,
  .navbar .d-flex.d-md-flex {
    display: flex !important;
  }

  /* Make navbar single row */
  .navbar .container-fluid {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
  }

  /* Remove column stacking */
  .navbar .flex-column {
    flex-direction: row !important;
  }

  /* Push login to right */
  .navbar .ms-md-auto {
    margin-left: auto !important;
  }

  /* Small login button */
  .navbar .btn-primary {
    padding: 6px 14px !important;
    font-size: 14px !important;
    border-radius: 20px !important;
  }
}


/* ================= SEARCH ================= */

@media (max-width: 768px) {
  .container .rounded-pill.d-flex {
    width: 95% !important;
    height: 48px !important;
    padding: 0 16px !important;
  }
}


/* ================= CATEGORY FILTER FIX ================= */

/* Desktop */
.bg-white.position-sticky {
  background: #fff !important;
  padding: 16px 0;
  margin-top: 30px;
  border-bottom: 1px solid #eee;
}

/* Mobile Fix */
@media (max-width: 768px) {

  .bg-white.position-sticky {
    padding: 10px 0 !important;
  }

  /* Make filter scrollable */
  .bg-white.position-sticky > div {
    justify-content: flex-start !important;
    overflow-x: auto !important;
    padding: 0 10px;
    gap: 10px;
  }

  /* Hide scrollbar */
  .bg-white.position-sticky > div::-webkit-scrollbar {
    display: none;
  }

  /* Make buttons smaller */
  .bg-white.position-sticky button {
    padding: 6px 14px !important;
    font-size: 14px;
    white-space: nowrap;
  }

  /* Reduce arrow button size */
  .bg-white.position-sticky .btn.rounded-circle {
    width: 36px !important;
    height: 36px !important;
  }
}


/* ================= CARDS ================= */

.card {
  transition: all 0.3s ease;
  border-radius: 20px !important;
}

.card:hover {
  transform: translateY(-4px);
}

.card img {
  height: 200px;
  object-fit: cover;
}

/* Tablet */
@media (max-width: 992px) {
  .col-md-2 {
    flex: 0 0 25%;
    max-width: 25%;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .col-6.col-sm-3.col-md-2 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .card img {
    height: 150px;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .col-6.col-sm-3.col-md-2 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}


/* ================= FOOTER ================= */

@media (max-width: 768px) {
  footer .row {
    text-align: center !important;
  }

  footer .col-md-6 {
    flex-direction: column;
    gap: 8px !important;
  }
}

`}</style>
    </div>
    
  );
};

export default Frontend;
