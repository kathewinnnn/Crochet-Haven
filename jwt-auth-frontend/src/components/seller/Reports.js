import React, { useState, useEffect } from "react";

const reportStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Lato:wght@300;400;700&display=swap');

  :root {
    --cream: #fdf6ec;
    --warm-white: #fffbf5;
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

  .ch-reports {
    font-family: 'Lato', sans-serif;
    color: var(--charcoal);
    padding: 52px 56px;
    min-height: 100vh;
  }

  .ch-rep-header { margin-bottom: 44px; }

  .ch-rep-eyebrow {
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

  .ch-rep-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--terracotta);
  }

  .ch-rep-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .ch-rep-title em { font-style: italic; color: var(--rose); }

  .ch-rep-subtitle {
    font-size: 0.86rem;
    color: var(--muted);
    font-weight: 300;
  }

  /* ── Metric Cards ── */
  .ch-rep-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 48px;
  }

  .ch-rep-metric {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 28px 28px 24px;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .ch-rep-metric:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(44, 36, 32, 0.09);
  }

  .ch-rep-metric::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
  }

  .ch-rep-metric:nth-child(1)::before { background: linear-gradient(90deg, var(--rose), #f4a7b2); }
  .ch-rep-metric:nth-child(2)::before { background: linear-gradient(90deg, var(--terracotta), var(--amber)); }
  .ch-rep-metric:nth-child(3)::before { background: linear-gradient(90deg, var(--sage), #c5dfc8); }

  .ch-rep-metric-icon {
    font-size: 1.6rem;
    margin-bottom: 16px;
    display: block;
    line-height: 1;
  }

  .ch-rep-metric-value {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 800;
    color: var(--charcoal);
    line-height: 1;
    letter-spacing: -0.03em;
    display: block;
    margin-bottom: 6px;
  }

  .ch-rep-metric-label {
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
  }

  /* ── Top Products Table ── */
  .ch-rep-section {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .ch-rep-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 28px;
    border-bottom: 1px solid var(--border);
    background: rgba(253, 246, 236, 0.6);
  }

  .ch-rep-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--charcoal);
  }

  .ch-rep-section-badge {
    background: rgba(232, 114, 138, 0.1);
    color: var(--rose);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
  }

  .ch-rep-table {
    width: 100%;
    border-collapse: collapse;
  }

  .ch-rep-table thead tr {
    background: rgba(253, 246, 236, 0.5);
  }

  .ch-rep-table th {
    text-align: left;
    padding: 12px 28px;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
    border-bottom: 1px solid var(--border);
  }

  .ch-rep-table tbody tr {
    border-bottom: 1px solid rgba(212, 115, 94, 0.07);
    transition: background 0.14s ease;
  }

  .ch-rep-table tbody tr:last-child { border-bottom: none; }
  .ch-rep-table tbody tr:hover { background: rgba(253, 246, 236, 0.6); }

  .ch-rep-table td {
    padding: 14px 28px;
    font-size: 0.84rem;
    color: var(--charcoal);
    vertical-align: middle;
  }

  .ch-rep-rank {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 0.7rem;
    font-weight: 700;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .ch-rep-rank-1 { background: rgba(232, 164, 90, 0.2); color: var(--amber); }
  .ch-rep-rank-2 { background: rgba(138, 171, 142, 0.2); color: var(--sage); }
  .ch-rep-rank-3 { background: rgba(212, 115, 94, 0.15); color: var(--terracotta); }
  .ch-rep-rank-n { background: rgba(138, 122, 116, 0.1); color: var(--muted); }

  .ch-rep-name-cell {
    display: flex;
    align-items: center;
  }

  .ch-rep-qty {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .ch-rep-sales {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 0.92rem;
    color: var(--charcoal);
  }

  /* Bar visualization */
  .ch-rep-bar-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ch-rep-bar-track {
    flex: 1;
    height: 5px;
    background: rgba(212, 115, 94, 0.1);
    border-radius: 10px;
    overflow: hidden;
    max-width: 120px;
  }

  .ch-rep-bar-fill {
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(90deg, var(--rose), var(--amber));
    transition: width 0.6s ease;
  }

  .ch-rep-empty {
    padding: 60px 28px;
    text-align: center;
    color: var(--muted);
    font-size: 0.88rem;
    font-weight: 300;
  }

  .ch-rep-empty-emoji {
    font-size: 2.8rem;
    display: block;
    margin-bottom: 12px;
    opacity: 0.4;
  }

  .ch-rep-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .ch-rep-loader {
    width: 36px;
    height: 36px;
    border: 2.5px solid rgba(232, 114, 138, 0.2);
    border-top-color: var(--rose);
    border-radius: 50%;
    animation: chRepSpin 0.8s linear infinite;
  }

  @keyframes chRepSpin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .ch-reports { padding: 32px 20px; }
    .ch-rep-title { font-size: 1.8rem; }
    .ch-rep-table th:last-child,
    .ch-rep-table td:last-child { display: none; }
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

const Reports = () => {
  const [reports, setReports] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:5000/orders");
      const orders = await response.json();

      const completedOrders = orders.filter(
        (order) => order.status === "Delivered" || order.status === "Completed"
      );

      const totalSales = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const totalOrders = completedOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      const productSales = {};
      completedOrders.forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            const key = item.id || item.name;
            if (!productSales[key]) {
              productSales[key] = { id: item.id, name: item.name, sales: 0, quantity: 0 };
            }
            const subtotal = (item.price || 0) * (item.quantity || 1);
            productSales[key].sales += subtotal;
            productSales[key].quantity += item.quantity || 1;
          });
        }
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 10);

      setReports({ totalSales, totalOrders, averageOrderValue, topProducts });
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports({ totalSales: 0, totalOrders: 0, averageOrderValue: 0, topProducts: [] });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const n = parseFloat(price);
    return isNaN(n) ? "0.00" : n.toFixed(2);
  };

  const maxSales = reports.topProducts.length > 0
    ? Math.max(...reports.topProducts.map((p) => p.sales))
    : 1;

  const rankClass = (i) => {
    if (i === 0) return "ch-rep-rank ch-rep-rank-1";
    if (i === 1) return "ch-rep-rank ch-rep-rank-2";
    if (i === 2) return "ch-rep-rank ch-rep-rank-3";
    return "ch-rep-rank ch-rep-rank-n";
  };

  if (loading) {
    return (
      <div className="ch-reports">
        <style>{reportStyles}</style>
        <div className="ch-rep-loading">
          <div className="ch-rep-loader" />
          <span>Loading reports…</span>
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
      <style>{reportStyles}</style>
      <div className="ch-reports">
        {/* Header */}
        <div className="ch-rep-header">
          <p className="ch-rep-eyebrow">Analytics</p>
          <h1 className="ch-rep-title">Sales <em>Reports</em></h1>
          <p className="ch-rep-subtitle">Showing data from delivered and completed orders only.</p>
        </div>

        {/* Metrics */}
        <div className="ch-rep-metrics">
          {[
            { icon: "💰", value: `₱${formatPrice(reports.totalSales)}`,         label: "Total Sales" },
            { icon: "📦", value: reports.totalOrders,                            label: "Completed Orders" },
            { icon: "📊", value: `₱${formatPrice(reports.averageOrderValue)}`,   label: "Avg. Order Value" },
          ].map((m, i) => (
            <div key={i} className="ch-rep-metric">
              <span className="ch-rep-metric-icon">{m.icon}</span>
              <span className="ch-rep-metric-value">{m.value}</span>
              <span className="ch-rep-metric-label">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Top Products */}
        <div className="ch-rep-section">
          <div className="ch-rep-section-head">
            <span className="ch-rep-section-title">Top Selling Products</span>
            <span className="ch-rep-section-badge">Top {reports.topProducts.length}</span>
          </div>

          {reports.topProducts.length === 0 ? (
            <div className="ch-rep-empty">
              <span className="ch-rep-empty-emoji">📦</span>
              No completed orders yet — data will appear once orders are delivered.
            </div>
          ) : (
            <table className="ch-rep-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Qty Sold</th>
                  <th>Sales (₱)</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {reports.topProducts.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <span className={rankClass(index)}>{index + 1}</span>
                    </td>
                    <td>
                      <div className="ch-rep-name-cell">{product.name}</div>
                    </td>
                    <td>
                      <span className="ch-rep-qty">{product.quantity}</span>
                    </td>
                    <td>
                      <span className="ch-rep-sales">₱{formatPrice(product.sales)}</span>
                    </td>
                    <td>
                      <div className="ch-rep-bar-wrap">
                        <div className="ch-rep-bar-track">
                          <div
                            className="ch-rep-bar-fill"
                            style={{ width: `${(product.sales / maxSales) * 100}%` }}
                          />
                        </div>
                        <span style={{ fontSize: "0.72rem", color: "var(--muted)", minWidth: 36 }}>
                          {Math.round((product.sales / maxSales) * 100)}%
                        </span>
                      </div>
                    </td>
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

export default Reports;