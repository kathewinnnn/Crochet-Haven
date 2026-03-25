import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const sidebarStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800&family=Lato:wght@300;400;700&display=swap');

  :root {
    --sb-bg: #2c2420;
    --sb-surface: rgba(255,255,255,0.04);
    --sb-border: rgba(255,255,255,0.07);
    --sb-rose: #e8728a;
    --sb-rose-glow: rgba(232,114,138,0.2);
    --sb-amber: #e8a45a;
    --sb-muted: rgba(255,255,255,0.38);
    --sb-text: rgba(255,255,255,0.82);
    --sb-width: 240px;
  }

  .ch-seller-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sb-width);
    height: 100vh;
    background: var(--sb-bg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 100;
    font-family: 'Lato', sans-serif;
  }

  .ch-seller-sidebar::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .ch-seller-sidebar::after {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--sb-rose-glow) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .ch-ss-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .ch-ss-logo {
    padding: 28px 24px 20px;
    border-bottom: 1px solid var(--sb-border);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ch-ss-logo-img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--sb-rose);
    flex-shrink: 0;
  }

  .ch-ss-logo-fallback {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--sb-rose), var(--sb-amber));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    flex-shrink: 0;
    border: 2px solid var(--sb-rose);
  }

  .ch-ss-brand {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
    letter-spacing: -0.01em;
  }

  .ch-ss-brand span { color: var(--sb-rose); }

  .ch-ss-tagline {
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--sb-muted);
    margin-top: 4px;
  }

  .ch-ss-section-lbl {
    padding: 20px 24px 8px;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--sb-muted);
  }

  .ch-ss-nav {
    flex: 1;
    overflow-y: auto;
    padding: 4px 12px;
    scrollbar-width: none;
  }

  .ch-ss-nav::-webkit-scrollbar { display: none; }

  .ch-ss-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    border-radius: 6px;
    color: var(--sb-text);
    font-size: 0.88rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 2px;
    position: relative;
    border: 1px solid transparent;
    user-select: none;
  }

  .ch-ss-item:hover {
    background: var(--sb-surface);
    color: #fff;
    border-color: var(--sb-border);
  }

  .ch-ss-item.active {
    background: linear-gradient(135deg, rgba(232,114,138,0.18) 0%, rgba(232,164,90,0.1) 100%);
    color: #fff;
    border-color: rgba(232,114,138,0.25);
    font-weight: 700;
  }

  .ch-ss-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 3px;
    background: var(--sb-rose);
    border-radius: 0 2px 2px 0;
  }

  .ch-ss-icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
  }

  .ch-ss-label { flex: 1; }

  .ch-ss-chevron {
    font-size: 0.6rem;
    color: var(--sb-muted);
    transition: transform 0.25s ease;
    margin-left: auto;
  }

  .ch-ss-chevron.open { transform: rotate(90deg); }

  .ch-ss-submenu {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease;
  }

  .ch-ss-submenu.open { max-height: 200px; }

  .ch-ss-sub-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 14px 9px 44px;
    border-radius: 6px;
    color: var(--sb-muted);
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 2px;
    border: 1px solid transparent;
  }

  .ch-ss-sub-item:hover {
    background: var(--sb-surface);
    color: var(--sb-text);
    border-color: var(--sb-border);
  }

  .ch-ss-sub-item.active { color: var(--sb-rose); font-weight: 700; }

  .ch-ss-sub-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--sb-muted);
    flex-shrink: 0;
    transition: background 0.2s ease;
  }

  .ch-ss-sub-item.active .ch-ss-sub-dot,
  .ch-ss-sub-item:hover .ch-ss-sub-dot { background: var(--sb-rose); }

  .ch-ss-divider {
    height: 1px;
    background: var(--sb-border);
    margin: 8px 12px;
  }

  .ch-ss-footer {
    padding: 12px;
    border-top: 1px solid var(--sb-border);
  }

  .ch-ss-logout {
    width: 100%;
    padding: 12px 14px;
    border-radius: 6px;
    border: 1px solid rgba(232,114,138,0.25);
    background: rgba(232,114,138,0.08);
    color: var(--sb-rose);
    font-family: 'Lato', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .ch-ss-logout:hover {
    background: var(--sb-rose);
    color: #fff;
    border-color: var(--sb-rose);
    box-shadow: 0 4px 16px rgba(232,114,138,0.3);
  }

  /* ── Mobile Topbar (hamburger) ── */
  .ch-mobile-topbar {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: var(--sb-bg);
    z-index: 200;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid var(--sb-border);
    font-family: 'Lato', sans-serif;
  }

  .ch-mobile-topbar-brand {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.01em;
  }

  .ch-mobile-topbar-brand span { color: var(--sb-rose); }

  .ch-hamburger {
    width: 36px;
    height: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.18s ease;
  }

  .ch-hamburger:hover { background: var(--sb-surface); }

  .ch-hamburger-line {
    width: 22px;
    height: 2px;
    background: rgba(255,255,255,0.82);
    border-radius: 2px;
    transition: all 0.28s ease;
    transform-origin: center;
  }

  .ch-hamburger.open .ch-hamburger-line:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .ch-hamburger.open .ch-hamburger-line:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }

  .ch-hamburger.open .ch-hamburger-line:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* Mobile drawer overlay */
  .ch-mobile-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 149;
    backdrop-filter: blur(2px);
    animation: ch-overlay-in 0.22s ease;
  }

  @keyframes ch-overlay-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Mobile drawer */
  .ch-mobile-drawer {
    position: fixed;
    top: 56px;
    left: 0;
    width: 260px;
    height: calc(100vh - 56px);
    background: var(--sb-bg);
    z-index: 150;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ch-mobile-drawer.open {
    transform: translateX(0);
  }

  .ch-mobile-drawer::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .ch-mobile-drawer-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .ch-ss-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: ch-ss-fade 0.2s ease;
  }

  @keyframes ch-ss-fade { from { opacity: 0; } to { opacity: 1; } }

  .ch-ss-modal {
    background: #fffbf5;
    border-radius: 4px;
    padding: 40px 36px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 24px 64px rgba(0,0,0,0.25);
    animation: ch-ss-modal-up 0.3s ease;
  }

  @keyframes ch-ss-modal-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ch-ss-modal-icon { font-size: 2.8rem; margin-bottom: 16px; display: block; }

  .ch-ss-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #2c2420;
    margin-bottom: 10px;
    letter-spacing: -0.01em;
  }

  .ch-ss-modal-desc {
    font-size: 0.88rem;
    color: #8a7a74;
    line-height: 1.7;
    margin-bottom: 28px;
    font-weight: 300;
  }

  .ch-ss-modal-actions { display: flex; gap: 12px; justify-content: center; }

  .ch-ss-modal-cancel {
    padding: 12px 28px;
    border: 1.5px solid rgba(212,115,94,0.25);
    border-radius: 2px;
    background: transparent;
    color: #8a7a74;
    font-family: 'Lato', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ch-ss-modal-cancel:hover { border-color: #8a7a74; color: #2c2420; }

  .ch-ss-modal-confirm {
    padding: 12px 28px;
    border: none;
    border-radius: 2px;
    background: #e8728a;
    color: #fff;
    font-family: 'Lato', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .ch-ss-modal-confirm::after {
    content: '';
    position: absolute;
    inset: 0;
    background: #c4556b;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 0;
  }

  .ch-ss-modal-confirm:hover::after { transform: translateX(0); }
  .ch-ss-modal-confirm span { position: relative; z-index: 1; }

  .ch-ss-spinner {
    width: 44px;
    height: 44px;
    border: 3px solid rgba(232,114,138,0.2);
    border-top-color: #e8728a;
    border-radius: 50%;
    animation: ch-ss-spin 0.9s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes ch-ss-spin { to { transform: rotate(360deg); } }

  .ch-ss-spinning-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    color: #2c2420;
    margin-bottom: 6px;
  }

  .ch-ss-spinning-sub { font-size: 0.82rem; color: #8a7a74; font-weight: 300; }

  /* ── Responsive breakpoints ── */
  @media (max-width: 1024px) {
    /* Tablet: sidebar stays but slightly narrower */
    .ch-seller-sidebar {
      width: 200px;
    }
    :root {
      --sb-width: 200px;
    }
  }

  @media (max-width: 768px) {
    /* Mobile: hide fixed sidebar, show topbar + drawer */
    .ch-seller-sidebar {
      display: none !important;
    }
    .ch-mobile-topbar {
      display: flex;
    }
    .ch-mobile-overlay.visible {
      display: block;
    }
  }
`;

const NavContent = ({ activePage, setActivePage, showProducts, setShowProducts, onItemClick }) => {
  const isProductsActive = activePage === "add-product" || activePage === "categories";

  const mainItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "orders",    icon: "📦", label: "Orders" },
    { id: "reports",   icon: "📈", label: "Reports" },
  ];

  const accountItems = [
    { id: "settings", icon: "⚙️", label: "Settings" },
    { id: "profile",  icon: "👤", label: "Profile" },
  ];

  const handleClick = (id) => {
    setActivePage(id);
    if (onItemClick) onItemClick();
  };

  return (
    <>
      <div className="ch-ss-section-lbl">Main</div>
      <nav className="ch-ss-nav">
        {mainItems.map((item) => (
          <div
            key={item.id}
            className={`ch-ss-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => handleClick(item.id)}
          >
            <span className="ch-ss-icon">{item.icon}</span>
            <span className="ch-ss-label">{item.label}</span>
          </div>
        ))}

        <div
          className={`ch-ss-item ${isProductsActive ? "active" : ""}`}
          onClick={() => setShowProducts(!showProducts)}
        >
          <span className="ch-ss-icon">🛍️</span>
          <span className="ch-ss-label">Products</span>
          <span className={`ch-ss-chevron ${showProducts ? "open" : ""}`}>▶</span>
        </div>

        <div className={`ch-ss-submenu ${showProducts ? "open" : ""}`}>
          <div
            className={`ch-ss-sub-item ${activePage === "add-product" ? "active" : ""}`}
            onClick={() => handleClick("add-product")}
          >
            <div className="ch-ss-sub-dot" />
            Add Products
          </div>
          <div
            className={`ch-ss-sub-item ${activePage === "categories" ? "active" : ""}`}
            onClick={() => handleClick("categories")}
          >
            <div className="ch-ss-sub-dot" />
            Categories
          </div>
        </div>

        <div className="ch-ss-divider" />
        <div className="ch-ss-section-lbl" style={{ padding: "8px 2px 8px" }}>Account</div>

        {accountItems.map((item) => (
          <div
            key={item.id}
            className={`ch-ss-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => handleClick(item.id)}
          >
            <span className="ch-ss-icon">{item.icon}</span>
            <span className="ch-ss-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </>
  );
};

const SellerSidebar = ({ setActivePage, activePage }) => {
  const [showProducts, setShowProducts] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }, 1500);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (mobileOpen) setMobileOpen(false);
        if (showLogoutModal && !isLoggingOut) setShowLogoutModal(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showLogoutModal, isLoggingOut, mobileOpen]);

  useEffect(() => {
    if (showLogoutModal && !isLoggingOut && cancelButtonRef.current) cancelButtonRef.current.focus();
  }, [showLogoutModal, isLoggingOut]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <style>{sidebarStyles}</style>

      {/* ── Desktop / Tablet Sidebar ── */}
      <aside className="ch-seller-sidebar">
        <div className="ch-ss-inner">
          <div className="ch-ss-logo">
            <img
              src="/img/ch.png"
              alt="Crochet Haven"
              className="ch-ss-logo-img"
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            />
            <div className="ch-ss-logo-fallback" style={{ display: "none" }}>🧶</div>
            <div>
              <div className="ch-ss-brand">Crochet <span>Haven</span></div>
              <div className="ch-ss-tagline">Seller Panel</div>
            </div>
          </div>

          <NavContent
            activePage={activePage}
            setActivePage={setActivePage}
            showProducts={showProducts}
            setShowProducts={setShowProducts}
          />

          <div className="ch-ss-footer">
            <button className="ch-ss-logout" onClick={() => setShowLogoutModal(true)}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Topbar ── */}
      <div className="ch-mobile-topbar">
        <div className="ch-mobile-topbar-brand">Crochet <span>Haven</span></div>
        <button
          className={`ch-hamburger ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <div className="ch-hamburger-line" />
          <div className="ch-hamburger-line" />
          <div className="ch-hamburger-line" />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`ch-mobile-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile Drawer ── */}
      <div className={`ch-mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <div className="ch-mobile-drawer-inner">
          <NavContent
            activePage={activePage}
            setActivePage={setActivePage}
            showProducts={showProducts}
            setShowProducts={setShowProducts}
            onItemClick={() => setMobileOpen(false)}
          />

          <div className="ch-ss-footer">
            <button
              className="ch-ss-logout"
              onClick={() => { setMobileOpen(false); setShowLogoutModal(true); }}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          className="ch-ss-modal-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget && !isLoggingOut) setShowLogoutModal(false); }}
        >
          <div className="ch-ss-modal" role="dialog" aria-modal="true">
            {isLoggingOut ? (
              <>
                <div className="ch-ss-spinner" />
                <div className="ch-ss-spinning-title">Logging out…</div>
                <div className="ch-ss-spinning-sub">Please wait a moment.</div>
              </>
            ) : (
              <>
                <span className="ch-ss-modal-icon">🚪</span>
                <div className="ch-ss-modal-title">Confirm Logout</div>
                <div className="ch-ss-modal-desc">
                  Are you sure you want to logout? You'll need to sign in again to access your seller account.
                </div>
                <div className="ch-ss-modal-actions">
                  <button ref={cancelButtonRef} className="ch-ss-modal-cancel" onClick={() => setShowLogoutModal(false)}>
                    Cancel
                  </button>
                  <button className="ch-ss-modal-confirm" onClick={handleLogout}>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SellerSidebar;