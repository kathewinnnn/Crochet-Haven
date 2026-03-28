import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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
    overflow-x: hidden;
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
  .ch-header {
    position: relative;
    padding: 0;
    overflow: hidden;
    background: var(--warm-white);
    border-bottom: 1px solid var(--border);
  }

  .ch-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 52px 60px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  .ch-logo-text span { color: var(--rose); }

  .ch-tagline {
    font-size: 0.78rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 6px;
    font-weight: 400;
  }

  .ch-nav-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 30px;
    background: var(--rose);
    color: #fff;
    text-decoration: none;
    font-family: 'Lato', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-radius: 2px;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .ch-nav-cta:hover {
    background: var(--deep-rose);
    transform: translateY(-1px);
  }

  /* ─── HERO ─── */
  .ch-hero {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 60px 100px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    z-index: 1;
  }

  .ch-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 0.72rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--terracotta);
    font-weight: 700;
    margin-bottom: 20px;
  }

  .ch-hero-eyebrow::before {
    content: '';
    display: block;
    width: 32px;
    height: 1.5px;
    background: var(--terracotta);
  }

  .ch-hero-headline {
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--charcoal);
    margin-bottom: 24px;
  }

  .ch-hero-headline em {
    font-style: italic;
    color: var(--rose);
  }

  .ch-hero-body {
    font-size: 1.05rem;
    line-height: 1.8;
    color: var(--muted);
    margin-bottom: 36px;
    font-weight: 300;
    max-width: 420px;
  }

  .ch-hero-actions {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
  }

  .ch-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 36px;
    background: var(--charcoal);
    color: var(--cream);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: 2px;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .ch-btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--rose);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 0;
  }

  .ch-btn-primary:hover::after { transform: translateX(0); }
  .ch-btn-primary:hover { color: #fff; }
  .ch-btn-primary span { position: relative; z-index: 1; }

  .ch-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    background: transparent;
    color: var(--muted);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 400;
    transition: color 0.2s ease;
    border-bottom: 1px solid var(--border);
  }

  .ch-btn-ghost:hover { color: var(--rose); }

  /* ─── Hero Visual ─── */
  .ch-hero-visual {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 12px;
  }

  .ch-hero-card {
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .ch-hero-card-main {
    grid-column: 1 / 3;
    background: linear-gradient(135deg, #f7e8d8, #f0cfc4);
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5rem;
  }

  .ch-hero-card-sm {
    background: linear-gradient(135deg, #fbe8e0, #f5d5ca);
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.8rem;
    transition: transform 0.3s ease;
  }

  .ch-hero-card-sm:hover { transform: scale(1.03); }

  .ch-hero-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: var(--rose);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 5px 10px;
    border-radius: 2px;
  }

  .ch-stats-strip {
    grid-column: 1 / 3;
    display: flex;
    gap: 0;
    background: var(--charcoal);
    border-radius: 4px;
    overflow: hidden;
  }

  .ch-stat {
    flex: 1;
    padding: 18px 20px;
    text-align: center;
    border-right: 1px solid rgba(255,255,255,0.08);
  }

  .ch-stat:last-child { border-right: none; }

  .ch-stat-num {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--amber);
    line-height: 1;
  }

  .ch-stat-lbl {
    display: block;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    margin-top: 5px;
  }

  /* ─── CATEGORIES ─── */
  .ch-categories {
    position: relative;
    z-index: 1;
    padding: 0 60px 100px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .ch-section-label {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 40px;
  }

  .ch-section-label h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 600;
    color: var(--charcoal);
  }

  .ch-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .ch-cat-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 14px;
  }

  .ch-cat-card {
    text-decoration: none;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    display: block;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .ch-cat-card:hover { transform: translateY(-3px); box-shadow: 0 20px 50px rgba(44,36,32,0.12); }

  .ch-cat-card-inner {
    padding: 36px 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 180px;
    position: relative;
  }

  .ch-cat-card:nth-child(1) .ch-cat-card-inner { background: linear-gradient(145deg, #f9e8d5, #f0d0bf); }
  .ch-cat-card:nth-child(2) .ch-cat-card-inner { background: linear-gradient(145deg, #fde8ef, #f5ccd8); }
  .ch-cat-card:nth-child(3) .ch-cat-card-inner { background: linear-gradient(145deg, #e8f4ea, #d0e8d3); }
  .ch-cat-card:nth-child(4) .ch-cat-card-inner { background: linear-gradient(145deg, #e8eaf4, #cfd3e8); }
  .ch-cat-card:nth-child(5) .ch-cat-card-inner { background: linear-gradient(145deg, #fdf4e0, #f5e2b8); }

  .ch-cat-card:nth-child(1) { grid-column: 1; grid-row: 1 / 3; }
  .ch-cat-card:nth-child(1) .ch-cat-card-inner { min-height: 374px; }

  .ch-cat-emoji {
    font-size: 2.5rem;
    line-height: 1;
    display: block;
    margin-bottom: 14px;
  }

  .ch-cat-card:nth-child(1) .ch-cat-emoji { font-size: 4rem; }

  .ch-cat-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--charcoal);
    margin-bottom: 6px;
  }

  .ch-cat-card:nth-child(1) .ch-cat-name { font-size: 1.5rem; }

  .ch-cat-desc {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.6;
    font-weight: 300;
  }

  .ch-cat-arrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--rose);
    margin-top: 20px;
    transition: gap 0.2s ease;
  }

  .ch-cat-card:hover .ch-cat-arrow { gap: 12px; }

  /* ─── QUOTE STRIP ─── */
  .ch-quote-strip {
    position: relative;
    z-index: 1;
    background: var(--charcoal);
    padding: 72px 60px;
    text-align: center;
    overflow: hidden;
  }

  .ch-quote-strip::before {
    content: '"';
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Playfair Display', serif;
    font-size: 20rem;
    color: rgba(255,255,255,0.03);
    line-height: 1;
    pointer-events: none;
  }

  .ch-quote-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-style: italic;
    font-weight: 400;
    color: var(--warm-white);
    max-width: 700px;
    margin: 0 auto 20px;
    line-height: 1.5;
    position: relative;
    z-index: 1;
  }

  .ch-quote-cite {
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    position: relative;
    z-index: 1;
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

  /* ─── TABLET (769px - 1024px) ─── */
  @media (max-width: 1024px) and (min-width: 769px) {
    .ch-page { margin-left: 220px; padding-top: 56px; }
    .ch-header-inner { padding: 36px 30px; }
    .ch-hero { padding: 50px 30px 60px; gap: 40px; }
    .ch-hero-headline { font-size: 2.8rem; }
    .ch-categories { padding: 0 30px 60px; }
    .ch-cat-grid { grid-template-columns: 1fr 1fr; }
    .ch-cat-card:nth-child(1) { grid-column: 1 / 3; grid-row: auto; }
    .ch-cat-card:nth-child(1) .ch-cat-card-inner { min-height: 200px; }
    .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 28px 30px; }
    .ch-quote-strip { padding: 56px 30px; }
    .ch-quote-text { font-size: 1.4rem; }
  }

  /* ─── MOBILE (≤768px) ─── */
  @media (max-width: 768px) {
    .ch-page { margin-left: 0; padding-top: 56px; }
    .ch-header-inner { padding: 20px 16px 16px 68px; margin-left: -50px; }
    .ch-logo-yarn { font-size: 2rem; }
    .ch-logo-text { font-size: 1.4rem; }
    .ch-tagline { display: none; }
    .ch-nav-cta { padding: 10px 15px; font-size: 0.70rem; width:25%}

    .ch-hero {
      grid-template-columns: 1fr;
      gap: 32px;
      padding: 36px 16px 48px;
    }
    .ch-hero-headline { font-size: 2.2rem; }
    .ch-hero-body { font-size: 0.95rem; max-width: 100%; }
    .ch-hero-actions { flex-direction: column; align-items: flex-start; gap: 12px; }
    .ch-hero-card-main { height: 160px; font-size: 3.5rem; }
    .ch-hero-card-sm { height: 90px; font-size: 2rem; }
    .ch-stat-num { font-size: 1.2rem; }

    .ch-categories { padding: 0 16px 48px; }
    .ch-section-label h2 { font-size: 1.5rem; }
    .ch-cat-grid { grid-template-columns: 1fr; }
    .ch-cat-card:nth-child(1) { grid-column: 1; }
    .ch-cat-card:nth-child(1) .ch-cat-card-inner { min-height: 160px; }
    .ch-cat-card-inner { padding: 22px 20px; min-height: 140px; }
    .ch-cat-card:nth-child(1) .ch-cat-emoji { font-size: 2.5rem; }

    .ch-quote-strip { padding: 40px 16px; }
    .ch-quote-text { font-size: 1.2rem; }

    .ch-footer { flex-direction: column; gap: 10px; text-align: center; padding: 20px 16px; }
  }

  @media (max-width: 1024px) and (min-width: 769px) {
  .ch-page { margin-left: 160px; padding-top: 0 }
  .ch-nav-cta { width: 35%; padding: 12px; margin-left: 15.6px; }
}

@media (max-width: 750px) and (min-width: 414px) {
  .ch-nav-cta { width: 50%; padding: 12px; margin-left: 15.6px; }
}
`;

export default function Home() {
  return (
    <>
      <style>{styles}</style>
      <div className="ch-page">

        {/* ── HEADER ── */}
        <header className="ch-header">
          <div className="ch-header-inner">
            <div className="ch-logo-block">
              <span className="ch-logo-yarn">🧶</span>
              <div>
                <div className="ch-logo-text">Crochet <span>Haven</span></div>
                <div className="ch-tagline">Stitched with love, for you</div>
              </div>
            </div>
            <Link to="/user/products" className="ch-nav-cta">
              <span>Shop Collection →</span>
            </Link>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="ch-hero">
          <div>
            <p className="ch-hero-eyebrow">Handmade with Care</p>
            <h1 className="ch-hero-headline">
              Crafted<br />
              for <em>cozy</em><br />
              living
            </h1>
            <p className="ch-hero-body">
              Discover unique crochet pieces made stitch by stitch — from whimsical accessories to warmth-first home decor. Every item is a small act of love.
            </p>
            <div className="ch-hero-actions">
              <Link to="/user/products" className="ch-btn-primary">
                <span>Explore the Shop</span>
              </Link>
              <Link to="/user/products" className="ch-btn-ghost">
                View New Arrivals ↗
              </Link>
            </div>
          </div>

          <div className="ch-hero-visual">
            <div className="ch-hero-card ch-hero-card-main">
              🧶
              <span className="ch-hero-badge">New</span>
            </div>
            <div className="ch-hero-card ch-hero-card-sm">🌸</div>
            <div className="ch-hero-card ch-hero-card-sm">🎀</div>
            <div className="ch-stats-strip">
              <div className="ch-stat">
                <span className="ch-stat-num">200+</span>
                <span className="ch-stat-lbl">Items</span>
              </div>
              <div className="ch-stat">
                <span className="ch-stat-num">4.9★</span>
                <span className="ch-stat-lbl">Rating</span>
              </div>
              <div className="ch-stat">
                <span className="ch-stat-num">100%</span>
                <span className="ch-stat-lbl">Handmade</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="ch-categories">
          <div className="ch-section-label">
            <h2>Browse Categories</h2>
          </div>
          <div className="ch-cat-grid">
            {[
              { emoji: '🌸', name: 'Accessories & Bouquet', desc: 'Floral arrangements and wearable art that bloom year-round.', to: '/user/products' },
              { emoji: '👜', name: 'Bags', desc: 'Handcrafted bags for every occasion and adventure.', to: '/user/products' },
              { emoji: '🧣', name: 'Clothing', desc: 'Cozy hats, scarves, and layers made to keep you warm.', to: '/user/products' },
              { emoji: '🏠', name: 'Home Decor', desc: 'Charming pieces to brighten your space.', to: '/user/products' },
              { emoji: '🎁', name: 'Gift Sets', desc: 'Curated bundles wrapped with warmth.', to: '/user/products' },
            ].map((cat) => (
              <Link key={cat.name} to={cat.to} className="ch-cat-card">
                <div className="ch-cat-card-inner">
                  <div>
                    <span className="ch-cat-emoji">{cat.emoji}</span>
                    <div className="ch-cat-name">{cat.name}</div>
                    <div className="ch-cat-desc">{cat.desc}</div>
                  </div>
                  <div className="ch-cat-arrow">Shop now →</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── QUOTE ── */}
        <div className="ch-quote-strip">
          <p className="ch-quote-text">
            "Crochet is like painting with yarn — a way to express yourself and create something that lasts."
          </p>
          <span className="ch-quote-cite">— Anonymous Crochet Lover</span>
        </div>

        {/* ── FOOTER ── */}
        <footer className="ch-footer">
          <div className="ch-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>

      </div>
    </>
  );
}