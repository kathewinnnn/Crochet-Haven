import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../apiConfig';

const API_URL = `${API_BASE_URL}/products`;

const catStyles = `
  :root {
    --cream: #fdf6ec; --warm-white: #fffbf5; --blush: #f4a7b2;
    --rose: #e8728a; --deep-rose: #c4556b; --terracotta: #d4735e;
    --amber: #e8a45a; --sage: #8aab8e; --charcoal: #2c2420;
    --muted: #8a7a74; --border: rgba(212,115,94,0.15);
  }

  .ch-cats-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 0.7rem; letter-spacing: 0.24em; text-transform: uppercase;
    color: var(--terracotta); font-weight: 700; margin-bottom: 8px;
  }
  .ch-cats-eyebrow::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--terracotta); }
  .ch-cats-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800; color: var(--charcoal); letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 5px; }
  .ch-cats-title em { font-style: italic; color: var(--rose); }
  .ch-cats-subtitle { font-size: 0.85rem; color: var(--muted); font-weight: 300; margin-bottom: 32px; }

  .ch-cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }

  .ch-cat-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; transition: transform .25s ease, box-shadow .25s ease; }
  .ch-cat-card:hover { transform: translateY(-4px); box-shadow: 0 20px 56px rgba(44,36,32,.1); }

  .ch-carousel { position: relative; height: 200px; background: linear-gradient(135deg,#f7e8d8,#f0cfc4); overflow: hidden; }
  .ch-carousel-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s ease; }
  .ch-cat-card:hover .ch-carousel-img { transform: scale(1.04); }
  .ch-carousel-no-img { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; font-size: 3rem; background: linear-gradient(135deg,#f7e8d8,#f0cfc4); opacity: .6; }

  .ch-carousel-nav { position: absolute; top: 50%; transform: translateY(-50%); display: flex; justify-content: space-between; width: 100%; padding: 0 10px; pointer-events: none; }
  .ch-carousel-btn { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,.85); border: none; color: var(--charcoal); font-size: 1rem; display: flex; align-items: center; justify-content: center; cursor: pointer; pointer-events: all; transition: all .18s ease; box-shadow: 0 2px 8px rgba(44,36,32,.12); }
  .ch-carousel-btn:hover { background: var(--rose); color: #fff; transform: scale(1.1); }
  .ch-carousel-counter { position: absolute; bottom: 10px; right: 12px; background: rgba(44,36,32,.6); color: rgba(255,255,255,.9); font-size: 0.65rem; font-weight: 700; letter-spacing: .1em; padding: 3px 8px; border-radius: 2px; backdrop-filter: blur(4px); }

  .ch-cat-card-body { padding: 20px 20px 18px; }
  .ch-cat-card-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--charcoal); margin-bottom: 8px; line-height: 1.2; }
  .ch-cat-card-meta { display: flex; align-items: center; gap: 10px; }
  .ch-cat-card-count { display: inline-flex; align-items: center; gap: 5px; background: rgba(232,114,138,.1); color: var(--rose); font-size: 0.7rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; padding: 3px 9px; border-radius: 2px; }
  .ch-cat-card-images-count { font-size: 0.71rem; color: var(--muted); font-weight: 300; }

  .ch-cat-product-list { margin-top: 12px; border-top: 1px solid var(--border); padding-top: 12px; display: flex; flex-direction: column; gap: 5px; max-height: 110px; overflow-y: auto; }
  .ch-cat-product-list::-webkit-scrollbar { width: 3px; }
  .ch-cat-product-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .ch-cat-product-name { font-size: 0.77rem; color: var(--muted); font-weight: 300; display: flex; align-items: center; gap: 7px; }
  .ch-cat-product-name::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: var(--rose); opacity: .5; flex-shrink: 0; }

  .ch-cats-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 260px; gap: 14px; color: var(--muted); font-size: .83rem; }
  .ch-cats-loader { width: 32px; height: 32px; border: 2.5px solid rgba(232,114,138,.2); border-top-color: var(--rose); border-radius: 50%; animation: catSpin .8s linear infinite; }
  @keyframes catSpin { to { transform: rotate(360deg); } }

  .ch-empty-state { grid-column: 1/-1; padding: 72px 24px; text-align: center; color: var(--muted); font-size: .87rem; font-weight: 300; }
  .ch-empty-emoji { font-size: 2.8rem; display: block; margin-bottom: 12px; opacity: .45; }

  .ch-cat-card:nth-child(5n+1) .ch-carousel { background: linear-gradient(135deg,#f9e8d5,#f0d0bf); }
  .ch-cat-card:nth-child(5n+2) .ch-carousel { background: linear-gradient(135deg,#fde8ef,#f5ccd8); }
  .ch-cat-card:nth-child(5n+3) .ch-carousel { background: linear-gradient(135deg,#e8f4ea,#d0e8d3); }
  .ch-cat-card:nth-child(5n+4) .ch-carousel { background: linear-gradient(135deg,#e8eaf4,#cfd3e8); }
  .ch-cat-card:nth-child(5n+5) .ch-carousel { background: linear-gradient(135deg,#fdf4e0,#f5e2b8); }

  @media (max-width: 1024px) {
    .ch-cat-grid { grid-template-columns: repeat(2,1fr); gap: 14px; }
  }
  @media (max-width: 768px) {
    .ch-cats-title { font-size: 1.5rem; }
    .ch-cat-grid { grid-template-columns: 1fr; gap: 12px; }
    .ch-carousel { height: 160px; }
    .ch-cat-card-body { padding: 14px 14px 12px; }
  }
`;

const categoryEmojis = {
  "Accessories & Bouquet": "🌸", "Bags": "👜", "Clothing": "🧣",
  "Home Decor": "🏠", "Gift Sets": "🎁",
};

const Categories = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      const grouped = res.data.reduce((acc, p) => {
        if (!acc[p.category]) acc[p.category] = [];
        acc[p.category].push(p);
        return acc;
      }, {});
      setGroupedProducts(grouped);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const nextImage = (cat, len) => setCurrentImageIndex(p => ({ ...p, [cat]: ((p[cat] || 0) + 1) % len }));
  const prevImage = (cat, len) => setCurrentImageIndex(p => ({ ...p, [cat]: ((p[cat] || 0) - 1 + len) % len }));

  if (loading) return (
    <><style>{catStyles}</style>
      <div className="ch-cats-loading"><div className="ch-cats-loader" /><span>Loading categories…</span></div>
    </>
  );

  return (
    <>
      <style>{catStyles}</style>
      <p className="ch-cats-eyebrow">Browse</p>
      <h1 className="ch-cats-title">Product <em>Categories</em></h1>
      <p className="ch-cats-subtitle">
        {Object.keys(groupedProducts).length} categories · {Object.values(groupedProducts).reduce((s, p) => s + p.length, 0)} total products
      </p>

      <div className="ch-cat-grid">
        {Object.keys(groupedProducts).length === 0 ? (
          <div className="ch-empty-state"><span className="ch-empty-emoji">📁</span>No categories yet.</div>
        ) : (
          Object.keys(groupedProducts).map(category => {
            const products = groupedProducts[category];
            const allImages = products.flatMap(p => p.images || []);
            const idx = currentImageIndex[category] || 0;
            const emoji = categoryEmojis[category] || "🧶";
            return (
              <div key={category} className="ch-cat-card">
                <div className="ch-carousel">
                  {allImages.length > 0 ? (
                    <>
                      <img src={allImages[idx]} alt={category} className="ch-carousel-img" />
                      {allImages.length > 1 && (
                        <>
                          <div className="ch-carousel-nav">
                            <button className="ch-carousel-btn" onClick={() => prevImage(category, allImages.length)}>‹</button>
                            <button className="ch-carousel-btn" onClick={() => nextImage(category, allImages.length)}>›</button>
                          </div>
                          <span className="ch-carousel-counter">{idx + 1} / {allImages.length}</span>
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
                    {allImages.length > 0 && <span className="ch-cat-card-images-count">{allImages.length} image{allImages.length !== 1 ? "s" : ""}</span>}
                  </div>
                  <div className="ch-cat-product-list">
                    {products.map(p => (
                      <span key={p.id} className="ch-cat-product-name">
                        {p.name}
                        <span style={{ marginLeft: "auto", fontFamily: "'Playfair Display',serif", fontWeight: 600, color: "var(--charcoal)", fontSize: ".74rem" }}>
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
    </>
  );
};

export default Categories;