// ── Reports.jsx ──────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import API_BASE_URL from '../../apiConfig';

const reportStyles = `
  :root {
    --cream:#fdf6ec; --warm-white:#fffbf5; --rose:#e8728a; --deep-rose:#c4556b;
    --terracotta:#d4735e; --amber:#e8a45a; --sage:#8aab8e;
    --charcoal:#2c2420; --muted:#8a7a74; --border:rgba(212,115,94,0.15);
  }
  .ch-rep-eyebrow { display:inline-flex; align-items:center; gap:10px; font-size:.7rem; letter-spacing:.24em; text-transform:uppercase; color:var(--terracotta); font-weight:700; margin-bottom:8px; }
  .ch-rep-eyebrow::before { content:''; display:block; width:28px; height:1.5px; background:var(--terracotta); }
  .ch-rep-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:800; color:var(--charcoal); letter-spacing:-.03em; line-height:1.1; margin-bottom:5px; }
  .ch-rep-title em { font-style:italic; color:var(--rose); }
  .ch-rep-subtitle { font-size:.84rem; color:var(--muted); font-weight:300; margin-bottom:28px; }
  .ch-rep-metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:36px; }
  .ch-rep-metric { background:var(--warm-white); border:1px solid var(--border); border-radius:4px; padding:22px 18px 16px; position:relative; overflow:hidden; transition:transform .25s,box-shadow .25s; }
  .ch-rep-metric:hover { transform:translateY(-3px); box-shadow:0 16px 48px rgba(44,36,32,.09); }
  .ch-rep-metric::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; }
  .ch-rep-metric:nth-child(1)::before { background:linear-gradient(90deg,var(--rose),#f4a7b2); }
  .ch-rep-metric:nth-child(2)::before { background:linear-gradient(90deg,var(--terracotta),var(--amber)); }
  .ch-rep-metric:nth-child(3)::before { background:linear-gradient(90deg,var(--sage),#c5dfc8); }
  .ch-rep-metric-icon { font-size:1.4rem; margin-bottom:11px; display:block; line-height:1; }
  .ch-rep-metric-value { font-family:'Playfair Display',serif; font-size:1.85rem; font-weight:800; color:var(--charcoal); line-height:1; letter-spacing:-.03em; display:block; margin-bottom:5px; }
  .ch-rep-metric-label { font-size:.67rem; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); font-weight:700; }
  .ch-rep-section { background:var(--warm-white); border:1px solid var(--border); border-radius:4px; overflow:hidden; }
  .ch-rep-section-head { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; border-bottom:1px solid var(--border); background:rgba(253,246,236,.6); }
  .ch-rep-section-title { font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:600; color:var(--charcoal); }
  .ch-rep-section-badge { background:rgba(232,114,138,.1); color:var(--rose); font-size:.64rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; padding:3px 9px; border-radius:2px; }
  .ch-rep-table { width:100%; border-collapse:collapse; }
  .ch-rep-table thead tr { background:rgba(253,246,236,.5); }
  .ch-rep-table th { text-align:left; padding:10px 22px; font-size:.61rem; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); font-weight:700; border-bottom:1px solid var(--border); }
  .ch-rep-table tbody tr { border-bottom:1px solid rgba(212,115,94,.07); transition:background .14s; }
  .ch-rep-table tbody tr:last-child { border-bottom:none; }
  .ch-rep-table tbody tr:hover { background:rgba(253,246,236,.6); }
  .ch-rep-table td { padding:12px 22px; font-size:.83rem; color:var(--charcoal); vertical-align:middle; }
  .ch-rep-rank { display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; font-size:.68rem; font-weight:700; margin-right:9px; flex-shrink:0; }
  .ch-rep-rank-1 { background:rgba(232,164,90,.2); color:var(--amber); }
  .ch-rep-rank-2 { background:rgba(138,171,142,.2); color:var(--sage); }
  .ch-rep-rank-3 { background:rgba(212,115,94,.15); color:var(--terracotta); }
  .ch-rep-rank-n { background:rgba(138,122,116,.1); color:var(--muted); }
  .ch-rep-name-cell { display:flex; align-items:center; }
  .ch-rep-qty { font-family:'Playfair Display',serif; font-weight:600; font-size:.88rem; }
  .ch-rep-sales { font-family:'Playfair Display',serif; font-weight:700; font-size:.9rem; }
  .ch-rep-bar-wrap { display:flex; align-items:center; gap:10px; }
  .ch-rep-bar-track { flex:1; height:5px; background:rgba(212,115,94,.1); border-radius:10px; overflow:hidden; max-width:110px; }
  .ch-rep-bar-fill { height:100%; border-radius:10px; background:linear-gradient(90deg,var(--rose),var(--amber)); transition:width .6s; }
  .ch-rep-empty { padding:52px 22px; text-align:center; color:var(--muted); font-size:.86rem; font-weight:300; }
  .ch-rep-empty-emoji { font-size:2.6rem; display:block; margin-bottom:10px; opacity:.4; }
  .ch-rep-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:260px; gap:14px; color:var(--muted); font-size:.83rem; }
  .ch-rep-loader { width:32px; height:32px; border:2.5px solid rgba(232,114,138,.2); border-top-color:var(--rose); border-radius:50%; animation:rSpin .8s linear infinite; }
  @keyframes rSpin { to { transform:rotate(360deg); } }
  @media (max-width:1024px) { .ch-rep-metrics { grid-template-columns:repeat(3,1fr); } }
  @media (max-width:768px) {
    .ch-rep-title { font-size:1.5rem; }
    .ch-rep-metrics { grid-template-columns:1fr; gap:9px; margin-bottom:22px; }
    .ch-rep-metric { padding:15px 13px 12px; }
    .ch-rep-metric-value { font-size:1.5rem; }
    .ch-rep-section { overflow-x:auto; }
    .ch-rep-table th:last-child, .ch-rep-table td:last-child { display:none; }
    .ch-rep-table th, .ch-rep-table td { padding:9px 12px; }
  }
`;

export const Reports = () => {
  const [reports, setReports] = useState({ totalSales:0, totalOrders:0, averageOrderValue:0, topProducts:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      const orders = await res.json();
      const done = orders.filter(o => o.status === "Delivered" || o.status === "Completed");
      const totalSales = done.reduce((s, o) => s + (o.total || 0), 0);
      const totalOrders = done.length;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
      const ps = {};
      done.forEach(o => (o.items || []).forEach(item => {
        const k = item.id || item.name;
        if (!ps[k]) ps[k] = { id:item.id, name:item.name, sales:0, quantity:0 };
        ps[k].sales += (item.price || 0) * (item.quantity || 1);
        ps[k].quantity += item.quantity || 1;
      }));
      const topProducts = Object.values(ps).sort((a,b) => b.sales - a.sales).slice(0,10);
      setReports({ totalSales, totalOrders, averageOrderValue, topProducts });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fmtP = p => { const n = parseFloat(p); return isNaN(n) ? "0.00" : n.toFixed(2); };
  const maxSales = reports.topProducts.length > 0 ? Math.max(...reports.topProducts.map(p => p.sales)) : 1;
  const rankClass = i => i === 0 ? "ch-rep-rank ch-rep-rank-1" : i === 1 ? "ch-rep-rank ch-rep-rank-2" : i === 2 ? "ch-rep-rank ch-rep-rank-3" : "ch-rep-rank ch-rep-rank-n";

  if (loading) return (<><style>{reportStyles}</style><div className="ch-rep-loading"><div className="ch-rep-loader" /><span>Loading reports…</span></div></>);

  return (
    <>
      <style>{reportStyles}</style>
      <p className="ch-rep-eyebrow">Analytics</p>
      <h1 className="ch-rep-title">Sales <em>Reports</em></h1>
      <p className="ch-rep-subtitle">Showing data from delivered and completed orders only.</p>
      <div className="ch-rep-metrics">
        {[
          { icon:"💰", value:`₱${fmtP(reports.totalSales)}`, label:"Total Sales" },
          { icon:"📦", value:reports.totalOrders, label:"Completed Orders" },
          { icon:"📊", value:`₱${fmtP(reports.averageOrderValue)}`, label:"Avg. Order Value" },
        ].map((m,i) => (
          <div key={i} className="ch-rep-metric">
            <span className="ch-rep-metric-icon">{m.icon}</span>
            <span className="ch-rep-metric-value">{m.value}</span>
            <span className="ch-rep-metric-label">{m.label}</span>
          </div>
        ))}
      </div>
      <div className="ch-rep-section">
        <div className="ch-rep-section-head">
          <span className="ch-rep-section-title">Top Selling Products</span>
          <span className="ch-rep-section-badge">Top {reports.topProducts.length}</span>
        </div>
        {reports.topProducts.length === 0 ? (
          <div className="ch-rep-empty"><span className="ch-rep-empty-emoji">📦</span>No completed orders yet.</div>
        ) : (
          <table className="ch-rep-table">
            <thead><tr><th>#</th><th>Product</th><th>Qty Sold</th><th>Sales (₱)</th><th>Share</th></tr></thead>
            <tbody>
              {reports.topProducts.map((p, i) => (
                <tr key={i}>
                  <td><span className={rankClass(i)}>{i+1}</span></td>
                  <td><div className="ch-rep-name-cell">{p.name}</div></td>
                  <td><span className="ch-rep-qty">{p.quantity}</span></td>
                  <td><span className="ch-rep-sales">₱{fmtP(p.sales)}</span></td>
                  <td>
                    <div className="ch-rep-bar-wrap">
                      <div className="ch-rep-bar-track"><div className="ch-rep-bar-fill" style={{ width:`${(p.sales/maxSales)*100}%` }} /></div>
                      <span style={{ fontSize:".71rem", color:"var(--muted)", minWidth:34 }}>{Math.round((p.sales/maxSales)*100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Reports;