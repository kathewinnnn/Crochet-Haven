import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
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
  .ch-header-inner { max-width: 1200px; margin: 0 auto; padding: 32px 60px; display: flex; align-items: center; justify-content: space-between; }
  .ch-logo-block { display: flex; align-items: center; gap: 16px; text-decoration: none; }
  .ch-logo-yarn { font-size: 2.2rem; animation: sway 4s ease-in-out infinite; display: inline-block; transform-origin: bottom center; }

  @keyframes sway {
    0%, 100% { transform: rotate(-4deg); }
    50% { transform: rotate(4deg); }
  }

  .ch-logo-text { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; color: var(--charcoal); line-height: 1; }
  .ch-logo-text span { color: var(--rose); }
  .ch-tagline { font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); margin-top: 5px; }

  .ch-nav-cta { display: inline-flex; align-items: center; padding: 12px 24px; background: var(--rose); color: #fff; text-decoration: none; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 2px; transition: background 0.2s ease, transform 0.2s ease; }
  .ch-nav-cta:hover { background: var(--deep-rose); transform: translateY(-1px); }

  /* ─── PAGE BANNER ─── */
  .ch-page-banner { position: relative; z-index: 1; background: var(--charcoal); padding: 48px 60px; overflow: hidden; text-align: center; }
  .ch-page-banner::after { content: ''; position: absolute; right: -80px; top: -80px; width: 360px; height: 360px; border-radius: 50%; background: radial-gradient(circle, rgba(232,114,138,0.15) 0%, transparent 70%); pointer-events: none; }
  .ch-banner-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .ch-banner-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--amber); font-weight: 700; margin-bottom: 14px; }
  .ch-banner-eyebrow::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--amber); }
  .ch-banner-title { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 800; color: var(--warm-white); line-height: 1.1; margin-bottom: 10px; letter-spacing: -0.02em; }
  .ch-banner-title em { font-style: italic; color: var(--blush); }
  .ch-banner-sub { font-size: 0.9rem; color: rgba(255,255,255,0.4); font-weight: 300; }

  /* ─── BODY ─── */
  .ch-orders-body { position: relative; z-index: 1; flex: 1; max-width: 1200px; margin: 0 auto; padding: 48px 60px 80px; width: 100%; }

  /* ─── TABS ─── */
  .ch-tabs { display: flex; gap: 8px; flex-wrap: wrap; background: var(--warm-white); padding: 8px; border-radius: 4px; border: 1px solid var(--border); margin-bottom: 28px; }
  .ch-tab { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border: 1px solid transparent; background: transparent; border-radius: 2px; font-family: 'Lato', sans-serif; font-size: 0.82rem; font-weight: 500; color: var(--muted); cursor: pointer; transition: all 0.2s ease; white-space: nowrap; }
  .ch-tab:hover { background: #fef9f5; color: var(--rose); border-color: var(--border); }
  .ch-tab.active { background: var(--charcoal); color: var(--cream); border-color: var(--charcoal); font-weight: 700; }
  .ch-tab-count { font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 10px; background: rgba(0,0,0,0.08); color: inherit; }
  .ch-tab.active .ch-tab-count { background: rgba(255,255,255,0.15); }

  /* ─── ORDER CARDS ─── */
  .ch-orders-list { display: flex; flex-direction: column; gap: 14px; }
  .ch-order-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; transition: box-shadow 0.2s ease; }
  .ch-order-card:hover { box-shadow: 0 8px 28px rgba(44,36,32,0.08); }
  .ch-order-head { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; cursor: pointer; background: var(--cream); border-bottom: 1px solid var(--border); transition: background 0.2s ease; }
  .ch-order-head:hover { background: #fef5f0; }
  .ch-order-id-group { display: flex; flex-direction: column; gap: 3px; }
  .ch-order-id { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: var(--charcoal); }
  .ch-order-date { font-size: 0.78rem; color: var(--muted); font-weight: 300; }
  .ch-order-status-group { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
  .ch-status-pill { padding: 5px 14px; border-radius: 2px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #fff; }
  .ch-order-eta { font-size: 0.75rem; color: var(--muted); font-weight: 300; }
  .ch-order-items { border-bottom: 1px solid var(--border); }
  .ch-order-item { display: flex; align-items: center; gap: 16px; padding: 16px 24px; border-bottom: 1px solid var(--border); }
  .ch-order-item:last-child { border-bottom: none; }
  .ch-item-img { width: 66px; height: 66px; border-radius: 4px; overflow: hidden; background: linear-gradient(145deg, #f7e8d8, #f0cfc4); flex-shrink: 0; }
  .ch-item-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ch-item-info { flex: 1; min-width: 0; }
  .ch-item-name { font-family: 'Playfair Display', serif; font-size: 0.92rem; font-weight: 600; color: var(--charcoal); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ch-item-meta { font-size: 0.78rem; color: var(--muted); font-weight: 300; }
  .ch-item-price { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: var(--rose); flex-shrink: 0; }
  .ch-order-foot { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: var(--cream); }
  .ch-order-total-row { display: flex; align-items: center; gap: 10px; }
  .ch-order-total-lbl { font-size: 0.82rem; color: var(--muted); }
  .ch-order-total-amt { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 800; color: var(--rose); }
  .ch-pay-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 2px; }
  .ch-pay-badge.paid { background: #d1fae5; color: #065f46; }
  .ch-pay-badge.refunded { background: #fee2e2; color: #991b1b; }
  .ch-pay-badge.pending { background: #fef3c7; color: #92400e; }
  .ch-order-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .ch-order-btn { padding: 9px 18px; border: 1px solid var(--border); border-radius: 2px; background: transparent; color: var(--muted); font-family: 'Lato', sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
  .ch-order-btn:hover { border-color: var(--rose); color: var(--rose); background: rgba(232,114,138,0.05); }
  .ch-order-btn.danger:hover { border-color: #dc2626; color: #dc2626; background: #fef2f2; }
  .ch-order-btn.primary { background: var(--rose); border-color: var(--rose); color: #fff; }
  .ch-order-btn.primary:hover { background: var(--deep-rose); border-color: var(--deep-rose); color: #fff; }

  /* Empty state */
  .ch-orders-empty { text-align: center; padding: 80px 40px; background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; }
  .ch-orders-empty-icon { font-size: 3.5rem; display: block; margin-bottom: 18px; }
  .ch-orders-empty h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--charcoal); margin-bottom: 8px; }
  .ch-orders-empty p { font-size: 0.88rem; color: var(--muted); font-weight: 300; }

  /* Loading */
  .ch-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; }
  .ch-spinner { width: 48px; height: 48px; border: 3px solid var(--border); border-top-color: var(--rose); border-radius: 50%; animation: ch-spin 0.9s linear infinite; }
  @keyframes ch-spin { to { transform: rotate(360deg); } }
  .ch-loading p { font-size: 0.9rem; color: var(--muted); }
  .ch-error-banner { padding: 14px 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; color: #991b1b; font-size: 0.88rem; margin-bottom: 20px; }

  /* Toast */
  .ch-toast-global { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 9999; padding: 12px 28px; border-radius: 2px; font-size: 0.88rem; font-weight: 700; letter-spacing: 0.06em; color: #fff; animation: ch-fade-up 0.3s ease; box-shadow: 0 8px 28px rgba(44,36,32,0.18); white-space: nowrap; }
  @keyframes ch-fade-up { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  .ch-toast-global.success { background: var(--sage); }
  .ch-toast-global.error { background: #ef4444; }
  .ch-toast-global.info { background: var(--charcoal); }

  /* ─── MODAL BASE ─── */
  .ch-modal-overlay { position: fixed; inset: 0; background: rgba(44,36,32,0.65); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; animation: ch-fade 0.2s ease; }
  @keyframes ch-fade { from { opacity: 0; } to { opacity: 1; } }
  .ch-modal { background: var(--warm-white); border-radius: 4px; padding: 40px 36px; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,0.22); animation: ch-modal-up 0.3s ease; }
  @keyframes ch-modal-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .ch-modal-icon { font-size: 2.5rem; display: block; margin-bottom: 14px; }
  .ch-modal-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 800; color: var(--charcoal); margin-bottom: 10px; }
  .ch-modal-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.7; margin-bottom: 28px; font-weight: 300; }
  .ch-modal-actions { display: flex; gap: 12px; justify-content: center; }
  .ch-modal-cancel { padding: 12px 26px; border: 1.5px solid var(--border); border-radius: 2px; background: transparent; color: var(--muted); font-family: 'Lato', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
  .ch-modal-cancel:hover { border-color: var(--muted); color: var(--charcoal); }
  .ch-modal-confirm { padding: 12px 26px; border: none; border-radius: 2px; background: #dc2626; color: #fff; font-family: 'Lato', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease; position: relative; overflow: hidden; }
  .ch-modal-confirm::after { content: ''; position: absolute; inset: 0; background: #b91c1c; transform: translateX(-100%); transition: transform 0.25s ease; z-index: 0; }
  .ch-modal-confirm:hover::after { transform: translateX(0); }
  .ch-modal-confirm span { position: relative; z-index: 1; }
  .ch-modal-confirm.primary-confirm { background: var(--rose); }
  .ch-modal-confirm.primary-confirm::after { background: var(--deep-rose); }

  /* ─── BUY AGAIN MODAL ─── */
  .ch-buyagain-modal { background: var(--warm-white); border-radius: 4px; max-width: 520px; width: 100%; box-shadow: 0 24px 60px rgba(0,0,0,0.22); animation: ch-modal-up 0.3s ease; overflow: hidden; }
  .ch-buyagain-header { padding: 24px 28px 18px; border-bottom: 1px solid var(--border); background: var(--cream); display: flex; align-items: center; gap: 12px; }
  .ch-buyagain-header-icon { font-size: 1.6rem; }
  .ch-buyagain-header-text h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 800; color: var(--charcoal); margin-bottom: 2px; }
  .ch-buyagain-header-text p { font-size: 0.76rem; color: var(--muted); font-weight: 300; }
  .ch-buyagain-items { max-height: 340px; overflow-y: auto; padding: 12px 0; }
  .ch-buyagain-item { display: flex; align-items: center; gap: 14px; padding: 12px 28px; transition: background 0.15s ease; }
  .ch-buyagain-item:hover { background: rgba(232,114,138,0.04); }
  .ch-buyagain-item-img { width: 54px; height: 54px; border-radius: 3px; overflow: hidden; background: linear-gradient(145deg, #f7e8d8, #f0cfc4); flex-shrink: 0; border: 1px solid var(--border); }
  .ch-buyagain-item-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ch-buyagain-item-info { flex: 1; min-width: 0; }
  .ch-buyagain-item-name { font-family: 'Playfair Display', serif; font-size: 0.88rem; font-weight: 600; color: var(--charcoal); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ch-buyagain-item-desc { font-size: 0.72rem; color: var(--muted); font-weight: 300; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ch-buyagain-item-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .ch-buyagain-item-price { font-size: 0.78rem; color: var(--rose); font-weight: 700; }
  .ch-buyagain-item-cat { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--terracotta); border: 1px solid rgba(212,115,94,0.3); padding: 2px 7px; border-radius: 2px; white-space: nowrap; }
  .ch-buyagain-item-add { padding: 7px 14px; background: var(--rose); border: none; border-radius: 2px; color: #fff; font-family: 'Lato', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease; flex-shrink: 0; white-space: nowrap; }
  .ch-buyagain-item-add:hover { background: var(--deep-rose); }
  .ch-buyagain-item-add.added { background: var(--sage); cursor: default; }
  .ch-buyagain-footer { padding: 16px 28px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; background: var(--cream); }
  .ch-buyagain-add-all { padding: 11px 22px; background: var(--charcoal); border: none; border-radius: 2px; color: #fff; font-family: 'Lato', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease; }
  .ch-buyagain-add-all:hover { background: #1a1210; }
  .ch-buyagain-go-cart { padding: 11px 22px; background: var(--rose); border: none; border-radius: 2px; color: #fff; font-family: 'Lato', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease; }
  .ch-buyagain-go-cart:hover { background: var(--deep-rose); }
  .ch-buyagain-dismiss { padding: 11px 22px; background: transparent; border: 1.5px solid var(--border); border-radius: 2px; color: var(--muted); font-family: 'Lato', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
  .ch-buyagain-dismiss:hover { border-color: var(--muted); color: var(--charcoal); }

  /* ─── CONTACT SELLER MODAL ─── */
  .ch-chat-modal { background: var(--warm-white); border-radius: 4px; max-width: 480px; width: 100%; box-shadow: 0 24px 60px rgba(0,0,0,0.22); animation: ch-modal-up 0.3s ease; overflow: hidden; display: flex; flex-direction: column; max-height: 85vh; }
  .ch-chat-header { padding: 18px 22px; background: var(--charcoal); display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .ch-chat-seller-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--rose); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
  .ch-chat-seller-info { flex: 1; }
  .ch-chat-seller-name { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: var(--warm-white); margin-bottom: 1px; }
  .ch-chat-seller-status { font-size: 0.7rem; color: var(--sage); font-weight: 400; display: flex; align-items: center; gap: 5px; }
  .ch-chat-seller-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--sage); display: inline-block; }
  .ch-chat-close { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 1.4rem; cursor: pointer; padding: 0; line-height: 1; transition: color 0.15s ease; }
  .ch-chat-close:hover { color: #fff; }
  .ch-chat-order-ref { padding: 10px 16px; background: rgba(212,115,94,0.08); border-bottom: 1px solid var(--border); font-size: 0.74rem; color: var(--muted); display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .ch-chat-order-ref strong { color: var(--terracotta); font-weight: 700; }
  .ch-chat-messages { flex: 1; overflow-y: auto; padding: 18px 16px; display: flex; flex-direction: column; gap: 12px; min-height: 240px; }
  .ch-chat-msg { display: flex; flex-direction: column; max-width: 78%; }
  .ch-chat-msg.seller { align-self: flex-start; }
  .ch-chat-msg.buyer { align-self: flex-end; }
  .ch-chat-bubble { padding: 10px 14px; border-radius: 12px; font-size: 0.82rem; line-height: 1.55; font-weight: 400; }
  .ch-chat-msg.seller .ch-chat-bubble { background: var(--cream); border: 1px solid var(--border); color: var(--charcoal); border-bottom-left-radius: 4px; }
  .ch-chat-msg.buyer .ch-chat-bubble { background: var(--rose); color: #fff; border-bottom-right-radius: 4px; }
  .ch-chat-time { font-size: 0.65rem; color: var(--muted); margin-top: 4px; padding: 0 2px; }
  .ch-chat-msg.buyer .ch-chat-time { text-align: right; }
  .ch-chat-quick-replies { padding: 8px 16px 4px; display: flex; gap: 8px; flex-wrap: wrap; border-top: 1px solid var(--border); flex-shrink: 0; }
  .ch-chat-quick-reply { padding: 6px 12px; background: transparent; border: 1px solid var(--border); border-radius: 100px; font-family: 'Lato', sans-serif; font-size: 0.7rem; color: var(--muted); cursor: pointer; transition: all 0.15s ease; white-space: nowrap; }
  .ch-chat-quick-reply:hover { border-color: var(--rose); color: var(--rose); background: rgba(232,114,138,0.05); }
  .ch-chat-input-row { padding: 12px 16px; display: flex; gap: 10px; border-top: 1px solid var(--border); flex-shrink: 0; background: var(--warm-white); }
  .ch-chat-input { flex: 1; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 100px; background: var(--cream); font-family: 'Lato', sans-serif; font-size: 0.82rem; color: var(--charcoal); outline: none; transition: border-color 0.2s ease; }
  .ch-chat-input:focus { border-color: var(--rose); }
  .ch-chat-input::placeholder { color: var(--muted); }
  .ch-chat-send { width: 40px; height: 40px; background: var(--rose); border: none; border-radius: 50%; color: #fff; font-size: 1rem; cursor: pointer; transition: background 0.2s ease, transform 0.15s ease; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ch-chat-send:hover { background: var(--deep-rose); transform: scale(1.05); }
  .ch-chat-send:disabled { background: var(--border); cursor: default; transform: none; }

  /* ─── FOOTER ─── */
  .ch-footer { position: relative; z-index: 1; background: var(--warm-white); border-top: 1px solid var(--border); padding: 32px 60px; display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
  .ch-footer-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--charcoal); display: flex; align-items: center; gap: 8px; }
  .ch-footer-copy { font-size: 0.78rem; color: var(--muted); letter-spacing: 0.04em; }

  /* ─── Responsive ─── */
  @media (max-width: 900px) {
    .ch-page { margin-left: 0; }
    .ch-header-inner { padding: 24px 30px; }
    .ch-page-banner { padding: 40px 30px; }
    .ch-banner-title { font-size: 2rem; }
    .ch-orders-body { padding: 36px 30px 60px; }
    .ch-tabs { flex-wrap: nowrap; overflow-x: auto; }
    .ch-tab { flex-shrink: 0; }
    .ch-order-head { flex-direction: column; align-items: flex-start; gap: 10px; }
    .ch-order-foot { flex-direction: column; gap: 14px; align-items: flex-start; }
    .ch-order-actions { flex-wrap: wrap; }
    .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 28px 30px; }
    .ch-buyagain-modal, .ch-chat-modal { max-width: 100%; }
  }

  @media (max-width: 580px) {
    .ch-order-item { flex-wrap: wrap; }
    .ch-item-img { width: 56px; height: 56px; }
  }
`;

// ─── Buy Again Modal ───────────────────────────────────────────────────────────
// ✅ Receives the full products map from the parent (fetched once on mount)
// so description + category are always available when adding to cart.
const BuyAgainModal = ({ order, onClose, onAddedToCart, navigate, addToCart, productsMap }) => {
  const [addedKeys, setAddedKeys] = useState(new Set());
  const [allAdded, setAllAdded] = useState(false);

  const fmt = (p) => `₱${parseFloat(p).toFixed(2)}`;
  const itemKey = (item, i) => `${item.id}-${i}`;

  const addItemToCart = (item, i) => {
    // ✅ Merge order item with full product data from productsMap.
    // This guarantees Cart.jsx always gets description + category.
    const product = productsMap[item.id] || {};

    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      selectedImage: item.selectedImage || item.image || null,
      description: product.description || "",
      category: product.category || "",
      addedAt: Date.now(),
    };

    addToCart(cartItem);
    setAddedKeys(prev => new Set([...prev, itemKey(item, i)]));
  };

  const addAllToCart = () => {
    order.items.forEach((item, i) => addItemToCart(item, i));
    setAllAdded(true);
    onAddedToCart(order.items.length);
  };

  const goToCart = () => {
    onClose();
    navigate("/user/cart");
  };

  return (
    <div className="ch-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ch-buyagain-modal">
        <div className="ch-buyagain-header">
          <span className="ch-buyagain-header-icon">🛒</span>
          <div className="ch-buyagain-header-text">
            <h3>Buy Again</h3>
            <p>Select items to add back to your cart</p>
          </div>
        </div>

        <div className="ch-buyagain-items">
          {order.items.map((item, i) => {
            const key = itemKey(item, i);
            const isAdded = addedKeys.has(key) || allAdded;
            const imgSrc = item.selectedImage || item.image || null;
            const product = productsMap[item.id] || {};
            return (
              <div key={i} className="ch-buyagain-item">
                <div className="ch-buyagain-item-img">
                  <img
                    src={imgSrc}
                    alt={item.name}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='54' height='54'%3E%3Crect fill='%23f7e8d8' width='54' height='54'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20'%3E🧶%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="ch-buyagain-item-info">
                  <div className="ch-buyagain-item-name">{item.name}</div>
                  {/* ✅ Description shown just like Cart.jsx */}
                  {product.description && (
                    <div className="ch-buyagain-item-desc">{product.description}</div>
                  )}
                  <div className="ch-buyagain-item-meta">
                    <span className="ch-buyagain-item-price">{fmt(item.price)} × {item.quantity}</span>
                    {/* ✅ Category badge shown just like Cart.jsx */}
                    {product.category && (
                      <span className="ch-buyagain-item-cat">{product.category}</span>
                    )}
                  </div>
                </div>
                <button
                  className={`ch-buyagain-item-add${isAdded ? " added" : ""}`}
                  onClick={() => { if (!isAdded) addItemToCart(item, i); }}
                  disabled={isAdded}
                >
                  {isAdded ? "✓ Added" : "+ Add"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="ch-buyagain-footer">
          <button className="ch-buyagain-dismiss" onClick={onClose}>Close</button>
          {(addedKeys.size > 0 || allAdded) ? (
            <button className="ch-buyagain-go-cart" onClick={goToCart}>Go to Cart →</button>
          ) : (
            <button className="ch-buyagain-add-all" onClick={addAllToCart}>Add All to Cart</button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Contact Seller Modal ──────────────────────────────────────────────────────
const SELLER_NAME = "Crochet Haven";
const QUICK_REPLIES = [
  "Where is my order?",
  "When will it be shipped?",
  "Can I change my address?",
  "Is this item still available?",
];

const AUTO_RESPONSES = {
  "where is my order": "Hi there! 🌸 Your order is currently being carefully prepared by our team. You'll receive a shipping notification with tracking details once it's on its way!",
  "when will it be shipped": "We typically process and ship orders within 1–3 business days. You'll get an email with tracking info as soon as it ships! 📦",
  "can i change my address": "We can update your address if the order hasn't shipped yet! Please share your new address and we'll do our best to accommodate you. 🏠",
  "is this item still available": "Great taste! 🧶 Our crochet items are handmade, so availability can change. Let me check on that for you — it may take a moment!",
};

const getAutoResponse = (msg) => {
  const lower = msg.toLowerCase();
  for (const key of Object.keys(AUTO_RESPONSES)) {
    if (lower.includes(key.split(" ")[0]) || lower === key) return AUTO_RESPONSES[key];
  }
  return "Thank you for reaching out! 💕 Our team will get back to you shortly. We usually respond within a few hours during business hours (9am–6pm).";
};

const ContactSellerModal = ({ order, onClose }) => {
  const [messages, setMessages] = useState([
    { type: "seller", text: `Hello! 👋 Welcome to Crochet Haven. How can I help you with your order ${order.id}?`, time: "Just now" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages, typing]);

  const now = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { type: "buyer", text: msg, time: now() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { type: "seller", text: getAutoResponse(msg), time: now() }]);
    }, 1000 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="ch-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ch-chat-modal">
        <div className="ch-chat-header">
          <div className="ch-chat-seller-avatar">🧶</div>
          <div className="ch-chat-seller-info">
            <div className="ch-chat-seller-name">{SELLER_NAME}</div>
            <div className="ch-chat-seller-status">Active now</div>
          </div>
          <button className="ch-chat-close" onClick={onClose}>×</button>
        </div>
        <div className="ch-chat-order-ref">
          📦 Regarding order <strong>{order.id}</strong> · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </div>
        <div className="ch-chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`ch-chat-msg ${m.type}`}>
              <div className="ch-chat-bubble">{m.text}</div>
              <div className="ch-chat-time">{m.time}</div>
            </div>
          ))}
          {typing && (
            <div className="ch-chat-msg seller">
              <div className="ch-chat-bubble" style={{ padding: "12px 16px" }}>
                <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--muted)", display: "inline-block", animation: `bounce-dot 1s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="ch-chat-quick-replies">
          {QUICK_REPLIES.map((r, i) => (
            <button key={i} className="ch-chat-quick-reply" onClick={() => sendMessage(r)}>{r}</button>
          ))}
        </div>
        <div className="ch-chat-input-row">
          <input className="ch-chat-input" type="text" placeholder="Type a message…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
          <button className="ch-chat-send" onClick={() => sendMessage()} disabled={!input.trim()}>➤</button>
        </div>
      </div>
      <style>{`@keyframes bounce-dot { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-5px); opacity: 1; } }`}</style>
    </div>
  );
};

// ─── Main Orders Component ─────────────────────────────────────────────────────
const Orders = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [cancelModal, setCancelModal] = useState({ show: false, displayId: null, backendId: null });
  const [buyAgainModal, setBuyAgainModal] = useState({ show: false, order: null });
  const [contactModal, setContactModal] = useState({ show: false, order: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // ✅ Fetch all products once on mount and store as a map { id → product }
  // so BuyAgainModal always has description + category without extra per-open fetches.
  const [productsMap, setProductsMap] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchProductsMap();

    const onUpdate = () => fetchOrders();
    const onStorage = (e) => { if (e.key === 'ordersUpdatedAt') fetchOrders(); };
    window.addEventListener('ordersUpdated', onUpdate);
    window.addEventListener('storage', onStorage);
    return () => { window.removeEventListener('ordersUpdated', onUpdate); window.removeEventListener('storage', onStorage); };
  }, []);

  // ✅ Single request for all products, converted into a lookup map by id
  const fetchProductsMap = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) return;
      const data = await res.json();
      const map = {};
      data.forEach(p => { map[p.id] = p; });
      setProductsMap(map);
    } catch {
      // Non-critical — cart items will just lack description/category if this fails
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined }
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();

      const mapped = data
        .map(order => {
          const trackStatus = order.tracking?.status || null;
          const uiStatus = trackStatus === 'out_for_delivery' ? 'out_for_delivery' : mapStatus(order.status);
          let eta = order.estimatedDelivery || null;
          if (!eta && uiStatus === 'to_receive') { const d = new Date(order.createdAt); d.setDate(d.getDate() + 5); eta = d.toISOString(); }
          if (!eta && uiStatus === 'out_for_delivery') eta = new Date().toISOString();

          return {
            id: `ORD-${new Date(order.createdAt).getFullYear()}-${order.id.slice(-3).padStart(3, '0')}`,
            backendId: order.id,
            date: order.createdAt.split('T')[0],
            createdAt: order.createdAt,
            status: uiStatus,
            tracking: order.tracking || null,
            estimatedDelivery: eta,
            paymentMethod: order.paymentMethod,
            total: order.total,
            items: order.items.map(i => ({
              id: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              selectedImage: i.selectedImage || null,
              image: i.selectedImage || null,
            }))
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(mapped);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (s) => ({ "Pending": "to_ship", "Processing": "to_ship", "Shipped": "to_receive", "Delivered": "completed", "Cancelled": "cancelled" }[s] || "to_ship");
  const statusLabel = (s) => ({ to_pay: "To Pay", to_ship: "To Ship", to_receive: "To Receive", out_for_delivery: "Out for Delivery", completed: "Completed", cancelled: "Cancelled" }[s] || s);
  const statusColor = (s) => ({ to_pay: "#e8a45a", to_ship: "#3b82f6", to_receive: "#8b5cf6", out_for_delivery: "#d4735e", completed: "#8aab8e", cancelled: "#8a7a74" }[s] || "#8a7a74");

  const fmt = (p) => `₱${parseFloat(p).toFixed(2)}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  const filtered = useCallback(() => {
    if (activeTab === "all") return orders;
    return orders.filter(o => o.status === activeTab);
  }, [orders, activeTab])();

  const tabCounts = {
    all: orders.filter(o => o.status !== "cancelled").length,
    to_pay: orders.filter(o => o.status === "to_pay").length,
    to_ship: orders.filter(o => o.status === "to_ship").length,
    to_receive: orders.filter(o => o.status === "to_receive").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3500);
  };

  const confirmCancel = async () => {
    const { displayId, backendId } = cancelModal;
    setCancelModal({ show: false, displayId: null, backendId: null });
    try {
      const token = localStorage.getItem('token');
      let ok = false;
      if (backendId) {
        const res = await fetch(`${API_BASE_URL}/orders/${backendId}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined }
        }).catch(() => {});
        if (res?.ok) ok = true;
      }
      if (ok) {
        setOrders(p => p.map(o => o.backendId === backendId ? { ...o, status: 'cancelled' } : o));
        try { localStorage.setItem('ordersUpdatedAt', String(Date.now())); } catch {}
        window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: { backendId } }));
        showToast('Order cancelled successfully', 'success');
      } else {
        setOrders(p => p.map(o => (backendId ? o.backendId === backendId : o.id === displayId) ? { ...o, status: 'cancelled' } : o));
        showToast('Order cancellation queued', 'info');
      }
    } catch {
      showToast('Failed to cancel order', 'error');
    }
  };

  const tabs = [
    { key: "all", label: "All Orders" },
    { key: "to_pay", label: "To Pay" },
    { key: "to_ship", label: "To Ship" },
    { key: "to_receive", label: "To Receive" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="ch-page">
        <div className="ch-loading"><div className="ch-spinner" /><p>Loading your orders…</p></div>
      </div>
    </>
  );

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
            <Link to="/user/products" className="ch-nav-cta">Shop →</Link>
          </div>
        </header>

        <div className="ch-page-banner">
          <div className="ch-banner-inner">
            <p className="ch-banner-eyebrow">Your Account</p>
            <h1 className="ch-banner-title"><em>My</em> Orders</h1>
            <p className="ch-banner-sub">Track and manage all your crochet purchases</p>
          </div>
        </div>

        <div className="ch-orders-body">
          {error && <div className="ch-error-banner">{error}</div>}

          <div className="ch-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`ch-tab${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>
                {t.label}
                <span className="ch-tab-count">{tabCounts[t.key]}</span>
              </button>
            ))}
          </div>

          <div className="ch-orders-list">
            {filtered.length === 0 ? (
              <div className="ch-orders-empty">
                <span className="ch-orders-empty-icon">📦</span>
                <h3>{activeTab === "all" ? "No orders yet" : `No ${statusLabel(activeTab).toLowerCase()} orders`}</h3>
                <p>{activeTab === "all" ? "Complete a checkout to see your orders here" : `You don't have any ${statusLabel(activeTab).toLowerCase()} orders at the moment`}</p>
              </div>
            ) : filtered.map(order => (
              <div key={order.id} className="ch-order-card">
                <div className="ch-order-head">
                  <div className="ch-order-id-group">
                    <span className="ch-order-id">{order.id}</span>
                    <span className="ch-order-date">{fmtDate(order.date)}</span>
                  </div>
                  <div className="ch-order-status-group">
                    <span className="ch-status-pill" style={{ backgroundColor: statusColor(order.status) }}>{statusLabel(order.status)}</span>
                    {(order.paymentMethod === 'gcash' || order.paymentMethod === 'paymaya' || order.paymentMethod === 'card') && (
                      <span className="ch-pay-badge paid">Paid</span>
                    )}
                    {(order.status === 'to_receive' || order.status === 'out_for_delivery') && order.estimatedDelivery && (
                      <span className="ch-order-eta">
                        {order.status === 'out_for_delivery' ? `Out for delivery — ${fmtDate(order.estimatedDelivery)}` : `Est. delivery: ${fmtDate(order.estimatedDelivery)}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="ch-order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="ch-order-item">
                      <div className="ch-item-img">
                        <img src={item.image} alt={item.name}
                          onError={e => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='66' height='66'%3E%3Crect fill='%23f7e8d8' width='66' height='66'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='22'%3E📦%3C/text%3E%3C/svg%3E"; }} />
                      </div>
                      <div className="ch-item-info">
                        <div className="ch-item-name">{item.name}</div>
                        <div className="ch-item-meta">Qty: {item.quantity} × {fmt(item.price)}</div>
                      </div>
                      <div className="ch-item-price">{fmt(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div className="ch-order-foot">
                  <div className="ch-order-total-row">
                    <span className="ch-order-total-lbl">Total:</span>
                    <span className="ch-order-total-amt">{fmt(order.total)}</span>
                    <span className={`ch-pay-badge ${order.paymentStatus}`}>
                      {order.paymentStatus === "paid" ? "Paid" : order.paymentStatus === "refunded" ? "Refunded" : "Pending"}
                    </span>
                  </div>
                  <div className="ch-order-actions">
                    {order.status === "completed" && (
                      <button className="ch-order-btn primary" onClick={() => setBuyAgainModal({ show: true, order })}>
                        🛒 Buy Again
                      </button>
                    )}
                    {(order.status === "to_ship" || order.status === "to_receive") && order.tracking && (
                      <button className="ch-order-btn">Track Order</button>
                    )}
                    {(order.status === "to_ship" || order.status === "to_receive") && (
                      <button className="ch-order-btn" onClick={() => setContactModal({ show: true, order })}>
                        💬 Contact Seller
                      </button>
                    )}
                    {(order.status === "to_ship" || order.status === "to_pay") && (
                      <button className="ch-order-btn danger" onClick={e => { e.stopPropagation(); setCancelModal({ show: true, displayId: order.id, backendId: order.backendId }); }}>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="ch-footer">
          <div className="ch-footer-logo">🧶 Crochet Haven</div>
          <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
        </footer>

        {/* Cancel Modal */}
        {cancelModal.show && (
          <div className="ch-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setCancelModal({ show: false, displayId: null, backendId: null }); }}>
            <div className="ch-modal">
              <span className="ch-modal-icon">🗑️</span>
              <div className="ch-modal-title">Cancel Order</div>
              <div className="ch-modal-desc">Are you sure you want to cancel this order? This action cannot be undone.</div>
              <div className="ch-modal-actions">
                <button className="ch-modal-cancel" onClick={() => setCancelModal({ show: false, displayId: null, backendId: null })}>Keep Order</button>
                <button className="ch-modal-confirm" onClick={confirmCancel}><span>Cancel Order</span></button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ productsMap passed in — description + category available immediately, no per-open fetch */}
        {buyAgainModal.show && buyAgainModal.order && (
          <BuyAgainModal
            order={buyAgainModal.order}
            onClose={() => setBuyAgainModal({ show: false, order: null })}
            onAddedToCart={(count) => showToast(`${count} item${count !== 1 ? "s" : ""} added to cart! 🛒`, "success")}
            navigate={navigate}
            addToCart={addToCart}
            productsMap={productsMap}
          />
        )}

        {contactModal.show && contactModal.order && (
          <ContactSellerModal order={contactModal.order} onClose={() => setContactModal({ show: false, order: null })} />
        )}

        {toast.show && <div className={`ch-toast-global ${toast.type}`}>{toast.message}</div>}
      </div>
    </>
  );
};

export default Orders;