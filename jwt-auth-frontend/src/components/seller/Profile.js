import React, { useState, useEffect, useRef } from "react";
import API_BASE_URL from '../../apiConfig';

const API_URL = `${API_BASE_URL}/api/auth`;

const profileStyles = `
  :root {
    --cream:#fdf6ec; --warm-white:#fffbf5; --rose:#e8728a; --deep-rose:#c4556b;
    --terracotta:#d4735e; --amber:#e8a45a; --sage:#8aab8e;
    --charcoal:#2c2420; --muted:#8a7a74; --border:rgba(212,115,94,0.15);
  }
  .ch-prof-eyebrow { display:inline-flex; align-items:center; gap:10px; font-size:.7rem; letter-spacing:.24em; text-transform:uppercase; color:var(--terracotta); font-weight:700; margin-bottom:8px; }
  .ch-prof-eyebrow::before { content:''; display:block; width:28px; height:1.5px; background:var(--terracotta); }
  .ch-prof-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:800; color:var(--charcoal); letter-spacing:-.03em; line-height:1.1; margin-bottom:24px; }
  .ch-prof-title em { font-style:italic; color:var(--rose); }

  .ch-prof-avatar-card { background:var(--warm-white); border:1px solid var(--border); border-radius:4px; padding:32px 24px; display:flex; align-items:center; gap:28px; margin-bottom:20px; }
  .ch-prof-avatar-wrap { position:relative; flex-shrink:0; }
  .ch-prof-avatar { width:110px; height:110px; border-radius:50%; object-fit:cover; object-position:center; border:3px solid var(--rose); box-shadow:0 8px 32px rgba(232,114,138,.2); display:block; }
  .ch-prof-avatar-overlay { position:absolute; inset:0; border-radius:50%; background:rgba(44,36,32,.5); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; cursor:pointer; font-size:1.3rem; }
  .ch-prof-avatar-wrap:hover .ch-prof-avatar-overlay { opacity:1; }
  .ch-prof-avatar-info { flex:1; min-width:0; }
  .ch-prof-avatar-name { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:800; color:var(--charcoal); letter-spacing:-.02em; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ch-prof-avatar-store { font-size:.8rem; color:var(--muted); font-weight:300; margin-bottom:10px; }
  .ch-prof-avatar-store span { color:var(--rose); font-weight:700; }
  .ch-prof-avatar-location { display:inline-flex; align-items:center; gap:4px; font-size:.73rem; color:var(--muted); font-weight:300; }

  .ch-prof-info-card { background:var(--warm-white); border:1px solid var(--border); border-radius:4px; overflow:hidden; margin-bottom:20px; }
  .ch-prof-card-head { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; border-bottom:1px solid var(--border); background:rgba(253,246,236,.6); }
  .ch-prof-card-title { font-family:'Playfair Display',serif; font-size:1.08rem; font-weight:600; color:var(--charcoal); }
  .ch-prof-card-body { padding:22px; }
  .ch-prof-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .ch-prof-form-group { display:flex; flex-direction:column; gap:6px; }
  .ch-prof-form-group.span-2 { grid-column:span 2; }
  .ch-prof-form-label { font-size:.67rem; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); font-weight:700; }
  .ch-prof-form-input, .ch-prof-form-textarea { width:100%; padding:9px 13px; border:1.5px solid var(--border); border-radius:3px; background:var(--cream); color:var(--charcoal); font-family:'Lato',sans-serif; font-size:.84rem; outline:none; transition:border-color .18s,box-shadow .18s; }
  .ch-prof-form-input:focus, .ch-prof-form-textarea:focus { border-color:var(--rose); box-shadow:0 0 0 3px rgba(232,114,138,.1); }
  .ch-prof-form-textarea { resize:vertical; min-height:88px; }
  .ch-prof-field-value { padding:9px 13px; background:rgba(253,246,236,.5); border:1px solid var(--border); border-radius:3px; font-size:.84rem; color:var(--charcoal); min-height:40px; line-height:1.5; }
  .ch-prof-field-empty { color:var(--muted); font-style:italic; font-weight:300; }

  .ch-prof-btn-primary { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; background:var(--charcoal); color:var(--cream); border:none; border-radius:3px; font-family:'Lato',sans-serif; font-size:.78rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; transition:all .22s; position:relative; overflow:hidden; }
  .ch-prof-btn-primary::after { content:''; position:absolute; inset:0; background:var(--rose); transform:translateX(-100%); transition:transform .28s; }
  .ch-prof-btn-primary:hover::after { transform:translateX(0); }
  .ch-prof-btn-primary span { position:relative; z-index:1; }
  .ch-prof-btn-primary:hover { color:#fff; }
  .ch-prof-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
  .ch-prof-btn-ghost { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; background:transparent; border:1.5px solid var(--border); border-radius:3px; color:var(--muted); font-family:'Lato',sans-serif; font-size:.78rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; transition:all .18s; }
  .ch-prof-btn-ghost:hover { border-color:var(--rose); color:var(--rose); }
  .ch-prof-btn-img { display:inline-flex; align-items:center; gap:6px; padding:7px 16px; background:transparent; border:1.5px solid var(--border); border-radius:3px; color:var(--muted); font-family:'Lato',sans-serif; font-size:.73rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; transition:all .18s; }
  .ch-prof-btn-img:hover { border-color:var(--rose); color:var(--rose); }
  .ch-prof-save-bar { display:flex; gap:10px; align-items:center; padding:18px 22px; border-top:1px solid var(--border); background:rgba(253,246,236,.4); }

  .ch-prof-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:260px; gap:14px; color:var(--muted); font-size:.83rem; }
  .ch-prof-loader { width:32px; height:32px; border:2.5px solid rgba(232,114,138,.2); border-top-color:var(--rose); border-radius:50%; animation:profSpin .8s linear infinite; }
  @keyframes profSpin { to { transform:rotate(360deg); } }

  /* Password change panel */
  .ch-prof-pwd-panel { padding:20px; background:var(--cream); border-top:1px solid var(--border); }
  .ch-prof-pwd-panel-title { font-family:'Playfair Display',serif; font-size:1.05rem; font-weight:700; color:var(--charcoal); margin-bottom:6px; }
  .ch-prof-pwd-panel-sub { font-size:.82rem; color:var(--muted); font-weight:300; margin-bottom:16px; line-height:1.5; }
  .ch-prof-pwd-field { margin-bottom:14px; }
  .ch-prof-pwd-field label { display:block; font-size:.67rem; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); font-weight:700; margin-bottom:6px; }
  .ch-prof-pwd-input { width:100%; padding:11px 14px; border:1.5px solid var(--border); border-radius:3px; font-family:'Lato',sans-serif; font-size:.9rem; color:var(--charcoal); background:var(--warm-white); box-sizing:border-box; }
  .ch-prof-pwd-input:focus { outline:none; border-color:var(--rose); box-shadow:0 0 0 3px rgba(232,114,138,.1); }
  .ch-prof-pwd-error { font-size:.78rem; color:#dc2626; margin-bottom:10px; display:flex; align-items:center; gap:5px; }
  .ch-prof-pwd-success { font-size:.78rem; color:#065f46; margin-bottom:10px; display:flex; align-items:center; gap:5px; }
  .ch-prof-pwd-actions { display:flex; gap:10px; }

  @media (max-width:768px) {
    .ch-prof-title { font-size:1.5rem; }
    .ch-prof-avatar-card { flex-direction:column; text-align:center; gap:14px; padding:20px 14px; }
    .ch-prof-avatar { width:86px; height:86px; }
    .ch-prof-avatar-name { font-size:1.15rem; }
    .ch-prof-form-grid { grid-template-columns:1fr; }
    .ch-prof-form-group.span-2 { grid-column:span 1; }
    .ch-prof-card-body { padding:14px; }
    .ch-prof-card-head { padding:13px 14px; flex-wrap:wrap; gap:9px; }
    .ch-prof-save-bar { padding:14px; flex-wrap:wrap; }
  }
`;

const Profile = () => {
  const [profile, setProfile] = useState({ name:"", email:"", phone:"", bio:"", storeName:"", location:"", avatar:"https://via.placeholder.com/150" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const fileRef = useRef(null);
  const getToken = () => localStorage.getItem("token") || localStorage.getItem("ch_token");

  useEffect(() => {
    const fetchProfile = async () => {
      // First, load from localStorage - try ch_user first (most reliable source)
      let saved = localStorage.getItem("ch_user");
      if (saved) {
        try {
          const userData = JSON.parse(saved);
          console.log('📦 Loaded ch_user:', userData);
          // Map ch_user fields to seller profile format
          setProfile({
            name: userData.fullName || userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            bio: userData.bio || "",
            storeName: userData.storeName || "",
            location: userData.location || userData.address || "",
            avatar: userData.avatar || "https://via.placeholder.com/150"
          });
        } catch (e) {
          console.error('Failed to parse ch_user:', e);
        }
      }
      
      // Also check sellerProfile for backwards compatibility
      const sellerSaved = localStorage.getItem("sellerProfile");
      if (sellerSaved) {
        try {
          const sellerData = JSON.parse(sellerSaved);
          if (!saved) {
            setProfile(sellerData);
          }
        } catch (e) {
          console.error('Failed to parse sellerProfile:', e);
        }
      }
       
      const token = getToken();
      if (token) {
        try {
          const r = await fetch(`${API_URL}/profile`, { headers:{ Authorization:`Bearer ${token}` } });
          if (r.ok) {
            const data = await r.json();
            console.log('📡 Seller API profile data:', data);
            // Merge API data - API takes precedence
            setProfile(prev => ({
              ...prev,
              name: data.fullName || data.name || prev.name || "",
              email: data.email || prev.email || "",
              phone: data.phone || prev.phone || "",
              bio: data.bio || prev.bio || "",
              storeName: data.storeName || prev.storeName || "",
              location: data.location || data.address || prev.location || "",
              avatar: data.avatar || prev.avatar || "https://via.placeholder.com/150"
            }));
            // Save to localStorage
            localStorage.setItem("sellerProfile", JSON.stringify({
              name: data.fullName || data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              bio: data.bio || "",
              storeName: data.storeName || "",
              location: data.location || data.address || "",
              avatar: data.avatar || "https://via.placeholder.com/150"
            }));
            // Also update ch_user with API data
            const currentChUser = JSON.parse(localStorage.getItem("ch_user") || "{}");
            localStorage.setItem("ch_user", JSON.stringify({ ...currentChUser, ...data }));
          } else {
            console.error('Failed to fetch profile:', r.status);
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      } else {
        console.log('No token found for profile fetch');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (f, v) => setProfile(p => ({ ...p, [f]:v }));

  const handleAvatarChange = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = { ...profile, avatar:reader.result };
      setProfile(updated);
      localStorage.setItem("sellerProfile", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    const token = getToken();
    try {
      if (token) {
        const r = await fetch(`${API_URL}/profile`, { 
          method:"PUT", 
          headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` }, 
          body:JSON.stringify({
            fullName: profile.name,
            phone: profile.phone,
            address: profile.location,
            bio: profile.bio,
            storeName: profile.storeName,
            location: profile.location,
            avatar: profile.avatar
          }) 
        });
        if (r.ok) { 
          const d = await r.json(); 
          setProfile(prev => ({ ...prev, name: d.fullName || d.name || prev.name }));
          localStorage.setItem("sellerProfile", JSON.stringify(profile));
        }
      } else {
        localStorage.setItem("sellerProfile", JSON.stringify(profile));
      }
      setIsEditing(false);
    } catch { 
      localStorage.setItem("sellerProfile", JSON.stringify(profile)); 
      setIsEditing(false); 
    }
    finally { setSaving(false); }
  };

  const handleCancel = () => { 
    setIsEditing(false); 
    setShowPasswordForm(false);
    const s = localStorage.getItem("sellerProfile"); 
    if (s) setProfile(JSON.parse(s)); 
  };

  // Password change handlers
  const handlePasswordFieldChange = (field, value) => {
    setPasswords(p => ({ ...p, [field]: value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    setPasswordError('');
    
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess(data.message);
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => { setShowPasswordForm(false); setPasswordSuccess(''); }, 2000);
      } else {
        setPasswordError(data.message);
      }
    } catch {
      setPasswordError('Failed. Please try again.');
    } finally {
      setSavingPassword(false);
    }
  };

  const resetPasswordForm = () => {
    setShowPasswordForm(false);
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const fields = [
    { key:"name",      label:"Full Name",   type:"text",  placeholder:"Your full name" },
    { key:"email",     label:"Email",       type:"email", placeholder:"your@email.com" },
    { key:"phone",     label:"Phone",       type:"tel",   placeholder:"+63 912 345 6789" },
    { key:"storeName", label:"Store Name",  type:"text",  placeholder:"Your shop name" },
  ];

  if (loading) return (<><style>{profileStyles}</style><div className="ch-prof-loading"><div className="ch-prof-loader" /><span>Loading profile…</span></div></>);

  return (
    <>
      <style>{profileStyles}</style>
      <p className="ch-prof-eyebrow">Account</p>
      <h1 className="ch-prof-title">Seller <em>Profile</em></h1>

      <div className="ch-prof-avatar-card">
        <div className="ch-prof-avatar-wrap">
          <img src={profile.avatar || "https://via.placeholder.com/150"} alt="Avatar" className="ch-prof-avatar" onError={e => { e.target.src = "https://via.placeholder.com/150"; }} />
          {isEditing && <div className="ch-prof-avatar-overlay" onClick={() => fileRef.current?.click()}>📷</div>}
          <input type="file" ref={fileRef} accept="image/*" onChange={handleAvatarChange} style={{ display:"none" }} />
        </div>
        <div className="ch-prof-avatar-info">
          <div className="ch-prof-avatar-name">{profile.name || "Your Name"}</div>
          <div className="ch-prof-avatar-store">{profile.storeName ? <><span>{profile.storeName}</span> · Seller</> : "Seller Account"}</div>
          {profile.location && <div className="ch-prof-avatar-location">📍 {profile.location}</div>}
          {isEditing && <button className="ch-prof-btn-img" style={{ marginTop:12 }} onClick={() => fileRef.current?.click()}>📷 Change Photo</button>}
        </div>
      </div>

      <div className="ch-prof-info-card">
        <div className="ch-prof-card-head">
          <span className="ch-prof-card-title">Profile Information</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {!isEditing && !showPasswordForm && (
              <button className="ch-prof-btn-ghost" onClick={() => setShowPasswordForm(true)}>🔑 Change Password</button>
            )}
            {!isEditing && <button className="ch-prof-btn-primary" onClick={() => setIsEditing(true)}><span>✏️ Edit Profile</span></button>}
          </div>
        </div>
        <div className="ch-prof-card-body">
          <div className="ch-prof-form-grid">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key} className="ch-prof-form-group">
                <label className="ch-prof-form-label">{label}</label>
                {isEditing
                  ? <input type={type} className="ch-prof-form-input" value={profile[key] || ""} onChange={e => handleChange(key, e.target.value)} placeholder={placeholder} />
                  : <div className={`ch-prof-field-value ${!profile[key] ? "ch-prof-field-empty" : ""}`}>{profile[key] || "Not set"}</div>
                }
              </div>
            ))}
            <div className="ch-prof-form-group span-2">
              <label className="ch-prof-form-label">Location</label>
              {isEditing
                ? <input type="text" className="ch-prof-form-input" value={profile.location || ""} onChange={e => handleChange("location", e.target.value)} placeholder="City, Province, Philippines" />
                : <div className={`ch-prof-field-value ${!profile.location ? "ch-prof-field-empty" : ""}`}>{profile.location || "Not set"}</div>
              }
            </div>
            <div className="ch-prof-form-group span-2">
              <label className="ch-prof-form-label">Bio</label>
              {isEditing
                ? <textarea className="ch-prof-form-textarea" value={profile.bio || ""} onChange={e => handleChange("bio", e.target.value)} placeholder="Tell customers about yourself…" rows={4} />
                : <div className={`ch-prof-field-value ${!profile.bio ? "ch-prof-field-empty" : ""}`} style={{ minHeight:72 }}>{profile.bio || "Not set"}</div>
              }
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="ch-prof-save-bar">
            <button className="ch-prof-btn-primary" onClick={handleSave} disabled={saving}><span>{saving ? "Saving…" : "💾 Save Profile"}</span></button>
            <button className="ch-prof-btn-ghost" onClick={handleCancel}>Cancel</button>
          </div>
        )}
        {showPasswordForm && (
          <div className="ch-prof-pwd-panel">
            <div className="ch-prof-pwd-panel-title">🔑 Change Your Password</div>
            <div className="ch-prof-pwd-panel-sub">Enter your current password and choose a new one.</div>

            <div className="ch-prof-pwd-field">
              <label>Current Password</label>
              <input
                type="password"
                className="ch-prof-pwd-input"
                value={passwords.currentPassword}
                onChange={e => handlePasswordFieldChange('currentPassword', e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="ch-prof-pwd-field">
              <label>New Password</label>
              <input
                type="password"
                className="ch-prof-pwd-input"
                value={passwords.newPassword}
                onChange={e => handlePasswordFieldChange('newPassword', e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="ch-prof-pwd-field">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="ch-prof-pwd-input"
                value={passwords.confirmPassword}
                onChange={e => handlePasswordFieldChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {passwordError && <div className="ch-prof-pwd-error">⚠ {passwordError}</div>}
            {passwordSuccess && <div className="ch-prof-pwd-success">✓ {passwordSuccess}</div>}

            <div className="ch-prof-pwd-actions">
              <button className="ch-prof-btn-ghost" onClick={resetPasswordForm}>Cancel</button>
              <button className="ch-prof-btn-primary" onClick={handleChangePassword} disabled={savingPassword}>
                <span>{savingPassword ? 'Saving…' : '💾 Save Password'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
