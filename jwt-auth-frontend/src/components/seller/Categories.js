import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../apiConfig';

const API_URL = `${API_BASE_URL}/products`;

const catStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Lato:wght@300;400;700&display=swap');

  :root {
    --cream: #fdf6ec;
    --warm-white: #fffbf5;
    --blush: #f4a7b2;
    --rose: #e8728a;
    --deep-rose: #c4556b;
    --terracotta: #d4735e;
    --amber: #e8a45a;
    --sage: #8aab8e;
    --charcoal: #2c2420;
    --muted: #8a7a74;
    --border: rgba(212, 115, 94, 0.15);
  }

  /* ─── HEADER ─── */
  .ch-header {
    position: relative;
    padding: 0;
    overflow: hidden;
    background: var(--warm-white);
    border-bottom: 1px solid var(--border);
    margin-left: -20%;
    width: 121%;
    margin-top: -40px;
  }

  .ch-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 52px 60px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    margin-right: -231px;
    margin-top: 10px;
  }

  .ch-logo-block { display: flex; align-items: center; gap: 16px; }

  .ch-logo-yarn {
    font-size: 2.8rem;
    animation: sway 4s ease-in-out infinite;
    display: inline-block;
    transform-origin: bottom center;
  }

  @keyframes sway {
    0%, 100% { transform: rotate(-4deg); }
    50% { transform: rotate(4deg); }
  }

  .ch-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--charcoal);
    line-height: 1;
  }

  .ch-logo-text span { color: var(--rose); }

  .ch-tagline {
    font-size: 0.78rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 6px;
    font-weight: 400;
  }

  .ch-cats {
    font-family: 'Lato', sans-serif;
    color: var(--charcoal);
    padding: 52px 56px;
    min-height: 100vh;
  }

  .ch-cats-header { margin-bottom: 44px; }

  .ch-cats-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 0.7rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--terracotta);
    font-weight: 700;
    margin-bottom: 10px;
  }

  .ch-cats-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--terracotta);
  }

  .ch-cats-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .ch-cats-title em { font-style: italic; color: var(--rose); }

  .ch-cats-subtitle { font-size: 0.86rem; color: var(--muted); font-weight: 300; }

  .ch-cat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .ch-cat-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .ch-cat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 56px rgba(44, 36, 32, 0.1);
  }

  .ch-carousel {
    position: relative;
    height: 200px;
    background: linear-gradient(135deg, #f7e8d8, #f0cfc4);
    overflow: hidden;
  }

  .ch-carousel-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  .ch-cat-card:hover .ch-carousel-img { transform: scale(1.04); }

  .ch-carousel-no-img {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 3rem;
    background: linear-gradient(135deg, #f7e8d8, #f0cfc4);
    opacity: 0.6;
  }

  .ch-carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 10px;
    pointer-events: none;
  }

  .ch-carousel-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.85);
    border: none;
    color: var(--charcoal);
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    pointer-events: all;
    transition: all 0.18s ease;
    box-shadow: 0 2px 8px rgba(44, 36, 32, 0.12);
  }

  .ch-carousel-btn:hover { background: var(--rose); color: #fff; transform: scale(1.1); }

  .ch-carousel-counter {
    position: absolute;
    bottom: 10px;
    right: 12px;
    background: rgba(44, 36, 32, 0.6);
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 3px 8px;
    border-radius: 2px;
    backdrop-filter: blur(4px);
  }

  .ch-cat-card-body { padding: 22px 22px 20px; }

  .ch-cat-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .ch-cat-card-meta { display: flex; align-items: center; gap: 12px; }

  .ch-cat-card-count {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(232, 114, 138, 0.1);
    color: var(--rose);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
  }

  .ch-cat-card-images-count { font-size: 0.72rem; color: var(--muted); font-weight: 300; }

  .ch-cat-product-list {
    margin-top: 14px;
    border-top: 1px solid var(--border);
    padding-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 120px;
    overflow-y: auto;
  }

  .ch-cat-product-list::-webkit-scrollbar { width: 3px; }
  .ch-cat-product-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .ch-cat-product-name {
    font-size: 0.78rem;
    color: var(--muted);
    font-weight: 300;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .ch-cat-product-name::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--rose);
    opacity: 0.5;
    flex-shrink: 0;
  }

  .ch-cats-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .ch-cats-loader {
    width: 36px;
    height: 36px;
    border: 2.5px solid rgba(232, 114, 138, 0.2);
    border-top-color: var(--rose);
    border-radius: 50%;
    animation: chSpin 0.8s linear infinite;
  }

  .ch-empty-state {
    grid-column: 1 / -1;
    padding: 80px 28px;
    text-align: center;
    color: var(--muted);
    font-size: 0.88rem;
    font-weight: 300;
  }

  .ch-empty-emoji { font-size: 3rem; display: block; margin-bottom: 12px; opacity: 0.45; }

  .ch-cat-card:nth-child(5n+1) .ch-carousel { background: linear-gradient(135deg, #f9e8d5, #f0d0bf); }
  .ch-cat-card:nth-child(5n+2) .ch-carousel { background: linear-gradient(135deg, #fde8ef, #f5ccd8); }
  .ch-cat-card:nth-child(5n+3) .ch-carousel { background: linear-gradient(135deg, #e8f4ea, #d0e8d3); }
  .ch-cat-card:nth-child(5n+4) .ch-carousel { background: linear-gradient(135deg, #e8eaf4, #cfd3e8); }
  .ch-cat-card:nth-child(5n+5) .ch-carousel { background: linear-gradient(135deg, #fdf4e0, #f5e2b8); }

  @keyframes chSpin { to { transform: rotate(360deg); } }

  /* ─── FOOTER ─── */
  .ch-footer {
    position: relative;
    z-index: 1;
    background: var(--warm-white);
    border-top: 1px solid var(--border);
    padding: 32px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: -5%;
    width: 98.5%;
    margin-bottom: -17.5px;
  }

  .ch-footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--charcoal);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ch-footer-copy { font-size: 0.78rem; color: var(--muted); letter-spacing: 0.04em; }

  /* ─── TABLET (769px – 1024px) ─── */
  @media (min-width: 769px) and (max-width: 1024px) {
    .ch-header { margin-left: -5%; width: 110%; }
    .ch-header-inner { padding: 32px 32px 28px; margin-right: 0; }
    .ch-cats { padding: 36px 32px; }
    .ch-cats-title { font-size: 1.9rem; }
    .ch-cat-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .ch-footer { margin-left: -3%; width: 106%; padding: 24px 32px; }
  }

  /* ─── MOBILE (≤ 768px) ─── */
  @media (max-width: 768px) {
    .ch-header { display: none; }
    .ch-cats { padding: 80px 16px 24px; }
    .ch-cats-title { font-size: 1.6rem; }
    .ch-cats-header { margin-bottom: 28px; }
    .ch-cat-grid { grid-template-columns: 1fr; gap: 14px; }
    .ch-carousel { height: 160px; }
    .ch-cat-card-body { padding: 16px 16px 14px; }
    .ch-footer {
      margin-left: 0;
      width: 100%;
      padding: 20px 16px;
      flex-direction: column;
      gap: 6px;
      text-align: center;
    }
  }
`;

const categoryEmojis = {
  "Accessories & Bouquet": "🌸",
  "Bags": "👜",
  "Clothing": "🧣",
  "Home Decor": "🏠",
  "Gift Sets": "🎁",
};

const Categories = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      const products = response.data;
      const grouped = products.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
      }, {});
      setGroupedProducts(grouped);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = (category, imagesLength) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [category]: ((prev[category] || 0) + 1) % imagesLength,
    }));
  };

  const prevImage = (category, imagesLength) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [category]: ((prev[category] || 0) - 1 + imagesLength) % imagesLength,
    }));
  };

  if (loading) {
    return (
      <div className="ch-cats">
        <style>{catStyles}</style>
        <div className="ch-cats-loading">
          <div className="ch-cats-loader" />
          <span>Loading categories…</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="ch-header">
        <div className="ch-header-inner">
          <div className="ch-logo-block">
            <span className="ch-logo-yarn">🧶</span>
            <div>
              <div className="ch-logo-text">Crochet <span>Haven</span></div>
              <div className="ch-tagline">Stitched with love, for you</div>
            </div>
          </div>
        </div>
      </header>
      <style>{catStyles}</style>
      <div className="ch-cats">
        <div className="ch-cats-header">
          <p className="ch-cats-eyebrow">Browse</p>
          <h1 className="ch-cats-title">Product <em>Categories</em></h1>
          <p className="ch-cats-subtitle">
            {Object.keys(groupedProducts).length} categories · {Object.values(groupedProducts).reduce((s, p) => s + p.length, 0)} total products
          </p>
        </div>

        <div className="ch-cat-grid">
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="ch-empty-state">
              <span className="ch-empty-emoji">📁</span>
              No categories yet. Add some products first.
            </div>
          ) : (
            Object.keys(groupedProducts).map((category) => {
              const products = groupedProducts[category];
              const allImages = products.flatMap((p) => p.images || []);
              const currentIndex = currentImageIndex[category] || 0;
              const emoji = categoryEmojis[category] || "🧶";

              return (
                <div key={category} className="ch-cat-card">
                  <div className="ch-carousel">
                    {allImages.length > 0 ? (
                      <>
                        <img src={allImages[currentIndex]} alt={`${category}`} className="ch-carousel-img" />
                        {allImages.length > 1 && (
                          <>
                            <div className="ch-carousel-nav">
                              <button className="ch-carousel-btn" onClick={() => prevImage(category, allImages.length)} aria-label="Previous">‹</button>
                              <button className="ch-carousel-btn" onClick={() => nextImage(category, allImages.length)} aria-label="Next">›</button>
                            </div>
                            <span className="ch-carousel-counter">{currentIndex + 1} / {allImages.length}</span>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="ch-carousel-no-img"><span>{emoji}</span></div>
                    )}
                  </div>

                  <div className="ch-cat-card-body">
                    <div className="ch-cat-card-name">{category}</div>
                    <div className="ch-cat-card-meta">
                      <span className="ch-cat-card-count">{products.length} {products.length === 1 ? "product" : "products"}</span>
                      {allImages.length > 0 && (
                        <span className="ch-cat-card-images-count">{allImages.length} image{allImages.length !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                    <div className="ch-cat-product-list">
                      {products.map((p) => (
                        <span key={p.id} className="ch-cat-product-name">
                          {p.name}
                          <span style={{ marginLeft: "auto", fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "var(--charcoal)", fontSize: "0.75rem" }}>
                            ₱{parseFloat(p.price).toFixed(2)}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <footer className="ch-footer">
        <div className="ch-footer-logo">🧶 Crochet Haven</div>
        <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
      </footer>
    </>
  );
};

export default Categories;