import React, { useState, useEffect, useCallback, useRef } from "react";
import { jwtDecode } from "jwt-decode";
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
  .ch-header {
    background: var(--warm-white);
    border-bottom: 1px solid var(--border);
    position: relative;
    z-index: 1;
  }

  .ch-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ch-logo-block {
    display: flex;
    align-items: center;
    gap: 16px;
    text-decoration: none;
  }

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

  .ch-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--charcoal);
    line-height: 1;
  }

  .ch-logo-text span { color: var(--rose); }

  .ch-tagline {
    font-size: 0.72rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 5px;
  }

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

  .ch-banner-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--amber);
  }

  .ch-banner-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--warm-white);
    line-height: 1.1;
    margin-bottom: 10px;
    letter-spacing: -0.02em;
  }

  .ch-banner-title em { font-style: italic; color: var(--blush); }
  .ch-banner-sub { font-size: 0.9rem; color: rgba(255,255,255,0.4); font-weight: 300; }

  /* ─── BODY ─── */
  .ch-profile-body {
    position: relative;
    z-index: 1;
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 60px 80px;
    width: 100%;
  }

  /* ─── LAYOUT ─── */
  .ch-profile-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 28px;
    align-items: start;
  }

  /* ─── LEFT PANEL ─── */
  .ch-profile-aside {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 24px;
  }

  /* Avatar card */
  .ch-avatar-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 28px 20px;
    text-align: center;
  }

  .ch-avatar-wrap {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--rose), var(--amber));
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    border: 3px solid var(--rose);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .ch-avatar-wrap:hover { transform: scale(1.04); box-shadow: 0 6px 20px rgba(232,114,138,0.3); }

  .ch-avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }

  .ch-avatar-initial {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
  }

  .ch-avatar-overlay {
    position: absolute;
    inset: 0;
    background: rgba(44,36,32,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    font-size: 1.3rem;
    border-radius: 50%;
  }

  .ch-avatar-wrap:hover .ch-avatar-overlay { opacity: 1; }

  .ch-user-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 4px;
  }

  .ch-user-email {
    font-size: 0.78rem;
    color: var(--muted);
    margin-bottom: 12px;
    word-break: break-all;
    font-weight: 300;
  }

  .ch-user-badge {
    display: inline-block;
    background: linear-gradient(135deg, var(--rose), var(--amber));
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 2px;
  }

  /* Profile nav */
  .ch-profile-nav {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .ch-pnav-item {
    width: 100%;
    padding: 14px 18px;
    border: none;
    border-bottom: 1px solid var(--border);
    background: transparent;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Lato', sans-serif;
    font-size: 0.88rem;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    position: relative;
  }

  .ch-pnav-item:last-child { border-bottom: none; }

  .ch-pnav-item:hover { background: #fef9f5; color: var(--rose); }

  .ch-pnav-item.active {
    background: linear-gradient(135deg, rgba(232,114,138,0.12) 0%, rgba(232,164,90,0.07) 100%);
    color: var(--charcoal);
    font-weight: 700;
  }

  .ch-pnav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 3px;
    background: var(--rose);
    border-radius: 0 2px 2px 0;
  }

  .ch-pnav-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }

  /* ─── MAIN AREA ─── */
  .ch-profile-main {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Section header */
  .ch-section-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 16px;
  }

  .ch-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 4px;
  }

  .ch-section-sub { font-size: 0.82rem; color: var(--muted); font-weight: 300; }

  /* Info card */
  .ch-info-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .ch-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--charcoal);
    padding: 18px 24px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--cream);
  }

  .ch-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .ch-info-item {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
  }

  .ch-info-item:nth-child(even) { border-right: none; }
  .ch-info-item:nth-last-child(-n+2) { border-bottom: none; }
  .ch-info-item.full { grid-column: 1 / -1; border-right: none; }
  .ch-info-item.full:last-child { border-bottom: none; }

  .ch-info-label {
    display: block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .ch-info-value {
    font-size: 0.95rem;
    color: var(--charcoal);
    font-weight: 500;
  }

  .ch-status-badge {
    display: inline-block;
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 2px;
  }

  /* Buttons */
  .ch-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: var(--charcoal);
    color: var(--cream);
    border: none;
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s ease;
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
  .ch-btn-primary span { position: relative; z-index: 1; }
  .ch-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
  .ch-btn-primary:disabled::after { display: none; }

  .ch-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 22px;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ch-btn-secondary:hover { border-color: var(--muted); color: var(--charcoal); }

  .ch-btn-group { display: flex; gap: 10px; align-items: center; }

  /* Edit form */
  .ch-edit-form { padding: 24px; display: flex; flex-direction: column; gap: 18px; }

  .ch-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

  .ch-form-group { display: flex; flex-direction: column; gap: 7px; }

  .ch-form-group label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .ch-form-group input, .ch-form-group textarea {
    padding: 13px 16px;
    border: 1.5px solid var(--border);
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.95rem;
    color: var(--charcoal);
    background: var(--cream);
    transition: all 0.2s ease;
  }

  .ch-form-group input:focus, .ch-form-group textarea:focus {
    outline: none;
    border-color: var(--rose);
    background: var(--warm-white);
    box-shadow: 0 0 0 3px rgba(232,114,138,0.1);
  }

  /* Settings list */
  .ch-settings-list { padding: 0; }

  .ch-setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    transition: background 0.2s ease;
  }

  .ch-setting-item:last-child { border-bottom: none; }
  .ch-setting-item:hover { background: #fef9f5; }

  .ch-setting-info h4 {
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 4px;
  }

  .ch-setting-info p {
    font-size: 0.78rem;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.5;
  }

  /* Toggle */
  .ch-toggle {
    position: relative;
    width: 48px;
    height: 26px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .ch-toggle input { opacity: 0; width: 0; height: 0; }

  .ch-toggle-track {
    position: absolute;
    inset: 0;
    background: #e5e7eb;
    border-radius: 26px;
    transition: background 0.3s ease;
  }

  .ch-toggle-track::before {
    content: '';
    position: absolute;
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 6px rgba(0,0,0,0.18);
  }

  .ch-toggle input:checked + .ch-toggle-track { background: var(--rose); }
  .ch-toggle input:checked + .ch-toggle-track::before { transform: translateX(22px); }

  /* Danger zone */
  .ch-danger {
    margin: 24px;
    padding: 20px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .ch-danger h4 { font-size: 0.9rem; color: #991b1b; margin-bottom: 4px; }
  .ch-danger p { font-size: 0.78rem; color: #7f1d1d; font-weight: 300; }

  .ch-danger-btn {
    padding: 10px 20px;
    background: #dc2626;
    color: #fff;
    border: none;
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s ease;
  }

  .ch-danger-btn:hover { background: #b91c1c; }

  /* Toast */
  .ch-toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 360px;
  }

  .ch-toast {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    background: var(--warm-white);
    border-radius: 4px;
    box-shadow: 0 8px 32px rgba(44,36,32,0.14);
    animation: ch-toast-in 0.35s ease;
    position: relative;
    overflow: hidden;
  }

  @keyframes ch-toast-in {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .ch-toast-success { border-left: 3px solid var(--sage); }
  .ch-toast-error { border-left: 3px solid #ef4444; }
  .ch-toast-warning { border-left: 3px solid var(--amber); }
  .ch-toast-info { border-left: 3px solid var(--rose); }

  .ch-toast-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .ch-toast-success .ch-toast-icon { background: var(--sage); }
  .ch-toast-error .ch-toast-icon { background: #ef4444; }
  .ch-toast-warning .ch-toast-icon { background: var(--amber); }
  .ch-toast-info .ch-toast-icon { background: var(--rose); }

  .ch-toast-msg { font-size: 0.88rem; color: var(--charcoal); line-height: 1.5; flex: 1; }

  .ch-toast-close {
    background: none;
    border: none;
    color: var(--muted);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    transition: color 0.2s ease;
    flex-shrink: 0;
  }

  .ch-toast-close:hover { color: var(--charcoal); }

  .ch-toast-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--border);
  }

  .ch-toast-bar-fill {
    height: 100%;
    width: 100%;
    animation: ch-drain 5s linear forwards;
    transform-origin: left;
  }

  @keyframes ch-drain { to { width: 0%; } }

  .ch-toast-success .ch-toast-bar-fill { background: var(--sage); }
  .ch-toast-error .ch-toast-bar-fill { background: #ef4444; }

  /* Loading */
  .ch-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 16px;
  }

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

  .ch-footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--charcoal);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ch-footer-copy { font-size: 0.78rem; color: var(--muted); letter-spacing: 0.04em; }

  /* ─── Responsive ─── */
  @media (max-width: 900px) {
    .ch-page { margin-left: 0; }
    .ch-header-inner { padding: 24px 30px; }
    .ch-page-banner { padding: 40px 30px; }
    .ch-banner-title { font-size: 2rem; }
    .ch-profile-body { padding: 36px 30px 60px; }
    .ch-profile-layout { grid-template-columns: 1fr; }
    .ch-profile-aside { position: static; }
    .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 28px 30px; }
  }

  @media (max-width: 580px) {
    .ch-info-grid { grid-template-columns: 1fr; }
    .ch-info-item { border-right: none; }
    .ch-info-item:last-child { border-bottom: none; }
    .ch-form-row { grid-template-columns: 1fr; }
    .ch-section-head { flex-direction: column; gap: 12px; }
    .ch-danger { flex-direction: column; text-align: center; }
  }
`;

/* ─── Toast Component ─── */
const ChToast = ({ toast, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const icons = { success: "✓", error: "✕", warning: "!", info: "i" };

  return (
    <div className={`ch-toast ch-toast-${toast.type}`}>
      <div className="ch-toast-icon">{icons[toast.type] || "i"}</div>
      <p className="ch-toast-msg">{toast.message}</p>
      <button className="ch-toast-close" onClick={onClose}>×</button>
      <div className="ch-toast-bar"><div className="ch-toast-bar-fill" /></div>
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(() => localStorage.getItem("profileActiveSection") || "overview");
  const [toasts, setToasts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const [notifications, setNotifications] = useState(() => {
    const s = localStorage.getItem("userNotifications");
    return s ? JSON.parse(s) : { emailOrders: true, emailPromotions: false, smsNotifications: true };
  });

  const [privacy, setPrivacy] = useState(() => {
    const s = localStorage.getItem("userPrivacy");
    return s ? JSON.parse(s) : { profileVisible: true, showOrders: false };
  });

  const saveUserToStorage = useCallback((u) => localStorage.setItem("userProfile", JSON.stringify(u)), []);
  const loadUserFromStorage = useCallback(() => { const s = localStorage.getItem("userProfile"); return s ? JSON.parse(s) : null; }, []);

  useEffect(() => { fetchUserData(); }, []);
  useEffect(() => { localStorage.setItem("profileActiveSection", activeSection); }, [activeSection]);
  useEffect(() => { localStorage.setItem("userNotifications", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("userPrivacy", JSON.stringify(privacy)); }, [privacy]);

  const addToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

  const fetchUserData = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const saved = loadUserFromStorage();
        const merged = saved ? { ...decoded, ...saved } : decoded;
        setUser(merged);
        setEditForm({ fullName: merged.fullName || merged.username || "", email: merged.email || "", phone: merged.phone || "", address: merged.address || "" });
        saveUserToStorage(merged);
      }
    } catch {
      addToast("error", "Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      const updated = { ...user, ...editForm };
      setUser(updated);
      saveUserToStorage(updated);
      setIsEditing(false);
      addToast("success", "Profile updated successfully!");
    } catch {
      addToast("error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { addToast("error", "Passwords do not match!"); return; }
    if (passwordForm.newPassword.length < 6) { addToast("error", "Password must be at least 6 characters!"); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      addToast("success", "Password changed successfully!");
    } catch {
      addToast("error", "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatar = reader.result;
        setAvatarPreview(avatar);
        const updated = { ...user, avatar };
        setUser(updated);
        saveUserToStorage(updated);
        addToast("success", "Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const navItems = [
    { key: "overview", icon: "👤", label: "Overview" },
    { key: "security", icon: "🔒", label: "Security" },
    { key: "notifications", icon: "🔔", label: "Notifications" },
    { key: "privacy", icon: "🛡️", label: "Privacy" },
  ];

  if (loading && !user) return (
    <>
      <style>{styles}</style>
      <div className="ch-page">
        <div className="ch-loading"><div className="ch-spinner" /><p>Loading profile…</p></div>
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
            <h1 className="ch-banner-title"><em>{user?.fullName || user?.username || 'Profile'}</em></h1>
            <p className="ch-banner-sub">Manage your profile and preferences</p>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="ch-profile-body">
          <div className="ch-profile-layout">

            {/* Left aside */}
            <aside className="ch-profile-aside">
              <div className="ch-avatar-card">
                <div className="ch-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
                  {avatarPreview || user?.avatar
                    ? <img src={avatarPreview || user?.avatar} alt="Profile" />
                    : <span className="ch-avatar-initial">{user?.username?.charAt(0)?.toUpperCase() || "U"}</span>
                  }
                  <div className="ch-avatar-overlay">📷</div>
                </div>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                <div className="ch-user-name">{user?.fullName || user?.username}</div>
                <div className="ch-user-email">{user?.email}</div>
                <span className="ch-user-badge">{user?.role || "Customer"}</span>
              </div>

              <nav className="ch-profile-nav">
                {navItems.map(item => (
                  <button key={item.key} className={`ch-pnav-item${activeSection === item.key ? ' active' : ''}`} onClick={() => setActiveSection(item.key)}>
                    <span className="ch-pnav-icon">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Right main */}
            <main className="ch-profile-main">

              {/* Overview */}
              {activeSection === "overview" && (
                <>
                  <div className="ch-section-head">
                    <div>
                      <div className="ch-section-title">Personal Information</div>
                      <div className="ch-section-sub">Your account details and contact info</div>
                    </div>
                    {!isEditing
                      ? <button className="ch-btn-primary" onClick={() => setIsEditing(true)}><span>✏️ Edit Profile</span></button>
                      : <div className="ch-btn-group">
                          <button className="ch-btn-secondary" onClick={() => { setIsEditing(false); setEditForm({ fullName: user?.fullName || "", email: user?.email || "", phone: user?.phone || "", address: user?.address || "" }); }}>Cancel</button>
                          <button className="ch-btn-primary" onClick={handleEditSubmit} disabled={loading}><span>{loading ? "Saving…" : "Save Changes"}</span></button>
                        </div>
                    }
                  </div>
                  <div className="ch-info-card">
                    {!isEditing ? (
                      <div className="ch-info-grid">
                        {[
                          { label: "Username", value: user?.username },
                          { label: "Full Name", value: user?.fullName || "—" },
                          { label: "Email Address", value: user?.email || "—" },
                          { label: "Phone Number", value: user?.phone || "—" },
                          { label: "Address", value: user?.address || "—", full: true },
                          { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "January 2025" },
                          { label: "Account Status", badge: true },
                        ].map((item, i) => (
                          <div key={i} className={`ch-info-item${item.full ? ' full' : ''}`}>
                            <span className="ch-info-label">{item.label}</span>
                            {item.badge
                              ? <span className="ch-status-badge">Active</span>
                              : <span className="ch-info-value">{item.value}</span>
                            }
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="ch-edit-form">
                        <div className="ch-form-row">
                          <div className="ch-form-group">
                            <label>Full Name</label>
                            <input type="text" value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} placeholder="Your full name" />
                          </div>
                          <div className="ch-form-group">
                            <label>Email Address</label>
                            <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} placeholder="Your email" />
                          </div>
                        </div>
                        <div className="ch-form-row">
                          <div className="ch-form-group">
                            <label>Phone Number</label>
                            <input type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} placeholder="+63 912 345 6789" />
                          </div>
                          <div className="ch-form-group">
                            <label>Address</label>
                            <input type="text" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} placeholder="Your address" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Security */}
              {activeSection === "security" && (
                <>
                  <div className="ch-section-head">
                    <div>
                      <div className="ch-section-title">Password & Security</div>
                      <div className="ch-section-sub">Manage your password and account security</div>
                    </div>
                  </div>
                  <div className="ch-info-card">
                    <div className="ch-card-title">Change Password</div>
                    <form onSubmit={handlePasswordChange} className="ch-edit-form">
                      <div className="ch-form-group">
                        <label>Current Password</label>
                        <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Enter current password" required />
                      </div>
                      <div className="ch-form-row">
                        <div className="ch-form-group">
                          <label>New Password</label>
                          <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="New password" required />
                        </div>
                        <div className="ch-form-group">
                          <label>Confirm New Password</label>
                          <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Confirm password" required />
                        </div>
                      </div>
                      <button type="submit" className="ch-btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}><span>{loading ? "Updating…" : "Update Password"}</span></button>
                    </form>
                  </div>
                </>
              )}

              {/* Notifications */}
              {activeSection === "notifications" && (
                <>
                  <div className="ch-section-head">
                    <div>
                      <div className="ch-section-title">Notification Preferences</div>
                      <div className="ch-section-sub">Choose how you want to receive updates</div>
                    </div>
                  </div>
                  <div className="ch-info-card">
                    <div className="ch-settings-list">
                      {[
                        { key: "emailOrders", title: "Email Order Updates", desc: "Get notified about your order status and delivery updates" },
                        { key: "emailPromotions", title: "Promotional Emails", desc: "Receive news about new products, special offers, and discounts" },
                        { key: "smsNotifications", title: "SMS Notifications", desc: "Receive text messages for important account updates" },
                      ].map(item => (
                        <div key={item.key} className="ch-setting-item">
                          <div className="ch-setting-info">
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                          </div>
                          <label className="ch-toggle">
                            <input type="checkbox" checked={notifications[item.key]} onChange={() => { setNotifications(p => ({ ...p, [item.key]: !p[item.key] })); addToast("success", "Notification preferences saved!"); }} />
                            <span className="ch-toggle-track" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Privacy */}
              {activeSection === "privacy" && (
                <>
                  <div className="ch-section-head">
                    <div>
                      <div className="ch-section-title">Privacy Settings</div>
                      <div className="ch-section-sub">Control your privacy and data sharing preferences</div>
                    </div>
                  </div>
                  <div className="ch-info-card">
                    <div className="ch-settings-list">
                      {[
                        { key: "profileVisible", title: "Public Profile", desc: "Allow other users to view your profile information" },
                        { key: "showOrders", title: "Show Order History", desc: "Allow others to see your order history on your profile" },
                      ].map(item => (
                        <div key={item.key} className="ch-setting-item">
                          <div className="ch-setting-info">
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                          </div>
                          <label className="ch-toggle">
                            <input type="checkbox" checked={privacy[item.key]} onChange={() => { setPrivacy(p => ({ ...p, [item.key]: !p[item.key] })); addToast("success", "Privacy settings updated!"); }} />
                            <span className="ch-toggle-track" />
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="ch-danger">
                      <div>
                        <h4>Delete Account</h4>
                        <p>Permanently delete your account and all associated data. This cannot be undone.</p>
                      </div>
                      <button className="ch-danger-btn">Delete Account</button>
                    </div>
                  </div>
                </>
              )}

            </main>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="ch-footer">
          <div className="ch-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>

        {/* Toasts */}
        <div className="ch-toast-container">
          {toasts.map(t => <ChToast key={t.id} toast={t} onClose={() => removeToast(t.id)} />)}
        </div>

      </div>
    </>
  );
};

export default Profile;