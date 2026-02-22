import React, { useState, useEffect, useRef } from "react";

const orderStyles = `
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

  .ch-orders {
    font-family: 'Lato', sans-serif;
    color: var(--charcoal);
    padding: 52px 56px;
    min-height: 100vh;
  }

  .ch-orders-header {
    margin-bottom: 36px;
  }

  .ch-orders-eyebrow {
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

  .ch-orders-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--terracotta);
  }

  .ch-orders-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .ch-orders-title em { font-style: italic; color: var(--rose); }

  /* ── Notification ── */
  .ch-notification {
    position: fixed;
    top: 24px;
    right: 24px;
    background: var(--charcoal);
    color: #fff;
    border-radius: 6px;
    padding: 18px 20px;
    min-width: 300px;
    max-width: 380px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    box-shadow: 0 20px 60px rgba(44, 36, 32, 0.3);
    z-index: 9990;
    border-left: 4px solid var(--rose);
    animation: slideInRight 0.3s ease;
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .ch-notification-icon {
    font-size: 1.4rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .ch-notification-body h4 {
    font-family: 'Playfair Display', serif;
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--amber);
    margin-bottom: 4px;
  }

  .ch-notification-body p {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.75);
    line-height: 1.5;
    font-weight: 300;
    margin: 0;
  }

  .ch-notification-close {
    background: none;
    border: none;
    color: rgba(255,255,255,0.5);
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: auto;
    padding: 0;
    line-height: 1;
    flex-shrink: 0;
    transition: color 0.15s ease;
  }

  .ch-notification-close:hover { color: #fff; }

  /* ── Filter bar ── */
  .ch-order-filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }

  .ch-filter-btn {
    padding: 8px 18px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 100px;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .ch-filter-btn:hover { border-color: var(--rose); color: var(--rose); }

  .ch-filter-btn.active {
    background: var(--charcoal);
    border-color: var(--charcoal);
    color: #fff;
  }

  /* ── Table ── */
  .ch-orders-table-wrap {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 36px;
  }

  .ch-orders-table {
    width: 100%;
    border-collapse: collapse;
  }

  .ch-orders-table thead tr {
    background: rgba(253, 246, 236, 0.8);
  }

  .ch-orders-table th {
    text-align: left;
    padding: 12px 18px;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  .ch-orders-table tbody tr {
    border-bottom: 1px solid rgba(212, 115, 94, 0.07);
    transition: background 0.14s ease;
  }

  .ch-orders-table tbody tr:last-child { border-bottom: none; }
  .ch-orders-table tbody tr:hover { background: rgba(253, 246, 236, 0.5); }

  .ch-orders-table td {
    padding: 13px 18px;
    font-size: 0.82rem;
    color: var(--charcoal);
    vertical-align: middle;
  }

  .ch-order-id {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 0.88rem;
    color: var(--charcoal);
  }

  .ch-order-thumb {
    width: 44px;
    height: 44px;
    border-radius: 3px;
    object-fit: cover;
    border: 1px solid var(--border);
    display: block;
  }

  .ch-no-img {
    width: 44px;
    height: 44px;
    border-radius: 3px;
    background: rgba(212, 115, 94, 0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    color: var(--muted);
    text-align: center;
    line-height: 1.2;
  }

  .ch-customer-block strong {
    display: block;
    font-weight: 700;
    font-size: 0.84rem;
    color: var(--charcoal);
    margin-bottom: 2px;
  }

  .ch-customer-block span {
    display: block;
    font-size: 0.72rem;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.4;
  }

  .ch-product-item-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 0.8rem;
  }

  .ch-item-name { font-weight: 400; color: var(--charcoal); }
  .ch-item-qty { color: var(--muted); font-size: 0.75rem; }
  .ch-item-price { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 0.82rem; }
  .ch-item-sub { color: var(--rose); font-size: 0.72rem; font-weight: 700; }

  .ch-order-total {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 0.92rem;
    color: var(--charcoal);
  }

  .ch-order-date {
    font-size: 0.76rem;
    color: var(--muted);
    font-weight: 300;
    white-space: nowrap;
  }

  .ch-order-note {
    font-size: 0.76rem;
    color: var(--muted);
    font-style: italic;
    font-weight: 300;
    max-width: 140px;
  }

  /* Status badges */
  .ch-status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 2px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .ch-status-pending { background: rgba(232, 164, 90, 0.15); color: var(--amber); }
  .ch-status-processing { background: rgba(138, 171, 142, 0.15); color: var(--sage); }
  .ch-status-shipped { background: rgba(100, 120, 200, 0.13); color: #5b6fa8; }
  .ch-status-delivered { background: rgba(138, 171, 142, 0.2); color: #4a8a50; }
  .ch-status-cancelled { background: rgba(192, 57, 43, 0.1); color: #c0392b; }

  /* Status select */
  .ch-status-select {
    padding: 7px 10px;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    background: var(--cream);
    color: var(--charcoal);
    font-family: 'Lato', sans-serif;
    font-size: 0.76rem;
    font-weight: 400;
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s ease;
    min-width: 130px;
  }

  .ch-status-select:focus { border-color: var(--rose); }

  /* ── Mobile Cards ── */
  .ch-order-cards {
    display: none;
    flex-direction: column;
    gap: 16px;
  }

  .ch-order-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .ch-order-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
    border-bottom: 1px solid var(--border);
    background: rgba(253, 246, 236, 0.6);
  }

  .ch-order-card-id {
    font-family: 'Playfair Display', serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--charcoal);
  }

  .ch-order-card-body {
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 0.82rem;
  }

  .ch-order-card-body p { margin: 0; color: var(--charcoal); }
  .ch-order-card-body p span { color: var(--muted); font-weight: 300; }

  .ch-order-items-preview {
    border-top: 1px solid var(--border);
    padding-top: 10px;
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .ch-order-item-line {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
  }

  .ch-order-item-line span:last-child { font-family: 'Playfair Display', serif; font-weight: 600; }

  .ch-order-card-actions {
    padding: 14px 18px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ch-order-card-actions label {
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
  }

  /* Empty / Loading */
  .ch-orders-empty {
    padding: 60px 28px;
    text-align: center;
    color: var(--muted);
  }

  .ch-orders-empty-emoji {
    font-size: 3rem;
    display: block;
    margin-bottom: 12px;
    opacity: 0.4;
  }

  .ch-orders-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .ch-orders-loader {
    width: 36px;
    height: 36px;
    border: 2.5px solid rgba(232, 114, 138, 0.2);
    border-top-color: var(--rose);
    border-radius: 50%;
    animation: chSpin 0.8s linear infinite;
  }

  @keyframes chSpin { to { transform: rotate(360deg); } }

  /* Modal */
  .ch-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(44, 36, 32, 0.55);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
  }

  .ch-modal-box {
    background: var(--warm-white);
    border-radius: 6px;
    padding: 40px 36px;
    max-width: 420px;
    width: 90%;
    text-align: center;
    box-shadow: 0 30px 80px rgba(44, 36, 32, 0.22);
    border: 1px solid var(--border);
    font-family: 'Lato', sans-serif;
    animation: modalIn 0.22s ease;
  }

  @keyframes modalIn {
    from { opacity: 0; transform: translateY(14px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .ch-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 10px;
  }

  .ch-modal-desc {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.65;
    margin-bottom: 28px;
    font-weight: 300;
  }

  .ch-modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .ch-btn-danger {
    padding: 11px 24px;
    background: #c0392b;
    color: #fff;
    border: none;
    border-radius: 3px;
    font-family: 'Lato', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.18s ease;
  }

  .ch-btn-danger:hover { background: #a93226; }

  .ch-btn-neutral {
    padding: 11px 24px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ch-btn-neutral:hover { border-color: var(--rose); color: var(--rose); }

  @media (max-width: 900px) {
    .ch-orders { padding: 32px 20px; }
    .ch-orders-title { font-size: 1.8rem; }
    .ch-orders-table-wrap { display: none; }
    .ch-order-cards { display: flex; }
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

const statusClass = (status) => {
  const map = { pending: "ch-status-pending", processing: "ch-status-processing", shipped: "ch-status-shipped", delivered: "ch-status-delivered", cancelled: "ch-status-cancelled" };
  return map[(status || "").toLowerCase()] || "ch-status-pending";
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOrderNotification, setNewOrderNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [cancelModal, setCancelModal] = useState({ show: false, orderId: null });
  const notificationTimeoutRef = useRef(null);

  const getLastSeenOrder = () => {
    const saved = localStorage.getItem("lastSeenOrder");
    return saved ? JSON.parse(saved) : { id: null, timestamp: null };
  };

  const saveLastSeenOrder = (id, timestamp) => {
    localStorage.setItem("lastSeenOrder", JSON.stringify({ id, timestamp }));
  };

  useEffect(() => {
    fetchOrders();
    const pollInterval = setInterval(fetchOrders, 5000);
    const onOrdersUpdated = () => fetchOrders();
    const onStorage = (e) => { if (e.key === "ordersUpdatedAt") fetchOrders(); };
    window.addEventListener("ordersUpdated", onOrdersUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("ordersUpdated", onOrdersUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const showNewOrderNotification = (order) => {
    setNewOrderNotification({
      id: order.id,
      customer: order.customer?.fullName || "Unknown Customer",
      total: order.total,
      itemCount: order.items?.length || 1,
    });
    setShowNotification(true);
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    notificationTimeoutRef.current = setTimeout(() => setShowNotification(false), 5000);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        if (data.length > 0) {
          const lastSeen = getLastSeenOrder();
          const latest = data[data.length - 1];
          if (latest.id !== lastSeen.id) saveLastSeenOrder(latest.id, latest.createdAt);
        }
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (status === "Cancelled") { setCancelModal({ show: true, orderId: id }); return; }
    try {
      const response = await fetch(`http://localhost:5000/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
        const ts = String(Date.now());
        try { localStorage.setItem("ordersUpdatedAt", ts); } catch (e) {}
        window.dispatchEvent(new CustomEvent("ordersUpdated", { detail: { id, status } }));
      }
    } catch (err) { console.error("Error updating order status:", err); }
  };

  const confirmCancel = async () => {
    const { orderId } = cancelModal;
    try {
      const response = await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });
      if (response.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o)));
        const ts = String(Date.now());
        try { localStorage.setItem("ordersUpdatedAt", ts); } catch (e) {}
        window.dispatchEvent(new CustomEvent("ordersUpdated", { detail: { id: orderId, status: "Cancelled" } }));
      }
    } catch (err) { console.error("Error cancelling order:", err); }
    setCancelModal({ show: false, orderId: null });
  };

  const formatDate = (ds) =>
    new Date(ds).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const formatPrice = (p) => { const n = parseFloat(p); return isNaN(n) ? "0.00" : n.toFixed(2); };

  useEffect(() => () => { if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current); }, []);

  if (loading) {
    return (
      <div className="ch-orders">
        <style>{orderStyles}</style>
        <div className="ch-orders-loading">
          <div className="ch-orders-loader" />
          <span>Loading orders…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ch-orders">
        <style>{orderStyles}</style>
        <div className="ch-orders-header">
          <p className="ch-orders-eyebrow">Management</p>
          <h1 className="ch-orders-title">Order <em>Management</em></h1>
        </div>
        <div className="ch-orders-empty"><span className="ch-orders-empty-emoji">⚠️</span>{error}</div>
      </div>
    );
  }

  const filteredOrders = statusFilter === "All" ? orders : orders.filter((o) => o.status === statusFilter);
  
  // Sort orders by createdAt (latest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
      <style>{orderStyles}</style>
      <div className="ch-orders">
        {/* Notification */}
        {showNotification && newOrderNotification && (
          <div className="ch-notification">
            <div className="ch-notification-icon">🔔</div>
            <div className="ch-notification-body">
              <h4>New Order Received!</h4>
              <p><strong>Order #{newOrderNotification.id.slice(-6)}</strong></p>
              <p>Customer: {newOrderNotification.customer}</p>
              <p>{newOrderNotification.itemCount} item{newOrderNotification.itemCount !== 1 ? "s" : ""} · ₱{formatPrice(newOrderNotification.total)}</p>
            </div>
            <button className="ch-notification-close" onClick={() => setShowNotification(false)}>×</button>
          </div>
        )}

        {/* Header */}
        <div className="ch-orders-header">
          <p className="ch-orders-eyebrow">Management</p>
          <h1 className="ch-orders-title">Order <em>Management</em></h1>
        </div>

        {/* Filters */}
        <div className="ch-order-filters">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
            <button key={s} className={`ch-filter-btn ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}>
              {s}
            </button>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="ch-orders-table-wrap">
          <table className="ch-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Image</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    <div className="ch-orders-empty">
                      <span className="ch-orders-empty-emoji">📦</span>
                      No orders found.
                    </div>
                  </td>
                </tr>
              ) : (
                sortedOrders.flatMap((order) => {
                  const items = order.items || [];
                  return items.map((item, itemIndex) => {
                    const isFirst = itemIndex === 0;
                    const subtotal = item.price * item.quantity;
                    return (
                      <tr key={`${order.id}-${itemIndex}`}>
                        <td>{isFirst && <span className="ch-order-id">#{order.id.slice(-6)}</span>}</td>
                        <td>
                          {item.selectedImage ? (
                            <img src={item.selectedImage} alt={item.name} className="ch-order-thumb" />
                          ) : (
                            <div className="ch-no-img">No img</div>
                          )}
                        </td>
                        <td>
                          {isFirst && (
                            <div className="ch-customer-block">
                              <strong>{order.customer?.fullName}</strong>
                              <span>{order.customer?.email}</span>
                              <span>{order.customer?.address}, {order.customer?.city}</span>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="ch-product-item-row">
                            <span className="ch-item-name">{item.name}</span>
                            <span className="ch-item-qty">×{item.quantity}</span>
                            <span className="ch-item-price">₱{formatPrice(item.price)}</span>
                            <span className="ch-item-sub">= ₱{formatPrice(subtotal)}</span>
                          </div>
                        </td>
                        <td>{isFirst && <span className="ch-order-total">₱{formatPrice(order.total)}</span>}</td>
                        <td>{isFirst && <span className="ch-order-date">{formatDate(order.createdAt)}</span>}</td>
                        <td>
                          {isFirst && (
                            <span className={`ch-status-badge ${statusClass(order.status)}`}>
                              {order.status || "Pending"}
                            </span>
                          )}
                        </td>
                        <td>
                          {isFirst && (
                            <span className="ch-order-note">
                              {order.customer?.orderNote || "—"}
                            </span>
                          )}
                        </td>
                        <td>
                          {isFirst && order.status?.toLowerCase() !== "cancelled" && (
                            <select
                              value={order.status || "Pending"}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              className="ch-status-select"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="ch-order-cards">
          {sortedOrders.length === 0 ? (
            <div className="ch-orders-empty">
              <span className="ch-orders-empty-emoji">📦</span>
              No orders found.
            </div>
          ) : (
            sortedOrders.map((order) => (
              <div key={order.id} className="ch-order-card">
                <div className="ch-order-card-head">
                  <span className="ch-order-card-id">Order #{order.id.slice(-6)}</span>
                  <span className={`ch-status-badge ${statusClass(order.status)}`}>{order.status || "Pending"}</span>
                </div>
                <div className="ch-order-card-body">
                  <p><span>Customer: </span>{order.customer?.fullName}</p>
                  <p><span>Email: </span>{order.customer?.email}</p>
                  <p><span>Address: </span>{order.customer?.address}, {order.customer?.city}</p>
                  <p><span>Date: </span>{formatDate(order.createdAt)}</p>
                  <div className="ch-order-items-preview">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="ch-order-item-line">
                        <span>{item.name} ×{item.quantity}</span>
                        <span>₱{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="ch-order-item-line" style={{ borderTop: "1px solid var(--border)", paddingTop: 6, marginTop: 4 }}>
                      <strong style={{ fontSize: "0.8rem" }}>Total</strong>
                      <strong style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.88rem" }}>₱{formatPrice(order.total)}</strong>
                    </div>
                  </div>
                  {order.customer?.orderNote && <p><span>Note: </span>{order.customer.orderNote}</p>}
                </div>
                {order.status?.toLowerCase() !== "cancelled" && (
                  <div className="ch-order-card-actions">
                    <label>Update:</label>
                    <select value={order.status || "Pending"} onChange={(e) => updateStatus(order.id, e.target.value)} className="ch-status-select">
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Cancel Modal */}
        {cancelModal.show && (
          <div className="ch-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setCancelModal({ show: false, orderId: null })}>
            <div className="ch-modal-box">
              <div className="ch-modal-title">Cancel This Order?</div>
              <p className="ch-modal-desc">
                This action cannot be undone. The order will be marked as cancelled.
              </p>
              <div className="ch-modal-actions">
                <button className="ch-btn-neutral" onClick={() => setCancelModal({ show: false, orderId: null })}>
                  Keep Order
                </button>
                <button className="ch-btn-danger" onClick={confirmCancel}>
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* ── FOOTER ── */}
        <footer className="ch-footer">
          <div className="ch-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>
    </>
  );
};

export default Order;