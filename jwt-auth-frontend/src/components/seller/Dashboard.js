import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from '../../apiConfig';

const API_URL = `${API_BASE_URL}/products`;

const dashStyles = `
  :root {
    --cream: #fdf6ec; --warm-white: #fffbf5; --blush: #f4a7b2;
    --rose: #e8728a; --deep-rose: #c4556b; --terracotta: #d4735e;
    --amber: #e8a45a; --sage: #8aab8e; --charcoal: #2c2420;
    --muted: #8a7a74; --border: rgba(212,115,94,0.15);
  }
  .ch-dash-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 0.7rem; letter-spacing: 0.24em; text-transform: uppercase;
    color: var(--terracotta); font-weight: 700; margin-bottom: 8px;
  }
  .ch-dash-eyebrow::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--terracotta); }
  .ch-dash-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 800; color: var(--charcoal);
    letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 5px;
  }
  .ch-dash-title em { font-style: italic; color: var(--rose); }
  .ch-dash-subtitle { font-size: 0.85rem; color: var(--muted); font-weight: 300; margin-bottom: 32px; }

  .ch-stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 28px; }
  .ch-stat-card {
    background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px;
    padding: 22px 18px 16px; position: relative; overflow: hidden;
    transition: transform .25s ease, box-shadow .25s ease;
  }
  .ch-stat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(44,36,32,.09); }
  .ch-stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .ch-stat-card:nth-child(1)::before { background: linear-gradient(90deg, var(--rose), var(--blush)); }
  .ch-stat-card:nth-child(2)::before { background: linear-gradient(90deg, var(--terracotta), var(--amber)); }
  .ch-stat-card:nth-child(3)::before { background: linear-gradient(90deg, var(--sage), #c5dfc8); }
  .ch-stat-card:nth-child(4)::before { background: linear-gradient(90deg, var(--amber), #f5d4a0); }
  .ch-stat-card-icon { font-size: 1.4rem; margin-bottom: 11px; display: block; line-height: 1; }
  .ch-stat-card-num { font-family: 'Playfair Display', serif; font-size: 1.85rem; font-weight: 800; color: var(--charcoal); line-height: 1; letter-spacing: -0.03em; display: block; margin-bottom: 5px; }
  .ch-stat-card-label { font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); font-weight: 700; }

  .ch-cat-summary { display: flex; gap: 9px; flex-wrap: wrap; margin-bottom: 24px; }
  .ch-cat-pill { display: flex; align-items: center; gap: 7px; padding: 5px 12px; background: var(--warm-white); border: 1px solid var(--border); border-radius: 100px; font-size: 0.74rem; color: var(--muted); }
  .ch-cat-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--rose); flex-shrink: 0; }
  .ch-cat-pill strong { color: var(--charcoal); font-weight: 700; }

  .ch-dash-section { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
  .ch-dash-section-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .ch-dash-section-title { font-family: 'Playfair Display', serif; font-size: 1.08rem; font-weight: 600; color: var(--charcoal); }
  .ch-dash-section-badge { background: rgba(232,114,138,.1); color: var(--rose); font-size: 0.65rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; padding: 3px 9px; border-radius: 2px; }

  .ch-product-table { width: 100%; border-collapse: collapse; }
  .ch-product-table thead tr { background: rgba(253,246,236,.7); }
  .ch-product-table th { text-align: left; padding: 10px 20px; font-size: 0.62rem; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); font-weight: 700; border-bottom: 1px solid var(--border); }
  .ch-product-table tbody tr { border-bottom: 1px solid rgba(212,115,94,.08); transition: background .15s ease; }
  .ch-product-table tbody tr:last-child { border-bottom: none; }
  .ch-product-table tbody tr:hover { background: rgba(253,246,236,.6); }
  .ch-product-table td { padding: 11px 20px; font-size: 0.82rem; color: var(--charcoal); vertical-align: middle; }
  .ch-product-table td:first-child { max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ch-product-cat-tag { display: inline-block; background: rgba(212,115,94,.08); color: var(--terracotta); font-size: 0.64rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 2px 7px; border-radius: 2px; }
  .ch-product-price-cell { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 0.87rem; }

  .ch-mob-cards { display: none; }
  .ch-mob-card { padding: 12px 16px; border-bottom: 1px solid rgba(212,115,94,.08); display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .ch-mob-card:last-child { border-bottom: none; }
  .ch-mob-card-name { font-size: 0.85rem; font-weight: 600; color: var(--charcoal); margin-bottom: 3px; }
  .ch-mob-card-price { font-family: 'Playfair Display', serif; font-size: 0.94rem; font-weight: 700; color: var(--rose); white-space: nowrap; }

  .ch-empty-state { padding: 48px 20px; text-align: center; color: var(--muted); font-size: 0.85rem; font-weight: 300; }
  .ch-empty-state-emoji { font-size: 2.3rem; display: block; margin-bottom: 10px; opacity: .5; }

  .ch-dash-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 260px; gap: 14px; color: var(--muted); font-size: .83rem; }
  .ch-dash-loader { width: 32px; height: 32px; border: 2.5px solid rgba(232,114,138,.2); border-top-color: var(--rose); border-radius: 50%; animation: dSpin .8s linear infinite; }
  @keyframes dSpin { to { transform: rotate(360deg); } }

  @media (max-width: 1024px) {
    .ch-stat-grid { grid-template-columns: repeat(2,1fr); }
    .ch-product-table th:last-child, .ch-product-table td:last-child { display: none; }
  }
  @media (max-width: 768px) {
    .ch-dash-title { font-size: 1.5rem; }
    .ch-stat-grid { gap: 9px; margin-bottom: 18px; }
    .ch-stat-card { padding: 14px 12px 11px; }
    .ch-stat-card-num { font-size: 1.45rem; }
    .ch-product-table { display: none; }
    .ch-mob-cards { display: block; }
  }
`;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [pr, or] = await Promise.allSettled([
        axios.get(API_URL),
        fetch(`${API_BASE_URL}/orders`).then(r => r.json()),
      ]);
      if (pr.status === "fulfilled") setProducts(pr.value.data);
      if (or.status === "fulfilled") setOrders(or.value);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const totalProducts   = products.length;
  const totalCategories = new Set(products.map(p => p.category)).size;
  const totalValue      = products.reduce((s, p) => s + parseFloat(p.price || 0), 0);
  const totalOrders     = orders.length;
  const grouped = products.reduce((a, p) => { a[p.category] = (a[p.category] || 0) + 1; return a; }, {});

  if (loading) return (
    <><style>{dashStyles}</style>
      <div className="ch-dash-loading"><div className="ch-dash-loader" /><span>Loading dashboard…</span></div>
    </>
  );

  return (
    <>
      <style>{dashStyles}</style>
      <p className="ch-dash-eyebrow">Overview</p>
      <h1 className="ch-dash-title">Seller <em>Dashboard</em></h1>
      <p className="ch-dash-subtitle">Everything at a glance — your shop, your numbers.</p>

      <div className="ch-stat-grid">
        {[
          { icon: "🛍️", num: totalProducts,               label: "Total Products" },
          { icon: "📁", num: totalCategories,              label: "Categories" },
          { icon: "📦", num: totalOrders,                  label: "Total Orders" },
          { icon: "💰", num: `₱${totalValue.toFixed(2)}`, label: "Inventory Value" },
        ].map((s, i) => (
          <div key={i} className="ch-stat-card">
            <span className="ch-stat-card-icon">{s.icon}</span>
            <span className="ch-stat-card-num">{s.num}</span>
            <span className="ch-stat-card-label">{s.label}</span>
          </div>
        ))}
      </div>

      {Object.keys(grouped).length > 0 && (
        <div className="ch-cat-summary">
          {Object.entries(grouped).map(([cat, count]) => (
            <div key={cat} className="ch-cat-pill">
              <div className="ch-cat-pill-dot" />{cat} — <strong>{count}</strong>
            </div>
          ))}
        </div>
      )}

      <div className="ch-dash-section">
        <div className="ch-dash-section-head">
          <span className="ch-dash-section-title">All Products</span>
          <span className="ch-dash-section-badge">{totalProducts} items</span>
        </div>
        {products.length === 0 ? (
          <div className="ch-empty-state"><span className="ch-empty-state-emoji">🧶</span>No products yet.</div>
        ) : (
          <>
            <table className="ch-product-table">
              <thead><tr><th>Product Name</th><th>Category</th><th>Price</th><th>ID</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td><span className="ch-product-cat-tag">{p.category}</span></td>
                    <td className="ch-product-price-cell">₱{parseFloat(p.price).toFixed(2)}</td>
                    <td style={{ fontSize: ".72rem", color: "var(--muted)" }}>{p.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ch-mob-cards">
              {products.map(p => (
                <div key={p.id} className="ch-mob-card">
                  <div>
                    <div className="ch-mob-card-name">{p.name}</div>
                    <span className="ch-product-cat-tag">{p.category}</span>
                  </div>
                  <div className="ch-mob-card-price">₱{parseFloat(p.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;