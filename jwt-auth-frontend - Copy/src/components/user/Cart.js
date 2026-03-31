import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

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

  .ch-header { background: var(--warm-white); border-bottom: 1px solid var(--border); position: relative; z-index: 1; }
  .ch-header-inner { max-width: 1200px; margin: 0 auto; padding: 32px 60px; display: flex; align-items: center; justify-content: space-between; }
  .ch-logo-block { display: flex; align-items: center; gap: 16px; text-decoration: none; }
  .ch-logo-yarn { font-size: 2.2rem; animation: sway 4s ease-in-out infinite; display: inline-block; transform-origin: bottom center; }

  @keyframes sway { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }

  .ch-logo-text { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; color: var(--charcoal); line-height: 1; }
  .ch-logo-text span { color: var(--rose); }
  .ch-tagline { font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); margin-top: 5px; }
  .ch-nav-cta { display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; background: var(--rose); color: #fff; text-decoration: none; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 2px; transition: background 0.2s ease, transform 0.2s ease; }
  .ch-nav-cta:hover { background: var(--deep-rose); transform: translateY(-1px); }

  .ch-page-banner { position: relative; z-index: 1; background: var(--charcoal); padding: 48px 60px; overflow: hidden; text-align: center; }
  .ch-page-banner::after { content: ''; position: absolute; right: -80px; top: -80px; width: 360px; height: 360px; border-radius: 50%; background: radial-gradient(circle, rgba(232,114,138,0.15) 0%, transparent 70%); pointer-events: none; }
  .ch-banner-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .ch-banner-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--amber); font-weight: 700; margin-bottom: 14px; }
  .ch-banner-eyebrow::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--amber); }
  .ch-banner-title { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 800; color: var(--warm-white); line-height: 1.1; margin-bottom: 10px; letter-spacing: -0.02em; }
  .ch-banner-title em { font-style: italic; color: var(--blush); }
  .ch-banner-sub { font-size: 0.9rem; color: rgba(255,255,255,0.4); font-weight: 300; }

  .ch-cart-body { position: relative; z-index: 1; flex: 1; max-width: 1200px; margin: 0 auto; padding: 56px 60px 80px; width: 100%; }

  .ch-cart-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; text-align: center; }
  .ch-empty-icon { font-size: 4.5rem; display: block; margin-bottom: 24px; }
  .ch-empty-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: var(--charcoal); margin-bottom: 12px; }
  .ch-empty-sub { font-size: 0.95rem; color: var(--muted); font-weight: 300; margin-bottom: 32px; }

  .ch-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 16px 32px; background: var(--charcoal); color: var(--cream); text-decoration: none; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 2px; transition: background 0.25s ease; position: relative; overflow: hidden; }
  .ch-btn-primary::after { content: ''; position: absolute; inset: 0; background: var(--rose); transform: translateX(-100%); transition: transform 0.3s ease; z-index: 0; }
  .ch-btn-primary:hover::after { transform: translateX(0); }
  .ch-btn-primary span { position: relative; z-index: 1; }

  .ch-cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }

  .ch-items-panel { background: var(--warm-white); border-radius: 4px; border: 1px solid var(--border); overflow: hidden; }
  .ch-items-panel-head { padding: 20px 28px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .ch-items-panel-head h2 { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; color: var(--charcoal); }
  .ch-item-count-badge { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); background: var(--cream); border: 1px solid var(--border); padding: 4px 12px; border-radius: 20px; }
  .ch-select-all-wrap { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: var(--muted); cursor: pointer; }
  .ch-select-all-wrap input { accent-color: var(--rose); cursor: pointer; }

  .ch-cart-item { display: flex; align-items: center; gap: 20px; padding: 24px 28px; border-bottom: 1px solid var(--border); transition: background 0.2s ease; }
  .ch-cart-item:last-child { border-bottom: none; }
  .ch-cart-item:hover { background: #fef9f5; }

  .ch-item-checkbox { width: 22px; height: 22px; cursor: pointer; accent-color: var(--rose); flex-shrink: 0; }

  .ch-item-img { width: 90px; height: 90px; border-radius: 4px; overflow: hidden; background: linear-gradient(145deg, #f7e8d8, #f0cfc4); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 2rem; }
  .ch-item-img img { width: 100%; height: 100%; object-fit: cover; }

  .ch-item-info { flex: 1; min-width: 0; }
  .ch-item-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--charcoal); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ch-item-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.6; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-weight: 300; }
  .ch-item-cat { display: inline-block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--terracotta); border: 1px solid rgba(212,115,94,0.3); padding: 3px 10px; border-radius: 2px; }

  .ch-item-controls { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; flex-shrink: 0; }
  .ch-item-price { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--rose); }

  .ch-qty-strip { display: flex; align-items: center; border: 1px solid var(--border); border-radius: 2px; overflow: hidden; background: var(--cream); }
  .ch-qty-strip-btn { width: 32px; height: 32px; border: none; background: transparent; color: var(--rose); font-size: 1rem; font-weight: 700; cursor: pointer; transition: background 0.2s ease; display: flex; align-items: center; justify-content: center; }
  .ch-qty-strip-btn:hover { background: var(--rose); color: #fff; }
  .ch-qty-strip-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .ch-qty-strip-btn:disabled:hover { background: transparent; color: var(--rose); }
  .ch-qty-strip-val { width: 38px; text-align: center; font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: var(--charcoal); border-left: 1px solid var(--border); border-right: 1px solid var(--border); line-height: 32px; background: var(--warm-white); }

  .ch-remove-btn { background: none; border: none; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); cursor: pointer; padding: 4px 8px; border-radius: 2px; transition: all 0.2s ease; }
  .ch-remove-btn:hover { color: #dc2626; background: #fef2f2; }

  .ch-summary-panel { background: var(--warm-white); border-radius: 4px; border: 1px solid var(--border); padding: 28px; position: sticky; top: 24px; }
  .ch-summary-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; color: var(--charcoal); margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
  .ch-summary-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; color: var(--muted); margin-bottom: 12px; }
  .ch-summary-divider { height: 1px; background: var(--border); margin: 18px 0; }
  .ch-summary-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .ch-summary-total-lbl { font-size: 1rem; font-weight: 700; color: var(--charcoal); }
  .ch-summary-total-price { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 800; color: var(--rose); }

  .ch-checkout-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 10px 14px; border-radius: 2px; font-size: 0.82rem; text-align: center; margin-bottom: 14px; }

  .ch-checkout-btn { width: 100%; padding: 18px; background: var(--charcoal); color: var(--cream); border: none; border-radius: 2px; font-family: 'Lato', sans-serif; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; margin-bottom: 14px; transition: background 0.25s ease; position: relative; overflow: hidden; }
  .ch-checkout-btn::after { content: ''; position: absolute; inset: 0; background: var(--rose); transform: translateX(-100%); transition: transform 0.3s ease; z-index: 0; }
  .ch-checkout-btn:hover::after { transform: translateX(0); }
  .ch-checkout-btn span { position: relative; z-index: 1; }

  .ch-continue-link { display: block; text-align: center; color: var(--muted); text-decoration: none; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; transition: color 0.2s ease; padding: 8px; border-bottom: 1px solid var(--border); }
  .ch-continue-link:hover { color: var(--rose); }

  .ch-footer { position: relative; z-index: 1; background: var(--warm-white); border-top: 1px solid var(--border); padding: 32px 60px; display: flex; align-items: center; justify-content: space-between; }
  .ch-footer-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--charcoal); display: flex; align-items: center; gap: 8px; }
  .ch-footer-copy { font-size: 0.78rem; color: var(--muted); letter-spacing: 0.04em; }

  /* ─── TABLET ─── */
  @media (max-width: 1024px) and (min-width: 769px) {
    .ch-page { margin-left: 220px; padding-top: 56px; }
    .ch-header-inner { padding: 24px 24px; }
    .ch-cart-body { padding: 36px 24px 60px; }
    .ch-cart-layout { grid-template-columns: 1fr; }
    .ch-summary-panel { position: static; max-width: 100%; }
    .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 24px; }
    .ch-page-banner { padding: 36px 24px; }
    .ch-banner-title { font-size: 2rem; }
  }

  /* ─── MOBILE ─── */
  @media (max-width: 768px) {
    .ch-page { margin-left: 0; padding-top: 56px; }
    .ch-header-inner { padding: 14px 16px 14px 68px; margin-left: -50px; }
    .ch-logo-yarn { font-size: 1.8rem; }
    .ch-logo-text { font-size: 1.3rem; }
    .ch-tagline { display: none; }
    .ch-nav-cta { padding: 9px 14px; font-size: 0.72rem; }

    .ch-page-banner { padding: 28px 16px; }
    .ch-banner-title { font-size: 1.8rem; }
    .ch-banner-eyebrow { font-size: 0.62rem; }

    .ch-cart-body { padding: 24px 16px 48px; }
    .ch-cart-layout { grid-template-columns: 1fr; gap: 20px; }
    .ch-summary-panel { position: static; }
    .ch-items-panel-head { padding: 14px 16px; flex-wrap: wrap; gap: 8px; }

    .ch-cart-item { padding: 16px; gap: 12px; flex-wrap: wrap; }
    .ch-item-img { width: 70px; height: 70px; }
    .ch-item-info { min-width: calc(100% - 90px); }
    .ch-item-controls { flex-direction: row; align-items: center; width: 100%; justify-content: space-between; gap: 8px; flex-shrink: unset; }
    .ch-item-name { font-size: 0.9rem; }

    .ch-footer { flex-direction: column; gap: 10px; text-align: center; padding: 20px 16px; }
  }

  @media (max-width: 1024px) and (min-width: 769px) {
  .ch-page { margin-left: 160px; padding-top: 0 }
  .ch-header-inner { padding: 24px; }
  .ch-cart-body { padding: 36px 24px 60px; }
  .ch-cart-layout { grid-template-columns: 1fr; }
  .ch-summary-panel { position: static; max-width: 100%; }
  .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 24px; }
  .ch-page-banner { padding: 36px 24px; }
  .ch-banner-title { font-size: 2rem; }
}
`;

const resolveCurrentUserId = () => {
  // Same as Orders.js/Checkout.js
  const direct = localStorage.getItem('userId');
  if (direct) return String(direct);

  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const p = JSON.parse(raw);
      const id = p?.id || p?.userId;
      if (id) return String(id);
    }
  } catch {}

  try {
    const raw = localStorage.getItem('ch_user');
    if (raw) {
      const p = JSON.parse(raw);
      const id = p?.id || p?.userId;
      if (id) return String(id);
    }
  } catch {}

  try {
    const token = localStorage.getItem('ch_token') || localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload?.id || payload?.userId || payload?.sub;
      if (id) return String(id);
    }
  } catch {}

  return null;
};

const Cart = () => {
  const { cart, removeFromCart, incrementQuantity, decrementQuantity, selectedItems, toggleSelected, selectAll, deselectAll, getSelectedItems } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const safeCart = Array.isArray(cart) ? cart : [];
  const sortedCart = [...safeCart].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
  const uniqueCount = sortedCart.length;

  const selectedCart = getSelectedItems();
  const selectedCount = selectedCart.length;
  const total = selectedCart.reduce((sum, item) => {
    const price = parseFloat(item?.price) || 0;
    const qty = item?.quantity || 1;
    return sum + price * qty;
  }, 0);

  const allSelected = selectedItems.length === uniqueCount && uniqueCount > 0;

  const fmt = (p) => (isNaN(parseFloat(p)) ? '0.00' : parseFloat(p).toFixed(2));

  const handleCheckout = () => {
    const currentUserId = resolveCurrentUserId();
    if (!currentUserId) {
      setError('Please log in to proceed to checkout.');
      return;
    }
    if (selectedCount === 0) { setError('Please select at least one item to checkout.'); return; }
    setError('');
    navigate('/user/checkout');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ch-page">

        <header className="ch-header">
          <div className="ch-header-inner">
            <Link to="/user/home" className="ch-logo-block">
              <span className="ch-logo-yarn">🧶</span>
              <div>
                <div className="ch-logo-text">Crochet <span>Haven</span></div>
                <div className="ch-tagline">Stitched with love, for you</div>
              </div>
            </Link>
            <Link to="/user/products" className="ch-nav-cta">← Keep Shopping</Link>
          </div>
        </header>

        <div className="ch-page-banner">
          <div className="ch-banner-inner">
            <p className="ch-banner-eyebrow">Your Selection</p>
            <h1 className="ch-banner-title"><em>Shopping</em> Cart</h1>
            <p className="ch-banner-sub">{uniqueCount > 0 ? `${uniqueCount} ${uniqueCount === 1 ? 'product' : 'products'} ready for checkout` : 'No items added yet'}</p>
          </div>
        </div>

        <div className="ch-cart-body">
          {sortedCart.length === 0 ? (
            <div className="ch-cart-empty">
              <span className="ch-empty-icon">🛒</span>
              <div className="ch-empty-title">Your cart is empty</div>
              <p className="ch-empty-sub">Looks like you haven't added anything yet.</p>
              <Link to="/user/products" className="ch-btn-primary"><span>Browse Products</span></Link>
            </div>
          ) : (
            <div className="ch-cart-layout">
              <div className="ch-items-panel">
                <div className="ch-items-panel-head">
                  <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                    <h2>Cart Items</h2>
                    <span className="ch-item-count-badge">{uniqueCount} {uniqueCount === 1 ? 'product' : 'products'}</span>
                  </div>
                  <label className="ch-select-all-wrap">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => allSelected ? deselectAll() : selectAll()}
                    />
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </label>
                </div>
                {sortedCart.map(item => (
                  <div key={item.id} className="ch-cart-item">
                    <input
                      type="checkbox"
                      className="ch-item-checkbox"
                      checked={selectedItems.includes(`${item.id}-${item.selectedImage}`)}
                      onChange={() => toggleSelected(item.id, item.selectedImage)}
                    />
                    <div className="ch-item-img">
                      {item.selectedImage ? <img src={item.selectedImage} alt={item.name} /> : <span>🎁</span>}
                    </div>
                    <div className="ch-item-info">
                      <div className="ch-item-name">{item.name}</div>
                      <div className="ch-item-desc">{item.description}</div>
                      <span className="ch-item-cat">{item.category}</span>
                    </div>
                    <div className="ch-item-controls">
                      <span className="ch-item-price">₱{fmt(item.price * (item.quantity || 1))}</span>
                      <div className="ch-qty-strip">
                        <button className="ch-qty-strip-btn" onClick={() => decrementQuantity(item.id, item.selectedImage)} disabled={item.quantity <= 1}>−</button>
                        <span className="ch-qty-strip-val">{item.quantity || 1}</span>
                        <button className="ch-qty-strip-btn" onClick={() => incrementQuantity(item.id, item.selectedImage)}>+</button>
                      </div>
                      <button className="ch-remove-btn" onClick={() => removeFromCart(item.id, item.selectedImage)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ch-summary-panel">
                <div className="ch-summary-title">Order Summary</div>
                <div className="ch-summary-row">
                  <span>Subtotal ({selectedCount} {selectedCount === 1 ? 'item' : 'items'})</span>
                  <span>₱{fmt(total)}</span>
                </div>
                <div className="ch-summary-row">
                  <span>Shipping</span>
                  <span style={{ color: '#8aab8e', fontWeight: 700 }}>Free</span>
                </div>
                <div className="ch-summary-divider" />
                <div className="ch-summary-total">
                  <span className="ch-summary-total-lbl">Total</span>
                  <span className="ch-summary-total-price">₱{fmt(total)}</span>
                </div>
                {error && <div className="ch-checkout-error">{error}</div>}
                <button className="ch-checkout-btn" onClick={handleCheckout}>
                  <span>Proceed to Checkout →</span>
                </button>
                <Link to="/user/products" className="ch-continue-link">← Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>

        <footer className="ch-footer">
          <div className="ch-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>

      </div>
    </>
  );
};

export default Cart;