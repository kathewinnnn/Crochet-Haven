import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from '../../context/CartContext';

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

  .ch-sidebar {
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

  .ch-sidebar::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .ch-sidebar::after {
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

  .ch-sb-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0;
  }

  /* ─── LOGO AREA ─── */
  .ch-sb-logo {
    padding: 28px 24px 20px;
    border-bottom: 1px solid var(--sb-border);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .ch-sb-logo:hover { opacity: 0.85; }

  .ch-sb-logo-img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--sb-rose);
    flex-shrink: 0;
  }

  .ch-sb-logo-fallback {
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

  .ch-sb-brand {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
    letter-spacing: -0.01em;
  }

  .ch-sb-brand span { color: var(--sb-rose); }

  .ch-sb-tagline {
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--sb-muted);
    margin-top: 4px;
  }

  /* ─── SECTION LABEL ─── */
  .ch-sb-section-lbl {
    padding: 20px 24px 8px;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--sb-muted);
  }

  /* ─── NAV ─── */
  .ch-sb-nav {
    flex: 1;
    overflow-y: auto;
    padding: 4px 12px;
    scrollbar-width: none;
  }

  .ch-sb-nav::-webkit-scrollbar { display: none; }

  .ch-sb-item {
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

  .ch-sb-item:hover {
    background: var(--sb-surface);
    color: #fff;
    border-color: var(--sb-border);
  }

  .ch-sb-item.active {
    background: linear-gradient(135deg, rgba(232,114,138,0.18) 0%, rgba(232,164,90,0.1) 100%);
    color: #fff;
    border-color: rgba(232,114,138,0.25);
    font-weight: 700;
  }

  .ch-sb-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 3px;
    background: var(--sb-rose);
    border-radius: 0 2px 2px 0;
  }

  .ch-sb-icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
  }

  .ch-sb-label { flex: 1; }

  .ch-sb-badge {
    background: var(--sb-rose);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    box-shadow: 0 2px 8px rgba(232,114,138,0.4);
  }

  .ch-sb-chevron {
    font-size: 0.6rem;
    color: var(--sb-muted);
    transition: transform 0.25s ease;
    margin-left: auto;
  }

  .ch-sb-chevron.open { transform: rotate(90deg); }

  /* ─── SUBMENU ─── */
  .ch-sb-submenu {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease;
  }

  .ch-sb-submenu.open { max-height: 200px; }

  .ch-sb-sub-item {
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

  .ch-sb-sub-item:hover { background: var(--sb-surface); color: var(--sb-text); border-color: var(--sb-border); }
  .ch-sb-sub-item.active { color: var(--sb-rose); font-weight: 700; }

  .ch-sb-sub-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--sb-muted);
    flex-shrink: 0;
    transition: background 0.2s ease;
  }

  .ch-sb-sub-item.active .ch-sb-sub-dot,
  .ch-sb-sub-item:hover .ch-sb-sub-dot { background: var(--sb-rose); }

  /* ─── DIVIDER ─── */
  .ch-sb-divider {
    height: 1px;
    background: var(--sb-border);
    margin: 8px 12px;
  }

  /* ─── LOGOUT ─── */
  .ch-sb-footer {
    padding: 12px;
    border-top: 1px solid var(--sb-border);
  }

  .ch-sb-logout {
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

  .ch-sb-logout:hover {
    background: var(--sb-rose);
    color: #fff;
    border-color: var(--sb-rose);
    box-shadow: 0 4px 16px rgba(232,114,138,0.3);
  }

  /* ─── HAMBURGER BUTTON (mobile only) ─── */
  .ch-hamburger {
    display: none;
    position: fixed;
    top: 14px;
    left: 14px;
    z-index: 200;
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: var(--sb-bg);
    border: 1px solid var(--sb-border);
    cursor: pointer;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
    padding: 0;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }

  .ch-hamburger:hover { background: rgba(232,114,138,0.15); border-color: rgba(232,114,138,0.4); }

  .ch-hamburger-bar {
    width: 20px;
    height: 2px;
    background: rgba(255,255,255,0.82);
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  .ch-hamburger.open .ch-hamburger-bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .ch-hamburger.open .ch-hamburger-bar:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }
  .ch-hamburger.open .ch-hamburger-bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* ─── MOBILE OVERLAY ─── */
  .ch-sb-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 99;
    backdrop-filter: blur(2px);
    animation: ch-overlay-in 0.2s ease;
  }

  @keyframes ch-overlay-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* ─── MODAL ─── */
  .ch-sb-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: ch-fade 0.2s ease;
  }

  @keyframes ch-fade { from { opacity: 0; } to { opacity: 1; } }

  .ch-sb-modal {
    background: #fffbf5;
    border-radius: 4px;
    padding: 40px 36px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 24px 64px rgba(0,0,0,0.25);
    animation: ch-modal-up 0.3s ease;
    position: relative;
  }

  @keyframes ch-modal-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ch-sb-modal-icon { font-size: 2.8rem; margin-bottom: 16px; display: block; }

  .ch-sb-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #2c2420;
    margin-bottom: 10px;
    letter-spacing: -0.01em;
  }

  .ch-sb-modal-desc {
    font-size: 0.88rem;
    color: #8a7a74;
    line-height: 1.7;
    margin-bottom: 28px;
    font-weight: 300;
  }

  .ch-sb-modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .ch-sb-modal-cancel {
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

  .ch-sb-modal-cancel:hover { border-color: #8a7a74; color: #2c2420; }

  .ch-sb-modal-confirm {
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

  .ch-sb-modal-confirm::after {
    content: '';
    position: absolute;
    inset: 0;
    background: #c4556b;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 0;
  }

  .ch-sb-modal-confirm:hover::after { transform: translateX(0); }
  .ch-sb-modal-confirm span { position: relative; z-index: 1; }

  .ch-sb-spinner {
    width: 44px;
    height: 44px;
    border: 3px solid rgba(232,114,138,0.2);
    border-top-color: #e8728a;
    border-radius: 50%;
    animation: ch-spin 0.9s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes ch-spin { to { transform: rotate(360deg); } }

  .ch-sb-spinning-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    color: #2c2420;
    margin-bottom: 6px;
  }

  .ch-sb-spinning-sub { font-size: 0.82rem; color: #8a7a74; font-weight: 300; }

  /* ─── RESPONSIVE ─── */

  /* Tablet (768px - 1024px): sidebar stays but slightly narrower, content adjusts */
  @media (max-width: 1024px) and (min-width: 769px) {
    :root { --sb-width: 220px; }
  }

  /* Mobile (≤768px): hamburger shows, sidebar becomes a drawer */
  @media (max-width: 768px) {
    .ch-hamburger {
      display: flex;
    }

    .ch-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      width: 280px;
      z-index: 150;
    }

    .ch-sidebar.mobile-open {
      transform: translateX(0);
      box-shadow: 8px 0 40px rgba(0,0,0,0.4);
    }

    .ch-sb-overlay {
      display: block;
    }
  }
`;

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAccount, setShowAccount] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const { totalItems } = useCart();

  const isActive = (path) => {
    if (path === "/user" && location.pathname === "/user") return true;
    if (path !== "/user" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }, 1500);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showLogoutModal && !isLoggingOut) setShowLogoutModal(false);
        if (mobileOpen) setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showLogoutModal, isLoggingOut, mobileOpen]);

  useEffect(() => {
    if (showLogoutModal && !isLoggingOut && cancelButtonRef.current) cancelButtonRef.current.focus();
  }, [showLogoutModal, isLoggingOut]);

  const navItems = [
    { path: "/user", icon: "🏠", label: "Home" },
    { path: "/user/products", icon: "🛍️", label: "Products" },
    { path: "/user/cart", icon: "🛒", label: "Cart", badge: totalItems > 0 ? totalItems : null },
    { path: "/user/about", icon: "ℹ️", label: "About" },
  ];

  const accountItems = [
    { path: "/user/profile", label: "Profile" },
    { path: "/user/orders", label: "My Orders" },
    { path: "/user/settings", label: "Settings" },
  ];

  return (
    <>
      <style>{sidebarStyles}</style>

      {/* Hamburger button (mobile only) */}
      <button
        className={`ch-hamburger${mobileOpen ? ' open' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      >
        <span className="ch-hamburger-bar" />
        <span className="ch-hamburger-bar" />
        <span className="ch-hamburger-bar" />
      </button>

      {/* Overlay (mobile) */}
      {mobileOpen && (
        <div className="ch-sb-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`ch-sidebar${mobileOpen ? ' mobile-open' : ''}`}>
        <div className="ch-sb-inner">

          {/* Logo */}
          <div className="ch-sb-logo" onClick={() => handleNavClick("/user")}>
            <img
              src="/img/ch.png"
              alt="Crochet Haven"
              className="ch-sb-logo-img"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className="ch-sb-logo-fallback" style={{ display: 'none' }}>🧶</div>
            <div>
              <div className="ch-sb-brand">Crochet <span>Haven</span></div>
              <div className="ch-sb-tagline">Shop Zone</div>
            </div>
          </div>

          {/* Nav */}
          <div className="ch-sb-section-lbl">Navigation</div>
          <nav className="ch-sb-nav">

            {navItems.map(item => (
              <div
                key={item.path}
                className={`ch-sb-item${isActive(item.path) ? ' active' : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                <span className="ch-sb-icon">{item.icon}</span>
                <span className="ch-sb-label">{item.label}</span>
                {item.badge && <span className="ch-sb-badge">{item.badge}</span>}
              </div>
            ))}

            <div className="ch-sb-divider" />

            {/* Account dropdown */}
            <div
              className={`ch-sb-item${accountItems.some(a => isActive(a.path)) ? ' active' : ''}`}
              onClick={() => setShowAccount(!showAccount)}
            >
              <span className="ch-sb-icon">👤</span>
              <span className="ch-sb-label">My Account</span>
              <span className={`ch-sb-chevron${showAccount ? ' open' : ''}`}>▶</span>
            </div>

            <div className={`ch-sb-submenu${showAccount ? ' open' : ''}`}>
              {accountItems.map(item => (
                <div
                  key={item.path}
                  className={`ch-sb-sub-item${isActive(item.path) ? ' active' : ''}`}
                  onClick={() => handleNavClick(item.path)}
                >
                  <div className="ch-sb-sub-dot" />
                  {item.label}
                </div>
              ))}
            </div>

          </nav>

          {/* Logout */}
          <div className="ch-sb-footer">
            <button className="ch-sb-logout" onClick={() => setShowLogoutModal(true)}>
              <span>🚪</span> Logout
            </button>
          </div>

        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          className="ch-sb-modal-backdrop"
          onClick={e => { if (e.target === e.currentTarget && !isLoggingOut) setShowLogoutModal(false); }}
        >
          <div className="ch-sb-modal" role="dialog" aria-modal="true">
            {isLoggingOut ? (
              <>
                <div className="ch-sb-spinner" />
                <div className="ch-sb-spinning-title">Logging out…</div>
                <div className="ch-sb-spinning-sub">Please wait a moment.</div>
              </>
            ) : (
              <>
                <span className="ch-sb-modal-icon">🚪</span>
                <div className="ch-sb-modal-title">Confirm Logout</div>
                <div className="ch-sb-modal-desc">Are you sure you want to logout? You'll need to sign in again to access your account.</div>
                <div className="ch-sb-modal-actions">
                  <button
                    ref={cancelButtonRef}
                    className="ch-sb-modal-cancel"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="ch-sb-modal-confirm" onClick={handleLogout}>
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

export default UserSidebar;