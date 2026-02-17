import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/products";

const dashStyles = `
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

  .ch-logo-block {
    display: flex;
    align-items: center;
    gap: 16px;
  }

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

  .ch-logo-text span {
    color: var(--rose);
  }

  .ch-tagline {
    font-size: 0.78rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 6px;
    font-weight: 400;
  }

  .ch-dash {
    font-family: 'Lato', sans-serif;
    color: var(--charcoal);
    padding: 52px 56px;
    min-height: 100vh;
    position: relative;
  }

  .ch-dash-header {
    margin-bottom: 44px;
  }

  .ch-dash-eyebrow {
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

  .ch-dash-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--terracotta);
  }

  .ch-dash-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .ch-dash-title em {
    font-style: italic;
    color: var(--rose);
  }

  .ch-dash-subtitle {
    font-size: 0.88rem;
    color: var(--muted);
    font-weight: 300;
  }

  /* Stat cards */
  .ch-stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 48px;
  }

  .ch-stat-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 28px 28px 24px;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .ch-stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(44, 36, 32, 0.09);
  }

  .ch-stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  .ch-stat-card:nth-child(1)::before { background: linear-gradient(90deg, var(--rose), var(--blush)); }
  .ch-stat-card:nth-child(2)::before { background: linear-gradient(90deg, var(--terracotta), var(--amber)); }
  .ch-stat-card:nth-child(3)::before { background: linear-gradient(90deg, var(--sage), #c5dfc8); }
  .ch-stat-card:nth-child(4)::before { background: linear-gradient(90deg, var(--amber), #f5d4a0); }

  .ch-stat-card-icon {
    font-size: 1.6rem;
    margin-bottom: 16px;
    display: block;
    line-height: 1;
  }

  .ch-stat-card-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--charcoal);
    line-height: 1;
    letter-spacing: -0.03em;
    display: block;
    margin-bottom: 6px;
  }

  .ch-stat-card-label {
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
  }

  /* Product list section */
  .ch-dash-section {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .ch-dash-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 28px;
    border-bottom: 1px solid var(--border);
  }

  .ch-dash-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--charcoal);
  }

  .ch-dash-section-badge {
    background: rgba(232, 114, 138, 0.1);
    color: var(--rose);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
  }

  .ch-product-table {
    width: 100%;
    border-collapse: collapse;
  }

  .ch-product-table thead tr {
    background: rgba(253, 246, 236, 0.7);
  }

  .ch-product-table th {
    text-align: left;
    padding: 12px 28px;
    font-size: 0.65rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
    border-bottom: 1px solid var(--border);
  }

  .ch-product-table tbody tr {
    border-bottom: 1px solid rgba(212, 115, 94, 0.08);
    transition: background 0.15s ease;
  }

  .ch-product-table tbody tr:last-child { border-bottom: none; }
  .ch-product-table tbody tr:hover { background: rgba(253, 246, 236, 0.6); }

  .ch-product-table td {
    padding: 14px 28px;
    font-size: 0.85rem;
    color: var(--charcoal);
    vertical-align: middle;
  }

  .ch-product-table td:first-child {
    font-weight: 400;
    max-width: 280px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ch-product-cat-tag {
    display: inline-block;
    background: rgba(212, 115, 94, 0.08);
    color: var(--terracotta);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 2px;
  }

  .ch-product-price-cell {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    font-size: 0.92rem;
    color: var(--charcoal);
  }

  .ch-empty-state {
    padding: 64px 28px;
    text-align: center;
    color: var(--muted);
    font-size: 0.88rem;
    font-weight: 300;
  }

  .ch-empty-state-emoji {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .ch-dash-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
    color: var(--muted);
    font-size: 0.85rem;
    font-family: 'Lato', sans-serif;
  }

  .ch-dash-loader {
    width: 36px;
    height: 36px;
    border: 2.5px solid rgba(232, 114, 138, 0.2);
    border-top-color: var(--rose);
    border-radius: 50%;
    animation: chSpin 0.8s linear infinite;
  }

  @keyframes chSpin { to { transform: rotate(360deg); } }

  /* Summary row */
  .ch-cat-summary {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }

  .ch-cat-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 0.78rem;
    color: var(--muted);
  }

  .ch-cat-pill-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--rose);
    flex-shrink: 0;
  }

  .ch-cat-pill strong {
    color: var(--charcoal);
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .ch-dash { padding: 32px 24px; }
    .ch-dash-title { font-size: 1.8rem; }
    .ch-product-table { display: none; }
  }
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

  .ch-footer-copy {
    font-size: 0.78rem;
    color: var(--muted);
    letter-spacing: 0.04em;
  }
`;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.allSettled([
        axios.get(API_URL),
        fetch("http://localhost:5000/orders").then((r) => r.json()),
      ]);
      if (productsRes.status === "fulfilled") setProducts(productsRes.value.data);
      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;
  const totalCategories = new Set(products.map((p) => p.category)).size;
  const totalValue = products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);
  const totalOrders = orders.length;

  const groupedByCategory = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="ch-dash">
        <style>{dashStyles}</style>
        <div className="ch-dash-loading">
          <div className="ch-dash-loader" />
          <span>Loading dashboard…</span>
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
      <style>{dashStyles}</style>
      <div className="ch-dash">
        {/* Header */}
        <div className="ch-dash-header">
          <p className="ch-dash-eyebrow">Overview</p>
          <h1 className="ch-dash-title">
            Seller <em>Dashboard</em>
          </h1>
          <p className="ch-dash-subtitle">Everything at a glance — your shop, your numbers.</p>
        </div>

        {/* Stat cards */}
        <div className="ch-stat-grid">
          {[
            { icon: "🛍️", num: totalProducts, label: "Total Products" },
            { icon: "📁", num: totalCategories, label: "Categories" },
            { icon: "📦", num: totalOrders, label: "Total Orders" },
            { icon: "💰", num: `₱${totalValue.toFixed(2)}`, label: "Inventory Value" },
          ].map((s, i) => (
            <div key={i} className="ch-stat-card">
              <span className="ch-stat-card-icon">{s.icon}</span>
              <span className="ch-stat-card-num">{s.num}</span>
              <span className="ch-stat-card-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Category pills */}
        {Object.keys(groupedByCategory).length > 0 && (
          <div className="ch-cat-summary">
            {Object.entries(groupedByCategory).map(([cat, count]) => (
              <div key={cat} className="ch-cat-pill">
                <div className="ch-cat-pill-dot" />
                {cat} — <strong>{count}</strong>
              </div>
            ))}
          </div>
        )}

        {/* Product table */}
        <div className="ch-dash-section">
          <div className="ch-dash-section-head">
            <span className="ch-dash-section-title">All Products</span>
            <span className="ch-dash-section-badge">{totalProducts} items</span>
          </div>

          {products.length === 0 ? (
            <div className="ch-empty-state">
              <span className="ch-empty-state-emoji">🧶</span>
              No products yet. Add your first one!
            </div>
          ) : (
            <table className="ch-product-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>
                      <span className="ch-product-cat-tag">{product.category}</span>
                    </td>
                    <td className="ch-product-price-cell">₱{parseFloat(product.price).toFixed(2)}</td>
                    <td style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{product.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* ── FOOTER ── */}
        <footer className="ch-footer">
          <div className="ch-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>
    </>
  );
};

export default Dashboard;