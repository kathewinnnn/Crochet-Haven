import React from 'react';
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

  .ch-header { background: var(--warm-white); border-bottom: 1px solid var(--border); position: relative; z-index: 1; }
  .ch-header-inner { max-width: 1200px; margin: 0 auto; padding: 32px 60px; display: flex; align-items: center; justify-content: space-between; }
  .ch-logo-block { display: flex; align-items: center; gap: 16px; text-decoration: none; }
  .ch-logo-yarn { font-size: 2.2rem; animation: sway 4s ease-in-out infinite; display: inline-block; transform-origin: bottom center; }
  @keyframes sway { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
  .ch-logo-text { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; color: var(--charcoal); line-height: 1; }
  .ch-logo-text span { color: var(--rose); }
  .ch-tagline { font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); margin-top: 5px; }
  .ch-nav-cta { display: inline-flex; align-items: center; padding: 12px 24px; background: var(--rose); color: #fff; text-decoration: none; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 2px; transition: background 0.2s ease, transform 0.2s ease; }
  .ch-nav-cta:hover { background: var(--deep-rose); transform: translateY(-1px); }

  .ch-page-banner { position: relative; z-index: 1; background: var(--charcoal); padding: 72px 60px; overflow: hidden; }
  .ch-page-banner::after { content: ''; position: absolute; right: -80px; top: -80px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(232,114,138,0.18) 0%, transparent 70%); pointer-events: none; }
  .ch-banner-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .ch-banner-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--amber); font-weight: 700; margin-bottom: 16px; }
  .ch-banner-eyebrow::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--amber); }
  .ch-banner-title { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 800; color: var(--warm-white); line-height: 1.1; margin-bottom: 14px; letter-spacing: -0.02em; max-width: 600px; }
  .ch-banner-title em { font-style: italic; color: var(--blush); }
  .ch-banner-sub { font-size: 1rem; color: rgba(255,255,255,0.4); font-weight: 300; max-width: 480px; line-height: 1.7; }

  .ch-about-body { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 72px 60px 100px; }

  .ch-story { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; margin-bottom: 80px; padding-bottom: 80px; border-bottom: 1px solid var(--border); }
  .ch-story-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 0.72rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--terracotta); font-weight: 700; margin-bottom: 16px; }
  .ch-story-eyebrow::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--terracotta); }
  .ch-story h2 { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 800; color: var(--charcoal); line-height: 1.15; margin-bottom: 20px; letter-spacing: -0.02em; }
  .ch-story h2 em { font-style: italic; color: var(--rose); }
  .ch-story p { font-size: 0.95rem; line-height: 1.85; color: var(--muted); margin-bottom: 16px; font-weight: 300; }
  .ch-story-visual { background: linear-gradient(145deg, #f7e8d8, #f0cfc4); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 8rem; min-height: 320px; position: relative; overflow: hidden; }
  .ch-story-visual::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 30%, rgba(232,114,138,0.15), transparent 60%); }

  .ch-btn-primary { display: inline-flex; align-items: center; padding: 14px 30px; background: var(--charcoal); color: var(--cream); text-decoration: none; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 2px; margin-top: 8px; transition: background 0.25s ease; position: relative; overflow: hidden; }
  .ch-btn-primary::after { content: ''; position: absolute; inset: 0; background: var(--rose); transform: translateX(-100%); transition: transform 0.3s ease; z-index: 0; }
  .ch-btn-primary:hover::after { transform: translateX(0); }
  .ch-btn-primary span { position: relative; z-index: 1; }

  .ch-section-label { display: flex; align-items: center; gap: 16px; margin-bottom: 36px; }
  .ch-section-label h2 { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 600; color: var(--charcoal); white-space: nowrap; }
  .ch-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .ch-why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 80px; }
  .ch-why-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; padding: 32px 24px; transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .ch-why-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(44,36,32,0.08); }
  .ch-why-icon { font-size: 2.2rem; display: block; margin-bottom: 16px; }
  .ch-why-name { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 600; color: var(--charcoal); margin-bottom: 8px; }
  .ch-why-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.7; font-weight: 300; }

  .ch-mission { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; margin-bottom: 80px; padding-bottom: 80px; border-bottom: 1px solid var(--border); }
  .ch-mission-visual { background: linear-gradient(145deg, #e8f4ea, #d0e8d3); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 7rem; min-height: 280px; }
  .ch-mission h2 { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 800; color: var(--charcoal); line-height: 1.2; margin-bottom: 20px; letter-spacing: -0.02em; }
  .ch-mission h2 em { font-style: italic; color: var(--sage); }
  .ch-mission p { font-size: 0.95rem; line-height: 1.85; color: var(--muted); margin-bottom: 14px; font-weight: 300; }

  .ch-contact-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 56px; }
  .ch-contact-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; padding: 28px 22px; transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .ch-contact-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(44,36,32,0.08); }
  .ch-contact-icon { font-size: 2rem; display: block; margin-bottom: 14px; }
  .ch-contact-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--charcoal); margin-bottom: 8px; }
  .ch-contact-detail { font-size: 0.82rem; color: var(--muted); line-height: 1.7; font-weight: 300; }

  .ch-map-section { margin-bottom: 20px; }
  .ch-map-label { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .ch-map-label h2 { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 600; color: var(--charcoal); white-space: nowrap; }
  .ch-map-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .ch-map-frame { border-radius: 4px; overflow: hidden; border: 1px solid var(--border); height: 400px; }
  .ch-map-frame iframe { width: 100%; height: 100%; border: 0; display: block; }
  .ch-map-caption { margin-top: 12px; font-size: 0.8rem; color: var(--muted); text-align: center; letter-spacing: 0.04em; }

  .ch-quote-strip { position: relative; z-index: 1; background: var(--charcoal); padding: 72px 60px; text-align: center; overflow: hidden; margin-top: 0; }
  .ch-quote-strip::before { content: '"'; position: absolute; top: -40px; left: 50%; transform: translateX(-50%); font-family: 'Playfair Display', serif; font-size: 20rem; color: rgba(255,255,255,0.03); line-height: 1; pointer-events: none; }
  .ch-quote-text { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-style: italic; font-weight: 400; color: var(--warm-white); max-width: 700px; margin: 0 auto 20px; line-height: 1.5; position: relative; z-index: 1; }
  .ch-quote-cite { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.35); position: relative; z-index: 1; }

  .ch-footer { position: relative; z-index: 1; background: var(--warm-white); border-top: 1px solid var(--border); padding: 32px 60px; display: flex; align-items: center; justify-content: space-between; }
  .ch-footer-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--charcoal); display: flex; align-items: center; gap: 8px; }
  .ch-footer-copy { font-size: 0.78rem; color: var(--muted); letter-spacing: 0.04em; }

  @media (max-width: 1024px) {
    .ch-why-grid, .ch-contact-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 900px) {
    .ch-page { margin-left: 0; }
    .ch-header-inner { padding: 24px 30px; }
    .ch-page-banner { padding: 50px 30px; }
    .ch-banner-title { font-size: 2.2rem; }
    .ch-about-body { padding: 48px 30px 60px; }
    .ch-story, .ch-mission { grid-template-columns: 1fr; gap: 40px; }
    .ch-story-visual, .ch-mission-visual { min-height: 200px; }
    .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 28px 30px; }
    .ch-quote-strip { padding: 56px 30px; }
    .ch-quote-text { font-size: 1.4rem; }
  }

  @media (max-width: 580px) {
    .ch-why-grid, .ch-contact-grid { grid-template-columns: 1fr; }
    .ch-banner-title { font-size: 1.8rem; }
    .ch-story h2, .ch-mission h2 { font-size: 1.8rem; }
  }

  /* ─── TABLET ─── */
  @media (max-width: 1024px) and (min-width: 769px) {
    .ch-page { margin-left: 220px; padding-top: 56px; }
    .ch-header-inner { padding: 24px 30px; }
    .ch-page-banner { padding: 48px 30px; }
    .ch-banner-title { font-size: 2.2rem; }
    .ch-about-body { padding: 48px 30px 60px; }
    .ch-why-grid, .ch-contact-grid { grid-template-columns: repeat(2, 1fr); }
    .ch-story, .ch-mission { gap: 40px; }
    .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 24px 30px; }
    .ch-quote-strip { padding: 56px 30px; }
  }

  /* ─── MOBILE ─── */
  @media (max-width: 768px) {
    .ch-page { margin-left: 0; padding-top: 56px; }
    .ch-header-inner { padding: 14px 16px; }
    .ch-logo-yarn { font-size: 1.4rem; }
    .ch-logo-text { font-size: 1.2rem; }
    .ch-tagline { display: none; }
    .ch-nav-cta { padding: 9px 14px; font-size: 0.72rem; width:55%}
    .ch-page-banner { padding: 36px 16px; }
    .ch-banner-title { font-size: 1.8rem; }
    .ch-about-body { padding: 32px 16px 48px; }
    .ch-story, .ch-mission { grid-template-columns: 1fr; gap: 28px; }
    .ch-story-visual, .ch-mission-visual { min-height: 160px; font-size: 5rem; }
    .ch-story h2, .ch-mission h2 { font-size: 1.7rem; }
    .ch-why-grid, .ch-contact-grid { grid-template-columns: 1fr; gap: 12px; }
    .ch-map-frame { height: 260px; }
    .ch-quote-strip { padding: 36px 16px; }
    .ch-quote-text { font-size: 1.1rem; }
    .ch-nav-cta { width: 25%; padding: 12px; margin-left: 15.6px; }
    .ch-footer { flex-direction: column; gap: 10px; text-align: center; padding: 20px 16px; }
  }

  @media (max-width: 1024px) and (min-width: 769px) {
  .ch-page { margin-left: 160px; padding-top: 0 }
  .ch-nav-cta {width:38%; padding: 12px; margin-left: 15.6px}
  .ch-header-inner { padding: 24px 30px; }
  .ch-page-banner { padding: 48px 30px; }
  .ch-banner-title { font-size: 2.2rem; }
  .ch-about-body { padding: 48px 30px 60px; }
  .ch-why-grid, .ch-contact-grid { grid-template-columns: repeat(2, 1fr); }
  .ch-story, .ch-mission { gap: 40px; }
  .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 24px 30px; }
  .ch-quote-strip { padding: 56px 30px; }
  .ch-nav-cta { width: 38%; padding: 12px; }
}

@media (max-width: 750px) and (min-width: 414px) {
  .ch-nav-cta { width: 50%; padding: 12px; margin-left: 15.6px; }
}
`;

function About() {
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
            <Link to="/user/products" className="ch-nav-cta">Shop Collection →</Link>
          </div>
        </header>

        <div className="ch-page-banner">
          <div className="ch-banner-inner">
            <p className="ch-banner-eyebrow">Who We Are</p>
            <h1 className="ch-banner-title">Our <em>story</em>,<br />passion & craft</h1>
            <p className="ch-banner-sub">A small studio born from a love of handmade things and the warmth of yarn.</p>
          </div>
        </div>

        <div className="ch-about-body">
          <div className="ch-story">
            <div>
              <p className="ch-story-eyebrow">Since 2020</p>
              <h2>Born from a <em>love</em> of crochet</h2>
              <p>Crochet Haven started as a small hobby in a cozy corner of our home. What began with a single ball of yarn and a hook has blossomed into a thriving community of crafters and enthusiasts.</p>
              <p>Every piece we create carries care, attention to detail, and a warmth that mass-produced products simply can't match. We believe handmade things are a form of love made tangible.</p>
              <Link to="/user/products" className="ch-btn-primary"><span>Explore Our Products →</span></Link>
            </div>
            <div className="ch-story-visual">💝</div>
          </div>

          <div className="ch-section-label"><h2>Why Choose Us</h2></div>
          <div className="ch-why-grid">
            {[
              { icon: '✨', name: 'Handcrafted Quality', desc: 'Each item is carefully handmade with premium materials and genuine attention to every stitch.' },
              { icon: '🎨', name: 'Unique Designs', desc: 'Our designs are original and crafted to bring joy and beauty into your everyday life.' },
              { icon: '💚', name: 'Eco-Friendly', desc: 'We use sustainable materials and eco-conscious practices throughout our craft process.' },
              { icon: '❤️', name: 'Made with Love', desc: 'Every single stitch is made with passion and care, just for you.' },
            ].map(w => (
              <div key={w.name} className="ch-why-card">
                <span className="ch-why-icon">{w.icon}</span>
                <div className="ch-why-name">{w.name}</div>
                <div className="ch-why-desc">{w.desc}</div>
              </div>
            ))}
          </div>

          <div className="ch-mission">
            <div className="ch-mission-visual">🧵</div>
            <div>
              <p className="ch-story-eyebrow">Our Purpose</p>
              <h2>Spreading joy through <em>craft</em></h2>
              <p>At Crochet Haven, our mission is to spread the joy of handmade creations. We aim to produce beautiful, high-quality crochet items that bring warmth and happiness to everyday life.</p>
              <p>We're committed to supporting local artisans, promoting sustainable practices, and building a community of crochet lovers who appreciate the art of handmade goods.</p>
            </div>
          </div>

          <div className="ch-section-label"><h2>Get In Touch</h2></div>
          <div className="ch-contact-grid">
            {[
              { icon: '📍', name: 'Our Location', detail: '123 Yarn Street, Craft District\nPilar, Abra, Philippines 2812' },
              { icon: '📞', name: 'Phone', detail: '+63 912 345 6789\nMon–Sat: 9AM – 6PM' },
              { icon: '📧', name: 'Email', detail: 'hello@crochethaven.com\nsupport@crochethaven.com' },
              { icon: '💬', name: 'Social Media', detail: '@CrochetHavenPH\nFacebook | Instagram' },
            ].map(c => (
              <div key={c.name} className="ch-contact-card">
                <span className="ch-contact-icon">{c.icon}</span>
                <div className="ch-contact-name">{c.name}</div>
                <div className="ch-contact-detail" style={{ whiteSpace: 'pre-line' }}>{c.detail}</div>
              </div>
            ))}
          </div>

          <div className="ch-map-section">
            <div className="ch-map-label"><h2>📍 Find Us Here</h2></div>
            <div className="ch-map-frame">
              <iframe
                title="Crochet Haven Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15327.123456789!2d120.5833!3d17.4333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391a1234567890%3A0x1234567890abcdef!2sPilar%2C%20Abra%2C%20Philippines!5e0!3m2!1sen!2sph!4v1234567890"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="ch-map-caption">123 Yarn Street, Craft District, Pilar, Abra, Philippines</p>
          </div>
        </div>

        <div className="ch-quote-strip">
          <p className="ch-quote-text">"Crochet is like painting with yarn — a way to express yourself and create something that lasts."</p>
          <span className="ch-quote-cite">— Anonymous Crochet Lover</span>
        </div>

        <footer className="ch-footer">
          <div className="ch-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>
      </div>
    </>
  );
}

export default About;