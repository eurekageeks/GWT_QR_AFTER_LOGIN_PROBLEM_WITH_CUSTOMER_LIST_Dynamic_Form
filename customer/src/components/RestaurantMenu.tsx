'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://127.0.0.1:5000/api';
const IMAGE_BASE = 'http://127.0.0.1:5000';

/* 🔥 UNSPLASH SLIDER CONTENT */
const HOVER_MEDIA = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1550547660-d9450f859349' },
  { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-hd_1280_720_25fps.mp4' },
];

interface Food {
  _id: string;
  name: string;
  price: number;
  category: any;
  image?: string;
  rating?: number;
}

interface CartItem extends Food {
  quantity: number;
}

/* ⭐ STAR RATING (MODAL ONLY) */
function StarRating({ value = 0, onChange }: { value: number; onChange: (r: number) => void }) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="d-flex justify-content-center gap-2">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            cursor: 'pointer',
            fontSize: 30,
            transform: hover === star ? 'scale(1.2)' : 'scale(1)',
            transition: '0.15s',
            color: (hover ?? value) >= star ? '#ffc107' : '#ccc',
          }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function RestaurantMenu() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = useRef<any>(null);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  useEffect(() => {
    axios.get(`${API_URL}/foods`).then(res =>
      setFoods(res.data.map((f: Food) => ({ ...f, rating: f.rating ?? 0 })))
    );
  }, []);

  useEffect(() => {
    if (!hoveredId) return;
    sliderRef.current = setInterval(
      () => setSlideIndex(i => (i + 1) % HOVER_MEDIA.length),
      2500
    );
    return () => {
      clearInterval(sliderRef.current);
      setSlideIndex(0);
    };
  }, [hoveredId]);

  const getImageUrl = (img?: string) =>
    img?.startsWith('http') ? img : `${IMAGE_BASE}${img || ''}`;

  const addItem = (food: Food) => {
    setCart(prev => {
      const found = prev.find(i => i._id === food._id);
      return found
        ? prev.map(i => (i._id === food._id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { ...food, quantity: 1 }];
    });
  };

  const removeItem = (food: Food) => {
    setCart(prev =>
      prev
        .map(i => (i._id === food._id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter(i => i.quantity > 0)
    );
  };

  const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div
      className="min-vh-100 text-white"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,.7)),url(https://images.unsplash.com/photo-1504674900247-0877df9cc836)',
        backgroundSize: 'cover',
      }}
    >
      <div className="container py-5">
        <h1 className="text-center fw-bold mb-4">🍽️ Vikram Restaurant</h1>

        <div className="row g-4">
          {foods.map(food => {
            const qty = cart.find(i => i._id === food._id)?.quantity || 0;
            const isHovered = hoveredId === food._id;
            const media = HOVER_MEDIA[slideIndex];

            return (
              <div key={food._id} className="col-md-6 col-lg-4">
                <div
                  className="card h-100 border-0 shadow-lg position-relative"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: 18 }}
                  onMouseEnter={() => setHoveredId(food._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {food.rating! > 0 && (
                    <div className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded-pill"
                      style={{ background: 'rgba(0,0,0,.65)', fontSize: 13 }}>
                      ⭐ {food.rating?.toFixed(1)}
                    </div>
                  )}

                  <button
                    className="position-absolute top-0 end-0 m-2 btn btn-sm btn-dark rounded-circle"
                    onClick={() => {
                      setSelectedFood(food);
                      setShowRatingModal(true);
                    }}
                  >
                    ⭐
                  </button>

                  {isHovered && media.type === 'video' ? (
                    <video src={media.src} autoPlay muted loop className="card-img-top" style={{ height: 220 }} />
                  ) : (
                    <img
                      src={isHovered ? `${media.src}?w=800` : getImageUrl(food.image)}
                      className="card-img-top"
                      style={{ height: 220, objectFit: 'cover' }}
                    />
                  )}

                  <div className="card-body text-white">
                    <h5 className="fw-bold">{food.name}</h5>
                    <p className="fw-bold text-warning fs-5">₹{food.price}</p>

                    {qty === 0 ? (
                      <button className="btn btn-warning w-100 fw-bold" onClick={() => addItem(food)}>
                        Add To Cart
                      </button>
                    ) : (
                      <div className="d-flex justify-content-between bg-dark rounded-pill px-3 py-2">
                        <button className="btn btn-sm btn-light" onClick={() => removeItem(food)}>−</button>
                        <span>{qty}</span>
                        <button className="btn btn-sm btn-light" onClick={() => addItem(food)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🛒 RIGHT SIDE CART POPUP */}
      {cart.length > 0 && (
        <div
          className="position-fixed top-50 end-0 translate-middle-y p-3 shadow-lg"
          style={{
            width: 280,
            background: 'rgba(0,0,0,.85)',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            zIndex: 999,
          }}
        >
          <h6 className="fw-bold mb-3">🛒 Your Cart</h6>

          {cart.map(item => (
            <div key={item._id} className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div className="small fw-bold">{item.name}</div>
                <div className="small text-warning">₹{item.price} × {item.quantity}</div>
              </div>
              <div className="d-flex gap-1">
                <button className="btn btn-sm btn-light" onClick={() => removeItem(item)}>−</button>
                <button className="btn btn-sm btn-light" onClick={() => addItem(item)}>+</button>
              </div>
            </div>
          ))}

          <hr className="border-secondary" />
          <div className="fw-bold text-warning text-end">Total ₹{totalAmount}</div>
        </div>
      )}

      {/* ⭐ RATING MODAL */}
      {showRatingModal && selectedFood && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 16 }}>
              <div className="modal-header">
                <h5 className="modal-title">Rate {selectedFood.name}</h5>
                <button className="btn-close" onClick={() => setShowRatingModal(false)} />
              </div>
              <div className="modal-body text-center">
                <StarRating
                  value={selectedFood.rating ?? 0}
                  onChange={r =>
                    setFoods(prev =>
                      prev.map(f => (f._id === selectedFood._id ? { ...f, rating: r } : f))
                    )
                  }
                  
                />
              </div>
            </div>
          </div>
        </div>
        
      )}
      <footer
  className="mt-5 pt-4 pb-3 text-light"
  style={{
    background: 'rgba(0,0,0,0.9)',
    backdropFilter: 'blur(6px)',
  }}
>
  <div className="container">
    <div className="row gy-4">
      {/* BRAND */}
      <div className="col-md-4">
        <h5 className="fw-bold mb-3">Eureka Geeks</h5>
        <p className="small text-secondary">
          Building innovative digital solutions for modern businesses.
        </p>
      </div>

      {/* CONTACT */}
      <div className="col-md-5">
        <h6 className="fw-bold mb-3">Contact Us</h6>
        <p className="small mb-1">
          <strong>Head Office:</strong><br />
          C-167, Omicron 1, 6% Abadi,<br />
          Greater Noida – 201310
        </p>
        <p className="small mb-0 mt-2">
          <strong>Branch Offices:</strong><br />
          Earthcon Sanskriti, Noida Extension<br />
          Kannampalayam, Coimbatore,<br />
          Tamil Nadu – 641402
        </p>
      </div>

      {/* COPYRIGHT */}
      <div className="col-md-3 text-md-end">
        <h6 className="fw-bold mb-3">Legal</h6>
        <p className="small text-secondary mb-0">
          © {new Date().getFullYear()} <strong>Eureka Geeks</strong><br />
          All Rights Reserved.
        </p>
      </div>
    </div>

    <hr className="border-secondary mt-4" />

    <div className="text-center small text-secondary">
      Designed & Developed by <strong>Eureka Geeks</strong>
    </div>
  </div>
</footer>

    </div>
  );
}
