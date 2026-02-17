import React, { useState, useEffect, useRef } from "react";

const API_URL = "http://localhost:5000/api/auth";

const profileStyles = `
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

  .ch-profile {
    font-family: 'Lato', sans-serif;
    color: var(--charcoal);
    padding: 52px 56px;
    min-height: 100vh;
  }

  .ch-prof-header { margin-bottom: 40px; }

  .ch-prof-eyebrow {
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

  .ch-prof-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--terracotta);
  }

  .ch-prof-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .ch-prof-title em { font-style: italic; color: var(--rose); }

  /* ── Avatar card ── */
  .ch-prof-avatar-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 40px 28px;
    display: flex;
    align-items: center;
    gap: 32px;
    margin-bottom: 24px;
  }

  .ch-prof-avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }

  .ch-prof-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
    border: 3px solid var(--rose);
    box-shadow: 0 8px 32px rgba(232, 114, 138, 0.2);
    display: block;
  }

  .ch-prof-avatar-overlay {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(44, 36, 32, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    cursor: pointer;
    font-size: 1.4rem;
  }

  .ch-prof-avatar-wrap:hover .ch-prof-avatar-overlay { opacity: 1; }

  .ch-prof-avatar-info {
    flex: 1;
    min-width: 0;
  }

  .ch-prof-avatar-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.02em;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ch-prof-avatar-store {
    font-size: 0.82rem;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: 12px;
  }

  .ch-prof-avatar-store span {
    color: var(--rose);
    font-weight: 700;
  }

  .ch-prof-avatar-location {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.75rem;
    color: var(--muted);
    font-weight: 300;
  }

  /* ── Info card ── */
  .ch-prof-info-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .ch-prof-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 28px;
    border-bottom: 1px solid var(--border);
    background: rgba(253, 246, 236, 0.6);
  }

  .ch-prof-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--charcoal);
  }

  .ch-prof-card-body { padding: 28px; }

  /* ── Form grid ── */
  .ch-prof-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .ch-prof-form-group { display: flex; flex-direction: column; gap: 7px; }
  .ch-prof-form-group.span-2 { grid-column: span 2; }

  .ch-prof-form-label {
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
  }

  .ch-prof-form-input,
  .ch-prof-form-textarea {
    width: 100%;
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

  .ch-prof-form-input:focus,
  .ch-prof-form-textarea:focus {
    border-color: var(--rose);
    box-shadow: 0 0 0 3px rgba(232, 114, 138, 0.1);
  }

  .ch-prof-form-input::placeholder,
  .ch-prof-form-textarea::placeholder { color: var(--muted); opacity: 0.55; }

  .ch-prof-form-textarea { resize: vertical; min-height: 96px; }

  /* Static display value */
  .ch-prof-field-value {
    padding: 10px 14px;
    background: rgba(253, 246, 236, 0.5);
    border: 1px solid var(--border);
    border-radius: 3px;
    font-size: 0.86rem;
    color: var(--charcoal);
    min-height: 42px;
    line-height: 1.5;
  }

  .ch-prof-field-empty {
    color: var(--muted);
    font-style: italic;
    font-weight: 300;
  }

  /* ── Action buttons ── */
  .ch-prof-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 22px;
    background: var(--charcoal);
    color: var(--cream);
    border: none;
    border-radius: 3px;
    font-family: 'Lato', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.22s ease;
    position: relative;
    overflow: hidden;
  }

  .ch-prof-btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--rose);
    transform: translateX(-100%);
    transition: transform 0.28s ease;
  }

  .ch-prof-btn-primary:hover::after { transform: translateX(0); }
  .ch-prof-btn-primary span { position: relative; z-index: 1; }
  .ch-prof-btn-primary:hover { color: #fff; }
  .ch-prof-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .ch-prof-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 22px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .ch-prof-btn-ghost:hover { border-color: var(--rose); color: var(--rose); }

  .ch-prof-btn-img {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 18px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    color: var(--muted);
    font-family: 'Lato', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .ch-prof-btn-img:hover { border-color: var(--rose); color: var(--rose); }

  .ch-prof-save-bar {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 24px 28px;
    border-top: 1px solid var(--border);
    background: rgba(253, 246, 236, 0.4);
  }

  .ch-prof-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .ch-prof-loader {
    width: 36px;
    height: 36px;
    border: 2.5px solid rgba(232, 114, 138, 0.2);
    border-top-color: var(--rose);
    border-radius: 50%;
    animation: chProfSpin 0.8s linear infinite;
  }

  @keyframes chProfSpin { to { transform: rotate(360deg); } }

  @media (max-width: 900px) {
    .ch-profile { padding: 32px 20px; }
    .ch-prof-title { font-size: 1.8rem; }
    .ch-prof-avatar-card { flex-direction: column; text-align: center; gap: 20px; padding: 28px 20px; }
    .ch-prof-form-grid { grid-template-columns: 1fr; }
    .ch-prof-form-group.span-2 { grid-column: span 1; }
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

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", bio: "", storeName: "", location: "",
    avatar: "https://via.placeholder.com/150",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      const savedProfile = localStorage.getItem("sellerProfile");
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      if (token) {
        try {
          const res = await fetch(`${API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            const localData = savedProfile ? JSON.parse(savedProfile) : {};
            const merged = { ...localData, ...data, avatar: localData.avatar || data.avatar || "https://via.placeholder.com/150" };
            setProfile(merged);
            localStorage.setItem("sellerProfile", JSON.stringify(merged));
          }
        } catch (e) { console.error(e); }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (field, value) => setProfile((p) => ({ ...p, [field]: value }));

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = { ...profile, avatar: reader.result };
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
        const res = await fetch(`${API_URL}/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(profile),
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          localStorage.setItem("sellerProfile", JSON.stringify(data));
        }
      } else {
        localStorage.setItem("sellerProfile", JSON.stringify(profile));
      }
      setIsEditing(false);
    } catch {
      localStorage.setItem("sellerProfile", JSON.stringify(profile));
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    const saved = localStorage.getItem("sellerProfile");
    if (saved) setProfile(JSON.parse(saved));
  };

  const fields = [
    { key: "name",      label: "Full Name",   type: "text",  placeholder: "Your full name" },
    { key: "email",     label: "Email",        type: "email", placeholder: "your@email.com" },
    { key: "phone",     label: "Phone",        type: "tel",   placeholder: "+63 912 345 6789" },
    { key: "storeName", label: "Store Name",   type: "text",  placeholder: "Your shop name" },
  ];

  if (loading) {
    return (
      <div className="ch-profile">
        <style>{profileStyles}</style>
        <div className="ch-prof-loading">
          <div className="ch-prof-loader" />
          <span>Loading profile…</span>
        </div>
      </div>
    );
  }

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
      <style>{profileStyles}</style>
      <div className="ch-profile">
        {/* Header */}
        <div className="ch-prof-header">
          <p className="ch-prof-eyebrow">Account</p>
          <h1 className="ch-prof-title">Seller <em>Profile</em></h1>
        </div>

        {/* Avatar card */}
        <div className="ch-prof-avatar-card">
          <div className="ch-prof-avatar-wrap">
            <img
              src={profile.avatar || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="ch-prof-avatar"
              onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
            />
            {isEditing && (
              <div
                className="ch-prof-avatar-overlay"
                onClick={() => fileInputRef.current?.click()}
                title="Change photo"
              >
                📷
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </div>

          <div className="ch-prof-avatar-info">
            <div className="ch-prof-avatar-name">{profile.name || "Your Name"}</div>
            <div className="ch-prof-avatar-store">
              {profile.storeName ? <><span>{profile.storeName}</span> · Seller</> : "Seller Account"}
            </div>
            {profile.location && (
              <div className="ch-prof-avatar-location">📍 {profile.location}</div>
            )}
            {isEditing && (
              <button
                className="ch-prof-btn-img"
                style={{ marginTop: 14 }}
                onClick={() => fileInputRef.current?.click()}
              >
                📷 Change Photo
              </button>
            )}
          </div>
        </div>

        {/* Info card */}
        <div className="ch-prof-info-card">
          <div className="ch-prof-card-head">
            <span className="ch-prof-card-title">Profile Information</span>
            {!isEditing && (
              <button className="ch-prof-btn-primary" onClick={() => setIsEditing(true)}>
                <span>✏️ Edit Profile</span>
              </button>
            )}
          </div>

          <div className="ch-prof-card-body">
            <div className="ch-prof-form-grid">
              {fields.map(({ key, label, type, placeholder }) => (
                <div key={key} className="ch-prof-form-group">
                  <label className="ch-prof-form-label">{label}</label>
                  {isEditing ? (
                    <input
                      type={type}
                      className="ch-prof-form-input"
                      value={profile[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={placeholder}
                    />
                  ) : (
                    <div className={`ch-prof-field-value ${!profile[key] ? "ch-prof-field-empty" : ""}`}>
                      {profile[key] || "Not set"}
                    </div>
                  )}
                </div>
              ))}

              <div className="ch-prof-form-group span-2">
                <label className="ch-prof-form-label">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="ch-prof-form-input"
                    value={profile.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="City, Province, Philippines"
                  />
                ) : (
                  <div className={`ch-prof-field-value ${!profile.location ? "ch-prof-field-empty" : ""}`}>
                    {profile.location || "Not set"}
                  </div>
                )}
              </div>

              <div className="ch-prof-form-group span-2">
                <label className="ch-prof-form-label">Bio</label>
                {isEditing ? (
                  <textarea
                    className="ch-prof-form-textarea"
                    value={profile.bio || ""}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Tell customers a little about yourself and your craft…"
                    rows={4}
                  />
                ) : (
                  <div
                    className={`ch-prof-field-value ${!profile.bio ? "ch-prof-field-empty" : ""}`}
                    style={{ minHeight: 80 }}
                  >
                    {profile.bio || "Not set"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="ch-prof-save-bar">
              <button
                className="ch-prof-btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                <span>{saving ? "Saving…" : "💾 Save Profile"}</span>
              </button>
              <button className="ch-prof-btn-ghost" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
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

export default Profile;