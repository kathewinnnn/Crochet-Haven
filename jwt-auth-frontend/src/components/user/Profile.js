import React, { useState, useEffect, useCallback, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import {
  loadToken,
  loadAvatar,
  loadFullUser,
  saveUserProfile,
  saveAvatar,
  clearUserData,
  resolveUserId,
} from "../../pages/userStorage";

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

  .ch-page-banner { position: relative; z-index: 1; background: var(--charcoal); padding: 48px 60px; overflow: hidden; text-align: center; }
  .ch-page-banner::after { content: ''; position: absolute; right: -80px; top: -80px; width: 360px; height: 360px; border-radius: 50%; background: radial-gradient(circle, rgba(232,114,138,0.15) 0%, transparent 70%); pointer-events: none; }
  .ch-banner-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .ch-banner-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--amber); font-weight: 700; margin-bottom: 14px; }
  .ch-banner-eyebrow::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--amber); }
  .ch-banner-title { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 800; color: var(--warm-white); line-height: 1.1; margin-bottom: 10px; letter-spacing: -0.02em; }
  .ch-banner-title em { font-style: italic; color: var(--blush); }
  .ch-banner-sub { font-size: 0.9rem; color: rgba(255,255,255,0.4); font-weight: 300; }

  .ch-profile-body { position: relative; z-index: 1; flex: 1; max-width: 1200px; margin: 0 auto; padding: 48px 60px 80px; width: 100%; }
  .ch-profile-layout { display: grid; grid-template-columns: 260px 1fr; gap: 28px; align-items: start; }

  .ch-profile-aside { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 24px; }
  .ch-avatar-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; padding: 28px 20px; text-align: center; }
  .ch-avatar-wrap { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, var(--rose), var(--amber)); margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; position: relative; border: 3px solid var(--rose); transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .ch-avatar-wrap:hover { transform: scale(1.04); box-shadow: 0 6px 20px rgba(232,114,138,0.3); }
  .ch-avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .ch-avatar-initial { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800; color: #fff; }
  .ch-avatar-overlay { position: absolute; inset: 0; background: rgba(44,36,32,0.55); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s ease; font-size: 1.3rem; border-radius: 50%; }
  .ch-avatar-wrap:hover .ch-avatar-overlay { opacity: 1; }
  .ch-user-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--charcoal); margin-bottom: 4px; }
  .ch-user-email { font-size: 0.78rem; color: var(--muted); margin-bottom: 12px; word-break: break-all; font-weight: 300; }
  .ch-user-badge { display: inline-block; background: linear-gradient(135deg, var(--rose), var(--amber)); color: #fff; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 5px 14px; border-radius: 2px; }

  .ch-profile-nav { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
  .ch-pnav-item { width: 100%; padding: 14px 18px; border: none; border-bottom: 1px solid var(--border); background: transparent; display: flex; align-items: center; gap: 12px; font-family: 'Lato', sans-serif; font-size: 0.88rem; color: var(--muted); cursor: pointer; transition: all 0.2s ease; text-align: left; position: relative; }
  .ch-pnav-item:last-child { border-bottom: none; }
  .ch-pnav-item:hover { background: #fef9f5; color: var(--rose); }
  .ch-pnav-item.active { background: linear-gradient(135deg, rgba(232,114,138,0.12) 0%, rgba(232,164,90,0.07) 100%); color: var(--charcoal); font-weight: 700; }
  .ch-pnav-item.active::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 3px; background: var(--rose); border-radius: 0 2px 2px 0; }
  .ch-pnav-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }

  .ch-profile-main { min-width: 0; display: flex; flex-direction: column; gap: 20px; }
  .ch-section-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 16px; }
  .ch-section-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: var(--charcoal); margin-bottom: 4px; }
  .ch-section-sub { font-size: 0.82rem; color: var(--muted); font-weight: 300; }

  .ch-info-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
  .ch-card-title { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--charcoal); padding: 18px 24px 16px; border-bottom: 1px solid var(--border); background: var(--cream); }
  .ch-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .ch-info-item { padding: 20px 24px; border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); }
  .ch-info-item:nth-child(even) { border-right: none; }
  .ch-info-item:nth-last-child(-n+2) { border-bottom: none; }
  .ch-info-item.full { grid-column: 1 / -1; border-right: none; }
  .ch-info-item.full:last-child { border-bottom: none; }
  .ch-info-label { display: block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .ch-info-value { font-size: 0.95rem; color: var(--charcoal); font-weight: 500; }
  .ch-status-badge { display: inline-block; background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #065f46; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 12px; border-radius: 2px; }

  .ch-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: var(--charcoal); color: var(--cream); border: none; border-radius: 2px; font-family: 'Lato', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.25s ease; position: relative; overflow: hidden; }
  .ch-btn-primary::after { content: ''; position: absolute; inset: 0; background: var(--rose); transform: translateX(-100%); transition: transform 0.3s ease; z-index: 0; }
  .ch-btn-primary:hover::after { transform: translateX(0); }
  .ch-btn-primary span { position: relative; z-index: 1; }
  .ch-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
  .ch-btn-primary:disabled::after { display: none; }
  .ch-btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; background: transparent; color: var(--muted); border: 1px solid var(--border); border-radius: 2px; font-family: 'Lato', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
  .ch-btn-secondary:hover { border-color: var(--muted); color: var(--charcoal); }
  .ch-btn-group { display: flex; gap: 10px; align-items: center; }

  .ch-edit-form { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
  .ch-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .ch-form-group { display: flex; flex-direction: column; gap: 7px; }
  .ch-form-group label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
  .ch-form-group input, .ch-form-group textarea { padding: 13px 16px; border: 1.5px solid var(--border); border-radius: 2px; font-family: 'Lato', sans-serif; font-size: 0.95rem; color: var(--charcoal); background: var(--cream); transition: all 0.2s ease; }
  .ch-form-group input:focus, .ch-form-group textarea:focus { outline: none; border-color: var(--rose); background: var(--warm-white); box-shadow: 0 0 0 3px rgba(232,114,138,0.1); }

  .ch-settings-list { padding: 0; }
  .ch-setting-item { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--border); transition: background 0.2s ease; gap: 16px; }
  .ch-setting-item:last-child { border-bottom: none; }
  .ch-setting-item:hover { background: #fef9f5; }
  .ch-setting-info h4 { font-size: 0.92rem; font-weight: 700; color: var(--charcoal); margin-bottom: 4px; }
  .ch-setting-info p { font-size: 0.78rem; color: var(--muted); font-weight: 300; line-height: 1.5; }

  .ch-toggle { position: relative; width: 48px; height: 26px; cursor: pointer; flex-shrink: 0; }
  .ch-toggle input { opacity: 0; width: 0; height: 0; }
  .ch-toggle-track { position: absolute; inset: 0; background: #e5e7eb; border-radius: 26px; transition: background 0.3s ease; }
  .ch-toggle-track::before { content: ''; position: absolute; height: 20px; width: 20px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: transform 0.3s ease; box-shadow: 0 2px 6px rgba(0,0,0,0.18); }
  .ch-toggle input:checked + .ch-toggle-track { background: var(--rose); }
  .ch-toggle input:checked + .ch-toggle-track::before { transform: translateX(22px); }

  .ch-danger { margin: 24px; padding: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 2px; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
  .ch-danger h4 { font-size: 0.9rem; color: #991b1b; margin-bottom: 4px; }
  .ch-danger p { font-size: 0.78rem; color: #7f1d1d; font-weight: 300; }
  .ch-danger-btn { padding: 10px 20px; background: #dc2626; color: #fff; border: none; border-radius: 2px; font-family: 'Lato', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; flex-shrink: 0; transition: all 0.2s ease; }
  .ch-danger-btn:hover { background: #b91c1c; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(220,38,38,0.3); }

  .ch-del-backdrop { position: fixed; inset: 0; background: rgba(22,14,12,0.75); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9998; padding: 20px; animation: ch-fade 0.25s ease; }
  @keyframes ch-fade { from{opacity:0} to{opacity:1} }
  .ch-del-modal { background: var(--warm-white); border-radius: 8px; width: 100%; max-width: 460px; box-shadow: 0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(220,38,38,0.1); animation: ch-modal-up 0.3s cubic-bezier(0.34,1.56,0.64,1); overflow: hidden; }
  @keyframes ch-modal-up { from{opacity:0;transform:translateY(28px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  .ch-del-step1 { padding: 40px 36px 36px; text-align: center; display: flex; flex-direction: column; align-items: center; }
  .ch-del-icon-wrap { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #fee2e2, #fecaca); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 22px; border: 3px solid #fca5a5; animation: ch-shake 0.5s 0.3s ease both; }
  @keyframes ch-shake { 0%,100%{transform:rotate(0deg)} 20%{transform:rotate(-8deg)} 40%{transform:rotate(8deg)} 60%{transform:rotate(-5deg)} 80%{transform:rotate(5deg)} }
  .ch-del-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 800; color: #991b1b; margin-bottom: 12px; }
  .ch-del-desc { font-size: 0.9rem; color: var(--muted); line-height: 1.7; margin-bottom: 28px; font-weight: 300; max-width: 340px; }
  .ch-del-consequences { width: 100%; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 16px 18px; margin-bottom: 28px; text-align: left; }
  .ch-del-consequences-title { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #b91c1c; margin-bottom: 10px; }
  .ch-del-consequence-item { display: flex; align-items: center; gap: 10px; font-size: 0.82rem; color: #7f1d1d; margin-bottom: 7px; font-weight: 300; }
  .ch-del-consequence-item:last-child { margin-bottom: 0; }
  .ch-del-consequence-dot { width: 5px; height: 5px; border-radius: 50%; background: #dc2626; flex-shrink: 0; }
  .ch-del-step1-actions { display: flex; gap: 12px; width: 100%; }
  .ch-del-cancel-btn { flex: 1; padding: 14px 20px; border: 1.5px solid var(--border); border-radius: 2px; background: transparent; color: var(--muted); font-family: 'Lato', sans-serif; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
  .ch-del-cancel-btn:hover { border-color: var(--muted); color: var(--charcoal); }
  .ch-del-proceed-btn { flex: 1; padding: 14px 20px; border: none; border-radius: 2px; background: #dc2626; color: #fff; font-family: 'Lato', sans-serif; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.25s ease; position: relative; overflow: hidden; }
  .ch-del-proceed-btn::after { content: ''; position: absolute; inset: 0; background: #b91c1c; transform: translateX(-100%); transition: transform 0.3s ease; z-index: 0; }
  .ch-del-proceed-btn:hover::after { transform: translateX(0); }
  .ch-del-proceed-btn span { position: relative; z-index: 1; }
  .ch-del-step2 { display: flex; flex-direction: column; }
  .ch-del-step2-header { padding: 28px 32px 24px; background: linear-gradient(135deg, #fef2f2, #fee2e2); border-bottom: 1px solid #fecaca; display: flex; align-items: center; gap: 14px; }
  .ch-del-step2-icon { width: 44px; height: 44px; border-radius: 50%; background: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
  .ch-del-step2-heading { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 700; color: #991b1b; line-height: 1.2; }
  .ch-del-step2-sub { font-size: 0.78rem; color: #b91c1c; font-weight: 300; margin-top: 3px; }
  .ch-del-step2-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 20px; }
  .ch-del-step2-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.65; font-weight: 300; }
  .ch-del-step2-desc strong { color: var(--charcoal); font-weight: 700; }
  .ch-del-pwd-group { display: flex; flex-direction: column; gap: 8px; }
  .ch-del-pwd-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
  .ch-del-pwd-input-wrap { position: relative; }
  .ch-del-pwd-input { width: 100%; padding: 14px 48px 14px 16px; border: 1.5px solid #fca5a5; border-radius: 2px; font-family: 'Lato', sans-serif; font-size: 0.95rem; color: var(--charcoal); background: #fef2f2; transition: all 0.2s ease; box-sizing: border-box; }
  .ch-del-pwd-input:focus { outline: none; border-color: #dc2626; background: #fff; box-shadow: 0 0 0 3px rgba(220,38,38,0.1); }
  .ch-del-pwd-input.error { border-color: #dc2626; animation: ch-input-shake 0.4s ease; }
  @keyframes ch-input-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
  .ch-del-pwd-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 1rem; padding: 4px; }
  .ch-del-pwd-error { font-size: 0.75rem; color: #dc2626; font-weight: 500; display: flex; align-items: center; gap: 5px; }
  .ch-del-step2-actions { display: flex; gap: 12px; }
  .ch-del-final-btn { flex: 1; padding: 14px 20px; border: none; border-radius: 2px; background: #dc2626; color: #fff; font-family: 'Lato', sans-serif; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.25s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .ch-del-final-btn:hover:not(:disabled) { background: #b91c1c; }
  .ch-del-final-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .ch-del-deleting-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: ch-spin 0.8s linear infinite; }
  .ch-del-step3 { padding: 56px 36px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .ch-del-step3-ring { width: 80px; height: 80px; border: 3px solid #fee2e2; border-top-color: #dc2626; border-radius: 50%; animation: ch-spin 1s linear infinite; margin-bottom: 8px; }
  .ch-del-step3-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #991b1b; }
  .ch-del-step3-sub { font-size: 0.85rem; color: var(--muted); font-weight: 300; }
  @keyframes ch-spin { to{transform:rotate(360deg)} }

  .ch-toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; max-width: 360px; width: calc(100% - 40px); }
  .ch-toast { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; background: var(--warm-white); border-radius: 4px; box-shadow: 0 8px 32px rgba(44,36,32,0.14); animation: ch-toast-in 0.35s ease; position: relative; overflow: hidden; }
  @keyframes ch-toast-in { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
  .ch-toast-success { border-left: 3px solid var(--sage); }
  .ch-toast-error   { border-left: 3px solid #ef4444; }
  .ch-toast-warning { border-left: 3px solid var(--amber); }
  .ch-toast-info    { border-left: 3px solid var(--rose); }
  .ch-toast-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: #fff; flex-shrink: 0; }
  .ch-toast-success .ch-toast-icon { background: var(--sage); }
  .ch-toast-error   .ch-toast-icon { background: #ef4444; }
  .ch-toast-warning .ch-toast-icon { background: var(--amber); }
  .ch-toast-info    .ch-toast-icon { background: var(--rose); }
  .ch-toast-msg { font-size: 0.88rem; color: var(--charcoal); line-height: 1.5; flex: 1; }
  .ch-toast-close { background: none; border: none; color: var(--muted); font-size: 1.1rem; cursor: pointer; padding: 0 4px; line-height: 1; flex-shrink: 0; }
  .ch-toast-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
  .ch-toast-bar-fill { height: 100%; width: 100%; animation: ch-drain 5s linear forwards; transform-origin: left; }
  @keyframes ch-drain { to{width:0%} }
  .ch-toast-success .ch-toast-bar-fill { background: var(--sage); }
  .ch-toast-error   .ch-toast-bar-fill { background: #ef4444; }

  .ch-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; }
  .ch-spinner { width: 48px; height: 48px; border: 3px solid var(--border); border-top-color: var(--rose); border-radius: 50%; animation: ch-spin 0.9s linear infinite; }
  .ch-loading p { font-size: 0.9rem; color: var(--muted); }

  .ch-footer { position: relative; z-index: 1; background: var(--warm-white); border-top: 1px solid var(--border); padding: 32px 60px; display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
  .ch-footer-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--charcoal); display: flex; align-items: center; gap: 8px; }
  .ch-footer-copy { font-size: 0.78rem; color: var(--muted); letter-spacing: 0.04em; }

  .ch-avatar-changed-badge {
    position: absolute; bottom: 0; right: 0;
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--rose); border: 2px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: #fff;
    animation: ch-pop 0.3s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes ch-pop { from{transform:scale(0)} to{transform:scale(1)} }

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
    .ch-form-row { grid-template-columns: 1fr; }
    .ch-section-head { flex-direction: column; gap: 12px; }
    .ch-danger { flex-direction: column; text-align: center; }
  }
  @media (max-width: 768px) {
    .ch-page { margin-left: 0; padding-top: 56px; }
    .ch-header-inner { padding: 14px 16px 14px 68px; margin-left: -50px; }
    .ch-page-banner { padding: 28px 16px; }
    .ch-banner-title { font-size: 1.7rem; }
    .ch-profile-body { padding: 20px 16px 48px; }
    .ch-profile-layout { grid-template-columns: 1fr; }
    .ch-form-row { grid-template-columns: 1fr; }
    .ch-footer { flex-direction: column; gap: 10px; text-align: center; padding: 20px 16px; }
  }
  @media (max-width: 1024px) and (min-width: 769px) {
    .ch-page { margin-left: 160px; }
    .ch-profile-layout { grid-template-columns: 1fr; }
    .ch-profile-aside { position: static; }
  }
`;

// ── Toast ──────────────────────────────────────────────────────────────────────
const ChToast = ({ toast, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
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

// ── Circle Cropper ─────────────────────────────────────────────────────────────
const AvatarCropper = ({ imageSrc, onDone, onCancel }) => {
  const canvasRef  = useRef(null);
  const previewRef = useRef(null);
  const isDragging = useRef(false);
  const lastPos    = useRef({ x: 0, y: 0 });
  const imgRef     = useRef(new Image());
  const [offset,  setOffset]  = useState({ x: 0, y: 0 });
  const [scale,   setScale]   = useState(1);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const SIZE = 240;

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
    ctx.clearRect(0, 0, SIZE, SIZE); ctx.save();
    ctx.beginPath(); ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(imgRef.current, offset.x, offset.y, imgSize.w * scale, imgSize.h * scale);
    ctx.restore();
  }, [offset, scale, imgSize]);

  const onMD = (e) => { isDragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; };
  const onMU = () => { isDragging.current = false; };
  const onMM = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x, dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(p => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const crop = () => {
    const c = canvasRef.current; c.width = SIZE; c.height = SIZE;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, SIZE, SIZE); ctx.save();
    ctx.beginPath(); ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(imgRef.current, offset.x, offset.y, imgSize.w * scale, imgSize.h * scale);
    ctx.restore();
    onDone(c.toDataURL('image/png'));
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,6,6,.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--warm-white)', borderRadius: '12px', maxWidth: '340px', width: '100%', overflow: 'hidden', boxShadow: '0 40px 100px rgba(232,114,138,.3)' }}>
        <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg,#fdf6ec,#fce7f3)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: 'var(--charcoal)' }}>✂️ Crop Your Photo</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Drag to reposition · slider to zoom</div>
        </div>
        <div style={{ position: 'relative', width: '240px', height: '240px', margin: '20px auto 0', cursor: 'grab', userSelect: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: '0 0 0 9999px rgba(0,0,0,.5)', zIndex: 1, pointerEvents: 'none' }} />
          <canvas ref={previewRef} width={SIZE} height={SIZE}
            style={{ display: 'block', borderRadius: '50%', border: '3px solid var(--rose)', zIndex: 2, position: 'relative' }}
            onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px 20px 8px' }}>
          <span>🔍</span>
          <input type="range" min={0.3} max={3} step={0.01} value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--rose)', cursor: 'pointer' }} />
          <span style={{ fontSize: '12px', color: 'var(--muted)', minWidth: '36px' }}>{Math.round(scale * 100)}%</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', padding: '12px 20px 20px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '11px', border: '1px solid var(--border)', borderRadius: '2px', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontFamily: "'Lato',sans-serif", fontSize: '13px', fontWeight: 700 }}>Cancel</button>
          <button onClick={crop} style={{ flex: 2, padding: '11px', background: 'var(--rose)', border: 'none', borderRadius: '2px', color: '#fff', cursor: 'pointer', fontFamily: "'Lato',sans-serif", fontSize: '13px', fontWeight: 700 }}>Use This Photo ✓</button>
        </div>
      </div>
    </div>
  );
};

// ── Delete Modal ───────────────────────────────────────────────────────────────
// Sends POST /api/auth/delete-account with { username, email, password }.
// The backend verifies the password with bcrypt, removes the user + their
// orders from db.json, then returns 200. On success, local storage is wiped.
const DeleteAccountModal = ({ user, onClose, onDeleted }) => {
  const username = user?.username || "";
  const email = user?.email || "";
  const [step,       setStep]       = useState(1);
  const [password,   setPassword]   = useState("");
  const [showPwd,    setShowPwd]    = useState(false);
  const [pwdError,   setPwdError]   = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { if (step === 2) setTimeout(() => inputRef.current?.focus(), 80); }, [step]);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape" && step !== 3) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [step, onClose]);

  const handleFinalDelete = async (e) => {
    e.preventDefault();
    setPwdError("");

    if (!password.trim())    { setPwdError("Password is required.");                    return; }
    if (password.length < 6) { setPwdError("Password must be at least 6 characters.");  return; }

    setIsDeleting(true);
    setStep(3);

    try {
      const token = localStorage.getItem("ch_token");
      const res = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username, password }), // Backend only needs password (uses req.user.id from token)
      });

      const data = await res.json().catch(() => ({}));
      console.log("Delete response:", { status: res.status, data }); // Debug log

      if (!res.ok) {
        const msg = data.message || `Server error ${res.status}`;
        setIsDeleting(false);
        setStep(2);
        setPwdError(msg);
        return;
      }

      // ── Wipe ALL local storage for this user ──────────────────────────────
      clearUserData();
      const userId = resolveUserId();
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && userId && key.includes(userId)) toRemove.push(key);
      }
      toRemove.forEach(k => localStorage.removeItem(k));
      ["ch_token", "ch_user", "ch_notifications", "ch_privacy", "profileActiveSection"]
        .forEach(k => localStorage.removeItem(k));

      onDeleted();

    } catch {
      setIsDeleting(false);
      setStep(2);
      setPwdError("Network error — please check your connection and try again.");
    }
  };

  return (
    <div className="ch-del-backdrop" onClick={e => { if (e.target === e.currentTarget && step !== 3) onClose(); }}>
      <div className="ch-del-modal" role="dialog" aria-modal="true">
        {step === 1 && (
          <div className="ch-del-step1">
            <div className="ch-del-icon-wrap">⚠️</div>
            <div className="ch-del-title">Delete Account?</div>
            <p className="ch-del-desc">This action is <strong style={{ color: "#dc2626" }}>permanent and irreversible.</strong></p>
            <div className="ch-del-consequences">
              <div className="ch-del-consequences-title">What will be lost</div>
              {["Your profile and personal information", "All order history and receipts", "Saved addresses and preferences", "Account settings and notifications"].map((item, i) => (
                <div key={i} className="ch-del-consequence-item"><span className="ch-del-consequence-dot" />{item}</div>
              ))}
            </div>
            <div className="ch-del-step1-actions">
              <button className="ch-del-cancel-btn" onClick={onClose}>Keep Account</button>
              <button className="ch-del-proceed-btn" onClick={() => setStep(2)}><span>Yes, Delete It</span></button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="ch-del-step2">
            <div className="ch-del-step2-header">
              <div className="ch-del-step2-icon">🔑</div>
              <div>
                <div className="ch-del-step2-heading">Confirm Your Identity</div>
                <div className="ch-del-step2-sub">One last step before we proceed</div>
              </div>
            </div>
            <form onSubmit={handleFinalDelete} className="ch-del-step2-body">
              <p className="ch-del-step2-desc">Enter your <strong>current password</strong> to permanently delete your account.</p>
              <div className="ch-del-pwd-group">
                <label className="ch-del-pwd-label">Current Password</label>
                <div className="ch-del-pwd-input-wrap">
                  <input ref={inputRef} type={showPwd ? "text" : "password"}
                    className={`ch-del-pwd-input${pwdError ? " error" : ""}`}
                    value={password} onChange={e => { setPassword(e.target.value); setPwdError(""); }}
                    placeholder="Enter your password" autoComplete="current-password" />
                  <button type="button" className="ch-del-pwd-toggle" onClick={() => setShowPwd(s => !s)} tabIndex={-1}>
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
                {pwdError && <div className="ch-del-pwd-error"><span>⚠</span>{pwdError}</div>}
              </div>
              <div className="ch-del-step2-actions">
                <button type="button" className="ch-del-cancel-btn" onClick={onClose}>Cancel</button>
                <button type="submit" className="ch-del-final-btn" disabled={isDeleting}>
                  {isDeleting ? <><div className="ch-del-deleting-spinner" />Deleting…</> : "Delete My Account"}
                </button>
              </div>
            </form>
          </div>
        )}
        {step === 3 && (
          <div className="ch-del-step3">
            <div className="ch-del-step3-ring" />
            <div className="ch-del-step3-title">Deleting Account…</div>
            <p className="ch-del-step3-sub">Please wait while we remove your data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// MAIN PROFILE COMPONENT
// ═══════════════════════════════════════════════════
const Profile = () => {
  const navigate     = useNavigate();
  const fileInputRef = useRef(null);

  const [user,            setUser]            = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [activeSection,   setActiveSection]   = useState(
    () => localStorage.getItem("profileActiveSection") || "overview"
  );
  const [toasts,          setToasts]          = useState([]);
  const [isEditing,       setIsEditing]       = useState(false);
  const [editForm,        setEditForm]        = useState({});
  const [showAvatarCrop,  setShowAvatarCrop]  = useState(false);
  const [rawAvatarSrc,    setRawAvatarSrc]    = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordForm, setPasswordForm]       = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const getNotifKey   = () => `ch_notifications_${resolveUserId() || 'guest'}`;
  const getPrivacyKey = () => `ch_privacy_${resolveUserId() || 'guest'}`;

  const [notifications, setNotifications] = useState(() => {
    try {
      const userId = resolveUserId();
      const raw = localStorage.getItem(`ch_notifications_${userId}`) || localStorage.getItem("ch_notifications");
      return raw ? JSON.parse(raw) : { emailOrders: true, emailPromotions: false, smsNotifications: true };
    } catch { return { emailOrders: true, emailPromotions: false, smsNotifications: true }; }
  });

  const [privacy, setPrivacy] = useState(() => {
    try {
      const userId = resolveUserId();
      const raw = localStorage.getItem(`ch_privacy_${userId}`) || localStorage.getItem("ch_privacy");
      return raw ? JSON.parse(raw) : { profileVisible: true, showOrders: false };
    } catch { return { profileVisible: true, showOrders: false }; }
  });

  const addToast    = useCallback((type, message) => { const id = Date.now(); setToasts(p => [...p, { id, type, message }]); }, []);
  const removeToast = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

  useEffect(() => { loadUser(); }, []);
  useEffect(() => { localStorage.setItem("profileActiveSection", activeSection); }, [activeSection]);
  useEffect(() => { localStorage.setItem(getNotifKey(), JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(getPrivacyKey(), JSON.stringify(privacy)); }, [privacy]);

  const loadUser = () => {
    try {
      const token = loadToken();
      let decoded = {};
      if (token) { try { decoded = jwtDecode(token); } catch { /* expired */ } }
      const merged = loadFullUser(decoded);
      if (merged && (merged.username || merged.email)) {
        const avatar = loadAvatar();
        merged.avatar = avatar || merged.avatar || null;
        setUser(merged);
        setEditForm({
          fullName: merged.fullName || merged.username || "",
          email:    merged.email    || "",
          phone:    merged.phone    || "",
          address:  merged.address  || "",
        });
      }
    } catch { addToast("error", "Failed to load user data."); }
    finally  { setLoading(false); }
  };

  const handleEditSubmit = async (e) => {
    e?.preventDefault(); setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      const updated    = saveUserProfile({ ...editForm, username: user.username });
      const withAvatar = { ...user, ...updated, avatar: loadAvatar() || user?.avatar || null };
      setUser(withAvatar); setIsEditing(false);
      addToast("success", "Profile updated successfully!");
    } catch { addToast("error", "Failed to update profile."); }
    finally  { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { addToast("error", "Passwords do not match!"); return; }
    if (passwordForm.newPassword.length < 6) { addToast("error", "Password must be at least 6 characters!"); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      addToast("success", "Password changed successfully!");
    } catch { addToast("error", "Failed to change password."); }
    finally  { setLoading(false); }
  };

  const handleAvatarFilePick = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setRawAvatarSrc(reader.result); setShowAvatarCrop(true); };
    reader.readAsDataURL(file); e.target.value = '';
  };

  const handleAvatarCropDone = (dataUrl) => {
    setShowAvatarCrop(false); setRawAvatarSrc(null);
    saveAvatar(dataUrl);
    setUser(prev => ({ ...prev, avatar: dataUrl }));
    addToast("success", "Profile picture updated!");
  };

  const handleAccountDeleted = () => navigate("/");

  const navItems = [
    { key: "overview",      icon: "👤", label: "Overview"      },
    { key: "security",      icon: "🔒", label: "Security"      },
    { key: "notifications", icon: "🔔", label: "Notifications" },
    { key: "privacy",       icon: "🛡️", label: "Privacy"       },
  ];

  if (loading && !user) return (
    <><style>{styles}</style>
      <div className="ch-page">
        <div className="ch-loading"><div className="ch-spinner" /><p>Loading profile…</p></div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="ch-page">

        {showAvatarCrop && rawAvatarSrc && (
          <AvatarCropper imageSrc={rawAvatarSrc} onDone={handleAvatarCropDone}
            onCancel={() => { setShowAvatarCrop(false); setRawAvatarSrc(null); }} />
        )}

        {/* HEADER */}
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

        {/* BANNER */}
        <div className="ch-page-banner">
          <div className="ch-banner-inner">
            <p className="ch-banner-eyebrow">Your Account</p>
            <h1 className="ch-banner-title"><em>{user?.fullName || user?.username || "Profile"}</em></h1>
            <p className="ch-banner-sub">Manage your profile and preferences</p>
          </div>
        </div>

        {/* BODY */}
        <div className="ch-profile-body">
          <div className="ch-profile-layout">

            {/* LEFT ASIDE */}
            <aside className="ch-profile-aside">
              <div className="ch-avatar-card">
                <div className="ch-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
                  {user?.avatar
                    ? <img src={user.avatar} alt="Profile" />
                    : <span className="ch-avatar-initial">{user?.username?.charAt(0)?.toUpperCase() || "U"}</span>
                  }
                  <div className="ch-avatar-overlay">📷</div>
                </div>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleAvatarFilePick} style={{ display: "none" }} />
                <div className="ch-user-name">{user?.fullName || user?.username}</div>
                <div className="ch-user-email">{user?.email}</div>
                <span className="ch-user-badge">{user?.role || "Customer"}</span>
              </div>
              <nav className="ch-profile-nav">
                {navItems.map(item => (
                  <button key={item.key}
                    className={`ch-pnav-item${activeSection === item.key ? " active" : ""}`}
                    onClick={() => setActiveSection(item.key)}>
                    <span className="ch-pnav-icon">{item.icon}</span>{item.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* RIGHT MAIN */}
            <main className="ch-profile-main">

              {/* ── Overview ── */}
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
                          <button className="ch-btn-secondary" onClick={() => {
                            setIsEditing(false);
                            setEditForm({ fullName: user?.fullName || "", email: user?.email || "", phone: user?.phone || "", address: user?.address || "" });
                          }}>Cancel</button>
                          <button className="ch-btn-primary" onClick={handleEditSubmit} disabled={loading}>
                            <span>{loading ? "Saving…" : "Save Changes"}</span>
                          </button>
                        </div>
                    }
                  </div>
                  <div className="ch-info-card">
                    {!isEditing ? (
                      <div className="ch-info-grid">
                        {[
                          { label: "Username",       value: user?.username },
                          { label: "Full Name",      value: user?.fullName  || "—" },
                          { label: "Email Address",  value: user?.email     || "—" },
                          { label: "Phone Number",   value: user?.phone     || "—" },
                          { label: "Address",        value: user?.address   || "—", full: true },
                          { label: "Member Since",   value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "—" },
                          { label: "Account Status", badge: true },
                        ].map((item, i) => (
                          <div key={i} className={`ch-info-item${item.full ? " full" : ""}`}>
                            <span className="ch-info-label">{item.label}</span>
                            {item.badge ? <span className="ch-status-badge">Active</span> : <span className="ch-info-value">{item.value}</span>}
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

              {/* ── Security ── */}
              {activeSection === "security" && (
                <>
                  <div className="ch-section-head">
                    <div>
                      <div className="ch-section-title">Password &amp; Security</div>
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
                      <button type="submit" className="ch-btn-primary" disabled={loading} style={{ alignSelf: "flex-start" }}>
                        <span>{loading ? "Updating…" : "Update Password"}</span>
                      </button>
                    </form>
                  </div>
                </>
              )}

              {/* ── Notifications ── */}
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
                        { key: "emailOrders",      title: "Email Order Updates",  desc: "Get notified about your order status and delivery updates" },
                        { key: "emailPromotions",  title: "Promotional Emails",   desc: "Receive news about new products, special offers, and discounts" },
                        { key: "smsNotifications", title: "SMS Notifications",    desc: "Receive text messages for important account updates" },
                      ].map(item => (
                        <div key={item.key} className="ch-setting-item">
                          <div className="ch-setting-info"><h4>{item.title}</h4><p>{item.desc}</p></div>
                          <label className="ch-toggle">
                            <input type="checkbox" checked={notifications[item.key]}
                              onChange={() => { setNotifications(p => ({ ...p, [item.key]: !p[item.key] })); addToast("success", "Notification preferences saved!"); }} />
                            <span className="ch-toggle-track" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Privacy ── */}
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
                        { key: "profileVisible", title: "Public Profile",     desc: "Allow other users to view your profile information" },
                        { key: "showOrders",     title: "Show Order History", desc: "Allow others to see your order history on your profile" },
                      ].map(item => (
                        <div key={item.key} className="ch-setting-item">
                          <div className="ch-setting-info"><h4>{item.title}</h4><p>{item.desc}</p></div>
                          <label className="ch-toggle">
                            <input type="checkbox" checked={privacy[item.key]}
                              onChange={() => { setPrivacy(p => ({ ...p, [item.key]: !p[item.key] })); addToast("success", "Privacy settings updated!"); }} />
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
                      <button className="ch-danger-btn" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
                    </div>
                  </div>
                </>
              )}

            </main>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="ch-footer">
          <div className="ch-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>

        {/* Toasts */}
        <div className="ch-toast-container">
          {toasts.map(t => <ChToast key={t.id} toast={t} onClose={() => removeToast(t.id)} />)}
        </div>

        {/* Delete modal — pass full user object so the backend can look up by email or username */}
        {showDeleteModal && (
          <DeleteAccountModal
            user={user}
            onClose={() => setShowDeleteModal(false)}
            onDeleted={handleAccountDeleted}
          />
        )}

      </div>
    </>
  );
};

export default Profile;