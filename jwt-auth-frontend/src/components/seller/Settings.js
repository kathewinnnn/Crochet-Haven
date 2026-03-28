import React, { useState, useEffect } from "react";
import API_BASE_URL from '../../apiConfig';

const API_URL = `${API_BASE_URL}/api/auth`;

const settingsStyles = `
  :root {
    --cream:#fdf6ec; --warm-white:#fffbf5; --rose:#e8728a; --deep-rose:#c4556b;
    --terracotta:#d4735e; --amber:#e8a45a; --sage:#8aab8e;
    --charcoal:#2c2420; --muted:#8a7a74; --border:rgba(212,115,94,0.15);
  }
  .ch-set-eyebrow { display:inline-flex; align-items:center; gap:10px; font-size:.7rem; letter-spacing:.24em; text-transform:uppercase; color:var(--terracotta); font-weight:700; margin-bottom:8px; }
  .ch-set-eyebrow::before { content:''; display:block; width:28px; height:1.5px; background:var(--terracotta); }
  .ch-set-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:800; color:var(--charcoal); letter-spacing:-.03em; line-height:1.1; margin-bottom:28px; }
  .ch-set-title em { font-style:italic; color:var(--rose); }

  .ch-set-card { background:var(--warm-white); border:1px solid var(--border); border-radius:4px; overflow:hidden; margin-bottom:20px; }
  .ch-set-card-head { display:flex; align-items:center; gap:11px; padding:18px 22px; border-bottom:1px solid var(--border); background:rgba(253,246,236,.6); }
  .ch-set-card-icon { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.95rem; flex-shrink:0; }
  .ch-set-card-icon.rose { background:linear-gradient(135deg,var(--rose),#f4a7b2); }
  .ch-set-card-icon.amber { background:linear-gradient(135deg,var(--amber),#f5d4a0); }
  .ch-set-card-title { font-family:'Playfair Display',serif; font-size:1.08rem; font-weight:600; color:var(--charcoal); }
  .ch-set-card-body { padding:22px; }

  .ch-set-toggle-list { display:flex; flex-direction:column; gap:13px; }
  .ch-set-toggle-row { display:flex; align-items:center; justify-content:space-between; padding:13px 14px; background:rgba(253,246,236,.4); border:1px solid var(--border); border-radius:3px; transition:background .15s; }
  .ch-set-toggle-row:hover { background:rgba(253,246,236,.8); }
  .ch-set-toggle-info { display:flex; flex-direction:column; gap:2px; }
  .ch-set-toggle-label { font-size:.86rem; font-weight:700; color:var(--charcoal); }
  .ch-set-toggle-desc { font-size:.73rem; color:var(--muted); font-weight:300; }
  .ch-set-toggle-switch { position:relative; width:42px; height:23px; flex-shrink:0; }
  .ch-set-toggle-switch input { opacity:0; width:0; height:0; position:absolute; }
  .ch-set-toggle-track { position:absolute; inset:0; border-radius:23px; background:rgba(138,122,116,.2); transition:background .2s; cursor:pointer; }
  .ch-set-toggle-track::after { content:''; position:absolute; width:17px; height:17px; border-radius:50%; background:#fff; top:3px; left:3px; transition:transform .22s; box-shadow:0 1px 4px rgba(44,36,32,.2); }
  .ch-set-toggle-switch input:checked + .ch-set-toggle-track { background:var(--rose); }
  .ch-set-toggle-switch input:checked + .ch-set-toggle-track::after { transform:translateX(19px); }

  .ch-set-security-btns { display:flex; gap:10px; flex-wrap:wrap; }
  .ch-set-sec-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:3px; font-family:'Lato',sans-serif; font-size:.78rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; transition:all .2s; border:1.5px solid; }
  .ch-set-sec-btn.primary { background:var(--charcoal); color:var(--cream); border-color:var(--charcoal); }
  .ch-set-sec-btn.primary:hover { background:var(--rose); border-color:var(--rose); }
  .ch-set-sec-btn.ghost { background:transparent; color:var(--muted); border-color:var(--border); }
  .ch-set-sec-btn.ghost:hover { border-color:var(--rose); color:var(--rose); }
  .ch-set-sec-btn.danger { background:transparent; color:#c0392b; border-color:rgba(192,57,43,.3); }
  .ch-set-sec-btn.danger:hover { background:#c0392b; color:#fff; border-color:#c0392b; }
  .ch-set-sec-btn:disabled { opacity:.5; cursor:not-allowed; }

  .ch-set-panel { background:rgba(253,246,236,.5); border:1px solid var(--border); border-radius:3px; padding:20px; margin-top:16px; }
  .ch-set-panel-title { font-family:'Playfair Display',serif; font-size:.97rem; font-weight:600; color:var(--charcoal); margin-bottom:16px; }
  .ch-set-form-group { margin-bottom:13px; }
  .ch-set-form-label { display:block; font-size:.67rem; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); font-weight:700; margin-bottom:6px; }
  .ch-set-form-input { width:100%; max-width:400px; padding:9px 13px; border:1.5px solid var(--border); border-radius:3px; background:var(--cream); color:var(--charcoal); font-family:'Lato',sans-serif; font-size:.84rem; outline:none; transition:border-color .18s,box-shadow .18s; }
  .ch-set-form-input:focus { border-color:var(--rose); box-shadow:0 0 0 3px rgba(232,114,138,.1); }
  .ch-set-otp-input { max-width:170px; text-align:center; letter-spacing:.5em; font-size:1.05rem; font-family:'Playfair Display',serif; }
  .ch-set-form-input-wrapper { position:relative; display:inline-block; width:100%; max-width:400px; }
  .ch-set-form-input-wrapper .ch-set-form-input { padding-right:40px; }
  .ch-set-pwd-toggle { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--muted); padding:4px; font-size:1rem; transition:color .2s; }
  .ch-set-pwd-toggle:hover { color:var(--rose); }
  .ch-set-form-actions { display:flex; gap:9px; margin-top:16px; flex-wrap:wrap; }
  .ch-set-alert { display:flex; align-items:center; gap:9px; padding:10px 13px; border-radius:3px; font-size:.81rem; margin-bottom:13px; margin-top:3px; }
  .ch-set-alert.error { background:rgba(192,57,43,.08); border:1px solid rgba(192,57,43,.2); color:#c0392b; }
  .ch-set-alert.success { background:rgba(138,171,142,.12); border:1px solid rgba(138,171,142,.3); color:#4a8a50; }
  .ch-set-method-group { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px; }
  .ch-set-method-option { display:flex; align-items:center; gap:7px; padding:9px 16px; border:1.5px solid var(--border); border-radius:3px; cursor:pointer; font-size:.81rem; color:var(--muted); transition:all .18s; background:transparent; }
  .ch-set-method-option.selected { border-color:var(--rose); color:var(--charcoal); background:rgba(232,114,138,.06); font-weight:700; }
  .ch-set-method-option input[type="radio"] { display:none; }
  .ch-set-2fa-enabled { display:inline-flex; align-items:center; gap:5px; background:rgba(138,171,142,.15); color:#4a8a50; font-size:.7rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:3px 9px; border-radius:2px; margin-left:7px; }

  @media (max-width:768px) {
    .ch-set-title { font-size:1.5rem; }
    .ch-set-card-head { padding:13px 14px; flex-wrap:wrap; }
    .ch-set-card-body { padding:14px; }
    .ch-set-toggle-row { padding:11px 11px; }
    .ch-set-security-btns { flex-direction:column; }
    .ch-set-sec-btn { justify-content:center; }
    .ch-set-panel { padding:14px; }
    .ch-set-form-input { max-width:100%; }
    .ch-set-form-actions { flex-direction:column; }
  }
`;

const Settings = () => {
  const [notifications, setNotifications] = useState({ email:true, sms:false, push:true });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [show2FAForm, setShow2FAForm] = useState(false);
  const [twoFAStatus, setTwoFAStatus] = useState({ enabled:false, verified:false, method:null });
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
    const fetch2FA = async () => {
      const token = getToken(); if (!token) return;
      try { const r = await fetch(`${API_URL}/2fa-status`, { headers:{ Authorization:`Bearer ${token}` } }); if (r.ok) setTwoFAStatus(await r.json()); } catch {}
    };
    fetch2FA();
  }, []);

  const handlePasswordChange = (f, v) => { setPasswords(p => ({ ...p, [f]:v })); setPasswordError(""); setPasswordSuccess(""); };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword) { setPasswordError("Please enter your current password"); return; }
    if (passwords.currentPassword === passwords.newPassword) { setPasswordError("New password cannot be the same as your current password"); return; }
    if (passwords.newPassword !== passwords.confirmPassword) { setPasswordError("New password and confirm password do not match"); return; }
    if (passwords.newPassword.length < 6) { setPasswordError("Password must be at least 6 characters"); return; }
    setSavingPassword(true);
    try {
      const r = await fetch(`${API_URL}/change-password`, { method:"PUT", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` }, body:JSON.stringify({ currentPassword:passwords.currentPassword, newPassword:passwords.newPassword }) });
      const d = await r.json();
      if (r.ok) { setPasswordSuccess(d.message); setPasswords({ currentPassword:"", newPassword:"", confirmPassword:"" }); setTimeout(() => { setShowPasswordForm(false); setPasswordSuccess(""); }, 2000); }
      else setPasswordError(d.message);
    } catch { setPasswordError("Failed. Please try again."); }
    finally { setSavingPassword(false); }
  };

  const handleSendCode = async () => {
    if (twoFAMethod === "sms" && !twoFAPhone) { setTwoFAError("Enter your mobile number"); return; }
    if (twoFAMethod === "email" && !twoFABackupEmail) { setTwoFAError("Enter your backup email"); return; }
    setSendingCode(true);
    try {
      const r = await fetch(`${API_URL}/setup-2fa`, { method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` }, body:JSON.stringify({ method:twoFAMethod, phone:twoFAPhone, backupEmail:twoFABackupEmail }) });
      const d = await r.json();
      if (r.ok) { setTwoFASuccess(`Code sent to ${d.destination}`); setStep(2); setTwoFAError(""); }
      else setTwoFAError(d.message);
    } catch { setTwoFAError("Failed to send code"); }
    finally { setSendingCode(false); }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) { setTwoFAError("Enter the verification code"); return; }
    try {
      const r = await fetch(`${API_URL}/verify-2fa`, { method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` }, body:JSON.stringify({ verificationCode }) });
      const d = await r.json();
      if (r.ok) { setTwoFASuccess(d.message); setTwoFAStatus({ enabled:true, verified:true, method:twoFAMethod }); setTimeout(() => { setShow2FAForm(false); setStep(1); setTwoFASuccess(""); setVerificationCode(""); }, 2000); }
      else setTwoFAError(d.message);
    } catch { setTwoFAError("Failed to verify"); }
  };

  const handleDisable2FA = async () => {
    try {
      const r = await fetch(`${API_URL}/disable-2fa`, { method:"POST", headers:{ Authorization:`Bearer ${getToken()}` } });
      if (r.ok) { setTwoFASuccess("2FA disabled"); setTwoFAStatus({ enabled:false, verified:false, method:null }); setTimeout(() => setTwoFASuccess(""), 2000); }
    } catch { setTwoFAError("Failed to disable 2FA"); }
  };

  const resetPw = () => { setShowPasswordForm(false); setPasswords({ currentPassword:"", newPassword:"", confirmPassword:"" }); setPasswordError(""); setPasswordSuccess(""); };
  const reset2FA = () => { setShow2FAForm(false); setStep(1); setTwoFAError(""); setTwoFASuccess(""); setVerificationCode(""); };

  return (
    <>
      <style>{settingsStyles}</style>
      <p className="ch-set-eyebrow">Configuration</p>
      <h1 className="ch-set-title">Account <em>Settings</em></h1>

      {/* Notifications */}
      <div className="ch-set-card">
        <div className="ch-set-card-head">
          <div className="ch-set-card-icon rose">🔔</div>
          <span className="ch-set-card-title">Notification Preferences</span>
        </div>
        <div className="ch-set-card-body">
          <div className="ch-set-toggle-list">
            {[
              { key:"email", label:"Email Notifications", desc:"Receive order updates via email" },
              { key:"sms",   label:"SMS Notifications",   desc:"Receive text alerts to your phone" },
              { key:"push",  label:"Push Notifications",  desc:"Browser push alerts for activity" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="ch-set-toggle-row">
                <div className="ch-set-toggle-info">
                  <span className="ch-set-toggle-label">{label}</span>
                  <span className="ch-set-toggle-desc">{desc}</span>
                </div>
                <label className="ch-set-toggle-switch">
                  <input type="checkbox" checked={notifications[key]} onChange={() => setNotifications(p => ({ ...p, [key]:!p[key] }))} />
                  <span className="ch-set-toggle-track" />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="ch-set-card">
        <div className="ch-set-card-head">
          <div className="ch-set-card-icon amber">🔒</div>
          <span className="ch-set-card-title">
            Security Settings
            {twoFAStatus.enabled && twoFAStatus.verified && <span className="ch-set-2fa-enabled">✓ 2FA On</span>}
          </span>
        </div>
        <div className="ch-set-card-body">
          {!showPasswordForm && !show2FAForm && (
            <div className="ch-set-security-btns">
              <button className="ch-set-sec-btn primary" onClick={() => setShowPasswordForm(true)}>🔑 Change Password</button>
              {twoFAStatus.enabled && twoFAStatus.verified ? (
                <button className="ch-set-sec-btn danger" onClick={handleDisable2FA}>🚫 Disable 2FA</button>
              ) : (
                <button className="ch-set-sec-btn ghost" onClick={() => setShow2FAForm(true)}>🔐 Enable Two-Factor Auth</button>
              )}
            </div>
          )}
          {twoFASuccess && !show2FAForm && !showPasswordForm && <div className="ch-set-alert success" style={{ marginTop:14 }}>✓ {twoFASuccess}</div>}

          {showPasswordForm && (
            <div className="ch-set-panel">
              <div className="ch-set-panel-title">Change Password</div>
              <div className="ch-set-form-group">
                <label className="ch-set-form-label">Current Password</label>
                <div className="ch-set-form-input-wrapper">
                  <input type={showCurrentPassword ? "text" : "password"} className="ch-set-form-input" value={passwords.currentPassword} onChange={e => handlePasswordChange('currentPassword', e.target.value)} placeholder="••••••••" />
                  <button type="button" className="ch-set-pwd-toggle" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>{showCurrentPassword ? "👁️" : "👁️‍🗨️"}</button>
                </div>
              </div>
              <div className="ch-set-form-group">
                <label className="ch-set-form-label">New Password</label>
                <div className="ch-set-form-input-wrapper">
                  <input type={showNewPassword ? "text" : "password"} className="ch-set-form-input" value={passwords.newPassword} onChange={e => handlePasswordChange('newPassword', e.target.value)} placeholder="••••••••" />
                  <button type="button" className="ch-set-pwd-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>{showNewPassword ? "👁️" : "👁️‍🗨️"}</button>
                </div>
              </div>
              <div className="ch-set-form-group">
                <label className="ch-set-form-label">Confirm New Password</label>
                <div className="ch-set-form-input-wrapper">
                  <input type={showConfirmPassword ? "text" : "password"} className="ch-set-form-input" value={passwords.confirmPassword} onChange={e => handlePasswordChange('confirmPassword', e.target.value)} placeholder="••••••••" />
                  <button type="button" className="ch-set-pwd-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</button>
                </div>
              </div>
              {passwordError && <div className="ch-set-alert error">⚠ {passwordError}</div>}
              {passwordSuccess && <div className="ch-set-alert success">✓ {passwordSuccess}</div>}
              <div className="ch-set-form-actions">
                <button className="ch-set-sec-btn primary" onClick={handleChangePassword} disabled={savingPassword}>{savingPassword ? "Saving…" : "💾 Save Password"}</button>
                <button className="ch-set-sec-btn ghost" onClick={resetPw}>Cancel</button>
              </div>
            </div>
          )}

          {show2FAForm && (
            <div className="ch-set-panel">
              <div className="ch-set-panel-title">{step === 1 ? "Setup Two-Factor Authentication" : "Enter Verification Code"}</div>
              {step === 1 && (
                <>
                  <p style={{ fontSize:".83rem", color:"var(--muted)", marginBottom:15, fontWeight:300 }}>Choose how to receive verification codes:</p>
                  <div className="ch-set-method-group">
                    {[{ v:"sms", l:"📱 SMS" }, { v:"email", l:"📧 Email" }].map(({ v, l }) => (
                      <label key={v} className={`ch-set-method-option ${twoFAMethod === v ? "selected" : ""}`} onClick={() => setTwoFAMethod(v)}>
                        <input type="radio" name="2faM" value={v} checked={twoFAMethod === v} onChange={() => setTwoFAMethod(v)} />{l}
                      </label>
                    ))}
                  </div>
                  {twoFAMethod === "sms" && <div className="ch-set-form-group"><label className="ch-set-form-label">Mobile Number</label><input type="tel" className="ch-set-form-input" value={twoFAPhone} onChange={e => setTwoFAPhone(e.target.value)} placeholder="+63 912 345 6789" /></div>}
                  {twoFAMethod === "email" && <div className="ch-set-form-group"><label className="ch-set-form-label">Backup Email</label><input type="email" className="ch-set-form-input" value={twoFABackupEmail} onChange={e => setTwoFABackupEmail(e.target.value)} placeholder="backup@email.com" /></div>}
                  {twoFAError && <div className="ch-set-alert error">⚠ {twoFAError}</div>}
                  {twoFASuccess && <div className="ch-set-alert success">✓ {twoFASuccess}</div>}
                  <div className="ch-set-form-actions">
                    <button className="ch-set-sec-btn primary" onClick={handleSendCode} disabled={sendingCode}>{sendingCode ? "Sending…" : "📤 Send Code"}</button>
                    <button className="ch-set-sec-btn ghost" onClick={reset2FA}>Cancel</button>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <p style={{ fontSize:".83rem", color:"var(--muted)", marginBottom:15, fontWeight:300 }}>Enter the 6-digit code sent to your {twoFAMethod === "sms" ? "mobile" : "email"}.</p>
                  <div className="ch-set-form-group">
                    <label className="ch-set-form-label">Verification Code</label>
                    <input type="text" className="ch-set-form-input ch-set-otp-input" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} placeholder="000000" maxLength={6} />
                  </div>
                  {twoFAError && <div className="ch-set-alert error">⚠ {twoFAError}</div>}
                  {twoFASuccess && <div className="ch-set-alert success">✓ {twoFASuccess}</div>}
                  <div className="ch-set-form-actions">
                    <button className="ch-set-sec-btn primary" onClick={handleVerifyCode}>✅ Verify & Enable</button>
                    <button className="ch-set-sec-btn ghost" onClick={() => { setStep(1); setVerificationCode(""); setTwoFAError(""); setTwoFASuccess(""); }}>← Back</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;