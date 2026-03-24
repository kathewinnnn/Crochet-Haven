import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from '../../apiConfig';

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
  .ch-logo-yarn { font-size: 2.2rem; animation: sway 4s ease-in-out infinite; display: inline-block; transform-origin: bottom center; }

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
  .ch-settings-body {
    position: relative;
    z-index: 1;
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 60px 80px;
    width: 100%;
  }

  .ch-settings-layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 28px;
    align-items: start;
  }

  /* ─── SIDEBAR NAV ─── */
  .ch-settings-nav {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    position: sticky;
    top: 24px;
  }

  .ch-snav-item {
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

  .ch-snav-item:last-child { border-bottom: none; }
  .ch-snav-item:hover { background: #fef9f5; color: var(--rose); }

  .ch-snav-item.active {
    background: linear-gradient(135deg, rgba(232,114,138,0.12) 0%, rgba(232,164,90,0.07) 100%);
    color: var(--charcoal);
    font-weight: 700;
  }

  .ch-snav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 3px;
    background: var(--rose);
    border-radius: 0 2px 2px 0;
  }

  .ch-snav-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }

  /* ─── MAIN PANEL ─── */
  .ch-settings-main { min-width: 0; }

  .ch-settings-panel {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    animation: ch-fade-in 0.25s ease;
  }

  @keyframes ch-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .ch-panel-head {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    background: var(--cream);
  }

  .ch-panel-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--charcoal); margin-bottom: 4px; }
  .ch-panel-sub { font-size: 0.78rem; color: var(--muted); font-weight: 300; }

  /* ─── SETTING ITEMS ─── */
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

  .ch-setting-info { flex: 1; padding-right: 20px; }
  .ch-setting-info h4 { font-size: 0.9rem; font-weight: 700; color: var(--charcoal); margin-bottom: 4px; }
  .ch-setting-info p { font-size: 0.78rem; color: var(--muted); font-weight: 300; line-height: 1.5; }

  /* ─── 2FA status badge shown next to toggle ─── */
  .ch-2fa-status {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ch-2fa-badge {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
  }

  .ch-2fa-badge.enabled {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
  }

  .ch-2fa-badge.pending {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: #92400e;
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

  /* ─── 2FA SETUP PANEL ─── */
  .ch-twofa-panel {
    padding: 24px;
    background: var(--cream);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    animation: ch-fade-in 0.3s ease;
  }

  .ch-twofa-panel h4 { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; color: var(--charcoal); margin-bottom: 6px; }
  .ch-twofa-panel p { font-size: 0.82rem; color: var(--muted); font-weight: 300; margin-bottom: 18px; line-height: 1.6; }

  /* Pending notice shown when toggle is ON but setup not done yet */
  .ch-twofa-notice {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 18px;
    background: #fffbeb;
    border: 1px solid #fcd34d;
    border-radius: 2px;
    margin-bottom: 20px;
  }

  .ch-twofa-notice-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }

  .ch-twofa-notice-text h5 {
    font-size: 0.82rem;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 3px;
  }

  .ch-twofa-notice-text p {
    font-size: 0.76rem;
    color: #b45309;
    margin-bottom: 0;
    font-weight: 300;
  }

  .ch-twofa-methods { display: flex; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }

  .ch-twofa-method {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: var(--warm-white);
    border: 1.5px solid var(--border);
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Lato', sans-serif;
    font-size: 0.82rem;
    color: var(--muted);
  }

  .ch-twofa-method.selected { border-color: var(--rose); color: var(--rose); background: rgba(232,114,138,0.05); font-weight: 700; }
  .ch-twofa-method input { display: none; }

  .ch-twofa-input {
    width: 100%;
    max-width: 320px;
    padding: 12px 16px;
    border: 1.5px solid var(--border);
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.95rem;
    color: var(--charcoal);
    background: var(--warm-white);
    margin-bottom: 14px;
    transition: all 0.2s ease;
    display: block;
  }

  .ch-twofa-input:focus { outline: none; border-color: var(--rose); box-shadow: 0 0 0 3px rgba(232,114,138,0.1); }
  .ch-twofa-input.code { text-align: center; letter-spacing: 10px; font-size: 1.2rem; font-family: 'Playfair Display', serif; }

  .ch-twofa-error { font-size: 0.78rem; color: #dc2626; margin-bottom: 10px; display: flex; align-items: center; gap: 5px; }

  .ch-twofa-actions { display: flex; gap: 10px; flex-wrap: wrap; }

  .ch-twofa-btn {
    padding: 11px 22px;
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ch-twofa-btn.primary {
    background: var(--charcoal);
    color: var(--cream);
    border: none;
    position: relative;
    overflow: hidden;
  }

  .ch-twofa-btn.primary::after { content: ''; position: absolute; inset: 0; background: var(--rose); transform: translateX(-100%); transition: transform 0.25s ease; z-index: 0; }
  .ch-twofa-btn.primary:hover::after { transform: translateX(0); }
  .ch-twofa-btn.primary span { position: relative; z-index: 1; }
  .ch-twofa-btn.primary:disabled { opacity: 0.45; cursor: not-allowed; }
  .ch-twofa-btn.primary:disabled::after { display: none; }

  .ch-twofa-btn.secondary {
    background: transparent;
    color: var(--muted);
    border: 1.5px solid var(--border);
  }

  .ch-twofa-btn.secondary:hover { border-color: var(--muted); color: var(--charcoal); }

  /* ─── TOAST ─── */
  .ch-toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 360px;
    width: calc(100% - 40px);
  }

  .ch-toast {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    background: var(--warm-white);
    border-radius: 4px;
    box-shadow: 0 8px 32px rgba(44,36,12,0.14);
    animation: ch-toast-in 0.35s ease;
    position: relative;
    overflow: hidden;
  }

  @keyframes ch-toast-in { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }

  .ch-toast-success { border-left: 3px solid var(--sage); }
  .ch-toast-error   { border-left: 3px solid #ef4444; }
  .ch-toast-info    { border-left: 3px solid var(--rose); }

  .ch-toast-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: #fff; flex-shrink: 0; }
  .ch-toast-success .ch-toast-icon { background: var(--sage); }
  .ch-toast-error   .ch-toast-icon { background: #ef4444; }
  .ch-toast-info    .ch-toast-icon { background: var(--rose); }

  .ch-toast-msg { font-size: 0.88rem; color: var(--charcoal); line-height: 1.5; flex: 1; }
  .ch-toast-close { background: none; border: none; color: var(--muted); font-size: 1.1rem; cursor: pointer; padding: 0 4px; line-height: 1; transition: color 0.2s ease; flex-shrink: 0; }
  .ch-toast-close:hover { color: var(--charcoal); }

  .ch-toast-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
  .ch-toast-bar-fill { height: 100%; width: 100%; animation: ch-drain 5s linear forwards; }
  @keyframes ch-drain { to { width: 0%; } }
  .ch-toast-success .ch-toast-bar-fill { background: var(--sage); }
  .ch-toast-error   .ch-toast-bar-fill { background: #ef4444; }
  .ch-toast-info    .ch-toast-bar-fill { background: var(--rose); }

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
    .ch-settings-body { padding: 36px 30px 60px; }
    .ch-settings-layout { grid-template-columns: 1fr; }
    .ch-settings-nav { position: static; display: flex; overflow-x: auto; }
    .ch-snav-item { flex-shrink: 0; border-bottom: none; border-right: 1px solid var(--border); }
    .ch-snav-item:last-child { border-right: none; }
    .ch-snav-item.active::before { top: 0; bottom: auto; left: 20%; right: 20%; width: auto; height: 3px; border-radius: 0 0 2px 2px; }
    .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 28px 30px; }
  }

  @media (max-width: 580px) {
    .ch-setting-item { flex-direction: column; align-items: flex-start; gap: 14px; }
    .ch-2fa-status { align-self: flex-end; }
    .ch-twofa-methods { flex-direction: column; }
    .ch-settings-body { padding: 24px 16px 48px; }
    .ch-header-inner { padding: 18px 16px; }
    .ch-page-banner { padding: 32px 16px; }
    .ch-banner-title { font-size: 1.7rem; }
    .ch-footer { padding: 22px 16px; }
  }
`;

/* ─── Toast Component ─── */
const ChToast = ({ toast, onClose }) => {
  React.useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const icons = { success: "✓", error: "✕", info: "i" };

  return (
    <div className={`ch-toast ch-toast-${toast.type}`}>
      <div className="ch-toast-icon">{icons[toast.type] || "i"}</div>
      <p className="ch-toast-msg">{toast.message}</p>
      <button className="ch-toast-close" onClick={onClose}>×</button>
      <div className="ch-toast-bar"><div className="ch-toast-bar-fill" /></div>
    </div>
  );
};

const API_URL = `${API_BASE_URL}/api/auth`;

const UserSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newsletter: true,
    twoFactorAuth: false,
    loginAlerts: true,
    profileVisibility: true,
    showOrderHistory: false,
  });
  const [toasts, setToasts] = useState([]);
  const [activeSection, setActiveSection] = useState("account");

  const [show2FA, setShow2FA] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState('sms');
  const [twoFAPhone, setTwoFAPhone] = useState('');
  const [twoFAEmail, setTwoFAEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [twoFAStep, setTwoFAStep] = useState(1); 
  const [twoFAError, setTwoFAError] = useState('');
  const [sending, setSending] = useState(false);

  const addToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

  const toggle = (key) => {
    setSettings(p => ({ ...p, [key]: !p[key] }));
    addToast("success", `${key.replace(/([A-Z])/g, ' $1').trim()} updated`);
  };

  const handle2FAToggle = () => {
    if (!settings.twoFactorAuth) {
      // OFF → ON: enable toggle right away, then show setup panel
      setSettings(p => ({ ...p, twoFactorAuth: true }));
      setShow2FA(true);
      reset2FAForm();
    } else {
      // ON → OFF: disable and close everything
      setSettings(p => ({ ...p, twoFactorAuth: false }));
      setShow2FA(false);
      reset2FAForm();
      addToast("info", "Two-Factor Authentication disabled");
    }
  };

  const reset2FAForm = () => {
    setTwoFAStep(1);
    setTwoFAMethod('sms');
    setTwoFAPhone('');
    setTwoFAEmail('');
    setVerifyCode('');
    setTwoFAError('');
  };

  // Cancel during setup → revert toggle back to OFF
  const cancel2FA = () => {
    setSettings(p => ({ ...p, twoFactorAuth: false }));
    setShow2FA(false);
    reset2FAForm();
    addToast("info", "2FA setup cancelled");
  };

  const handleSend2FA = async () => {
    if (twoFAMethod === 'sms' && !twoFAPhone) { setTwoFAError('Please enter your mobile number'); return; }
    if (twoFAMethod === 'email' && !twoFAEmail) { setTwoFAError('Please enter your backup email'); return; }
    setSending(true);
    setTwoFAError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/setup-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ method: twoFAMethod, phone: twoFAPhone, backupEmail: twoFAEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setTwoFAStep(2);
        addToast("success", `Code sent to ${data.destination}`);
      } else {
        setTwoFAError(data.message);
      }
    } catch {
      setTwoFAError('Failed to send verification code');
    } finally {
      setSending(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verifyCode) { setTwoFAError('Please enter the verification code'); return; }
    setSending(true);
    setTwoFAError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ verificationCode: verifyCode }),
      });
      const data = await res.json();
      if (res.ok) {
        // Setup completed — close the panel, keep toggle ON
        setShow2FA(false);
        reset2FAForm();
        addToast("success", "Two-Factor Authentication enabled!");
      } else {
        setTwoFAError(data.message);
      }
    } catch {
      setTwoFAError('Failed to verify code');
    } finally {
      setSending(false);
    }
  };

  const navItems = [
    { key: "account",  icon: "🔔", label: "Account" },
    { key: "security", icon: "🔒", label: "Security" },
    { key: "privacy",  icon: "🛡️", label: "Privacy" },
  ];

  const accountSettings = [
    { key: "emailNotifications", title: "Email Notifications", desc: "Receive order updates and promotions via email" },
    { key: "pushNotifications",  title: "Push Notifications",  desc: "Get notified about new products and updates" },
    { key: "newsletter",         title: "Newsletter",          desc: "Subscribe to our weekly newsletter for tips and deals" },
  ];

  const privacySettings = [
    { key: "profileVisibility", title: "Profile Visibility",   desc: "Make your profile visible to other users" },
    { key: "showOrderHistory",  title: "Show Order History",   desc: "Display past orders on your public profile" },
  ];

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
            <h1 className="ch-banner-title">⚙️ <em>Settings</em></h1>
            <p className="ch-banner-sub">Manage your preferences and account settings</p>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="ch-settings-body">
          <div className="ch-settings-layout">

            {/* Sidebar */}
            <nav className="ch-settings-nav">
              {navItems.map(item => (
                <button
                  key={item.key}
                  className={`ch-snav-item${activeSection === item.key ? ' active' : ''}`}
                  onClick={() => setActiveSection(item.key)}
                >
                  <span className="ch-snav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Main panel */}
            <main className="ch-settings-main">

              {/* ── Account ── */}
              {activeSection === "account" && (
                <div className="ch-settings-panel">
                  <div className="ch-panel-head">
                    <div className="ch-panel-title">Account Settings</div>
                    <div className="ch-panel-sub">Manage your notification preferences</div>
                  </div>
                  {accountSettings.map(item => (
                    <div key={item.key} className="ch-setting-item">
                      <div className="ch-setting-info">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                      <label className="ch-toggle">
                        <input type="checkbox" checked={settings[item.key]} onChange={() => toggle(item.key)} aria-label={item.title} />
                        <span className="ch-toggle-track" />
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Security ── */}
              {activeSection === "security" && (
                <div className="ch-settings-panel">
                  <div className="ch-panel-head">
                    <div className="ch-panel-title">Security</div>
                    <div className="ch-panel-sub">Protect your account with additional security measures</div>
                  </div>

                  <div className="ch-setting-item">
                    <div className="ch-setting-info">
                      <h4>Two-Factor Authentication</h4>
                      <p>
                        Add an extra layer of security to your account.
                        {settings.twoFactorAuth && show2FA && (
                          <> <span style={{ color: "#b45309", fontWeight: 600 }}>Setup in progress — complete below to activate.</span></>
                        )}
                        {settings.twoFactorAuth && !show2FA && (
                          <> <span style={{ color: "#065f46", fontWeight: 600 }}>Active and protecting your account.</span></>
                        )}
                      </p>
                    </div>

                    {/* Toggle + optional badge */}
                    <div className="ch-2fa-status">
                      {settings.twoFactorAuth && show2FA && (
                        <span className="ch-2fa-badge pending">Setup Pending</span>
                      )}
                      {settings.twoFactorAuth && !show2FA && (
                        <span className="ch-2fa-badge enabled">Enabled</span>
                      )}
                      <label className="ch-toggle">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={handle2FAToggle}
                          aria-label="Two-factor authentication"
                        />
                        <span className="ch-toggle-track" />
                      </label>
                    </div>
                  </div>

                  {/* 2FA setup panel — only visible when toggle is ON and setup not yet done */}
                  {settings.twoFactorAuth && show2FA && (
                    <div className="ch-twofa-panel">

                      {/* Pending notice */}
                      <div className="ch-twofa-notice">
                        <span className="ch-twofa-notice-icon">⚠️</span>
                        <div className="ch-twofa-notice-text">
                          <h5>Setup Required</h5>
                          <p>2FA is enabled but not yet active. Complete the setup below to start protecting your account.</p>
                        </div>
                      </div>

                      {twoFAStep === 1 ? (
                        <>
                          <h4>📱 Setup Two-Factor Authentication</h4>
                          <p>Choose how you want to receive verification codes:</p>
                          <div className="ch-twofa-methods">
                            {[
                              { val: 'sms',   label: '📱 SMS (Mobile Number)' },
                              { val: 'email', label: '📧 Backup Email' },
                            ].map(m => (
                              <label
                                key={m.val}
                                className={`ch-twofa-method${twoFAMethod === m.val ? ' selected' : ''}`}
                                onClick={() => { setTwoFAMethod(m.val); setTwoFAError(''); }}
                              >
                                <input type="radio" name="twoFAMethod" value={m.val} checked={twoFAMethod === m.val} onChange={() => {}} />
                                {m.label}
                              </label>
                            ))}
                          </div>

                          {twoFAMethod === 'sms'
                            ? <input type="tel"   className="ch-twofa-input" placeholder="+63 912 345 6789"  value={twoFAPhone} onChange={e => { setTwoFAPhone(e.target.value); setTwoFAError(''); }} />
                            : <input type="email" className="ch-twofa-input" placeholder="backup@email.com" value={twoFAEmail} onChange={e => { setTwoFAEmail(e.target.value); setTwoFAError(''); }} />
                          }

                          {twoFAError && <div className="ch-twofa-error">⚠ {twoFAError}</div>}

                          <div className="ch-twofa-actions">
                            <button className="ch-twofa-btn secondary" onClick={cancel2FA}>Cancel</button>
                            <button className="ch-twofa-btn primary" onClick={handleSend2FA} disabled={sending}>
                              <span>{sending ? 'Sending…' : 'Send Verification Code'}</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4>🔐 Enter Verification Code</h4>
                          <p>
                            Enter the 6-digit code sent to your{' '}
                            {twoFAMethod === 'sms' ? `mobile number (${twoFAPhone})` : `backup email (${twoFAEmail})`}.
                          </p>
                          <input
                            type="text"
                            className="ch-twofa-input code"
                            placeholder="——————"
                            maxLength={6}
                            value={verifyCode}
                            onChange={e => { setVerifyCode(e.target.value.replace(/\D/g, '')); setTwoFAError(''); }}
                          />

                          {twoFAError && <div className="ch-twofa-error">⚠ {twoFAError}</div>}

                          <div className="ch-twofa-actions">
                            <button className="ch-twofa-btn secondary" onClick={() => { setTwoFAStep(1); setTwoFAError(''); }}>Back</button>
                            <button className="ch-twofa-btn primary" onClick={handleVerify2FA} disabled={sending}>
                              <span>{sending ? 'Verifying…' : 'Verify & Activate 2FA'}</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Login Alerts */}
                  <div className="ch-setting-item">
                    <div className="ch-setting-info">
                      <h4>Login Alerts</h4>
                      <p>Get notified when someone logs into your account</p>
                    </div>
                    <label className="ch-toggle">
                      <input type="checkbox" checked={settings.loginAlerts} onChange={() => toggle('loginAlerts')} aria-label="Login alerts" />
                      <span className="ch-toggle-track" />
                    </label>
                  </div>
                </div>
              )}

              {/* ── Privacy ── */}
              {activeSection === "privacy" && (
                <div className="ch-settings-panel">
                  <div className="ch-panel-head">
                    <div className="ch-panel-title">Privacy</div>
                    <div className="ch-panel-sub">Control your privacy and data sharing preferences</div>
                  </div>
                  {privacySettings.map(item => (
                    <div key={item.key} className="ch-setting-item">
                      <div className="ch-setting-info">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                      <label className="ch-toggle">
                        <input type="checkbox" checked={settings[item.key]} onChange={() => toggle(item.key)} aria-label={item.title} />
                        <span className="ch-toggle-track" />
                      </label>
                    </div>
                  ))}
                </div>
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

export default UserSettings;