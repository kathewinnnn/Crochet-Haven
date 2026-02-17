import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/auth";

const settingsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Lato:wght@300;400;700&display=swap');

  :root {
    --cream: #fdf6ec;
    --warm-white: #fffbf5;
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

  .ch-settings {
    font-family: 'Lato', sans-serif;
    color: var(--charcoal);
    padding: 52px 56px;
    min-height: 100vh;
  }

  .ch-set-header { margin-bottom: 44px; }

  .ch-set-eyebrow {
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

  .ch-set-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--terracotta);
  }

  .ch-set-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .ch-set-title em { font-style: italic; color: var(--rose); }

  /* ── Section card ── */
  .ch-set-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .ch-set-card-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 22px 28px;
    border-bottom: 1px solid var(--border);
    background: rgba(253, 246, 236, 0.6);
  }

  .ch-set-card-icon {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .ch-set-card-icon.rose   { background: linear-gradient(135deg, var(--rose), #f4a7b2); }
  .ch-set-card-icon.amber  { background: linear-gradient(135deg, var(--amber), #f5d4a0); }
  .ch-set-card-icon.sage   { background: linear-gradient(135deg, var(--sage), #c5dfc8); }

  .ch-set-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--charcoal);
  }

  .ch-set-card-body { padding: 28px; }

  /* ── Toggle rows ── */
  .ch-set-toggle-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ch-set-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: rgba(253, 246, 236, 0.4);
    border: 1px solid var(--border);
    border-radius: 3px;
    transition: background 0.15s ease;
  }

  .ch-set-toggle-row:hover { background: rgba(253, 246, 236, 0.8); }

  .ch-set-toggle-info { display: flex; flex-direction: column; gap: 2px; }

  .ch-set-toggle-label {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--charcoal);
  }

  .ch-set-toggle-desc {
    font-size: 0.75rem;
    color: var(--muted);
    font-weight: 300;
  }

  /* Custom toggle switch */
  .ch-set-toggle-switch {
    position: relative;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
  }

  .ch-set-toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }

  .ch-set-toggle-track {
    position: absolute;
    inset: 0;
    border-radius: 24px;
    background: rgba(138, 122, 116, 0.2);
    transition: background 0.2s ease;
    cursor: pointer;
  }

  .ch-set-toggle-track::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    top: 3px;
    left: 3px;
    transition: transform 0.22s ease;
    box-shadow: 0 1px 4px rgba(44, 36, 32, 0.2);
  }

  .ch-set-toggle-switch input:checked + .ch-set-toggle-track {
    background: var(--rose);
  }

  .ch-set-toggle-switch input:checked + .ch-set-toggle-track::after {
    transform: translateX(20px);
  }

  /* ── Security buttons ── */
  .ch-set-security-btns {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ch-set-sec-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 22px;
    border-radius: 3px;
    font-family: 'Lato', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1.5px solid;
  }

  .ch-set-sec-btn.primary {
    background: var(--charcoal);
    color: var(--cream);
    border-color: var(--charcoal);
  }

  .ch-set-sec-btn.primary:hover { background: var(--rose); border-color: var(--rose); }

  .ch-set-sec-btn.ghost {
    background: transparent;
    color: var(--muted);
    border-color: var(--border);
  }

  .ch-set-sec-btn.ghost:hover { border-color: var(--rose); color: var(--rose); }

  .ch-set-sec-btn.danger {
    background: transparent;
    color: #c0392b;
    border-color: rgba(192, 57, 43, 0.3);
  }

  .ch-set-sec-btn.danger:hover { background: #c0392b; color: #fff; border-color: #c0392b; }

  .ch-set-sec-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ── Inline form panel ── */
  .ch-set-panel {
    background: rgba(253, 246, 236, 0.5);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 24px;
    margin-top: 20px;
  }

  .ch-set-panel-title {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--charcoal);
    margin-bottom: 20px;
  }

  .ch-set-form-group {
    margin-bottom: 16px;
  }

  .ch-set-form-label {
    display: block;
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
    margin-bottom: 7px;
  }

  .ch-set-form-input {
    width: 100%;
    max-width: 420px;
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    background: var(--cream);
    color: var(--charcoal);
    font-family: 'Lato', sans-serif;
    font-size: 0.86rem;
    font-weight: 400;
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
  }

  .ch-set-form-input:focus {
    border-color: var(--rose);
    box-shadow: 0 0 0 3px rgba(232, 114, 138, 0.1);
  }

  .ch-set-form-input::placeholder { color: var(--muted); opacity: 0.55; }

  .ch-set-otp-input {
    max-width: 180px;
    text-align: center;
    letter-spacing: 0.5em;
    font-size: 1.1rem;
    font-family: 'Playfair Display', serif;
  }

  .ch-set-form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  /* ── Alert messages ── */
  .ch-set-alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    border-radius: 3px;
    font-size: 0.82rem;
    font-weight: 400;
    margin-bottom: 16px;
    margin-top: 4px;
  }

  .ch-set-alert.error {
    background: rgba(192, 57, 43, 0.08);
    border: 1px solid rgba(192, 57, 43, 0.2);
    color: #c0392b;
  }

  .ch-set-alert.success {
    background: rgba(138, 171, 142, 0.12);
    border: 1px solid rgba(138, 171, 142, 0.3);
    color: #4a8a50;
  }

  /* 2FA method selector */
  .ch-set-method-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .ch-set-method-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 400;
    color: var(--muted);
    transition: all 0.18s ease;
    background: transparent;
  }

  .ch-set-method-option.selected {
    border-color: var(--rose);
    color: var(--charcoal);
    background: rgba(232, 114, 138, 0.06);
    font-weight: 700;
  }

  .ch-set-method-option input[type="radio"] { display: none; }

  .ch-set-2fa-enabled {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(138, 171, 142, 0.15);
    color: #4a8a50;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
    margin-left: 8px;
  }

  @media (max-width: 768px) {
    .ch-settings { padding: 32px 20px; }
    .ch-set-title { font-size: 1.8rem; }
    .ch-set-form-input { max-width: 100%; }
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

const Settings = () => {
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [show2FAForm, setShow2FAForm] = useState(false);
  const [twoFAStatus, setTwoFAStatus] = useState({ enabled: false, verified: false, method: null });
  const [twoFAMethod, setTwoFAMethod] = useState("sms");
  const [twoFAPhone, setTwoFAPhone] = useState("");
  const [twoFABackupEmail, setTwoFABackupEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [twoFAError, setTwoFAError] = useState("");
  const [twoFASuccess, setTwoFASuccess] = useState("");
  const [step, setStep] = useState(1);
  const [sendingCode, setSendingCode] = useState(false);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetch2FAStatus = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/2fa-status`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setTwoFAStatus(await res.json());
      } catch (e) { console.error(e); }
    };
    fetch2FAStatus();
  }, []);

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) { setPasswordError("New passwords do not match"); return; }
    if (passwords.newPassword.length < 6) { setPasswordError("Password must be at least 6 characters"); return; }
    setSavingPassword(true);
    try {
      const res = await fetch(`${API_URL}/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess(data.message);
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => { setShowPasswordForm(false); setPasswordSuccess(""); }, 2000);
      } else { setPasswordError(data.message); }
    } catch { setPasswordError("Failed to change password. Please try again."); }
    finally { setSavingPassword(false); }
  };

  const handleSendCode = async () => {
    if (twoFAMethod === "sms" && !twoFAPhone) { setTwoFAError("Please enter your mobile number"); return; }
    if (twoFAMethod === "email" && !twoFABackupEmail) { setTwoFAError("Please enter your backup email"); return; }
    setSendingCode(true);
    try {
      const res = await fetch(`${API_URL}/setup-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ method: twoFAMethod, phone: twoFAPhone, backupEmail: twoFABackupEmail }),
      });
      const data = await res.json();
      if (res.ok) { setTwoFASuccess(`Code sent to ${data.destination}`); setStep(2); setTwoFAError(""); }
      else { setTwoFAError(data.message); }
    } catch { setTwoFAError("Failed to send verification code"); }
    finally { setSendingCode(false); }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) { setTwoFAError("Please enter the verification code"); return; }
    try {
      const res = await fetch(`${API_URL}/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ verificationCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setTwoFASuccess(data.message);
        setTwoFAStatus({ enabled: true, verified: true, method: twoFAMethod });
        setTimeout(() => { setShow2FAForm(false); setStep(1); setTwoFASuccess(""); setVerificationCode(""); }, 2000);
      } else { setTwoFAError(data.message); }
    } catch { setTwoFAError("Failed to verify code"); }
  };

  const handleDisable2FA = async () => {
    try {
      const res = await fetch(`${API_URL}/disable-2fa`, { method: "POST", headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.ok) {
        setTwoFASuccess("2FA disabled successfully");
        setTwoFAStatus({ enabled: false, verified: false, method: null });
        setTimeout(() => setTwoFASuccess(""), 2000);
      }
    } catch { setTwoFAError("Failed to disable 2FA"); }
  };

  const resetPasswordForm = () => {
    setShowPasswordForm(false);
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const reset2FAForm = () => {
    setShow2FAForm(false);
    setStep(1);
    setTwoFAError("");
    setTwoFASuccess("");
    setVerificationCode("");
  };

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
      <style>{settingsStyles}</style>
      <div className="ch-settings">
        {/* Header */}
        <div className="ch-set-header">
          <p className="ch-set-eyebrow">Configuration</p>
          <h1 className="ch-set-title">Account <em>Settings</em></h1>
        </div>

        {/* ── Notification Settings ── */}
        <div className="ch-set-card">
          <div className="ch-set-card-head">
            <div className="ch-set-card-icon rose">🔔</div>
            <span className="ch-set-card-title">Notification Preferences</span>
          </div>
          <div className="ch-set-card-body">
            <div className="ch-set-toggle-list">
              {[
                { key: "email", label: "Email Notifications",  desc: "Receive order updates via email" },
                { key: "sms",   label: "SMS Notifications",    desc: "Receive text alerts to your phone" },
                { key: "push",  label: "Push Notifications",   desc: "Browser push alerts for activity" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="ch-set-toggle-row">
                  <div className="ch-set-toggle-info">
                    <span className="ch-set-toggle-label">{label}</span>
                    <span className="ch-set-toggle-desc">{desc}</span>
                  </div>
                  <label className="ch-set-toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))}
                    />
                    <span className="ch-set-toggle-track" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Security Settings ── */}
        <div className="ch-set-card">
          <div className="ch-set-card-head">
            <div className="ch-set-card-icon amber">🔒</div>
            <span className="ch-set-card-title">
              Security Settings
              {twoFAStatus.enabled && twoFAStatus.verified && (
                <span className="ch-set-2fa-enabled">✓ 2FA On</span>
              )}
            </span>
          </div>
          <div className="ch-set-card-body">

            {/* Main buttons */}
            {!showPasswordForm && !show2FAForm && (
              <div className="ch-set-security-btns">
                <button className="ch-set-sec-btn primary" onClick={() => setShowPasswordForm(true)}>
                  🔑 Change Password
                </button>
                {twoFAStatus.enabled && twoFAStatus.verified ? (
                  <button className="ch-set-sec-btn danger" onClick={handleDisable2FA}>
                    🚫 Disable 2FA ({twoFAStatus.method === "sms" ? "SMS" : "Email"})
                  </button>
                ) : (
                  <button className="ch-set-sec-btn ghost" onClick={() => setShow2FAForm(true)}>
                    🔐 Enable Two-Factor Auth
                  </button>
                )}
              </div>
            )}

            {twoFASuccess && !show2FAForm && !showPasswordForm && (
              <div className="ch-set-alert success" style={{ marginTop: 16 }}>✓ {twoFASuccess}</div>
            )}

            {/* Change Password Panel */}
            {showPasswordForm && (
              <div className="ch-set-panel">
                <div className="ch-set-panel-title">Change Password</div>

                {[
                  { field: "currentPassword", label: "Current Password" },
                  { field: "newPassword",      label: "New Password" },
                  { field: "confirmPassword",  label: "Confirm New Password" },
                ].map(({ field, label }) => (
                  <div key={field} className="ch-set-form-group">
                    <label className="ch-set-form-label">{label}</label>
                    <input
                      type="password"
                      className="ch-set-form-input"
                      value={passwords[field]}
                      onChange={(e) => handlePasswordChange(field, e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                ))}

                {passwordError && <div className="ch-set-alert error">⚠ {passwordError}</div>}
                {passwordSuccess && <div className="ch-set-alert success">✓ {passwordSuccess}</div>}

                <div className="ch-set-form-actions">
                  <button
                    className="ch-set-sec-btn primary"
                    onClick={handleChangePassword}
                    disabled={savingPassword}
                  >
                    {savingPassword ? "Saving…" : "💾 Save Password"}
                  </button>
                  <button className="ch-set-sec-btn ghost" onClick={resetPasswordForm}>Cancel</button>
                </div>
              </div>
            )}

            {/* 2FA Panel */}
            {show2FAForm && (
              <div className="ch-set-panel">
                <div className="ch-set-panel-title">
                  {step === 1 ? "Setup Two-Factor Authentication" : "Enter Verification Code"}
                </div>

                {step === 1 && (
                  <>
                    <p style={{ fontSize: "0.84rem", color: "var(--muted)", marginBottom: 18, fontWeight: 300 }}>
                      Choose how you want to receive verification codes:
                    </p>
                    <div className="ch-set-method-group">
                      {[
                        { value: "sms",   label: "📱 SMS" },
                        { value: "email", label: "📧 Email" },
                      ].map(({ value, label }) => (
                        <label
                          key={value}
                          className={`ch-set-method-option ${twoFAMethod === value ? "selected" : ""}`}
                          onClick={() => setTwoFAMethod(value)}
                        >
                          <input type="radio" name="2faMethod" value={value} checked={twoFAMethod === value} onChange={() => setTwoFAMethod(value)} />
                          {label}
                        </label>
                      ))}
                    </div>

                    {twoFAMethod === "sms" && (
                      <div className="ch-set-form-group">
                        <label className="ch-set-form-label">Mobile Number</label>
                        <input type="tel" className="ch-set-form-input" value={twoFAPhone}
                          onChange={(e) => setTwoFAPhone(e.target.value)} placeholder="+63 912 345 6789" />
                      </div>
                    )}

                    {twoFAMethod === "email" && (
                      <div className="ch-set-form-group">
                        <label className="ch-set-form-label">Backup Email</label>
                        <input type="email" className="ch-set-form-input" value={twoFABackupEmail}
                          onChange={(e) => setTwoFABackupEmail(e.target.value)} placeholder="backup@email.com" />
                      </div>
                    )}

                    {twoFAError   && <div className="ch-set-alert error">⚠ {twoFAError}</div>}
                    {twoFASuccess && <div className="ch-set-alert success">✓ {twoFASuccess}</div>}

                    <div className="ch-set-form-actions">
                      <button className="ch-set-sec-btn primary" onClick={handleSendCode} disabled={sendingCode}>
                        {sendingCode ? "Sending…" : "📤 Send Code"}
                      </button>
                      <button className="ch-set-sec-btn ghost" onClick={reset2FAForm}>Cancel</button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p style={{ fontSize: "0.84rem", color: "var(--muted)", marginBottom: 18, fontWeight: 300 }}>
                      Enter the 6-digit code sent to your {twoFAMethod === "sms" ? "mobile number" : "backup email"}.
                    </p>
                    <div className="ch-set-form-group">
                      <label className="ch-set-form-label">Verification Code</label>
                      <input
                        type="text"
                        className="ch-set-form-input ch-set-otp-input"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                      />
                    </div>

                    {twoFAError   && <div className="ch-set-alert error">⚠ {twoFAError}</div>}
                    {twoFASuccess && <div className="ch-set-alert success">✓ {twoFASuccess}</div>}

                    <div className="ch-set-form-actions">
                      <button className="ch-set-sec-btn primary" onClick={handleVerifyCode}>
                        ✅ Verify & Enable
                      </button>
                      <button className="ch-set-sec-btn ghost"
                        onClick={() => { setStep(1); setVerificationCode(""); setTwoFAError(""); setTwoFASuccess(""); }}>
                        ← Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ── FOOTER ── */}
        <footer className="ch-footer">
          <div className="ch-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>
    </>
  );
};

export default Settings;