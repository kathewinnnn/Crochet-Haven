import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { saveToken, saveUserProfile, saveAvatar } from './userStorage';

/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */
const STEP_INFO   = 1;
const STEP_AVATAR = 2;
const STEP_TERMS  = 3;

const U = {
  IDLE:      'idle',
  CHECKING:  'checking',
  TAKEN:     'taken',
  AVAILABLE: 'available',
  ERROR:     'error',
};

/* ═══════════════════════════════════════════════════
   CIRCLE CROPPER
═══════════════════════════════════════════════════ */
const CircleCropper = ({ imageSrc, onDone, onCancel }) => {
  const canvasRef  = useRef(null);
  const previewRef = useRef(null);
  const isDragging = useRef(false);
  const lastPos    = useRef({ x: 0, y: 0 });
  const imgRef     = useRef(new Image());
  const SIZE = 260;

  const [offset,  setOffset]  = useState({ x: 0, y: 0 });
  const [scale,   setScale]   = useState(1);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const img = imgRef.current;
    img.onload = () => {
      const ratio = SIZE / Math.min(img.naturalWidth, img.naturalHeight);
      setScale(ratio);
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
      setOffset({ x: (SIZE - img.naturalWidth * ratio) / 2, y: (SIZE - img.naturalHeight * ratio) / 2 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !imgRef.current.complete || !imgSize.w) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgRef.current, offset.x, offset.y, imgSize.w * scale, imgSize.h * scale);
    ctx.restore();
  }, [offset, scale, imgSize]);

  const onMouseDown  = (e) => { isDragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; };
  const onMouseUp    = ()  => { isDragging.current = false; };
  const onMouseMove  = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x, dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(p => ({ x: p.x + dx, y: p.y + dy }));
  }, []);
  const onTouchStart = (e) => { isDragging.current = true; lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd   = ()  => { isDragging.current = false; };
  const onTouchMove  = (e) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - lastPos.current.x, dy = e.touches[0].clientY - lastPos.current.y;
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setOffset(p => ({ x: p.x + dx, y: p.y + dy }));
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    canvas.width = SIZE; canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.beginPath(); ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(imgRef.current, offset.x, offset.y, imgSize.w * scale, imgSize.h * scale);
    ctx.restore();
    onDone(canvas.toDataURL('image/png'));
  };

  return (
    <div style={cs.backdrop}>
      <div style={cs.modal}>
        <div style={cs.header}>
          <span style={cs.htitle}>✂️ Crop Your Photo</span>
          <span style={cs.hsub}>Drag to reposition · slider to zoom</span>
        </div>
        <div style={cs.stage}>
          <div style={cs.dimRing} />
          <canvas ref={previewRef} width={SIZE} height={SIZE} style={cs.canvas}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={cs.hint}>↕ ↔ Drag to adjust</div>
        </div>
        <div style={cs.zoomRow}>
          <span>🔍</span>
          <input type="range" min={0.3} max={3} step={0.01} value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: '#ec4899', cursor: 'pointer' }} />
          <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '36px', textAlign: 'right' }}>
            {Math.round(scale * 100)}%
          </span>
        </div>
        <div style={cs.actions}>
          <button style={cs.cancelBtn} onClick={onCancel}>Cancel</button>
          <button style={cs.doneBtn} onClick={handleCrop}>Use This Photo ✓</button>
        </div>
      </div>
    </div>
  );
};
const cs = {
  backdrop:  { position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(10,6,6,.87)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  modal:     { background: '#fff', borderRadius: '20px', boxShadow: '0 40px 100px rgba(249,168,212,.45)', width: '100%', maxWidth: '380px', overflow: 'hidden' },
  header:    { padding: '20px 24px 16px', background: 'linear-gradient(135deg,#fdf2f8,#fce7f3)', borderBottom: '1px solid #fbcfe8' },
  htitle:    { display: 'block', fontWeight: 700, color: '#1f2937', fontSize: '15px' },
  hsub:      { display: 'block', fontSize: '12px', color: '#9ca3af', marginTop: '2px' },
  stage:     { position: 'relative', width: '260px', height: '260px', margin: '24px auto 0', cursor: 'grab', userSelect: 'none' },
  dimRing:   { position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: '0 0 0 9999px rgba(0,0,0,.5)', zIndex: 1, pointerEvents: 'none' },
  canvas:    { display: 'block', borderRadius: '50%', border: '3px solid #f472b6', boxShadow: '0 0 0 4px rgba(244,114,182,.25)', zIndex: 2, position: 'relative' },
  hint:      { position: 'absolute', bottom: '-22px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap', zIndex: 3 },
  zoomRow:   { display: 'flex', alignItems: 'center', gap: '10px', padding: '28px 24px 8px' },
  actions:   { display: 'flex', gap: '12px', padding: '16px 24px 24px' },
  cancelBtn: { flex: 1, padding: '12px', border: '2px solid #fbcfe8', borderRadius: '10px', background: 'transparent', color: '#9ca3af', cursor: 'pointer', fontWeight: 600, fontSize: '14px' },
  doneBtn:   { flex: 2, padding: '12px', background: 'linear-gradient(135deg,#f9a8d4,#ec4899)', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 14px rgba(236,72,153,.4)' },
};

/* ═══════════════════════════════════════════════════
   SUCCESS OVERLAY
═══════════════════════════════════════════════════ */
const SuccessOverlay = ({ username }) => (
  <div style={ov.backdrop}>
    <style>{`
      @keyframes ovFadeIn{from{opacity:0}to{opacity:1}}
      @keyframes ovPopIn{0%{opacity:0;transform:scale(.6) translateY(20px)}65%{transform:scale(1.08) translateY(-4px)}100%{opacity:1;transform:scale(1) translateY(0)}}
      @keyframes ovShimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
      @keyframes ovSpin{to{transform:rotate(360deg)}}
      @keyframes ovDot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
      @keyframes ovSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes ovFill{from{width:0%}to{width:100%}}
      @keyframes ovFetti{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(80px) rotate(360deg);opacity:0}}
    `}</style>
    {[['15%','#f9a8d4','0s','8px'],['30%','#ec4899','.1s','6px'],['50%','#fbcfe8','.15s','10px'],
      ['65%','#f472b6','.05s','7px'],['80%','#f9a8d4','.2s','9px'],['22%','#fce7f3','.25s','5px'],['70%','#ec4899','.3s','6px'],
    ].map(([l, c, d, sz], i) => (
      <div key={i} style={{ position: 'fixed', top: '18%', left: l, width: sz, height: sz, borderRadius: '50%', background: c, animation: `ovFetti 1.4s ${d} ease-out forwards`, pointerEvents: 'none' }} />
    ))}
    <div style={ov.card}>
      <div style={ov.ringWrap}>
        <div style={ov.ro} /><div style={ov.ri} />
        <div style={ov.check}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <polyline points="8,18 15,25 28,11" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <h2 style={ov.h2}>Account Created! 🎉</h2>
      <p style={ov.sub}>Welcome aboard, <strong style={{ color: '#ec4899' }}>{username}</strong>!</p>
      <p style={ov.red}>Taking you to login…</p>
      <div style={ov.track}><div style={ov.bar} /></div>
      <div style={ov.dots}>{[0, 1, 2].map(i => <span key={i} style={{ ...ov.dot, animation: `ovDot 1.2s ${i * .2}s infinite ease-in-out` }} />)}</div>
    </div>
  </div>
);
const ov = {
  backdrop: { position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,rgba(253,242,248,.96),rgba(251,207,232,.96))', backdropFilter: 'blur(6px)', animation: 'ovFadeIn .35s ease' },
  card:     { background: '#fff', borderRadius: '24px', boxShadow: '0 32px 80px rgba(249,168,212,.45)', padding: '52px 44px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '340px', animation: 'ovPopIn .45s cubic-bezier(.34,1.56,.64,1) both' },
  ringWrap: { position: 'relative', width: '96px', height: '96px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  ro:       { position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#f472b6', borderRightColor: '#f9a8d4', animation: 'ovSpin 1s linear infinite' },
  ri:       { position: 'absolute', inset: '10px', borderRadius: '50%', border: '2px solid transparent', borderBottomColor: '#fbcfe8', borderLeftColor: '#ec4899', animation: 'ovSpin .7s linear infinite reverse' },
  check:    { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#f9a8d4,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(236,72,153,.35)' },
  h2:       { margin: '0 0 8px', fontSize: '24px', fontWeight: 700, color: '#1f2937', animation: 'ovSlide .4s .15s both', fontFamily: "'Segoe UI',sans-serif" },
  sub:      { margin: '0 0 6px', fontSize: '15px', color: '#6b7280', animation: 'ovSlide .4s .25s both', fontFamily: "'Segoe UI',sans-serif" },
  red:      { margin: '0 0 24px', fontSize: '13px', color: '#9ca3af', animation: 'ovSlide .4s .35s both', fontFamily: "'Segoe UI',sans-serif" },
  track:    { width: '220px', height: '5px', background: '#fce7f3', borderRadius: '99px', overflow: 'hidden', marginBottom: '20px', animation: 'ovSlide .4s .4s both' },
  bar:      { height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg,#f9a8d4,#ec4899,#f472b6)', backgroundSize: '400px 100%', animation: 'ovFill 1.8s cubic-bezier(.4,0,.2,1) forwards, ovShimmer 1.5s linear infinite' },
  dots:     { display: 'flex', gap: '8px', animation: 'ovSlide .4s .5s both' },
  dot:      { width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg,#f9a8d4,#ec4899)', display: 'inline-block' },
};

/* ═══════════════════════════════════════════════════
   DISAGREE MODAL
═══════════════════════════════════════════════════ */
const DisagreeModal = ({ onGoBack, onLeave }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 10001, background: 'rgba(10,6,6,.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div style={{ background: '#fff', borderRadius: '20px', padding: '40px 36px 36px', maxWidth: '380px', width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,.25)', textAlign: 'center' }}>
      <div style={{ fontSize: '52px', marginBottom: '16px' }}>🤔</div>
      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937', marginBottom: '10px' }}>No worries!</h3>
      <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7, marginBottom: '28px' }}>
        You need to agree to our Terms &amp; Conditions to create an account. You can go back and review them, or leave and come back anytime.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onGoBack} style={{ flex: 1, padding: '13px', border: '2px solid #fbcfe8', borderRadius: '12px', background: 'transparent', color: '#6b7280', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>← Go Back</button>
        <button onClick={onLeave}  style={{ flex: 1, padding: '13px', background: 'linear-gradient(135deg,#f9a8d4,#ec4899)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(236,72,153,.4)' }}>Leave for Now</button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   STEP BAR
═══════════════════════════════════════════════════ */
const StepBar = ({ current }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
    {[{ n: 1, label: 'Info' }, { n: 2, label: 'Photo' }, { n: 3, label: 'Terms' }].map((s, i, arr) => (
      <React.Fragment key={s.n}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: current >= s.n ? 'linear-gradient(135deg,#f9a8d4,#ec4899)' : '#fce7f3', color: current >= s.n ? '#fff' : '#f9a8d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', boxShadow: current >= s.n ? '0 4px 12px rgba(236,72,153,.4)' : 'none', transition: 'all .3s', border: current === s.n ? '2.5px solid #ec4899' : '2px solid transparent' }}>
            {current > s.n ? '✓' : s.n}
          </div>
          <span style={{ fontSize: '10px', fontWeight: 600, color: current >= s.n ? '#ec4899' : '#d1d5db', letterSpacing: '.08em', textTransform: 'uppercase' }}>{s.label}</span>
        </div>
        {i < arr.length - 1 && <div style={{ height: '2px', width: '48px', marginBottom: '18px', background: current > s.n ? 'linear-gradient(90deg,#f9a8d4,#ec4899)' : '#fce7f3', transition: 'background .3s' }} />}
      </React.Fragment>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════
   TERMS TEXT
═══════════════════════════════════════════════════ */
const TERMS = `Welcome to our platform. By creating an account, you agree to the following terms and conditions. Please read them carefully.

1. ACCOUNT ELIGIBILITY
You must be at least 13 years of age to register. By creating an account you confirm that all information you provide is accurate and truthful.

2. USE OF YOUR INFORMATION
We collect the personal information you provide (name, email, phone, address, profile photo) solely to operate and improve this service. We do not sell your data to third parties.

3. PASSWORD & SECURITY
You are responsible for maintaining the confidentiality of your password. Notify us immediately if you suspect unauthorized access to your account.

4. PROHIBITED CONDUCT
You agree not to impersonate others, upload harmful content, or use the platform for any unlawful activity.

5. INTELLECTUAL PROPERTY
All content on this platform, including designs and text, is owned by us and may not be reproduced without permission.

6. TERMINATION
We reserve the right to suspend or terminate accounts that violate these terms.

7. LIMITATION OF LIABILITY
To the extent permitted by law, we are not liable for indirect damages arising from your use of the service.

8. CHANGES TO TERMS
We may update these terms from time to time. Continued use of the platform constitutes acceptance of the revised terms.

9. GOVERNING LAW
These terms are governed by the laws of the Republic of the Philippines.

By clicking "I Agree & Create Account" you confirm you have read and accept these Terms & Conditions.`;

/* ═══════════════════════════════════════════════════
   HELPERS — detect server username-taken error
═══════════════════════════════════════════════════ */
const isUsernameTakenError = (msg = '') => {
  const lower = msg.toLowerCase();
  return (
    lower.includes('username') &&
    (lower.includes('taken') || lower.includes('already') || lower.includes('exist') || lower.includes('unavailable'))
  );
};

/* ═══════════════════════════════════════════════════
   MAIN REGISTER COMPONENT
═══════════════════════════════════════════════════ */
const Register = () => {
  const navigate = useNavigate();
  const fileRef  = useRef(null);
  const termsRef = useRef(null);
  const uTimer   = useRef(null);

  const [step, setStep] = useState(STEP_INFO);
  const [form, setForm] = useState({
    username: '', fullName: '', email: '', phone: '', address: '', password: '', confirmPassword: '',
  });

  const [uStatus,      setUStatus]      = useState(U.IDLE);
  const [fieldErrors,  setFieldErrors]  = useState({});
  const [touched,      setTouched]      = useState({});   // ← NEW

  const [globalError,  setGlobalError]  = useState('');
  const [isLoading,    setIsLoading]    = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [showPw,       setShowPw]       = useState(false);
  const [showCfPw,     setShowCfPw]     = useState(false);
  const [rawImage,     setRawImage]     = useState(null);
  const [avatar,       setAvatar]       = useState(null);
  const [showCrop,     setShowCrop]     = useState(false);
  const [termsRead,    setTermsRead]    = useState(false);
  const [showDisagree, setShowDisagree] = useState(false);
  const [focused,      setFocused]      = useState('');

  const usernameRef = useRef(form.username);
  usernameRef.current = form.username;

  const fireUsernameCheck = useCallback(async (u) => {
    setUStatus(U.CHECKING);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/auth/check-username?username=${encodeURIComponent(u)}`
      );
      if (usernameRef.current.trim() === u) {
        setUStatus(res.data?.available === true ? U.AVAILABLE : U.TAKEN);
      }
    } catch {
      if (usernameRef.current.trim() === u) setUStatus(U.IDLE);
    }
  }, []);

  useEffect(() => {
    clearTimeout(uTimer.current);
    const u = form.username.trim();
    if (u.length < 5) { setUStatus(U.IDLE); return; }
    setUStatus(U.CHECKING);
    uTimer.current = setTimeout(() => fireUsernameCheck(u), 600);
    return () => clearTimeout(uTimer.current);
  }, [form.username, fireUsernameCheck]);

  const runUsernameCheck = useCallback(() => {
    const u = usernameRef.current.trim();
    if (u.length < 5) return;
    clearTimeout(uTimer.current);
    fireUsernameCheck(u);
  }, [fireUsernameCheck]);

  const uIndicator = { [U.IDLE]: '', [U.CHECKING]: '⏳', [U.AVAILABLE]: '✅', [U.TAKEN]: '❌', [U.ERROR]: '' }[uStatus];

  const renderUsernameMsg = () => {
    const len = form.username.trim().length;
    if (len === 0) return null;
    if (len < 5)   return <div className="ferr">⚠ Must be at least 5 characters ({len}/5)</div>;
    switch (uStatus) {
      case U.CHECKING:  return <div className="fnfo">⏳ Checking availability…</div>;
      case U.AVAILABLE: return <div className="fok">✓ Username is available!</div>;
      case U.TAKEN:     return <div className="ferr">❌ This username is already taken. Please choose another.</div>;
      default:          return null;
    }
  };

  /* ─── STEP 1 VALIDATION ─── */
  const validateInfoWithStatus = (resolvedStatus) => {
    const errs = {};
    const u = form.username.trim();
    if (!u)                errs.username = 'Username is required.';
    else if (u.length < 5) errs.username = 'Username must be at least 5 characters.';
    else if (resolvedStatus === U.CHECKING) errs.username = 'Please wait — still checking username availability.';
    else if (resolvedStatus === U.TAKEN)    errs.username = 'This username is already taken. Please choose another.';

    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim())             errs.email = 'Email is required.';
    else if (!emailRx.test(form.email)) errs.email = 'Enter a valid email address.';

    const phoneDigits = form.phone.replace(/\D/g, '');
    if (!form.phone.trim())                 errs.phone = 'Phone number is required.';
    else if (phoneDigits.length > 11)       errs.phone = 'Phone number must not exceed 11 digits.';
    else if (phoneDigits.length !== 11)     errs.phone = 'Phone number must be 11 digits (e.g., 09XXXXXXXXX).';
    else if (!phoneDigits.startsWith('09')) errs.phone = 'Phone number must start with 09.';

    if (!form.address.trim()) errs.address = 'Address is required.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const goToAvatar = async () => {
    // Mark all fields as touched so required errors show
    setTouched({ username: true, fullName: true, email: true, phone: true, address: true, password: true, confirmPassword: true });

    const u = form.username.trim();
    if (u.length >= 5 && (uStatus === U.IDLE || uStatus === U.CHECKING || uStatus === U.ERROR)) {
      clearTimeout(uTimer.current);
      setUStatus(U.CHECKING);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/auth/check-username?username=${encodeURIComponent(u)}`
        );
        const resolved = res.data?.available === true ? U.AVAILABLE : U.TAKEN;
        setUStatus(resolved);
        const errs = validateInfoWithStatus(resolved);
        setFieldErrors(errs);
        if (Object.keys(errs).length === 0) setStep(STEP_AVATAR);
      } catch {
        setUStatus(U.IDLE);
        const errs = validateInfoWithStatus(U.IDLE);
        setFieldErrors(errs);
        if (Object.keys(errs).length === 0) setStep(STEP_AVATAR);
      }
      return;
    }
    const errs = validateInfoWithStatus(uStatus);
    setFieldErrors(errs);
    if (Object.keys(errs).length === 0) setStep(STEP_AVATAR);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setGlobalError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username: form.username,
        email:    form.email,
        password: form.password,
        fullName: form.fullName,
        phone:    form.phone,
        address:  form.address,
        avatar:   avatar || null,
      });

      const token = res.data?.token || res.data?.accessToken || null;
      if (token) saveToken(token);

      const userData = {
        id:        res.data?.user?.id || res.data?.id || Date.now().toString(),
        username:  form.username,
        email:     form.email,
        fullName:  form.fullName,
        phone:     form.phone,
        address:   form.address,
        role:      res.data?.user?.role || res.data?.role || 'Customer',
        createdAt: res.data?.user?.createdAt || res.data?.createdAt || new Date().toISOString(),
      };

      localStorage.setItem('ch_user', JSON.stringify(userData));
      localStorage.setItem('userId', userData.id);

      saveUserProfile({
        username:  form.username,
        email:     form.email,
        fullName:  form.fullName,
        phone:     form.phone,
        address:   form.address,
        role:      userData.role,
        createdAt: userData.createdAt,
      });
      saveAvatar(avatar || null);
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 2300);

    } catch (err) {
      setIsLoading(false);
      const serverMsg = err.response?.data?.message || '';

      if (err.response && isUsernameTakenError(serverMsg)) {
        setUStatus(U.TAKEN);
        setFieldErrors({ username: 'This username is already taken. Please choose another.' });
        setStep(STEP_INFO);
        return;
      }
      if (err.response && serverMsg.toLowerCase().includes('email')) {
        setFieldErrors({ email: serverMsg || 'This email is already registered.' });
        setStep(STEP_INFO);
        return;
      }
      if (err.response)     setGlobalError(serverMsg || 'Registration failed. Please try again.');
      else if (err.request) setGlobalError('Cannot connect to server. Please make sure the backend is running.');
      else                  setGlobalError('An unexpected error occurred. Please try again.');
    }
  };

  /* ─── MISC HELPERS ─── */
  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setRawImage(reader.result); setShowCrop(true); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleTermsScroll = (e) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 32) setTermsRead(true);
  };

  const inp = (name, hasErr) => ({
    width: '100%', padding: '13px 16px', fontSize: '14px', boxSizing: 'border-box',
    border: hasErr ? '2px solid #f87171' : focused === name ? '2px solid #f9a8d4' : '2px solid #fbcfe8',
    borderRadius: '10px', outline: 'none', transition: 'all .25s',
    backgroundColor: hasErr ? '#fff5f5' : focused === name ? '#fff' : '#fdf2f8',
    boxShadow: focused === name && !hasErr ? '0 0 0 4px rgba(249,168,212,.18)' : 'none',
    fontFamily: "'Segoe UI',sans-serif", color: '#1f2937',
  });

  // ← UPDATED: marks field as touched on blur + fires username check
  const fc = (name) => ({
    onFocus: () => setFocused(name),
    onBlur:  () => {
      setFocused('');
      setTouched(p => ({ ...p, [name]: true }));
      if (name === 'username') runUsernameCheck();
    },
  });

  const ch = (field) => (e) => {
    let newVal = e.target.value;
    if (field === 'phone') newVal = newVal.replace(/[^\d]/g, '');
    setForm(p => ({ ...p, [field]: newVal }));
    if (fieldErrors[field]) setFieldErrors(p => ({ ...p, [field]: '' }));
    if (field === 'username' && newVal.trim() !== usernameRef.current.trim()) {
      setUStatus(newVal.trim().length < 8 ? U.IDLE : U.CHECKING);
    }
  };

  // Derived helpers for phone validation used in both border and message
  const phoneDigitCount = form.phone.replace(/\D/g, '').length;
  const phoneHasLetters = /[^\d]/.test(form.phone);
  const phoneIsOverflow = phoneDigitCount > 11;
  const phoneHasErr     = !!fieldErrors.phone || phoneIsOverflow || phoneHasLetters;

  /* ═══════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════ */
  return (
    <>
      {showSuccess  && <SuccessOverlay username={form.username} />}
      {showDisagree && <DisagreeModal onGoBack={() => setShowDisagree(false)} onLeave={() => navigate('/')} />}
      {showCrop && rawImage && (
        <CircleCropper
          imageSrc={rawImage}
          onDone={url => { setAvatar(url); setShowCrop(false); }}
          onCancel={() => setShowCrop(false)}
        />
      )}

      <div style={st.page}>
        <style>{`
          @keyframes fadeIn { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
          @keyframes popIn  { 0%{opacity:0;transform:scale(.6) translateY(20px)} 65%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
          @keyframes spin   { to{transform:rotate(360deg)} }
          @keyframes shake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
          input::placeholder { color:#bbb; }
          input:-webkit-autofill { -webkit-box-shadow:0 0 0 1000px #fdf2f8 inset !important; }
          .ferr { font-size:12px; color:#ef4444; margin-top:5px; display:flex; align-items:center; gap:5px; }
          .fok  { font-size:12px; color:#10b981; margin-top:5px; display:flex; align-items:center; gap:5px; }
          .fnfo { font-size:12px; color:#9ca3af; margin-top:5px; }
          .shake { animation: shake .4s ease; }
          ::-webkit-scrollbar       { width:5px; }
          ::-webkit-scrollbar-track { background:#fce7f3; border-radius:99px; }
          ::-webkit-scrollbar-thumb { background:#f9a8d4; border-radius:99px; }
        `}</style>

        <div style={st.card}>

          {/* ── Logo ── */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '44px', marginBottom: '8px', filter: 'drop-shadow(0 4px 8px rgba(249,168,212,.4))' }}>📝</div>
            <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 700, color: '#1f2937', fontFamily: "'Segoe UI',sans-serif" }}>Create Account</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>Sign up to get started</p>
          </div>

          <StepBar current={step} />

          {/* ════ STEP 1 — Info ════ */}
          {step === STEP_INFO && (
            <div>

              {/* ── Server-redirected username error banner ── */}
              {uStatus === U.TAKEN && (
                <div style={{ background: '#fff1f2', border: '1.5px solid #fca5a5', borderRadius: '10px', padding: '11px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>⚠️</span>
                  <p style={{ margin: 0, fontSize: '13px', color: '#b91c1c', fontWeight: 500 }}>
                    This username is already taken — please choose a different one.
                  </p>
                </div>
              )}

              {/* Username */}
              <div style={st.fg}>
                <label style={st.label}>👤 Username</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={form.username}
                    onChange={ch('username')}
                    placeholder="Choose a unique username (min. 5 characters)"
                    style={{
                      ...inp('username', uStatus === U.TAKEN || (!!fieldErrors.username && form.username.trim().length < 5) || (touched.username && !form.username.trim())),
                      paddingRight: '40px',
                    }}
                    {...fc('username')}
                  />
                  {uIndicator && (
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', lineHeight: 1, pointerEvents: 'none' }}>
                      {uIndicator}
                    </span>
                  )}
                </div>
                {touched.username && !form.username.trim()
                  ? <div className="ferr">⚠ Username is required.</div>
                  : renderUsernameMsg() ?? (fieldErrors.username && uStatus !== U.TAKEN
                      ? <div className="ferr">⚠ {fieldErrors.username}</div>
                      : null
                    )
                }
              </div>

              {/* Full Name */}
              <div style={st.fg}>
                <label style={st.label}>🪪 Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={ch('fullName')}
                  placeholder="Your full name"
                  style={inp('fullName', !!fieldErrors.fullName || (touched.fullName && !form.fullName.trim()))}
                  {...fc('fullName')}
                />
                {fieldErrors.fullName
                  ? <div className="ferr">⚠ {fieldErrors.fullName}</div>
                  : touched.fullName && !form.fullName.trim()
                    ? <div className="ferr">⚠ Full name is required.</div>
                    : null}
              </div>

              {/* Email */}
              <div style={st.fg}>
                <label style={st.label}>✉️ Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={ch('email')}
                  placeholder="Enter your email"
                  style={inp('email', !!fieldErrors.email || (touched.email && !form.email.trim()))}
                  {...fc('email')}
                />
                {fieldErrors.email
                  ? <div className="ferr">⚠ {fieldErrors.email}</div>
                  : touched.email && !form.email.trim()
                    ? <div className="ferr">⚠ Email is required.</div>
                    : null}
              </div>

              {/* Phone */}
              <div style={st.fg}>
                <label style={st.label}>📱 Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={ch('phone')}
                  placeholder="09XXXXXXXXX"
                  style={inp('phone', phoneHasErr || (touched.phone && !form.phone.trim()))}
                  {...fc('phone')}
                />
                {phoneHasLetters
                  ? <div className="ferr">⚠ Phone number must contain digits only — no letters or symbols.</div>
                  : phoneIsOverflow
                    ? <div className="ferr">⚠ Phone number must not exceed 11 digits.</div>
                    : fieldErrors.phone
                      ? <div className="ferr">⚠ {fieldErrors.phone}</div>
                      : touched.phone && !form.phone.trim()
                        ? <div className="ferr">⚠ Phone number is required.</div>
                        : null}
              </div>

              {/* Address */}
              <div style={st.fg}>
                <label style={st.label}>📍 Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={ch('address')}
                  placeholder="Your address"
                  style={inp('address', !!fieldErrors.address || (touched.address && !form.address.trim()))}
                  {...fc('address')}
                />
                {fieldErrors.address
                  ? <div className="ferr">⚠ {fieldErrors.address}</div>
                  : touched.address && !form.address.trim()
                    ? <div className="ferr">⚠ Address is required.</div>
                    : null}
              </div>

              {/* Password */}
              <div style={st.fg}>
                <label style={st.label}>🔒 Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={ch('password')}
                    placeholder="Create a password"
                    style={{ ...inp('password', !!fieldErrors.password || (touched.password && !form.password)), paddingRight: '44px' }}
                    {...fc('password')}
                  />
                  <button type="button" style={st.eye} onClick={() => setShowPw(p => !p)}>{showPw ? '🙈' : '👁️'}</button>
                </div>
                {fieldErrors.password
                  ? <div className="ferr">⚠ {fieldErrors.password}</div>
                  : touched.password && !form.password
                    ? <div className="ferr">⚠ Password is required.</div>
                    : <div className="fnfo" style={{ color: form.password.length >= 6 ? '#10b981' : '#9ca3af' }}>
                        {form.password.length === 0 ? 'Minimum 6 characters' : form.password.length < 6 ? 'Too short' : '✓ Strength: Good'}
                      </div>}
              </div>

              {/* Confirm Password */}
              <div style={{ ...st.fg, marginBottom: 0 }}>
                <label style={st.label}>🔐 Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCfPw ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={ch('confirmPassword')}
                    placeholder="Confirm your password"
                    style={{ ...inp('confirmPassword', !!fieldErrors.confirmPassword || (touched.confirmPassword && !form.confirmPassword)), paddingRight: '44px' }}
                    {...fc('confirmPassword')}
                  />
                  <button type="button" style={st.eye} onClick={() => setShowCfPw(p => !p)}>{showCfPw ? '🙈' : '👁️'}</button>
                </div>
                {fieldErrors.confirmPassword
                  ? <div className="ferr">⚠ {fieldErrors.confirmPassword}</div>
                  : touched.confirmPassword && !form.confirmPassword
                    ? <div className="ferr">⚠ Please confirm your password.</div>
                    : form.confirmPassword && form.password === form.confirmPassword
                      ? <div className="fok">✓ Passwords match</div>
                      : null}
              </div>

              <button style={{ ...st.primary, marginTop: '24px' }} onClick={goToAvatar}>
                Continue to Photo →
              </button>
              <div style={st.loginHint}>
                Already have an account? <Link to="/" style={st.loginLink}>Login</Link>
              </div>
            </div>
          )}

          {/* ════ STEP 2 — Avatar ════ */}
          {step === STEP_AVATAR && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', lineHeight: 1.65 }}>
                Add a profile picture so others can recognise you.<br />
                <span style={{ color: '#f9a8d4' }}>You can skip this step if you prefer.</span>
              </p>
              <div
                style={{ width: '130px', height: '130px', borderRadius: '50%', background: avatar ? 'transparent' : 'linear-gradient(135deg,#fce7f3,#fbcfe8)', margin: '0 auto 20px', border: '3px solid #f9a8d4', boxShadow: '0 8px 28px rgba(249,168,212,.4)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
                onClick={() => fileRef.current?.click()}
              >
                {avatar
                  ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '42px' }}>📷</span>}
                {avatar && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,36,32,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s', fontSize: '22px', borderRadius: '50%' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}>✏️</div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFilePick} style={{ display: 'none' }} />
              <button style={{ ...st.primary, display: 'inline-flex', width: 'auto', padding: '12px 28px', marginBottom: '12px' }} onClick={() => fileRef.current?.click()}>
                {avatar ? '🔄 Change Photo' : '📸 Choose Photo'}
              </button>
              {avatar && (
                <div style={{ marginBottom: '4px' }}>
                  <button style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setAvatar(null)}>
                    Remove photo
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button style={st.secondary} onClick={() => setStep(STEP_INFO)}>← Back</button>
                <button style={st.primary} onClick={() => setStep(STEP_TERMS)}>{avatar ? 'Next →' : 'Skip for Now →'}</button>
              </div>
            </div>
          )}

          {/* ════ STEP 3 — Terms ════ */}
          {step === STEP_TERMS && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', marginBottom: '8px', textAlign: 'center', fontFamily: "'Segoe UI',sans-serif" }}>
                📜 Terms &amp; Conditions
              </h3>
              <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginBottom: '14px' }}>
                Scroll to the bottom to enable the agree button.
              </p>
              <div ref={termsRef} onScroll={handleTermsScroll}
                style={{ height: '200px', overflowY: 'auto', background: '#fdf2f8', border: '1.5px solid #fbcfe8', borderRadius: '12px', padding: '16px 18px', fontSize: '12.5px', color: '#374151', lineHeight: 1.75, whiteSpace: 'pre-wrap', marginBottom: '16px', fontFamily: "'Segoe UI',sans-serif" }}>
                {TERMS}
              </div>
              {!termsRead && (
                <div style={{ textAlign: 'center', fontSize: '11px', color: '#f9a8d4', marginBottom: '12px' }}>
                  ↓ Scroll down to read all terms
                </div>
              )}

              {globalError && (
                <div style={{ ...st.errBox, marginBottom: '14px' }}>
                  <span style={{ color: '#ec4899' }}>⚠️</span>
                  <p style={{ color: '#be185d', fontSize: '13px', margin: 0 }}>{globalError}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={st.secondary} onClick={() => setStep(STEP_AVATAR)}>← Back</button>
                <button
                  style={{ ...st.primary, opacity: termsRead ? 1 : .45, cursor: termsRead ? 'pointer' : 'not-allowed' }}
                  disabled={!termsRead || isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading
                    ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .8s linear infinite' }} />
                        Creating Account…
                      </span>
                    : '✓ I Agree & Create Account'}
                </button>
              </div>
              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <button style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowDisagree(true)}>
                  I Do Not Agree
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

const st = {
  page:      { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#fdf2f8 0%,#fce7f3 50%,#fbcfe8 100%)', padding: '24px', fontFamily: "'Segoe UI',Tahoma,Geneva,Verdana,sans-serif" },
  card:      { background: '#fff', borderRadius: '20px', boxShadow: '0 20px 60px rgba(249,168,212,.4)', padding: '40px 36px', width: '100%', maxWidth: '440px', animation: 'fadeIn .5s ease-out' },
  fg:        { marginBottom: '16px' },
  label:     { display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '7px' },
  eye:       { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '16px', padding: '4px' },
  errBox:    { background: '#fdf2f8', border: '1px solid #f9a8d4', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' },
  primary:   { width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg,#f9a8d4 0%,#f472b6 50%,#ec4899 100%)', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all .25s', boxShadow: '0 4px 14px rgba(249,168,212,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  secondary: { flex: 1, padding: '14px', fontSize: '14px', fontWeight: 600, color: '#9ca3af', background: 'transparent', border: '2px solid #fbcfe8', borderRadius: '12px', cursor: 'pointer', transition: 'all .2s' },
  loginHint: { textAlign: 'center', marginTop: '20px', color: '#9ca3af', fontSize: '13px' },
  loginLink: { color: '#ec4899', textDecoration: 'none', fontWeight: 700 },
};

export default Register;