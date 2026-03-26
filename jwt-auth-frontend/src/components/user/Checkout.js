import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../apiConfig';

const checkoutStyles = `
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
    --error: #d93025;
    --error-bg: rgba(217, 48, 37, 0.06);
    --error-border: rgba(217, 48, 37, 0.3);
  }

  /* ── Page wrapper ── */
  .ch-co-page {
    font-family: 'Lato', sans-serif;
    background-color: var(--cream);
    color: var(--charcoal);
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    margin-left: 240px;
  }

  .ch-co-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  /* ── Header ── */
  .ch-co-header {
    position: relative;
    background: var(--warm-white);
    border-bottom: 1px solid var(--border);
    z-index: 1;
  }

  .ch-co-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 44px 60px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ch-co-logo-block {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .ch-co-logo-yarn {
    font-size: 2.4rem;
    animation: coSway 4s ease-in-out infinite;
    display: inline-block;
    transform-origin: bottom center;
  }

  @keyframes coSway {
    0%, 100% { transform: rotate(-4deg); }
    50%       { transform: rotate(4deg); }
  }

  .ch-co-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.7rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--charcoal);
    line-height: 1;
  }

  .ch-co-logo-text span { color: var(--rose); }

  .ch-co-tagline {
    font-size: 0.72rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 5px;
    font-weight: 400;
  }

  .ch-co-header-eyebrow {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .ch-co-header-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.68rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--terracotta);
    font-weight: 700;
  }

  .ch-co-header-tag::before {
    content: '';
    display: block;
    width: 24px;
    height: 1.5px;
    background: var(--terracotta);
  }

  .ch-co-header-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .ch-co-header-title em { font-style: italic; color: var(--rose); }

  /* ── Main layout ── */
  .ch-co-main {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 60px 80px;
  }

  /* ── Empty state ── */
  .ch-co-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 40px;
    text-align: center;
  }

  .ch-co-empty-emoji {
    font-size: 4rem;
    margin-bottom: 20px;
    opacity: 0.5;
    animation: coSway 4s ease-in-out infinite;
    display: inline-block;
    transform-origin: bottom center;
  }

  .ch-co-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 10px;
    letter-spacing: -0.02em;
  }

  .ch-co-empty-sub {
    font-size: 0.9rem;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: 32px;
  }

  /* ── Success state ── */
  .ch-co-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 40px;
    text-align: center;
  }

  .ch-co-success-icon {
    font-size: 5rem;
    margin-bottom: 24px;
    animation: coSway 3s ease-in-out infinite;
    display: inline-block;
    transform-origin: bottom center;
  }

  .ch-co-success-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.03em;
    margin-bottom: 12px;
    line-height: 1.1;
  }

  .ch-co-success-title em { font-style: italic; color: var(--rose); }

  .ch-co-success-sub {
    font-size: 0.96rem;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.7;
    max-width: 420px;
    margin-bottom: 36px;
  }

  /* ── Two-column checkout layout ── */
  .ch-co-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 40px;
    align-items: start;
  }

  /* ── Card container ── */
  .ch-co-card {
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .ch-co-card-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 22px 28px;
    border-bottom: 1px solid var(--border);
    background: rgba(253, 246, 236, 0.6);
  }

  .ch-co-card-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    flex-shrink: 0;
  }

  .ch-co-card-icon.rose  { background: linear-gradient(135deg, var(--rose), var(--blush)); }
  .ch-co-card-icon.amber { background: linear-gradient(135deg, var(--amber), #f5d4a0); }

  .ch-co-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--charcoal);
  }

  .ch-co-card-body { padding: 28px; }

  /* ── Form elements ── */
  .ch-co-form-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 18px;
  }

  .ch-co-form-group:last-of-type { margin-bottom: 0; }

  .ch-co-label {
    font-size: 0.67rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
  }

  .ch-co-input,
  .ch-co-select,
  .ch-co-textarea {
    width: 94%;
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
    -webkit-appearance: none;
  }

  .ch-co-input:focus,
  .ch-co-select:focus,
  .ch-co-textarea:focus {
    border-color: var(--rose);
    box-shadow: 0 0 0 3px rgba(232, 114, 138, 0.1);
  }

  /* ── Input error state ── */
  .ch-co-input.has-error {
    border-color: var(--error-border) !important;
    background: var(--error-bg);
    box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.07);
  }

  .ch-co-input.has-error:focus {
    border-color: var(--error) !important;
    box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.12);
  }

  /* ── Error message ── */
  .ch-co-field-error {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.73rem;
    font-weight: 600;
    color: var(--error);
    letter-spacing: 0.01em;
    margin-top: 2px;
    animation: coErrorSlide 0.2s ease forwards;
  }

  @keyframes coErrorSlide {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ch-co-field-error::before {
    content: '⚠';
    font-size: 0.7rem;
    flex-shrink: 0;
  }

  .ch-co-input::placeholder,
  .ch-co-textarea::placeholder { color: var(--muted); opacity: 0.55; }

  .ch-co-select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a7a74' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }

  .ch-co-textarea { resize: vertical; min-height: 80px; }

  .ch-co-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  /* Payment method badge */
  .ch-co-pay-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: rgba(232, 114, 138, 0.08);
    border: 1px solid rgba(232, 114, 138, 0.2);
    border-radius: 2px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--rose);
    margin-bottom: 16px;
  }

  /* ── Submit button ── */
  .ch-co-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 15px 28px;
    margin-top: 24px;
    background: var(--charcoal);
    color: var(--cream);
    border: none;
    border-radius: 3px;
    font-family: 'Lato', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .ch-co-submit::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--rose);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 0;
  }

  .ch-co-submit:hover::after { transform: translateX(0); }
  .ch-co-submit:hover { color: #fff; }
  .ch-co-submit span { position: relative; z-index: 1; }

  .ch-co-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ch-co-submit:disabled::after { display: none; }

  /* ── CTA button (shared) ── */
  .ch-co-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    background: var(--charcoal);
    color: var(--cream);
    text-decoration: none;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: 2px;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .ch-co-cta::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--rose);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 0;
  }

  .ch-co-cta:hover::after { transform: translateX(0); }
  .ch-co-cta:hover { color: #fff; }
  .ch-co-cta span { position: relative; z-index: 1; }

  /* ── Order summary ── */
  .ch-co-items { display: flex; flex-direction: column; gap: 1px; background: var(--border); }

  .ch-co-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    background: var(--warm-white);
  }

  .ch-co-item:first-child { padding-top: 0; }
  .ch-co-item:last-child  { padding-bottom: 0; }

  .ch-co-item-img {
    width: 56px;
    height: 56px;
    border-radius: 3px;
    overflow: hidden;
    border: 1px solid var(--border);
    flex-shrink: 0;
  }

  .ch-co-item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .ch-co-item-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f7e8d8, #f0cfc4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
  }

  .ch-co-item-info { flex: 1; min-width: 0; }

  .ch-co-item-name {
    font-family: 'Playfair Display', serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--charcoal);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 3px;
  }

  .ch-co-item-qty {
    font-size: 0.72rem;
    color: var(--muted);
    font-weight: 300;
  }

  .ch-co-item-price {
    font-family: 'Playfair Display', serif;
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--charcoal);
    white-space: nowrap;
  }

  /* ── Total row ── */
  .ch-co-total-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 0 0;
    margin-top: 18px;
    border-top: 1px solid var(--border);
  }

  .ch-co-total-label {
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
  }

  .ch-co-total-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--charcoal);
    letter-spacing: -0.02em;
  }

  /* ── Back link ── */
  .ch-co-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-top: 20px;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.18s ease;
    border-bottom: 1px solid var(--border);
    padding-bottom: 2px;
  }

  .ch-co-back:hover { color: var(--rose); border-color: var(--rose); }

  /* ── Divider inside card ── */
  .ch-co-card-divider {
    height: 1px;
    background: var(--border);
    margin: 20px 0;
  }

  /* ── Footer ── */
  .ch-co-footer {
    position: relative;
    z-index: 1;
    background: var(--warm-white);
    border-top: 1px solid var(--border);
    padding: 28px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ch-co-footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--charcoal);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ch-co-footer-copy {
    font-size: 0.75rem;
    color: var(--muted);
    letter-spacing: 0.04em;
  }

  /* ── Loader spinner ── */
  .ch-co-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: coSpin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes coSpin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .ch-co-page { margin-left: 0; }
    .ch-co-main { padding: 40px 24px 60px; }
    .ch-co-header-inner { padding: 32px 24px; }
    .ch-co-grid { grid-template-columns: 1fr; }
    .ch-co-footer { flex-direction: column; gap: 10px; text-align: center; padding: 24px; }
  }

  @media (max-width: 580px) {
    .ch-co-form-row { grid-template-columns: 1fr; }
    .ch-co-header-eyebrow { display: none; }
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    .ch-co-page { margin-left: 220px; padding-top: 56px; }
    .ch-co-header-inner { padding: 28px 30px; }
    .ch-co-main { padding: 40px 30px 60px; }
    .ch-co-grid { grid-template-columns: 1fr; }
    .ch-co-footer { flex-direction: column; gap: 10px; text-align: center; padding: 24px 30px; }
  }
 
  @media (max-width: 768px) {
    .ch-co-page { margin-left: 0; padding-top: 56px; }
    .ch-co-header-inner { padding: 14px 16px 14px 68px; margin-left: -50px;}
    .ch-co-logo-yarn { font-size: 1.8rem; }
    .ch-co-logo-text { font-size: 1.3rem; }
    .ch-co-tagline { display: none; }
    .ch-co-header-eyebrow { display: none; }
    .ch-co-main { padding: 24px 16px 48px; }
    .ch-co-grid { grid-template-columns: 1fr; }
    .ch-co-form-row { grid-template-columns: 1fr; }
    .ch-co-card-body { padding: 18px; }
    .ch-co-card-head { padding: 16px 18px; }
    .ch-co-footer { flex-direction: column; gap: 10px; text-align: center; padding: 20px 16px; }
  }

  @media (max-width: 1024px) and (min-width: 769px) {
  .ch-co-page { margin-left: 160px; padding-top: 0 }
  .ch-co-header-title {margin-left: 23%;}
  .ch-co-header-inner { padding: 28px 30px; }
  .ch-co-main { padding: 40px 30px 60px; }
  .ch-co-grid { grid-template-columns: 1fr; }
  .ch-co-footer { flex-direction: column; gap: 10px; text-align: center; padding: 24px 30px; }
}
`;

// ── Helper: decode userId from JWT ───────────────────────────────────────────
const getUserIdFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return String(payload.id || payload.userId || payload.sub || '');
  } catch {
    return '';
  }
};

// ── Mobile number validation helper ──────────────────────────────────────────
const validateMobileNumber = (value) => {
  if (!value) return '';
  const trimmed = value.trim();
  const stripped = trimmed.replace(/\s+/g, '');

  if (stripped.startsWith('+63')) {
    const digits = stripped.slice(3);
    if (!/^\d+$/.test(digits)) return 'Only digits are allowed after +63.';
    if (digits.length < 10) return `Incomplete number — ${10 - digits.length} more digit(s) needed after +63.`;
    if (digits.length > 10) return 'Too many digits — must be +63 followed by exactly 10 digits.';
    if (!digits.startsWith('9')) return 'Number after +63 must start with 9 (e.g. +639XXXXXXXXX).';
    return '';
  }

  if (stripped.startsWith('0')) {
    if (!/^\d+$/.test(stripped)) return 'Mobile number must contain digits only.';
    if (stripped.length < 11) return `Incomplete number — must be 11 digits (currently ${stripped.length}).`;
    if (stripped.length > 11) return 'Too many digits — mobile number must be exactly 11 digits.';
    if (!stripped.startsWith('09')) return 'Number must start with 09 (e.g. 09XXXXXXXXX).';
    return '';
  }

  return 'Enter a valid PH number starting with 09 or +63.';
};

const resolveCurrentUserId = () => {
  // Same logic as Orders.js
  const direct = localStorage.getItem('userId');
  if (direct) return String(direct);

  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const p = JSON.parse(raw);
      const id = p?.id || p?.userId;
      if (id) return String(id);
    }
  } catch {}

  try {
    const raw = localStorage.getItem('ch_user');
    if (raw) {
      const p = JSON.parse(raw);
      const id = p?.id || p?.userId;
      if (id) return String(id);
    }
  } catch {}

  try {
    const token = localStorage.getItem('ch_token') || localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload?.id || payload?.userId || payload?.sub;
      if (id) return String(id);
    }
  } catch {}

  return null;
};

const Checkout = () => {
  const { cart, clearCart, selectedItems, getSelectedItems } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', zipCode: '',
    paymentMethod: '', gcashNumber: '', paymayaNumber: '',
    cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '', orderNote: ''
  });

  // LOGIN GUARD: Redirect if not authenticated
  useEffect(() => {
    const currentUserId = resolveCurrentUserId();
    if (!currentUserId) {
      navigate('/login', { state: { from: '/user/checkout' } });
      return;
    }
  }, [navigate]);


  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileErrors, setMobileErrors] = useState({ gcashNumber: '', paymayaNumber: '' });

  const safeCart = selectedItems.length > 0 ? getSelectedItems() : (Array.isArray(cart) ? cart : []);

  const total = safeCart.reduce((sum, item) => {
    const price = item?.price ? parseFloat(item.price) : 0;
    const qty   = item?.quantity ?? 1;
    return sum + (isNaN(price) ? 0 : price * qty);
  }, 0);

  const formatPrice = (price) => {
    const n = parseFloat(price);
    return isNaN(n) ? '0.00' : n.toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'gcashNumber' || name === 'paymayaNumber') {
      setMobileErrors(prev => ({ ...prev, [name]: value ? validateMobileNumber(value) : '' }));
    }
    if (name === 'paymentMethod') {
      setMobileErrors({ gcashNumber: '', paymayaNumber: '' });
    }
  };

  const activeMobileField = formData.paymentMethod === 'gcash'
    ? 'gcashNumber'
    : formData.paymentMethod === 'paymaya'
    ? 'paymayaNumber'
    : null;

  const hasMobileError = activeMobileField
    ? (mobileErrors[activeMobileField] !== '' ||
       (formData[activeMobileField] && validateMobileNumber(formData[activeMobileField]) !== ''))
    : false;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeMobileField) {
      const err = validateMobileNumber(formData[activeMobileField]);
      if (err) {
        setMobileErrors(prev => ({ ...prev, [activeMobileField]: err }));
        return;
      }
    }

    setIsLoading(true);
    try {
      // ── Resolve the logged-in user's ID ────────────────────────────────────
      const token = localStorage.getItem('token');
      let userId = localStorage.getItem('userId');

      // Fall back to JWT decoding if localStorage doesn't have it
      if (!userId && token) {
        userId = getUserIdFromToken(token);
        if (userId) localStorage.setItem('userId', userId);
      }

      // Also grab username if stored
      const username = localStorage.getItem('username') || '';

      const orderData = {
        // ── KEY FIX: attach userId and username so Orders page can filter ──
        userId,
        username,
        customer: formData,
        paymentMethod: formData.paymentMethod,
        items: safeCart.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity || 1,
          selectedImage: item.selectedImage
        })),
        total,
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        clearCart();
        // Notify the Orders page that a new order was placed
        try { localStorage.setItem('ordersUpdatedAt', String(Date.now())); } catch {}
        window.dispatchEvent(new CustomEvent('ordersUpdated'));
      } else {
        const errorData = await response.json();
        alert('Failed to place order: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error placing order: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const paymentLabel = {
    gcash: 'GCash', paymaya: 'PayMaya', cod: 'Cash on Delivery', card: 'Credit / Debit Card'
  };

  /* ── Success screen ── */
  if (isSubmitted) {
    return (
      <>
        <style>{checkoutStyles}</style>
        <div className="ch-co-page">
          <header className="ch-co-header">
            <div className="ch-co-header-inner">
              <div className="ch-co-logo-block">
                <span className="ch-co-logo-yarn">🧶</span>
                <div>
                  <div className="ch-co-logo-text">Crochet <span>Haven</span></div>
                  <div className="ch-co-tagline">Stitched with love, for you</div>
                </div>
              </div>
            </div>
          </header>

          <main className="ch-co-main">
            <div className="ch-co-success">
              <span className="ch-co-success-icon">🎉</span>
              <h1 className="ch-co-success-title">Order <em>Confirmed!</em></h1>
              <p className="ch-co-success-sub">
                Thank you for your purchase. We'll process your order and ship it to you soon — crafted with care, just for you.
              </p>
              <Link to="/user/products" className="ch-co-cta">
                <span>Continue Shopping →</span>
              </Link>
            </div>
          </main>

          <footer className="ch-co-footer">
            <div className="ch-co-footer-logo">🧶 Crochet Haven</div>
            <p className="ch-co-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
          </footer>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{checkoutStyles}</style>
      <div className="ch-co-page">

        <header className="ch-co-header">
          <div className="ch-co-header-inner">
            <div className="ch-co-logo-block">
              <span className="ch-co-logo-yarn">🧶</span>
              <div>
                <div className="ch-co-logo-text">Crochet <span>Haven</span></div>
                <div className="ch-co-tagline">Stitched with love, for you</div>
              </div>
            </div>
            <div className="ch-co-header-eyebrow">
              <span className="ch-co-header-tag">Secure Checkout</span>
              <div className="ch-co-header-title">Complete Your <em>Order</em></div>
            </div>
          </div>
        </header>

        <main className="ch-co-main">
          {safeCart.length === 0 ? (
            <div className="ch-co-empty">
              <span className="ch-co-empty-emoji">🛒</span>
              <h2 className="ch-co-empty-title">Your cart is empty</h2>
              <p className="ch-co-empty-sub">Looks like you haven't added any items yet.</p>
              <Link to="/user/products" className="ch-co-cta">
                <span>Browse Products →</span>
              </Link>
            </div>
          ) : (
            <div className="ch-co-grid">

              {/* ── LEFT: Shipping + Payment form ── */}
              <div>
                <form onSubmit={handleSubmit}>
                  {/* Shipping */}
                  <div className="ch-co-card" style={{ marginBottom: 24 }}>
                    <div className="ch-co-card-head">
                      <div className="ch-co-card-icon rose">📦</div>
                      <span className="ch-co-card-title">Shipping Information</span>
                    </div>
                    <div className="ch-co-card-body">

                      <div className="ch-co-form-group">
                        <label className="ch-co-label" htmlFor="fullName">Full Name</label>
                        <input style={{width: '95%'}} className="ch-co-input" type="text" id="fullName" name="fullName"
                          value={formData.fullName} onChange={handleChange} required placeholder="Your full name" />
                      </div>

                      <div className="ch-co-form-row">
                        <div className="ch-co-form-group">
                          <label className="ch-co-label" htmlFor="email">Email</label>
                          <input className="ch-co-input" type="email" id="email" name="email"
                            value={formData.email} onChange={handleChange} required placeholder="you@email.com" />
                        </div>
                        <div className="ch-co-form-group">
                          <label className="ch-co-label" htmlFor="phone">Phone</label>
                          <input style={{width: '90%'}} className="ch-co-input" type="tel" id="phone" name="phone"
                            value={formData.phone} onChange={handleChange} required placeholder="+63 912 345 6789" />
                        </div>
                      </div>

                      <div className="ch-co-form-group">
                        <label className="ch-co-label" htmlFor="address">Address</label>
                        <input style={{width: '95%'}} className="ch-co-input" type="text" id="address" name="address"
                          value={formData.address} onChange={handleChange} required placeholder="Street address" />
                      </div>

                      <div className="ch-co-form-row">
                        <div className="ch-co-form-group">
                          <label className="ch-co-label" htmlFor="city">City / Province</label>
                          <input className="ch-co-input" type="text" id="city" name="city"
                            value={formData.city} onChange={handleChange} required placeholder="City" />
                        </div>
                        <div className="ch-co-form-group">
                          <label className="ch-co-label" htmlFor="zipCode">ZIP Code</label>
                          <input style={{width: '90%'}} className="ch-co-input" type="text" id="zipCode" name="zipCode"
                            value={formData.zipCode} onChange={handleChange} required placeholder="0000" />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Payment */}
                  <div className="ch-co-card">
                    <div className="ch-co-card-head">
                      <div className="ch-co-card-icon amber">💳</div>
                      <span className="ch-co-card-title">Payment Method</span>
                    </div>
                    <div className="ch-co-card-body">

                      <div className="ch-co-form-group">
                        <label className="ch-co-label" htmlFor="paymentMethod">Select Method</label>
                        <select style={{width: '100%'}} className="ch-co-select" id="paymentMethod" name="paymentMethod"
                          value={formData.paymentMethod} onChange={handleChange} required>
                          <option value="">Choose payment method…</option>
                          <option value="gcash">GCash</option>
                          <option value="paymaya">PayMaya</option>
                          <option value="cod">Cash on Delivery (COD)</option>
                          <option value="card">Credit / Debit Card</option>
                        </select>
                      </div>

                      {formData.paymentMethod && (
                        <div className="ch-co-pay-badge">
                          {formData.paymentMethod === 'gcash'   && '📱 '}
                          {formData.paymentMethod === 'paymaya' && '📱 '}
                          {formData.paymentMethod === 'cod'     && '💵 '}
                          {formData.paymentMethod === 'card'    && '💳 '}
                          {paymentLabel[formData.paymentMethod]}
                        </div>
                      )}

                      {/* GCash */}
                      {formData.paymentMethod === 'gcash' && (
                        <div className="ch-co-form-group">
                          <label className="ch-co-label" htmlFor="gcashNumber">GCash Number</label>
                          <input
                            className={`ch-co-input${mobileErrors.gcashNumber ? ' has-error' : ''}`}
                            type="tel" id="gcashNumber" name="gcashNumber"
                            value={formData.gcashNumber} onChange={handleChange}
                            required placeholder="09XXXXXXXXX"
                          />
                          {mobileErrors.gcashNumber && (
                            <span className="ch-co-field-error">{mobileErrors.gcashNumber}</span>
                          )}
                        </div>
                      )}

                      {/* PayMaya */}
                      {formData.paymentMethod === 'paymaya' && (
                        <div className="ch-co-form-group">
                          <label className="ch-co-label" htmlFor="paymayaNumber">PayMaya Number</label>
                          <input
                            className={`ch-co-input${mobileErrors.paymayaNumber ? ' has-error' : ''}`}
                            type="tel" id="paymayaNumber" name="paymayaNumber"
                            value={formData.paymayaNumber} onChange={handleChange}
                            required placeholder="09XXXXXXXXX"
                          />
                          {mobileErrors.paymayaNumber && (
                            <span className="ch-co-field-error">{mobileErrors.paymayaNumber}</span>
                          )}
                        </div>
                      )}

                      {/* Card */}
                      {formData.paymentMethod === 'card' && (
                        <>
                          <div className="ch-co-form-group">
                            <label className="ch-co-label" htmlFor="cardName">Cardholder Name</label>
                            <input className="ch-co-input" type="text" id="cardName" name="cardName"
                              value={formData.cardName} onChange={handleChange} required placeholder="Name on card" />
                          </div>
                          <div className="ch-co-form-group">
                            <label className="ch-co-label" htmlFor="cardNumber">Card Number</label>
                            <input className="ch-co-input" type="text" id="cardNumber" name="cardNumber"
                              value={formData.cardNumber} onChange={handleChange} required
                              placeholder="1234 5678 9012 3456" maxLength="19" />
                          </div>
                          <div className="ch-co-form-row">
                            <div className="ch-co-form-group">
                              <label className="ch-co-label" htmlFor="cardExpiry">Expiry</label>
                              <input className="ch-co-input" type="text" id="cardExpiry" name="cardExpiry"
                                value={formData.cardExpiry} onChange={handleChange} required placeholder="MM/YY" maxLength="5" />
                            </div>
                            <div className="ch-co-form-group">
                              <label className="ch-co-label" htmlFor="cardCvv">CVV</label>
                              <input className="ch-co-input" type="text" id="cardCvv" name="cardCvv"
                                value={formData.cardCvv} onChange={handleChange} required placeholder="123" maxLength="4" />
                            </div>
                          </div>
                        </>
                      )}

                      <button
                        type="submit"
                        className="ch-co-submit"
                        disabled={isLoading || !formData.paymentMethod || hasMobileError}
                      >
                        {isLoading ? (
                          <>
                            <div className="ch-co-spinner" />
                            <span>Processing…</span>
                          </>
                        ) : (
                          <span>Place Order · ₱{formatPrice(total)}</span>
                        )}
                      </button>

                    </div>
                  </div>
                </form>
              </div>

              {/* ── RIGHT: Order summary ── */}
              <div>
                <div className="ch-co-card">
                  <div className="ch-co-card-head">
                    <div className="ch-co-card-icon rose">🧶</div>
                    <span className="ch-co-card-title">Order Summary</span>
                  </div>
                  <div className="ch-co-card-body">

                    <div className="ch-co-items">
                      {safeCart.map((item) => (
                        <div key={item.id} className="ch-co-item">
                          <div className="ch-co-item-img">
                            {item.selectedImage
                              ? <img src={item.selectedImage} alt={item.name} />
                              : <div className="ch-co-item-placeholder">🎁</div>
                            }
                          </div>
                          <div className="ch-co-item-info">
                            <div className="ch-co-item-name">{item.name}</div>
                            <div className="ch-co-item-qty">Qty: {item.quantity || 1}</div>
                          </div>
                          <div className="ch-co-item-price">
                            ₱{formatPrice(item.price * (item.quantity || 1))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="ch-co-total-row">
                      <span className="ch-co-total-label">Total</span>
                      <span className="ch-co-total-value">₱{formatPrice(total)}</span>
                    </div>

                    <div className="ch-co-card-divider" />

                    {/* Order note */}
                    <div className="ch-co-form-group">
                      <label className="ch-co-label" htmlFor="orderNote">
                        Order Note{' '}
                        <span style={{ opacity: 0.5, fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>
                          (optional)
                        </span>
                      </label>
                      <textarea
                        className="ch-co-textarea"
                        id="orderNote" name="orderNote"
                        value={formData.orderNote} onChange={handleChange}
                        placeholder="Color preference, gift wrapping, special instructions…"
                        rows="3"
                      />
                    </div>

                    <Link to="/user/cart" className="ch-co-back">← Back to Cart</Link>

                  </div>
                </div>
              </div>

            </div>
          )}
        </main>

        <footer className="ch-co-footer">
          <div className="ch-co-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-co-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>

      </div>
    </>
  );
};

export default Checkout;