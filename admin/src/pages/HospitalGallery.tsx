import React, { useEffect, useState } from "react";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";

const images = [
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
  "https://images.unsplash.com/photo-1504439468489-c8920d796a29",
  "https://images.unsplash.com/photo-1551190822-a9333d879b1f",
  "https://images.unsplash.com/photo-1551190822-a9333d879b1f",
  "https://images.unsplash.com/photo-1551190822-a9333d879b1f",
];

export default function HospitalGallery() {
  const [loading, setLoading] = useState(true);

  // WAIT 2 SECONDS
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // RUN ANIMATION AFTER LOADING
  useEffect(() => {
    if (!loading) {
      $(".gallery-img").each(function (i) {
        const el = $(this);

        el.css({
          transform: "rotateY(90deg)",
          opacity: 0,
        });

        setTimeout(() => {
          el.css({
            transform: "rotateY(0deg)",
            opacity: 1,
          });
        }, i * 120);
      });
    }
  }, [loading]);

  // LOADER UI
  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        {/* Smart Loader */}
        <div className="smart-loader mb-3">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p className="text-muted">Preparing gallery...</p>

        {/* Loader CSS */}
        <style>{`
          .smart-loader {
            display: flex;
            gap: 10px;
          }

          .smart-loader span {
            width: 14px;
            height: 14px;
            background: #0d6efd;
            border-radius: 50%;
            animation: bounce 0.6s infinite alternate;
          }

          .smart-loader span:nth-child(2) {
            animation-delay: 0.2s;
          }

          .smart-loader span:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes bounce {
            from {
              transform: translateY(0);
              opacity: 0.5;
            }
            to {
              transform: translateY(-12px);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h3
  className="mb-4"
  style={{ backgroundColor: "skyblue", padding: "10px", borderRadius: "6px" ,textAlign  : "center" }}
>
  Hospital Gallery
</h3>


      <div className="row g-3">
        {images.map((img, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4">
            <img
              src={img}
              alt="Hospital"
              className="img-fluid rounded shadow gallery-img"
              style={{
                height: "220px",
                width: "100%",
                objectFit: "cover",
                transition: "transform 0.6s ease, opacity 0.6s ease",
                transformStyle: "preserve-3d",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
