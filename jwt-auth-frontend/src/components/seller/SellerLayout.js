import React, { useState } from "react";
import SellerSidebar from "./SellerSidebar";
import CrudApp from "./CrudApp";
import Dashboard from "./Dashboard";
import Categories from "./Categories";
import Order from "./Order";
import Reports from "./Reports";
import Settings from "./Settings";
import Profile from "./Profile";

/* ─────────────────────────────────────────────────────────────
   SellerLayout owns the entire shell:
     • sidebar offset
     • shared top header
     • shared footer
     • scrollable content area

   Every page component renders ONLY its inner content —
   no per-page headers, no per-page footers, no margin hacks.
───────────────────────────────────────────────────────────── */

const layoutStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Lato:wght@300;400;700&display=swap');

  :root {
    --sl-sidebar: 240px;
    --sl-topbar-h: 0px;       /* desktop: no topbar */
    --cream: #fdf6ec;
    --warm-white: #fffbf5;
    --rose: #e8728a;
    --blush: #f4a7b2;
    --terracotta: #d4735e;
    --amber: #e8a45a;
    --charcoal: #2c2420;
    --muted: #8a7a74;
    --border: rgba(212,115,94,0.15);
  }

  /* ── shell ── */
  .sl-shell {
    display: flex;
    min-height: 100vh;
    background: var(--cream);
    font-family: 'Lato', sans-serif;
  }

  /* ── right column (everything to the right of sidebar) ── */
  .sl-body {
    margin-left: var(--sl-sidebar);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-width: 0;
  }

  /* ── shared header ── */
  .sl-header {
    background: var(--warm-white);
    border-bottom: 1px solid var(--border);
    padding: 20px 40px;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
  }

  .sl-logo-yarn {
    font-size: 2rem;
    animation: sl-sway 4s ease-in-out infinite;
    display: inline-block;
    transform-origin: bottom center;
    line-height: 1;
  }

  @keyframes sl-sway {
    0%, 100% { transform: rotate(-4deg); }
    50%       { transform: rotate(4deg); }
  }

  .sl-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.55rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .sl-logo-text span { color: var(--rose); }

  .sl-tagline {
    font-size: 0.65rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 3px;
  }

  /* ── scrollable page content ── */
  .sl-content {
    flex: 1;
    overflow-y: auto;
    padding: 40px 44px;
  }

  /* ── shared footer ── */
  .sl-footer {
    background: var(--warm-white);
    border-top: 1px solid var(--border);
    padding: 20px 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .sl-footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--charcoal);
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .sl-footer-copy {
    font-size: 0.74rem;
    color: var(--muted);
  }

  /* ════════════════════════════════════
     TABLET  (769px – 1024px)
     SellerSidebar handles its own drawer;
     we just zero out the body offset.
  ════════════════════════════════════ */
  @media (max-width: 1024px) {
    :root { --sl-sidebar: 0px; }
    .sl-body { margin-left: 0; }
    .sl-header { padding: 16px 24px; }
    .sl-content { padding: 28px 24px; }
    .sl-footer { padding: 16px 24px; }
  }

  /* ════════════════════════════════════
     MOBILE  (≤ 768px)
     SellerSidebar shows its mobile topbar
     (56 px tall), so offset content down.
  ════════════════════════════════════ */
  @media (max-width: 768px) {
    :root {
      --sl-sidebar: 0px;
      --sl-topbar-h: 56px;
    }

    .sl-body { margin-left: 0; padding-top: var(--sl-topbar-h); }

    /* Hide our shared header on mobile — SellerSidebar's topbar replaces it */
    .sl-header { display: none; }

    .sl-content { padding: 20px 16px 28px; }

    .sl-footer {
      flex-direction: column;
      gap: 4px;
      text-align: center;
      padding: 16px;
    }
  }
`;

/* Page title map — shown in the header breadcrumb */
const PAGE_TITLES = {
  dashboard:   { eyebrow: "Overview",   title: "Seller",  em: "Dashboard" },
  "add-product": { eyebrow: "Inventory", title: "Manage",  em: "Products" },
  categories:  { eyebrow: "Browse",     title: "Product", em: "Categories" },
  orders:      { eyebrow: "Management", title: "Order",   em: "Management" },
  reports:     { eyebrow: "Analytics",  title: "Sales",   em: "Reports" },
  settings:    { eyebrow: "Config",     title: "Account", em: "Settings" },
  profile:     { eyebrow: "Account",    title: "Seller",  em: "Profile" },
};

const SellerLayout = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":    return <Dashboard />;
      case "add-product":  return <CrudApp />;
      case "categories":   return <Categories />;
      case "orders":       return <Order />;
      case "reports":      return <Reports />;
      case "settings":     return <Settings />;
      case "profile":      return <Profile />;
      default:             return null;
    }
  };

  return (
    <>
      <style>{layoutStyles}</style>

      <div className="sl-shell">
        {/* ── Sidebar (manages its own mobile drawer internally) ── */}
        <SellerSidebar setActivePage={setActivePage} activePage={activePage} />

        {/* ── Right body ── */}
        <div className="sl-body">

          {/* Shared header — hidden on mobile, replaced by SellerSidebar's topbar */}
          <header className="sl-header">
            <span className="sl-logo-yarn">🧶</span>
            <div>
              <div className="sl-logo-text">Crochet <span>Haven</span></div>
              <div className="sl-tagline">Seller Panel</div>
            </div>
          </header>

          {/* Page content */}
          <main className="sl-content">
            {renderContent()}
          </main>

          {/* Shared footer */}
          <footer className="sl-footer">
            <div className="sl-footer-logo">🧶 Crochet Haven</div>
            <p className="sl-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
          </footer>

        </div>
      </div>
    </>
  );
};

export default SellerLayout;