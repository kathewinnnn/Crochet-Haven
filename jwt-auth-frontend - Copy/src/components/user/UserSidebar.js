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
    position: fixed; top: 0; left: 0;
    width: var(--sb-width); height: 100vh;
    background: var(--sb-bg);
    display: flex; flex-direction: column;
    overflow: hidden; z-index: 100;
    font-family: 'Lato', sans-serif;
  }
  .ch-sidebar::before {
    content: ''; position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0;
  }
  .ch-sidebar::after {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, var(--sb-rose-glow) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .ch-sb-inner { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; }
  .ch-sb-logo { padding: 28px 24px 20px; border-bottom: 1px solid var(--sb-border); display: flex; align-items: center; gap: 12px; cursor: pointer; transition: opacity 0.2s ease; flex-shrink: 0; }
  .ch-sb-logo:hover { opacity: 0.85; }
  .ch-sb-logo-img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--sb-rose); flex-shrink: 0; }
  .ch-sb-logo-fallback { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--sb-rose), var(--sb-amber)); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; border: 2px solid var(--sb-rose); }
  .ch-sb-brand-wrapper { flex: 1; min-width: 0; }
  .ch-sb-brand { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 800; color: #fff; line-height: 1; letter-spacing: -0.01em; }
  .ch-sb-brand span { color: var(--sb-rose); }
  .ch-sb-tagline { font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--sb-muted); margin-top: 4px; }
  .ch-sb-section-lbl { padding: 20px 24px 8px; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--sb-muted); flex-shrink: 0; }
  .ch-sb-nav { flex: 1; overflow-y: auto; padding: 4px 12px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .ch-sb-nav::-webkit-scrollbar { display: none; }
  .ch-sb-item { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 6px; color: var(--sb-text); font-size: 0.88rem; font-weight: 400; cursor: pointer; transition: all 0.2s ease; margin-bottom: 2px; position: relative; border: 1px solid transparent; user-select: none; -webkit-tap-highlight-color: transparent; }
  .ch-sb-item:hover { background: var(--sb-surface); color: #fff; border-color: var(--sb-border); }
  .ch-sb-item.active { background: linear-gradient(135deg, rgba(232,114,138,0.18) 0%, rgba(232,164,90,0.1) 100%); color: #fff; border-color: rgba(232,114,138,0.25); font-weight: 700; }
  .ch-sb-item.active::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 3px; background: var(--sb-rose); border-radius: 0 2px 2px 0; }
  .ch-sb-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }
  .ch-sb-label { flex: 1; }
  .ch-sb-badge { background: var(--sb-rose); color: #fff; font-size: 0.65rem; font-weight: 700; min-width: 20px; height: 20px; border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 0 6px; box-shadow: 0 2px 8px rgba(232,114,138,0.4); }
  .ch-sb-chevron { font-size: 0.6rem; color: var(--sb-muted); transition: transform 0.25s ease; margin-left: auto; }
  .ch-sb-chevron.open { transform: rotate(90deg); }
  .ch-sb-submenu { overflow: hidden; max-height: 0; transition: max-height 0.3s ease; }
  .ch-sb-submenu.open { max-height: 200px; }
  .ch-sb-sub-item { display: flex; align-items: center; gap: 10px; padding: 9px 14px 9px 44px; border-radius: 6px; color: var(--sb-muted); font-size: 0.82rem; cursor: pointer; transition: all 0.2s ease; margin-bottom: 2px; border: 1px solid transparent; -webkit-tap-highlight-color: transparent; }
  .ch-sb-sub-item:hover { background: var(--sb-surface); color: var(--sb-text); border-color: var(--sb-border); }
  .ch-sb-sub-item.active { color: var(--sb-rose); font-weight: 700; }
  .ch-sb-sub-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--sb-muted); flex-shrink: 0; transition: background 0.2s ease; }
  .ch-sb-sub-item.active .ch-sb-sub-dot, .ch-sb-sub-item:hover .ch-sb-sub-dot { background: var(--sb-rose); }
  .ch-sb-divider { height: 1px; background: var(--sb-border); margin: 8px 12px; }
  .ch-sb-footer { padding: 12px; border-top: 1px solid var(--sb-border); flex-shrink: 0; }
  .ch-sb-logout { width: 100%; padding: 12px 14px; border-radius: 6px; border: 1px solid rgba(232,114,138,0.25); background: rgba(232,114,138,0.08); color: var(--sb-rose); font-family: 'Lato', sans-serif; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease; -webkit-tap-highlight-color: transparent; }
  .ch-sb-logout:hover { background: var(--sb-rose); color: #fff; border-color: var(--sb-rose); box-shadow: 0 4px 16px rgba(232,114,138,0.3); }

  .ch-mobile-topbar { display: none; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: var(--sb-bg); z-index: 200; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid var(--sb-border); font-family: 'Lato', sans-serif; }
  .ch-mobile-topbar-brand { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 800; color: #fff; letter-spacing: -0.01em; }
  .ch-mobile-topbar-brand span { color: var(--sb-rose); }
  .ch-hamburger { width: 36px; height: 36px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; cursor: pointer; background: transparent; border: none; padding: 4px; border-radius: 4px; transition: background 0.18s ease; -webkit-tap-highlight-color: transparent; }
  .ch-hamburger:hover { background: var(--sb-surface); }
  .ch-hamburger-line { width: 22px; height: 2px; background: rgba(255,255,255,0.82); border-radius: 2px; transition: all 0.28s ease; transform-origin: center; }
  .ch-hamburger.open .ch-hamburger-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .ch-hamburger.open .ch-hamburger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .ch-hamburger.open .ch-hamburger-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  .ch-mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 149; backdrop-filter: blur(2px); animation: ch-overlay-in 0.22s ease; cursor: pointer; }
  @keyframes ch-overlay-in { from { opacity: 0; } to { opacity: 1; } }
  .ch-mobile-drawer { position: fixed; top: 56px; left: 0; width: 260px; height: calc(100vh - 56px); background: var(--sb-bg); z-index: 150; display: flex; flex-direction: column; overflow: hidden; transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
  .ch-mobile-drawer.open { transform: translateX(0); box-shadow: 8px 0 48px rgba(0,0,0,0.45); }
  .ch-mobile-drawer::before { content: ''; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; z-index: 0; }
  .ch-mobile-drawer-inner { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; }

  .ch-sb-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: ch-fade 0.2s ease; padding: 16px; }
  @keyframes ch-fade { from { opacity: 0; } to { opacity: 1; } }
  .ch-sb-modal { background: #fffbf5; border-radius: 4px; padding: 40px 36px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,0.25); animation: ch-modal-up 0.3s ease; position: relative; }
  @keyframes ch-modal-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .ch-sb-modal-icon { font-size: 2.8rem; margin-bottom: 16px; display: block; }
  .ch-sb-modal-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 800; color: #2c2420; margin-bottom: 10px; }
  .ch-sb-modal-desc { font-size: 0.88rem; color: #8a7a74; line-height: 1.7; margin-bottom: 28px; font-weight: 300; }
  .ch-sb-modal-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .ch-sb-modal-cancel { padding: 12px 28px; border: 1.5px solid rgba(212,115,94,0.25); border-radius: 2px; background: transparent; color: #8a7a74; font-family: 'Lato', sans-serif; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
  .ch-sb-modal-cancel:hover { border-color: #8a7a74; color: #2c2420; }
  .ch-sb-modal-confirm { padding: 12px 28px; border: none; border-radius: 2px; background: #e8728a; color: #fff; font-family: 'Lato', sans-serif; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.25s ease; position: relative; overflow: hidden; }
  .ch-sb-modal-confirm::after { content: ''; position: absolute; inset: 0; background: #c4556b; transform: translateX(-100%); transition: transform 0.25s ease; z-index: 0; }
  .ch-sb-modal-confirm:hover::after { transform: translateX(0); }
  .ch-sb-modal-confirm span { position: relative; z-index: 1; }
  .ch-sb-spinner { width: 44px; height: 44px; border: 3px solid rgba(232,114,138,0.2); border-top-color: #e8728a; border-radius: 50%; animation: ch-spin 0.9s linear infinite; margin: 0 auto 16px; }
  @keyframes ch-spin { to { transform: rotate(360deg); } }
  .ch-sb-spinning-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #2c2420; margin-bottom: 6px; }
  .ch-sb-spinning-sub { font-size: 0.82rem; color: #8a7a74; font-weight: 300; }

  @media (max-width: 1024px) and (min-width: 769px) {
    :root { --sb-width: 160px; }
    .ch-sidebar { display: flex !important; width: var(--sb-width); }
    .ch-mobile-topbar { display: none !important; }
    .ch-mobile-overlay { display: none !important; }
    .ch-mobile-drawer { display: none !important; }
    .ch-sb-logo { padding: 18px 14px 14px; gap: 8px; }
    .ch-sb-logo-img, .ch-sb-logo-fallback { width: 34px; height: 34px; font-size: 1.1rem; }
    .ch-sb-brand { font-size: 0.88rem; }
    .ch-sb-tagline { font-size: 0.55rem; letter-spacing: 0.14em; }
    .ch-sb-section-lbl { padding: 14px 14px 6px; font-size: 0.55rem; }
    .ch-sb-nav { padding: 4px 8px; }
    .ch-sb-item { padding: 9px 10px; font-size: 0.8rem; gap: 7px; }
    .ch-sb-icon { font-size: 0.9rem; width: 18px; }
    .ch-sb-sub-item { padding: 8px 10px 8px 34px; font-size: 0.76rem; }
    .ch-sb-footer { padding: 10px; }
    .ch-sb-logout { padding: 10px 8px; font-size: 0.72rem; gap: 5px; letter-spacing: 0.05em; }
  }

  @media (max-width: 768px) {
    .ch-sidebar { display: none !important; }
    .ch-mobile-topbar { display: flex; }
    .ch-mobile-overlay.visible { display: block; }
    .ch-sb-modal { padding: 32px 24px; }
    .ch-sb-modal-title { font-size: 1.3rem; }
    .ch-sb-modal-actions { flex-direction: column; }
    .ch-sb-modal-cancel, .ch-sb-modal-confirm { width: 100%; padding: 14px; }
  }

  @media (max-width: 380px) {
    .ch-mobile-drawer { width: 240px; }
  }
`;

const NavContent = ({ showAccount, setShowAccount, onItemClick, totalItems, navigate }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/user" && location.pathname === "/user") return true;
    if (path !== "/user" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleClick = (path) => {
    navigate(path);
    if (onItemClick) onItemClick();
  };

  const navItems = [
    { path: "/user",          icon: "🏠", label: "Home" },
    { path: "/user/products", icon: "🛍️", label: "Products" },
    { path: "/user/cart",     icon: "🛒", label: "Cart", badge: totalItems > 0 ? totalItems : null },
    { path: "/user/about",    icon: "ℹ️",  label: "About" },
  ];

  const accountItems = [
    { path: "/user/profile",  label: "Profile" },
    { path: "/user/orders",   label: "My Orders" },
    { path: "/user/settings", label: "Settings" },
  ];

  return (
    <>
      <div className="ch-sb-section-lbl">Navigation</div>
      <nav className="ch-sb-nav">
        {navItems.map(item => (
          <div
            key={item.path}
            className={`ch-sb-item${isActive(item.path) ? " active" : ""}`}
            onClick={() => handleClick(item.path)}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === "Enter" && handleClick(item.path)}
          >
            <span className="ch-sb-icon">{item.icon}</span>
            <span className="ch-sb-label">{item.label}</span>
            {item.badge && <span className="ch-sb-badge">{item.badge}</span>}
          </div>
        ))}

        <div className="ch-sb-divider" />

        <div
          className={`ch-sb-item${accountItems.some(a => isActive(a.path)) ? " active" : ""}`}
          onClick={() => setShowAccount(!showAccount)}
          role="button" tabIndex={0}
          onKeyDown={e => e.key === "Enter" && setShowAccount(!showAccount)}
          aria-expanded={showAccount}
        >
          <span className="ch-sb-icon">👤</span>
          <span className="ch-sb-label">My Account</span>
          <span className={`ch-sb-chevron${showAccount ? " open" : ""}`}>▶</span>
        </div>

        <div className={`ch-sb-submenu${showAccount ? " open" : ""}`}>
          {accountItems.map(item => (
            <div
              key={item.path}
              className={`ch-sb-sub-item${isActive(item.path) ? " active" : ""}`}
              onClick={() => handleClick(item.path)}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === "Enter" && handleClick(item.path)}
            >
              <div className="ch-sb-sub-dot" />
              {item.label}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
};

const UserSidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { totalItems } = useCart();

  const [showAccount,     setShowAccount]     = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut,    setIsLoggingOut]    = useState(false);
  const [mobileOpen,      setMobileOpen]      = useState(false);
  const cancelButtonRef = useRef(null);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      // ── Clear every auth / cart key ──────────────────────────────────
      ['token', 'ch_token', 'user', 'ch_user', 'ch_avatar',
       'profileActiveSection', 'ch_notifications', 'ch_privacy'
      ].forEach(k => localStorage.removeItem(k));

      // Tell CartContext to reset to guest cart immediately
      window.dispatchEvent(new Event('userAuthChanged'));

      navigate('/');
    }, 1500);
  };

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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

  return (
    <>
      <style>{sidebarStyles}</style>

      {/* Desktop + Tablet Sidebar */}
      <aside className="ch-sidebar" aria-label="Navigation sidebar">
        <div className="ch-sb-inner">
          <div className="ch-sb-logo" onClick={() => navigate("/user")}>
            <img
              src="/img/ch.png" alt="Crochet Haven" className="ch-sb-logo-img"
              onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            />
            <div className="ch-sb-logo-fallback" style={{ display: "none" }}>🧶</div>
            <div className="ch-sb-brand-wrapper">
              <div className="ch-sb-brand">Crochet <span>Haven</span></div>
              <div className="ch-sb-tagline">Shop Zone</div>
            </div>
          </div>

          <NavContent showAccount={showAccount} setShowAccount={setShowAccount} totalItems={totalItems} navigate={navigate} />

          <div className="ch-sb-footer">
            <button className="ch-sb-logout" onClick={() => setShowLogoutModal(true)}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
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

      <div className={`ch-mobile-overlay ${mobileOpen ? "visible" : ""}`} onClick={() => setMobileOpen(false)} aria-hidden="true" />

      {/* Mobile Drawer */}
      <div className={`ch-mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <div className="ch-mobile-drawer-inner">
          <NavContent showAccount={showAccount} setShowAccount={setShowAccount} totalItems={totalItems} navigate={navigate} onItemClick={() => setMobileOpen(false)} />
          <div className="ch-sb-footer">
            <button className="ch-sb-logout" onClick={() => { setMobileOpen(false); setShowLogoutModal(true); }}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          className="ch-sb-modal-backdrop"
          onClick={e => { if (e.target === e.currentTarget && !isLoggingOut) setShowLogoutModal(false); }}
        >
          <div className="ch-sb-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
            {isLoggingOut ? (
              <>
                <div className="ch-sb-spinner" />
                <div className="ch-sb-spinning-title">Logging out…</div>
                <div className="ch-sb-spinning-sub">Please wait a moment.</div>
              </>
            ) : (
              <>
                <span className="ch-sb-modal-icon">🚪</span>
                <div className="ch-sb-modal-title" id="logout-title">Confirm Logout</div>
                <div className="ch-sb-modal-desc">
                  Are you sure you want to logout? You'll need to sign in again to access your account.
                </div>
                <div className="ch-sb-modal-actions">
                  <button ref={cancelButtonRef} className="ch-sb-modal-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                  <button className="ch-sb-modal-confirm" onClick={handleLogout}><span>Logout</span></button>
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