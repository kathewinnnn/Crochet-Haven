import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400;1,600&family=Lato:wght@300;400;700&display=swap');

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

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ch-page {
    font-family: 'Lato', sans-serif;
    background-color: var(--cream);
    color: var(--charcoal);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    margin-left: 240px;
  }

  .ch-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  /* ─── HEADER ─── */
  .ch-header { background: var(--warm-white); border-bottom: 1px solid var(--border); position: relative; z-index: 1; }

  .ch-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ch-logo-block { display: flex; align-items: center; gap: 16px; text-decoration: none; }

  .ch-logo-yarn {
    font-size: 2.2rem;
    animation: sway 4s ease-in-out infinite;
    display: inline-block;
    transform-origin: bottom center;
  }

  @keyframes sway {
    0%, 100% { transform: rotate(-4deg); }
    50% { transform: rotate(4deg); }
  }

  .ch-logo-text { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; color: var(--charcoal); line-height: 1; }
  .ch-logo-text span { color: var(--rose); }
  .ch-tagline { font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); margin-top: 5px; }

  .ch-nav-cta {
    display: inline-flex;
    align-items: center;
    padding: 12px 24px;
    background: var(--rose);
    color: #fff;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-radius: 2px;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .ch-nav-cta:hover { background: var(--deep-rose); transform: translateY(-1px); }

  /* ─── PAGE BANNER ─── */
  .ch-page-banner {
    position: relative;
    z-index: 1;
    background: var(--charcoal);
    padding: 48px 60px;
    overflow: hidden;
    text-align: center;
  }

  .ch-page-banner::after {
    content: '';
    position: absolute;
    right: -80px;
    top: -80px;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(232,114,138,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .ch-banner-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

  .ch-banner-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--amber);
    font-weight: 700;
    margin-bottom: 14px;
  }

  .ch-banner-eyebrow::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--amber); }

  .ch-banner-title { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 800; color: var(--warm-white); line-height: 1.1; margin-bottom: 10px; letter-spacing: -0.02em; }
  .ch-banner-title em { font-style: italic; color: var(--blush); }
  .ch-banner-sub { font-size: 0.9rem; color: rgba(255,255,255,0.4); font-weight: 300; }

  /* ─── BODY ─── */
  .ch-orders-body {
    position: relative;
    z-index: 1;
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 60px 80px;
    width: 100%;
  }

  /* ─── TABS ─── */
  .ch-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    background: var(--warm-white);
    padding: 8px;
    border-radius: 4px;
    border: 1px solid var(--border);
    margin-bottom: 28px;
  }

  .ch-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .ch-tab:hover { background: #fef9f5; color: var(--rose); border-color: var(--border); }

  .ch-tab.active {
    background: var(--charcoal);
    color: var(--cream);
    border-color: var(--charcoal);
    font-weight: 700;
  }

  .ch-tab-count {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
    background: rgba(0,0,0,0.08);
    color: inherit;
  }

  .ch-tab.active .ch-tab-count { background: rgba(255,255,255,0.15); }

  /* ─── ORDER CARDS ─── */
  .ch-orders-list { display: flex; flex-direction: column; gap: 14px; }

  .ch-order-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    transition: box-shadow 0.2s ease;
  }

  .ch-order-card:hover { box-shadow: 0 8px 28px rgba(44,36,32,0.08); }

  /* Header row */
  .ch-order-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
    cursor: pointer;
    background: var(--cream);
    border-bottom: 1px solid var(--border);
    transition: background 0.2s ease;
  }

  .ch-order-head:hover { background: #fef5f0; }

  .ch-order-id-group { display: flex; flex-direction: column; gap: 3px; }

  .ch-order-id {
    font-family: 'Playfair Display', serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--charcoal);
  }

  .ch-order-date { font-size: 0.78rem; color: var(--muted); font-weight: 300; }

  .ch-order-status-group { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }

  .ch-status-pill {
    padding: 5px 14px;
    border-radius: 2px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fff;
  }

  .ch-order-eta { font-size: 0.75rem; color: var(--muted); font-weight: 300; }

  /* Items */
  .ch-order-items { border-bottom: 1px solid var(--border); }

  .ch-order-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
  }

  .ch-order-item:last-child { border-bottom: none; }

  .ch-item-img {
    width: 66px;
    height: 66px;
    border-radius: 4px;
    overflow: hidden;
    background: linear-gradient(145deg, #f7e8d8, #f0cfc4);
    flex-shrink: 0;
  }

  .ch-item-img img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .ch-item-info { flex: 1; min-width: 0; }

  .ch-item-name {
    font-family: 'Playfair Display', serif;
    font-size: 0.92rem;
    font-weight: 600;
    color: var(--charcoal);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ch-item-meta { font-size: 0.78rem; color: var(--muted); font-weight: 300; }

  .ch-item-price {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--rose);
    flex-shrink: 0;
  }

  /* Footer row */
  .ch-order-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: var(--cream);
  }

  .ch-order-total-row { display: flex; align-items: center; gap: 10px; }

  .ch-order-total-lbl { font-size: 0.82rem; color: var(--muted); }

  .ch-order-total-amt {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--rose);
  }

  .ch-pay-badge {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 2px;
  }

  .ch-pay-badge.paid { background: #d1fae5; color: #065f46; }
  .ch-pay-badge.refunded { background: #fee2e2; color: #991b1b; }
  .ch-pay-badge.pending { background: #fef3c7; color: #92400e; }

  /* Action buttons */
  .ch-order-actions { display: flex; gap: 8px; }

  .ch-order-btn {
    padding: 9px 18px;
    border: 1px solid var(--border);
    border-radius: 2px;
    background: transparent;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ch-order-btn:hover { border-color: var(--rose); color: var(--rose); background: rgba(232,114,138,0.05); }

  .ch-order-btn.danger:hover { border-color: #dc2626; color: #dc2626; background: #fef2f2; }

  /* Empty state */
  .ch-orders-empty {
    text-align: center;
    padding: 80px 40px;
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
  }

  .ch-orders-empty-icon { font-size: 3.5rem; display: block; margin-bottom: 18px; }

  .ch-orders-empty h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    color: var(--charcoal);
    margin-bottom: 8px;
  }

  .ch-orders-empty p { font-size: 0.88rem; color: var(--muted); font-weight: 300; }

  /* Loading */
  .ch-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; }

  .ch-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid var(--border);
    border-top-color: var(--rose);
    border-radius: 50%;
    animation: ch-spin 0.9s linear infinite;
  }

  @keyframes ch-spin { to { transform: rotate(360deg); } }

  .ch-loading p { font-size: 0.9rem; color: var(--muted); }

  /* Error banner */
  .ch-error-banner {
    padding: 14px 20px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 4px;
    color: #991b1b;
    font-size: 0.88rem;
    margin-bottom: 20px;
  }

  /* Toast */
  .ch-toast-global {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    padding: 12px 28px;
    border-radius: 2px;
    font-size: 0.88rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #fff;
    animation: ch-fade-up 0.3s ease;
    box-shadow: 0 8px 28px rgba(44,36,32,0.18);
  }

  @keyframes ch-fade-up { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

  .ch-toast-global.success { background: var(--sage); }
  .ch-toast-global.error { background: #ef4444; }
  .ch-toast-global.info { background: var(--charcoal); }

  /* Cancel Modal */
  .ch-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(44,36,32,0.65);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    animation: ch-fade 0.2s ease;
  }

  @keyframes ch-fade { from { opacity: 0; } to { opacity: 1; } }

  .ch-modal {
    background: var(--warm-white);
    border-radius: 4px;
    padding: 40px 36px;
    max-width: 420px;
    width: 100%;
    text-align: center;
    box-shadow: 0 24px 60px rgba(0,0,0,0.22);
    animation: ch-modal-up 0.3s ease;
  }

  @keyframes ch-modal-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .ch-modal-icon { font-size: 2.5rem; display: block; margin-bottom: 14px; }

  .ch-modal-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 800; color: var(--charcoal); margin-bottom: 10px; }

  .ch-modal-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.7; margin-bottom: 28px; font-weight: 300; }

  .ch-modal-actions { display: flex; gap: 12px; justify-content: center; }

  .ch-modal-cancel {
    padding: 12px 26px;
    border: 1.5px solid var(--border);
    border-radius: 2px;
    background: transparent;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ch-modal-cancel:hover { border-color: var(--muted); color: var(--charcoal); }

  .ch-modal-confirm {
    padding: 12px 26px;
    border: none;
    border-radius: 2px;
    background: #dc2626;
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .ch-modal-confirm::after { content: ''; position: absolute; inset: 0; background: #b91c1c; transform: translateX(-100%); transition: transform 0.25s ease; z-index: 0; }
  .ch-modal-confirm:hover::after { transform: translateX(0); }
  .ch-modal-confirm span { position: relative; z-index: 1; }

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
    margin-top: auto;
  }

  .ch-footer-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--charcoal); display: flex; align-items: center; gap: 8px; }
  .ch-footer-copy { font-size: 0.78rem; color: var(--muted); letter-spacing: 0.04em; }

  /* ─── Responsive ─── */
  @media (max-width: 900px) {
    .ch-page { margin-left: 0; }
    .ch-header-inner { padding: 24px 30px; }
    .ch-page-banner { padding: 40px 30px; }
    .ch-banner-title { font-size: 2rem; }
    .ch-orders-body { padding: 36px 30px 60px; }
    .ch-tabs { flex-wrap: nowrap; overflow-x: auto; }
    .ch-tab { flex-shrink: 0; }
    .ch-order-head { flex-direction: column; align-items: flex-start; gap: 10px; }
    .ch-order-foot { flex-direction: column; gap: 14px; align-items: flex-start; }
    .ch-order-actions { flex-wrap: wrap; }
    .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 28px 30px; }
  }

  @media (max-width: 580px) {
    .ch-order-item { flex-wrap: wrap; }
    .ch-item-img { width: 56px; height: 56px; }
  }
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [cancelModal, setCancelModal] = useState({ show: false, displayId: null, backendId: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    fetchOrders();
    const onUpdate = () => fetchOrders();
    const onStorage = (e) => { if (e.key === 'ordersUpdatedAt') fetchOrders(); };
    window.addEventListener('ordersUpdated', onUpdate);
    window.addEventListener('storage', onStorage);
    return () => { window.removeEventListener('ordersUpdated', onUpdate); window.removeEventListener('storage', onStorage); };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/orders", {
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined }
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();

      const mapped = data.map(order => {
        const trackStatus = order.tracking?.status || null;
        const uiStatus = trackStatus === 'out_for_delivery' ? 'out_for_delivery' : mapStatus(order.status);
        let eta = order.estimatedDelivery || null;
        if (!eta && uiStatus === 'to_receive') { const d = new Date(order.createdAt); d.setDate(d.getDate() + 5); eta = d.toISOString(); }
        if (!eta && uiStatus === 'out_for_delivery') eta = new Date().toISOString();

        return {
          id: `ORD-${new Date(order.createdAt).getFullYear()}-${order.id.slice(-3).padStart(3, '0')}`,
          backendId: order.id,
          date: order.createdAt.split('T')[0],
          status: uiStatus,
          tracking: order.tracking || null,
          estimatedDelivery: eta,
          paymentStatus: "paid",
          total: order.total,
          items: order.items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.selectedImage || null }))
        };
      });
      setOrders(mapped);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (s) => ({ "Pending": "to_ship", "Processing": "to_ship", "Shipped": "to_receive", "Delivered": "completed", "Cancelled": "cancelled" }[s] || "to_ship");

  const statusLabel = (s) => ({ to_pay: "To Pay", to_ship: "To Ship", to_receive: "To Receive", out_for_delivery: "Out for Delivery", completed: "Completed", cancelled: "Cancelled" }[s] || s);

  const statusColor = (s) => ({
    to_pay: "#e8a45a", to_ship: "#3b82f6", to_receive: "#8b5cf6",
    out_for_delivery: "#d4735e", completed: "#8aab8e", cancelled: "#8a7a74"
  }[s] || "#8a7a74");

  const fmt = (p) => `₱${parseFloat(p).toFixed(2)}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  const filtered = useCallback(() => {
    if (activeTab === "all") return orders;
    return orders.filter(o => o.status === activeTab);
  }, [orders, activeTab])();

  const tabCounts = {
    all: orders.filter(o => o.status !== "cancelled").length,
    to_pay: orders.filter(o => o.status === "to_pay").length,
    to_ship: orders.filter(o => o.status === "to_ship").length,
    to_receive: orders.filter(o => o.status === "to_receive").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3500);
  };

  const confirmCancel = async () => {
    const { displayId, backendId } = cancelModal;
    setCancelModal({ show: false, displayId: null, backendId: null });
    try {
      const token = localStorage.getItem('token');
      let ok = false;
      if (backendId) {
        const res = await fetch(`http://localhost:5000/orders/${backendId}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined }
        }).catch(() => {});
        if (res?.ok) ok = true;
      }
      if (ok) {
        setOrders(p => p.map(o => o.backendId === backendId ? { ...o, status: 'cancelled' } : o));
        try { localStorage.setItem('ordersUpdatedAt', String(Date.now())); } catch {}
        window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: { backendId } }));
        showToast('Order cancelled successfully', 'success');
      } else {
        setOrders(p => p.map(o => (backendId ? o.backendId === backendId : o.id === displayId) ? { ...o, status: 'cancelled' } : o));
        showToast('Order cancellation queued', 'info');
      }
    } catch {
      showToast('Failed to cancel order', 'error');
    }
  };

  const tabs = [
    { key: "all", label: "All Orders" },
    { key: "to_pay", label: "To Pay" },
    { key: "to_ship", label: "To Ship" },
    { key: "to_receive", label: "To Receive" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Returns" },
  ];

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="ch-page">
        <div className="ch-loading"><div className="ch-spinner" /><p>Loading your orders…</p></div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="ch-page">

        {/* ── HEADER ── */}
        <header className="ch-header">
          <div className="ch-header-inner">
            <Link to="/user/home" className="ch-logo-block">
              <span className="ch-logo-yarn">🧶</span>
              <div>
                <div className="ch-logo-text">Crochet <span>Haven</span></div>
                <div className="ch-tagline">Stitched with love, for you</div>
              </div>
            </Link>
            <Link to="/user/products" className="ch-nav-cta">Shop →</Link>
          </div>
        </header>

        {/* ── BANNER ── */}
        <div className="ch-page-banner">
          <div className="ch-banner-inner">
            <p className="ch-banner-eyebrow">Your Account</p>
            <h1 className="ch-banner-title"><em>My</em> Orders</h1>
            <p className="ch-banner-sub">Track and manage all your crochet purchases</p>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="ch-orders-body">
          {error && <div className="ch-error-banner">{error}</div>}

          {/* Tabs */}
          <div className="ch-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`ch-tab${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>
                {t.label}
                <span className="ch-tab-count">{tabCounts[t.key]}</span>
              </button>
            ))}
          </div>

          {/* List */}
          <div className="ch-orders-list">
            {filtered.length === 0 ? (
              <div className="ch-orders-empty">
                <span className="ch-orders-empty-icon">📦</span>
                <h3>{activeTab === "all" ? "No orders yet" : `No ${statusLabel(activeTab).toLowerCase()} orders`}</h3>
                <p>{activeTab === "all" ? "Complete a checkout to see your orders here" : `You don't have any ${statusLabel(activeTab).toLowerCase()} orders at the moment`}</p>
              </div>
            ) : filtered.map(order => (
              <div key={order.id} className="ch-order-card">

                {/* Head */}
                <div className="ch-order-head">
                  <div className="ch-order-id-group">
                    <span className="ch-order-id">{order.id}</span>
                    <span className="ch-order-date">{fmtDate(order.date)}</span>
                  </div>
                  <div className="ch-order-status-group">
                    <span className="ch-status-pill" style={{ backgroundColor: statusColor(order.status) }}>
                      {statusLabel(order.status)}
                    </span>
                    {(order.status === 'to_receive' || order.status === 'out_for_delivery') && order.estimatedDelivery && (
                      <span className="ch-order-eta">
                        {order.status === 'out_for_delivery' ? `Out for delivery — ${fmtDate(order.estimatedDelivery)}` : `Est. delivery: ${fmtDate(order.estimatedDelivery)}`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="ch-order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="ch-order-item">
                      <div className="ch-item-img">
                        <img src={item.image} alt={item.name}
                          onError={e => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='66' height='66'%3E%3Crect fill='%23f7e8d8' width='66' height='66'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='22'%3E📦%3C/text%3E%3C/svg%3E"; }} />
                      </div>
                      <div className="ch-item-info">
                        <div className="ch-item-name">{item.name}</div>
                        <div className="ch-item-meta">Qty: {item.quantity} × {fmt(item.price)}</div>
                      </div>
                      <div className="ch-item-price">{fmt(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="ch-order-foot">
                  <div className="ch-order-total-row">
                    <span className="ch-order-total-lbl">Total:</span>
                    <span className="ch-order-total-amt">{fmt(order.total)}</span>
                    <span className={`ch-pay-badge ${order.paymentStatus}`}>
                      {order.paymentStatus === "paid" ? "Paid" : order.paymentStatus === "refunded" ? "Refunded" : "Pending"}
                    </span>
                  </div>
                  <div className="ch-order-actions">
                    {order.status === "completed" && (
                      <button className="ch-order-btn">Buy Again</button>
                    )}
                    {(order.status === "to_ship" || order.status === "to_receive") && order.tracking && (
                      <button className="ch-order-btn">Track Order</button>
                    )}
                    {(order.status === "to_ship" || order.status === "to_receive") && (
                      <button className="ch-order-btn">Contact Seller</button>
                    )}
                    {(order.status === "to_ship" || order.status === "to_pay") && (
                      <button className="ch-order-btn danger" onClick={e => { e.stopPropagation(); setCancelModal({ show: true, displayId: order.id, backendId: order.backendId }); }}>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="ch-footer">
          <div className="ch-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>

        {/* Cancel Modal */}
        {cancelModal.show && (
          <div className="ch-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setCancelModal({ show: false, displayId: null, backendId: null }); }}>
            <div className="ch-modal">
              <span className="ch-modal-icon">🗑️</span>
              <div className="ch-modal-title">Cancel Order</div>
              <div className="ch-modal-desc">Are you sure you want to cancel this order? This action cannot be undone.</div>
              <div className="ch-modal-actions">
                <button className="ch-modal-cancel" onClick={() => setCancelModal({ show: false, displayId: null, backendId: null })}>Keep Order</button>
                <button className="ch-modal-confirm" onClick={confirmCancel}><span>Cancel Order</span></button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast.show && <div className={`ch-toast-global ${toast.type}`}>{toast.message}</div>}

      </div>
    </>
  );
};

export default Orders;