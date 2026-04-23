import React, { useState, useEffect, useCallback } from "react";
import DeleteConfirmModal from './DeleteConfirmModal';
import API_BASE_URL from '../../apiConfig';

const orderStyles = `
  :root {
    --cream: #fdf6ec; --warm-white: #fffbf5; --blush: #f4a7b2;
    --rose: #e8728a; --deep-rose: #c4556b; --terracotta: #d4735e;
    --amber: #e8a45a; --sage: #8aab8e; --charcoal: #2c2420;
    --muted: #8a7a74; --border: rgba(212,115,94,0.15);
  }
  .ch-orders-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: .7rem; letter-spacing: .24em; text-transform: uppercase; color: var(--terracotta); font-weight: 700; margin-bottom: 8px; }
  .ch-orders-eyebrow::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--terracotta); }
  .ch-orders-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800; color: var(--charcoal); letter-spacing: -.03em; line-height: 1.1; margin-bottom: 24px; }
  .ch-orders-title em { font-style: italic; color: var(--rose); }

  .ch-notification { position: fixed; top: 24px; right: 24px; background: var(--charcoal); color: #fff; border-radius: 6px; padding: 16px 18px; min-width: 280px; max-width: 360px; display: flex; align-items: flex-start; gap: 12px; box-shadow: 0 20px 60px rgba(44,36,32,.3); z-index: 9990; border-left: 4px solid var(--rose); animation: slideInRight .3s ease; }
  @keyframes slideInRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
  .ch-notification-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 1px; }
  .ch-notification-body h4 { font-family: 'Playfair Display', serif; font-size: .9rem; font-weight: 700; color: var(--amber); margin-bottom: 3px; }
  .ch-notification-body p { font-size: .77rem; color: rgba(255,255,255,.75); line-height: 1.5; font-weight: 300; margin: 0; }
  .ch-notification-close { background: none; border: none; color: rgba(255,255,255,.5); font-size: 1.1rem; cursor: pointer; margin-left: auto; padding: 0; line-height: 1; flex-shrink: 0; transition: color .15s; }
  .ch-notification-close:hover { color: #fff; }

  .ch-order-filters { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 24px; }
  .ch-filter-btn { padding: 7px 16px; background: transparent; border: 1.5px solid var(--border); border-radius: 100px; color: var(--muted); font-family: 'Lato',sans-serif; font-size: .73rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: all .18s; }
  .ch-filter-btn:hover { border-color: var(--rose); color: var(--rose); }
  .ch-filter-btn.active { background: var(--charcoal); border-color: var(--charcoal); color: #fff; }

  .ch-orders-table-wrap { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 28px; overflow-x: auto; }
  .ch-orders-table { width: 100%; border-collapse: collapse; min-width: 700px; }
  .ch-orders-table thead tr { background: rgba(253,246,236,.8); }
  .ch-orders-table th { text-align: left; padding: 11px 16px; font-size: .61rem; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); font-weight: 700; border-bottom: 1px solid var(--border); white-space: nowrap; }
  .ch-orders-table tbody tr { border-bottom: 1px solid rgba(212,115,94,.07); transition: background .14s; }
  .ch-orders-table tbody tr:last-child { border-bottom: none; }
  .ch-orders-table tbody tr:hover { background: rgba(253,246,236,.5); }
  .ch-orders-table td { padding: 12px 16px; font-size: .81rem; color: var(--charcoal); vertical-align: middle; }
  .ch-order-id { font-family: 'Playfair Display', serif; font-weight: 700; font-size: .86rem; }
  .ch-order-thumb { width: 42px; height: 42px; border-radius: 3px; object-fit: cover; border: 1px solid var(--border); display: block; }
  .ch-no-img { width: 42px; height: 42px; border-radius: 3px; background: rgba(212,115,94,.07); display: flex; align-items: center; justify-content: center; font-size: .63rem; color: var(--muted); text-align: center; line-height: 1.2; }
  .ch-customer-block strong { display: block; font-weight: 700; font-size: .82rem; margin-bottom: 2px; }
  .ch-customer-block span { display: block; font-size: .7rem; color: var(--muted); font-weight: 300; line-height: 1.4; }
  .ch-product-item-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; font-size: .79rem; }
  .ch-item-qty { color: var(--muted); font-size: .74rem; }
  .ch-item-price { font-family: 'Playfair Display', serif; font-weight: 600; font-size: .8rem; }
  .ch-item-sub { color: var(--rose); font-size: .71rem; font-weight: 700; }
  .ch-order-total { font-family: 'Playfair Display', serif; font-weight: 700; font-size: .9rem; }
  .ch-order-date { font-size: .74rem; color: var(--muted); font-weight: 300; white-space: nowrap; }
  .ch-order-note { font-size: .74rem; color: var(--muted); font-style: italic; font-weight: 300; max-width: 130px; }
  .ch-status-badge { display: inline-block; padding: 3px 9px; border-radius: 2px; font-size: .63rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; white-space: nowrap; }
  .ch-status-pending { background: rgba(232,164,90,.15); color: var(--amber); }
  .ch-status-processing { background: rgba(138,171,142,.15); color: var(--sage); }
  .ch-status-shipped { background: rgba(100,120,200,.13); color: #5b6fa8; }
   .ch-status-delivered { background: rgba(138,171,142,.2); color: #4a8a50; }
   .ch-status-confirmed { background: rgba(138,171,142,.35); color: #2d6a30; border: 1px solid rgba(138,171,142,.5); }
   .ch-status-cancelled { background: rgba(192,57,43,.1); color: #c0392b; }
  .ch-payment-badge { display: inline-block; padding: 3px 7px; border-radius: 2px; font-size: .6rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; }
  .ch-payment-paid { background: rgba(16,185,129,.15); color: #10b981; }
  .ch-payment-unpaid { background: rgba(245,158,11,.15); color: #f59e0b; }
  .ch-status-select { padding: 6px 9px; border: 1.5px solid var(--border); border-radius: 3px; background: var(--cream); color: var(--charcoal); font-family: 'Lato',sans-serif; font-size: .74rem; cursor: pointer; outline: none; transition: border-color .15s; min-width: 120px; }
  .ch-status-select:focus { border-color: var(--rose); }
  .ch-delete-btn { padding: 6px 12px; background: #c0392b; color: #fff; border: none; border-radius: 3px; font-family: 'Lato',sans-serif; font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: background .18s; }
  .ch-delete-btn:hover { background: #a93226; }

  .ch-order-accordion { display: none; flex-direction: column; gap: 10px; margin-bottom: 28px; }
  .ch-acc-item { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
  .ch-acc-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; background: rgba(253,246,236,.5); border-bottom: 1px solid transparent; transition: background .15s; user-select: none; }
  .ch-acc-header:hover { background: rgba(253,246,236,.9); }
  .ch-acc-item.open .ch-acc-header { border-bottom-color: var(--border); background: rgba(253,246,236,.85); }
  .ch-acc-order-id { font-family: 'Playfair Display', serif; font-weight: 700; font-size: .9rem; color: var(--charcoal); flex-shrink: 0; }
  .ch-acc-customer { font-size: .8rem; color: var(--muted); font-weight: 300; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ch-acc-meta { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .ch-acc-total { font-family: 'Playfair Display', serif; font-weight: 700; font-size: .86rem; color: var(--charcoal); white-space: nowrap; }
  .ch-acc-chevron { width: 26px; height: 26px; border-radius: 50%; background: rgba(212,115,94,.08); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: .65rem; color: var(--muted); flex-shrink: 0; transition: transform .25s ease, background .18s, color .18s; }
  .ch-acc-item.open .ch-acc-chevron { transform: rotate(180deg); background: var(--rose); color: #fff; border-color: var(--rose); }
  .ch-acc-body { max-height: 0; overflow: hidden; transition: max-height .35s cubic-bezier(0.4,0,0.2,1); }
  .ch-acc-item.open .ch-acc-body { max-height: 1000px; }
  .ch-acc-body-inner { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
  .ch-acc-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
  .ch-acc-info-row { display: flex; flex-direction: column; gap: 2px; }
  .ch-acc-info-label { font-size: .62rem; letter-spacing: .15em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  .ch-acc-info-value { font-size: .81rem; color: var(--charcoal); font-weight: 400; }
  .ch-acc-items-title { font-size: .65rem; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); font-weight: 700; margin-bottom: 8px; }
  .ch-acc-items-list { display: flex; flex-direction: column; gap: 8px; }
  .ch-acc-item-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: rgba(253,246,236,.5); border: 1px solid var(--border); border-radius: 3px; }
  .ch-acc-item-thumb { width: 44px; height: 44px; border-radius: 3px; object-fit: cover; border: 1px solid var(--border); flex-shrink: 0; display: block; }
  .ch-acc-item-no-img { width: 44px; height: 44px; border-radius: 3px; background: rgba(212,115,94,.07); display: flex; align-items: center; justify-content: center; font-size: .6rem; color: var(--muted); text-align: center; line-height: 1.3; flex-shrink: 0; }
  .ch-acc-item-info { flex: 1; min-width: 0; }
  .ch-acc-item-name { font-size: .82rem; font-weight: 600; color: var(--charcoal); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
  .ch-acc-item-sub { font-size: .73rem; color: var(--muted); font-weight: 300; }
  .ch-acc-item-subtotal { font-family: 'Playfair Display', serif; font-weight: 700; font-size: .86rem; color: var(--charcoal); white-space: nowrap; flex-shrink: 0; }
  .ch-acc-total-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(232,114,138,.05); border: 1px solid rgba(232,114,138,.15); border-radius: 3px; }
  .ch-acc-total-label { font-size: .72rem; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  .ch-acc-total-value { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1rem; color: var(--rose); }
  .ch-acc-actions { display: flex; align-items: center; gap: 10px; padding-top: 12px; border-top: 1px solid var(--border); }
  .ch-acc-actions-label { font-size: .65rem; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); font-weight: 700; flex-shrink: 0; }

  .ch-order-cards { display: none; flex-direction: column; gap: 14px; }
  .ch-order-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
  .ch-order-card-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border); background: rgba(253,246,236,.6); }
  .ch-order-card-id { font-family: 'Playfair Display', serif; font-size: .93rem; font-weight: 700; color: var(--charcoal); }
  .ch-order-card-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 7px; font-size: .81rem; }
  .ch-order-card-body p { margin: 0; color: var(--charcoal); }
  .ch-order-card-body p span { color: var(--muted); font-weight: 300; }
  .ch-order-items-preview { border-top: 1px solid var(--border); padding-top: 9px; margin-top: 3px; display: flex; flex-direction: column; gap: 5px; }
  .ch-order-item-line { display: flex; justify-content: space-between; align-items: center; font-size: .77rem; gap: 8px; }
  .ch-order-item-info { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
  .ch-order-item-info span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ch-order-thumb-sm { width: 36px; height: 36px; border-radius: 3px; object-fit: cover; border: 1px solid var(--border); display: block; flex-shrink: 0; }
  .ch-no-img-sm { width: 36px; height: 36px; border-radius: 3px; background: rgba(212,115,94,.07); display: flex; align-items: center; justify-content: center; font-size: .55rem; color: var(--muted); text-align: center; line-height: 1.2; flex-shrink: 0; }
  .ch-order-item-line span:last-child { font-family: 'Playfair Display',serif; font-weight: 600; white-space: nowrap; }
  .ch-order-card-actions { padding: 12px 16px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
  .ch-order-card-actions label { font-size: .68rem; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); font-weight: 700; }

  .ch-orders-empty { padding: 52px 24px; text-align: center; color: var(--muted); }
  .ch-orders-empty-emoji { font-size: 2.8rem; display: block; margin-bottom: 10px; opacity: .4; }
  .ch-orders-empty p { font-size: .85rem; margin: 6px 0 0; }

  .ch-orders-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 260px; gap: 14px; color: var(--muted); font-size: .83rem; }
  .ch-orders-loader { width: 32px; height: 32px; border: 2.5px solid rgba(232,114,138,.2); border-top-color: var(--rose); border-radius: 50%; animation: oSpin .8s linear infinite; }
  @keyframes oSpin { to { transform: rotate(360deg); } }

  .ch-error-box { background: rgba(192,57,43,.07); border: 1px solid rgba(192,57,43,.2); border-radius: 4px; padding: 16px 20px; margin-bottom: 20px; color: #c0392b; font-size: .82rem; display: flex; align-items: center; gap: 10px; }

  .ch-modal-backdrop { position: fixed; inset: 0; background: rgba(44,36,32,.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9998; padding: 16px; }
  .ch-modal-box { background: var(--warm-white); border-radius: 6px; padding: 36px 28px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 30px 80px rgba(44,36,32,.22); border: 1px solid var(--border); font-family: 'Lato',sans-serif; animation: oModalIn .22s ease; }
  @keyframes oModalIn { from { opacity:0; transform:translateY(14px) scale(.96); } to { opacity:1; transform:translateY(0) scale(1); } }
  .ch-modal-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--charcoal); margin-bottom: 9px; }
  .ch-modal-desc { font-size: .84rem; color: var(--muted); line-height: 1.65; margin-bottom: 24px; font-weight: 300; }
  .ch-modal-actions { display: flex; gap: 11px; justify-content: center; }
  .ch-btn-danger { padding: 10px 22px; background: #c0392b; color: #fff; border: none; border-radius: 3px; font-family: 'Lato',sans-serif; font-size: .79rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: background .18s; }
  .ch-btn-danger:hover { background: #a93226; }
  .ch-btn-neutral { padding: 10px 22px; background: transparent; border: 1.5px solid var(--border); border-radius: 3px; color: var(--muted); font-family: 'Lato',sans-serif; font-size: .79rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: all .15s; }
  .ch-btn-neutral:hover { border-color: var(--rose); color: var(--rose); }
  .ch-btn-primary { padding: 10px 22px; background: var(--rose); color: #fff; border: none; border-radius: 3px; font-family: 'Lato',sans-serif; font-size: .79rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: background .18s; }
  .ch-btn-primary:hover { background: var(--deep-rose); }
  .ch-btn-primary:disabled { opacity: .45; cursor: not-allowed; }

  /* ── Add Order button ── */
  .ch-add-order-btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 20px; background: var(--charcoal); color: #fff; border: none; border-radius: 3px; font-family: 'Lato', sans-serif; font-size: .74rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; cursor: pointer; transition: background .18s; margin-bottom: 20px; }
  .ch-add-order-btn:hover { background: var(--rose); }

  /* ── Add Order Modal ── */
  .ch-add-modal-backdrop { position: fixed; inset: 0; background: rgba(44,36,32,.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; }
  .ch-add-modal { background: var(--warm-white); border-radius: 6px; width: 100%; max-width: 620px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 30px 80px rgba(44,36,32,.25); border: 1px solid var(--border); font-family: 'Lato', sans-serif; animation: oModalIn .22s ease; overflow: hidden; }
  .ch-add-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 22px 28px 18px; border-bottom: 1px solid var(--border); background: rgba(253,246,236,.7); flex-shrink: 0; }
  .ch-add-modal-eyebrow { font-size: .63rem; letter-spacing: .22em; text-transform: uppercase; color: var(--terracotta); font-weight: 700; margin-bottom: 3px; }
  .ch-add-modal-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 800; color: var(--charcoal); letter-spacing: -.02em; margin: 0; }
  .ch-add-modal-title em { font-style: italic; color: var(--rose); }
  .ch-add-modal-close { width: 32px; height: 32px; border-radius: 50%; background: rgba(212,115,94,.08); border: 1px solid var(--border); color: var(--muted); font-size: .9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; flex-shrink: 0; line-height: 1; }
  .ch-add-modal-close:hover { background: var(--rose); color: #fff; border-color: var(--rose); }
  .ch-add-modal-body { padding: 24px 28px; overflow-y: auto; display: flex; flex-direction: column; gap: 26px; flex: 1; }
  .ch-add-modal-footer { padding: 16px 28px; border-top: 1px solid var(--border); background: rgba(253,246,236,.6); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; gap: 12px; }
  .ch-add-modal-total { font-family: 'Playfair Display', serif; font-weight: 700; font-size: .95rem; color: var(--charcoal); }
  .ch-add-modal-total span { color: var(--rose); }
  .ch-add-modal-footer-btns { display: flex; gap: 10px; }

  /* Section label */
  .ch-modal-section-label { font-size: .63rem; letter-spacing: .2em; text-transform: uppercase; color: var(--terracotta); font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .ch-modal-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* Form layout */
  .ch-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .ch-field-full { grid-column: 1 / -1; }
  .ch-field { display: flex; flex-direction: column; gap: 5px; }
  .ch-field label { font-size: .62rem; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  .ch-field input, .ch-field select, .ch-field textarea { padding: 8px 11px; border: 1.5px solid var(--border); border-radius: 3px; background: var(--cream); color: var(--charcoal); font-family: 'Lato', sans-serif; font-size: .82rem; outline: none; transition: border-color .15s, background .15s; width: 100%; box-sizing: border-box; }
  .ch-field input:focus, .ch-field select:focus, .ch-field textarea:focus { border-color: var(--rose); background: var(--warm-white); }
  .ch-field input::placeholder, .ch-field textarea::placeholder { color: rgba(138,122,116,.4); }
  .ch-field textarea { resize: vertical; min-height: 64px; line-height: 1.55; }

  /* Item adder */
  .ch-item-adder { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  .ch-add-item-btn { align-self: end; padding: 9px 16px; background: var(--sage); color: #fff; border: none; border-radius: 3px; font-family: 'Lato', sans-serif; font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: background .15s; white-space: nowrap; }
  .ch-add-item-btn:hover { background: #6d9471; }
  .ch-add-item-btn:disabled { opacity: .4; cursor: not-allowed; }

  /* Items list */
  .ch-modal-items-list { display: flex; flex-direction: column; gap: 7px; }
  .ch-modal-item-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: rgba(253,246,236,.65); border: 1px solid var(--border); border-radius: 3px; }
  .ch-modal-item-info { flex: 1; min-width: 0; }
  .ch-modal-item-name { font-size: .82rem; font-weight: 600; color: var(--charcoal); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
  .ch-modal-item-meta { font-size: .71rem; color: var(--muted); font-weight: 300; }
  .ch-modal-item-subtotal { font-family: 'Playfair Display', serif; font-weight: 700; font-size: .86rem; color: var(--charcoal); white-space: nowrap; flex-shrink: 0; }
  .ch-modal-item-remove { width: 26px; height: 26px; border-radius: 50%; background: rgba(192,57,43,.07); border: 1px solid rgba(192,57,43,.18); color: #c0392b; font-size: .78rem; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .15s; line-height: 1; }
  .ch-modal-item-remove:hover { background: #c0392b; color: #fff; border-color: #c0392b; }
  .ch-modal-items-empty { padding: 14px 16px; text-align: center; color: var(--muted); font-size: .78rem; font-style: italic; background: rgba(212,115,94,.04); border: 1px dashed rgba(212,115,94,.25); border-radius: 3px; }

  @media (max-width: 1024px) and (min-width: 769px) {
    .ch-orders-table-wrap { display: none; }
    .ch-order-accordion { display: flex; }
  }
  @media (max-width: 768px) {
    .ch-orders-title { font-size: 1.5rem; }
    .ch-order-filters { gap: 5px; margin-bottom: 16px; }
    .ch-filter-btn { padding: 5px 11px; font-size: .67rem; }
    .ch-orders-table-wrap { display: none; }
    .ch-order-accordion { display: none !important; }
    .ch-order-cards { display: flex; }
    .ch-notification { min-width: unset; max-width: calc(100vw - 32px); top: 70px; right: 16px; left: 16px; }
    .ch-field-grid { grid-template-columns: 1fr; }
    .ch-item-adder { grid-template-columns: 1fr 1fr; }
    .ch-add-modal { max-height: 95vh; }
    .ch-add-modal-header { padding: 16px 18px 14px; }
    .ch-add-modal-body { padding: 18px; }
    .ch-add-modal-footer { padding: 14px 18px; flex-direction: column; align-items: stretch; }
    .ch-add-modal-footer-btns { justify-content: flex-end; }
  }
`;

const statusClass = s => ({
  processing: "ch-status-processing",
  shipped: "ch-status-shipped",
  delivered: s?.confirmed ? "ch-status-confirmed" : "ch-status-delivered",
  cancelled: "ch-status-cancelled"
})[(s || "").toLowerCase()] || "ch-status-processing";

const BASE = API_BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "") + "/api";
const EMPTY_CUSTOMER = { fullName: '', email: '', phone: '', address: '', city: '', zipCode: '', orderNote: '' };
const EMPTY_ITEM = { name: '', price: '', quantity: 1, selectedImage: '' };

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [cancelModal, setCancelModal] = useState({ show: false, orderId: null });
  const [openAccordions, setOpenAccordions] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addOrderData, setAddOrderData] = useState({
    customer: { ...EMPTY_CUSTOMER }, paymentMethod: 'cod', items: [], total: 0
  });
  const [newItem, setNewItem] = useState({ ...EMPTY_ITEM });

  const getLastSeenOrder = () => {
    try { const s = localStorage.getItem("lastSeenOrder"); return s ? JSON.parse(s) : { id: null }; }
    catch { return { id: null }; }
  };
  const saveLastSeenOrder = id => { try { localStorage.setItem("lastSeenOrder", JSON.stringify({ id })); } catch {} };
  const getAuthHeaders = () => {
    const token = localStorage.getItem('ch_token') || localStorage.getItem('token');
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${BASE}/orders`, { headers: getAuthHeaders() });
      if (!res.ok) {
        let msg = `Server responded with ${res.status}: ${res.statusText}`;
        try { const d = await res.json(); if (d.error) msg = d.error; else if (d.message) msg = d.message; } catch {}
        throw new Error(msg);
      }
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setOrders(arr);
      if (arr.length > 0) { const l = arr[arr.length - 1]; if (l.id !== getLastSeenOrder().id) saveLastSeenOrder(l.id); }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(`Could not load orders: ${err.message}. Make sure your server is running on ${BASE}`);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchOrders();
    const poll = setInterval(fetchOrders, 5000);
    const onUpdate = () => fetchOrders();
    const onStorage = e => { if (e.key === "ordersUpdatedAt") fetchOrders(); };
    window.addEventListener("ordersUpdated", onUpdate);
    window.addEventListener("storage", onStorage);
    return () => { clearInterval(poll); window.removeEventListener("ordersUpdated", onUpdate); window.removeEventListener("storage", onStorage); };
  }, [fetchOrders]);

   const updateStatus = async (id, status) => {
     if (status === "Cancelled") { setCancelModal({ show: true, orderId: id }); return; }
     try {
       const order = orders.find(o => o.id === id);
       // If order is already confirmed by customer, prevent status changes
       if (order?.confirmed) {
         setNotification({ type: 'info', message: 'Cannot modify status: delivery already confirmed by customer.' });
         setTimeout(() => setNotification(null), 4000);
         return;
       }
       const res = await fetch(`${BASE}/orders/${id}`, { method: "PUT", headers: getAuthHeaders(), body: JSON.stringify({ status }) });
       if (res.ok) { setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)); window.dispatchEvent(new CustomEvent("ordersUpdated", { detail: { id, status } })); }
     } catch (e) { console.error(e); }
   };

  const confirmCancel = async () => {
    const { orderId } = cancelModal;
    setCancelModal({ show: false, orderId: null });
    try {
      const res = await fetch(`${BASE}/orders/${orderId}`, { method: "PUT", headers: getAuthHeaders(), body: JSON.stringify({ status: "Cancelled" }) });
      if (res.ok) { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Cancelled" } : o)); window.dispatchEvent(new CustomEvent("ordersUpdated", { detail: { id: orderId, status: "Cancelled" } })); }
    } catch (e) { console.error(e); }
  };

  const confirmDeleteOrder = async (orderId) => {
    const stringId = String(orderId);
    setShowDeleteModal(false); setDeletingOrderId(null);
    setNotification({ type: 'loading', message: 'Deleting order...' });
    setOrders(prev => prev.filter(o => String(o.id) !== stringId));
    let deleted = false, lastError = null;
    try {
      const res = await fetch(`${BASE}/orders/${stringId}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.ok) { deleted = true; }
      else {
        try { const d = await res.json(); lastError = d.message || d.error || `Status ${res.status}`; }
        catch { try { lastError = await res.text(); } catch { lastError = `Status ${res.status}`; } }
      }
    } catch (e) { lastError = e.message; }
    await fetchOrders();
    if (deleted) {
      setNotification({ type: 'success', message: 'Order deleted successfully!' });
      window.dispatchEvent(new CustomEvent("ordersUpdated", { detail: { id: stringId, deleted: true } }));
    } else {
      setNotification({ type: 'error', message: lastError || 'Failed to delete order. Please try again.' });
    }
    setTimeout(() => setNotification(null), 5000);
  };

  const toggleAccordion = id => setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));

  // ── Add Order ──
  const setCustomer = (field, value) => setAddOrderData(prev => ({ ...prev, customer: { ...prev.customer, [field]: value } }));

  const handleAddItem = () => {
    const price = parseFloat(newItem.price);
    const qty = parseInt(newItem.quantity);
    if (!newItem.name.trim() || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0) return;
    setAddOrderData(prev => ({
      ...prev,
      items: [...prev.items, { ...newItem, price, quantity: qty, id: Date.now().toString() }],
      total: prev.total + price * qty
    }));
    setNewItem({ ...EMPTY_ITEM });
  };

  const removeItem = index => {
    setAddOrderData(prev => {
      const items = prev.items.filter((_, i) => i !== index);
      return { ...prev, items, total: items.reduce((s, it) => s + it.price * it.quantity, 0) };
    });
  };

  const resetAddModal = () => {
    setAddOrderData({ customer: { ...EMPTY_CUSTOMER }, paymentMethod: 'cod', items: [], total: 0 });
    setNewItem({ ...EMPTY_ITEM });
    setShowAddModal(false);
  };

  const handleAddOrder = async () => {
    if (!addOrderData.customer.fullName.trim() || addOrderData.items.length === 0) return;
    try {
      const payload = { 
        ...addOrderData, 
        status: 'Processing', 
        createdAt: new Date().toISOString(),
        confirmed: false
      };
      const res = await fetch(`${BASE}/orders`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders(prev => [newOrder, ...prev]);
        resetAddModal();
        setNotification({ type: 'success', message: 'Order added successfully!' });
        window.dispatchEvent(new CustomEvent("ordersUpdated", { detail: { added: true } }));
      } else { setNotification({ type: 'error', message: 'Failed to add order.' }); }
    } catch (e) { console.error(e); setNotification({ type: 'error', message: 'Error adding order.' }); }
    setTimeout(() => setNotification(null), 5000);
  };

  const fmt = ds => {
    if (!ds) return "—";
    try { return new Date(ds).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return ds; }
  };
  const fmtP = p => { const n = parseFloat(p); return isNaN(n) ? "0.00" : n.toFixed(2); };
  const isDigital = m => ["gcash", "paymaya", "card"].includes((m || "").toLowerCase());
  const canAddItem = newItem.name.trim() && parseFloat(newItem.price) > 0 && parseInt(newItem.quantity) > 0;
  const canSubmit = addOrderData.customer.fullName.trim() && addOrderData.items.length > 0;

  if (loading) return (
    <>
      <style>{orderStyles}</style>
      <div className="ch-orders-loading"><div className="ch-orders-loader" /><span>Loading orders…</span></div>
    </>
  );

  const filtered = statusFilter === "All" ? orders : orders.filter(o => (o.status || "Processing") === statusFilter);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <style>{orderStyles}</style>

      <p className="ch-orders-eyebrow">Management</p>
      <h1 className="ch-orders-title">Order <em>Management</em></h1>

      {error && <div className="ch-error-box">⚠️ {error}</div>}

      <div className="ch-order-filters">
        {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => (
          <button key={s} className={`ch-filter-btn ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>
            {s} {s === "All" ? `(${orders.length})` : `(${orders.filter(o => (o.status || "Processing") === s).length})`}
          </button>
        ))}
      </div>

      {/* ── Desktop table ── */}
      <div className="ch-orders-table-wrap">
        <table className="ch-orders-table">
          <thead>
            <tr>
              <th>Order ID</th><th>Image</th><th>Customer</th><th>Product</th>
              <th>Total</th><th>Date</th><th>Status</th><th>Payment</th><th>Notes</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan="10">
                <div className="ch-orders-empty">
                  <span className="ch-orders-empty-emoji">📦</span>
                  <strong>No orders found</strong>
                  <p>{statusFilter !== "All" ? `No ${statusFilter} orders.` : "No orders have been placed yet."}</p>
                </div>
              </td></tr>
            ) : sorted.flatMap(order =>
              (order.items || []).map((item, idx) => {
                const isFirst = idx === 0;
                const subtotal = (item.price || 0) * (item.quantity || 1);
                const orderStatus = order.status || "Processing";
                return (
                  <tr key={`${order.id}-${idx}`}>
                    <td>{isFirst && <span className="ch-order-id">#{String(order.id).slice(-6)}</span>}</td>
                    <td>
                      {item.selectedImage
                        ? <img src={item.selectedImage} alt={item.name} className="ch-order-thumb" onError={e => { e.target.style.display = 'none'; }} />
                        : <div className="ch-no-img">No img</div>}
                    </td>
                    <td>
                      {isFirst && (
                        <div className="ch-customer-block">
                          <strong>{order.customer?.fullName || "—"}</strong>
                          <span>{order.customer?.email || "—"}</span>
                          <span>{[order.customer?.address, order.customer?.city].filter(Boolean).join(", ") || "—"}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="ch-product-item-row">
                        <span>{item.name}</span>
                        <span className="ch-item-qty">×{item.quantity || 1}</span>
                        <span className="ch-item-price">₱{fmtP(item.price)}</span>
                        <span className="ch-item-sub">= ₱{fmtP(subtotal)}</span>
                      </div>
                    </td>
                    <td>{isFirst && <span className="ch-order-total">₱{fmtP(order.total)}</span>}</td>
                    <td>{isFirst && <span className="ch-order-date">{fmt(order.createdAt)}</span>}</td>
                     <td>{isFirst && <span className={`ch-status-badge ${statusClass(orderStatus)}`}>{order.confirmed ? 'Delivered (Confirmed)' : orderStatus}</span>}</td>
                    <td>
                      {isFirst && (
                        <span className={`ch-payment-badge ${isDigital(order.paymentMethod) ? "ch-payment-paid" : "ch-payment-unpaid"}`}>
                          {isDigital(order.paymentMethod) ? "Paid" : (order.paymentMethod || "COD").toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td>{isFirst && <span className="ch-order-note">{order.customer?.orderNote || "—"}</span>}</td>
                     <td>
                       {isFirst && (orderStatus.toLowerCase() !== "cancelled" && !order.confirmed ? (
                         <select value={orderStatus} onChange={e => updateStatus(order.id, e.target.value)} className="ch-status-select">
                           <option value="Processing">Processing</option>
                           <option value="Shipped">Shipped</option>
                           <option value="Delivered">Delivered</option>
                           <option value="Cancelled">Cancelled</option>
                         </select>
                       ) : order.confirmed ? (
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.73rem', color: 'var(--sage)', fontWeight: 600 }}>
                           <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--sage)' }}></span>
                           Confirmed
                         </span>
                       ) : (
                         <button onClick={() => { setDeletingOrderId(order.id); setShowDeleteModal(true); }} className="ch-delete-btn">Delete</button>
                       ))}
                     </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Tablet accordion ── */}
      <div className="ch-order-accordion">
        {sorted.length === 0 ? (
          <div className="ch-orders-empty"><span className="ch-orders-empty-emoji">📦</span><strong>No orders found</strong></div>
        ) : sorted.map(order => {
          const isOpen = !!openAccordions[order.id];
          const orderStatus = order.status || "Processing";
          return (
            <div key={order.id} className={`ch-acc-item ${isOpen ? "open" : ""}`}>
               <div className="ch-acc-header" onClick={() => toggleAccordion(order.id)}>
                 <span className="ch-acc-order-id">#{String(order.id).slice(-6)}</span>
                 <span className="ch-acc-customer">{order.customer?.fullName || "Unknown"}</span>
                 <div className="ch-acc-meta">
                   <span className={`ch-status-badge ${statusClass(orderStatus)}`}>{order.confirmed ? 'Delivered (Confirmed)' : orderStatus}</span>
                   <span className="ch-acc-total">₱{fmtP(order.total)}</span>
                   <div className="ch-acc-chevron">▾</div>
                 </div>
               </div>
              <div className="ch-acc-body">
                <div className="ch-acc-body-inner">
                  <div className="ch-acc-info-grid">
                    <div className="ch-acc-info-row"><span className="ch-acc-info-label">Customer</span><span className="ch-acc-info-value">{order.customer?.fullName || "—"}</span></div>
                    <div className="ch-acc-info-row"><span className="ch-acc-info-label">Email</span><span className="ch-acc-info-value">{order.customer?.email || "—"}</span></div>
                    <div className="ch-acc-info-row"><span className="ch-acc-info-label">Address</span><span className="ch-acc-info-value">{[order.customer?.address, order.customer?.city].filter(Boolean).join(", ") || "—"}</span></div>
                    <div className="ch-acc-info-row"><span className="ch-acc-info-label">Date</span><span className="ch-acc-info-value">{fmt(order.createdAt)}</span></div>
                    <div className="ch-acc-info-row">
                      <span className="ch-acc-info-label">Payment</span>
                      <span className="ch-acc-info-value">
                        <span className={`ch-payment-badge ${isDigital(order.paymentMethod) ? "ch-payment-paid" : "ch-payment-unpaid"}`}>
                          {isDigital(order.paymentMethod) ? "Paid" : (order.paymentMethod || "COD").toUpperCase()}
                        </span>
                      </span>
                    </div>
                    {order.customer?.orderNote && (
                      <div className="ch-acc-info-row"><span className="ch-acc-info-label">Note</span><span className="ch-acc-info-value" style={{ fontStyle: "italic", color: "var(--muted)" }}>{order.customer.orderNote}</span></div>
                    )}
                  </div>
                  <div>
                    <div className="ch-acc-items-title">Order Items ({(order.items || []).length})</div>
                    <div className="ch-acc-items-list">
                      {(order.items || []).map((item, i) => (
                        <div key={i} className="ch-acc-item-row">
                          {item.selectedImage ? <img src={item.selectedImage} alt={item.name} className="ch-acc-item-thumb" onError={e => { e.target.style.display = 'none'; }} /> : <div className="ch-acc-item-no-img">No img</div>}
                          <div className="ch-acc-item-info">
                            <div className="ch-acc-item-name">{item.name}</div>
                            <div className="ch-acc-item-sub">×{item.quantity || 1} · ₱{fmtP(item.price)} each</div>
                          </div>
                          <span className="ch-acc-item-subtotal">₱{fmtP((item.price || 0) * (item.quantity || 1))}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                   <div className="ch-acc-total-row">
                     <span className="ch-acc-total-label">Order Total</span>
                     <span className="ch-acc-total-value">₱{fmtP(order.total)}</span>
                   </div>
                   {orderStatus.toLowerCase() !== "cancelled" && !order.confirmed ? (
                     <div className="ch-acc-actions">
                       <span className="ch-acc-actions-label">Update Status:</span>
                       <select value={orderStatus} onChange={e => updateStatus(order.id, e.target.value)} className="ch-status-select">
                         <option value="Processing">Processing</option>
                         <option value="Shipped">Shipped</option>
                         <option value="Delivered">Delivered</option>
                         <option value="Cancelled">Cancelled</option>
                       </select>
                     </div>
                   ) : order.confirmed ? (
                     <div className="ch-acc-actions">
                       <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.73rem', color: 'var(--sage)', fontWeight: 600 }}>
                         <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--sage)' }}></span>
                         Delivery Confirmed by Customer
                       </span>
                     </div>
                   ) : (
                     <div className="ch-acc-actions">
                       <span className="ch-acc-actions-label">Actions:</span>
                       <button onClick={() => { setDeletingOrderId(order.id); setShowDeleteModal(true); }} className="ch-delete-btn">Delete</button>
                     </div>
                   )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mobile cards ── */}
      <div className="ch-order-cards">
        {sorted.length === 0 ? (
          <div className="ch-orders-empty"><span className="ch-orders-empty-emoji">📦</span><strong>No orders found</strong></div>
        ) : sorted.map(order => {
          const orderStatus = order.status || "Processing";
          return (
            <div key={order.id} className="ch-order-card">
               <div className="ch-order-card-head">
                 <span className="ch-order-card-id">Order #{String(order.id).slice(-6)}</span>
                 <span className={`ch-status-badge ${statusClass(orderStatus)}`}>{order.confirmed ? 'Delivered (Confirmed)' : orderStatus}</span>
               </div>
              <div className="ch-order-card-body">
                <p><span>Customer: </span>{order.customer?.fullName || "—"}</p>
                <p><span>Email: </span>{order.customer?.email || "—"}</p>
                <p><span>Address: </span>{[order.customer?.address, order.customer?.city].filter(Boolean).join(", ") || "—"}</p>
                <p><span>Date: </span>{fmt(order.createdAt)}</p>
                <p><span>Payment: </span>
                  <span className={`ch-payment-badge ${isDigital(order.paymentMethod) ? "ch-payment-paid" : "ch-payment-unpaid"}`}>
                    {isDigital(order.paymentMethod) ? "Paid" : (order.paymentMethod || "COD").toUpperCase()}
                  </span>
                </p>
                <div className="ch-order-items-preview">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="ch-order-item-line">
                      <div className="ch-order-item-info">
                        {item.selectedImage ? <img src={item.selectedImage} alt={item.name} className="ch-order-thumb-sm" onError={e => { e.target.style.display = 'none'; }} /> : <div className="ch-no-img-sm">No img</div>}
                        <span>{item.name} ×{item.quantity || 1}</span>
                      </div>
                      <span>₱{fmtP((item.price || 0) * (item.quantity || 1))}</span>
                    </div>
                  ))}
                  <div className="ch-order-item-line" style={{ borderTop: "1px solid var(--border)", paddingTop: 5, marginTop: 3 }}>
                    <strong style={{ fontSize: ".79rem" }}>Total</strong>
                    <strong style={{ fontFamily: "'Playfair Display',serif", fontSize: ".86rem" }}>₱{fmtP(order.total)}</strong>
                  </div>
                </div>
              </div>
               {orderStatus.toLowerCase() !== "cancelled" && !order.confirmed ? (
                 <div className="ch-order-card-actions">
                   <label>Update:</label>
                   <select value={orderStatus} onChange={e => updateStatus(order.id, e.target.value)} className="ch-status-select">
                     <option value="Processing">Processing</option>
                     <option value="Shipped">Shipped</option>
                     <option value="Delivered">Delivered</option>
                     <option value="Cancelled">Cancelled</option>
                   </select>
                 </div>
               ) : order.confirmed ? (
                 <div className="ch-order-card-actions">
                   <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.73rem', color: 'var(--sage)', fontWeight: 600 }}>
                     <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--sage)' }}></span>
                     Delivery Confirmed
                   </span>
                 </div>
               ) : (
                 <div className="ch-order-card-actions">
                   <button onClick={() => { setDeletingOrderId(order.id); setShowDeleteModal(true); }} className="ch-delete-btn">Delete Order</button>
                 </div>
               )}
            </div>
          );
        })}
      </div>

      {/* ── Cancel modal ── */}
      {cancelModal.show && (
        <div className="ch-modal-backdrop" onClick={e => e.target === e.currentTarget && setCancelModal({ show: false, orderId: null })}>
          <div className="ch-modal-box">
            <div className="ch-modal-title">Cancel This Order?</div>
            <p className="ch-modal-desc">Are you sure you want to cancel this order? The order will be marked as cancelled.</p>
            <div className="ch-modal-actions">
              <button className="ch-btn-neutral" onClick={() => setCancelModal({ show: false, orderId: null })}>Keep Order</button>
              <button className="ch-btn-danger" onClick={confirmCancel}>Cancel Order</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete modal ── */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setDeletingOrderId(null); }}
          onConfirm={confirmDeleteOrder}
          orderId={deletingOrderId}
        />
      )}

      {/* ── Add Order Modal ── */}
      {showAddModal && (
        <div className="ch-add-modal-backdrop" onClick={e => e.target === e.currentTarget && resetAddModal()}>
          <div className="ch-add-modal">

            {/* Header */}
            <div className="ch-add-modal-header">
              <div>
                <div className="ch-add-modal-eyebrow">New Entry</div>
                <div className="ch-add-modal-title">Add <em>Order</em></div>
              </div>
              <button className="ch-add-modal-close" onClick={resetAddModal}>✕</button>
            </div>

            {/* Body */}
            <div className="ch-add-modal-body">

              {/* Customer Details */}
              <div>
                <div className="ch-modal-section-label">Customer Details</div>
                <div className="ch-field-grid">
                  <div className="ch-field">
                    <label>Full Name *</label>
                    <input type="text" placeholder="e.g. Maria Santos" value={addOrderData.customer.fullName} onChange={e => setCustomer('fullName', e.target.value)} />
                  </div>
                  <div className="ch-field">
                    <label>Email</label>
                    <input type="email" placeholder="e.g. maria@email.com" value={addOrderData.customer.email} onChange={e => setCustomer('email', e.target.value)} />
                  </div>
                  <div className="ch-field">
                    <label>Phone</label>
                    <input type="tel" placeholder="e.g. 09xx-xxx-xxxx" value={addOrderData.customer.phone} onChange={e => setCustomer('phone', e.target.value)} />
                  </div>
                  <div className="ch-field">
                    <label>City</label>
                    <input type="text" placeholder="e.g. Cebu City" value={addOrderData.customer.city} onChange={e => setCustomer('city', e.target.value)} />
                  </div>
                  <div className="ch-field ch-field-full">
                    <label>Address</label>
                    <input type="text" placeholder="Street, Barangay" value={addOrderData.customer.address} onChange={e => setCustomer('address', e.target.value)} />
                  </div>
                  <div className="ch-field">
                    <label>ZIP Code</label>
                    <input type="text" placeholder="e.g. 6000" value={addOrderData.customer.zipCode} onChange={e => setCustomer('zipCode', e.target.value)} />
                  </div>
                  <div className="ch-field">
                    <label>Payment Method</label>
                    <select value={addOrderData.paymentMethod} onChange={e => setAddOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}>
                      <option value="cod">Cash on Delivery</option>
                      <option value="gcash">GCash</option>
                      <option value="paymaya">PayMaya</option>
                      <option value="card">Card</option>
                    </select>
                  </div>
                  <div className="ch-field ch-field-full">
                    <label>Order Note</label>
                    <textarea placeholder="Any special instructions…" value={addOrderData.customer.orderNote} onChange={e => setCustomer('orderNote', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="ch-modal-section-label">Order Items</div>
                <div className="ch-item-adder">
                  <div className="ch-field">
                    <label>Item Name</label>
                    <input type="text" placeholder="e.g. Rose Bouquet" value={newItem.name}
                      onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && canAddItem && handleAddItem()} />
                  </div>
                  <div className="ch-field">
                    <label>Price (₱)</label>
                    <input type="number" placeholder="0.00" min="0" step="0.01" value={newItem.price}
                      onChange={e => setNewItem(prev => ({ ...prev, price: e.target.value }))} />
                  </div>
                  <div className="ch-field">
                    <label>Qty</label>
                    <input type="number" placeholder="1" min="1" value={newItem.quantity}
                      onChange={e => setNewItem(prev => ({ ...prev, quantity: e.target.value }))} />
                  </div>
                </div>
                <div className="ch-field" style={{ marginBottom: 12 }}>
                  <label>Image URL <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <input type="text" placeholder="https://…" value={newItem.selectedImage}
                    onChange={e => setNewItem(prev => ({ ...prev, selectedImage: e.target.value }))} />
                </div>
                <button className="ch-add-item-btn" onClick={handleAddItem} disabled={!canAddItem}>+ Add Item</button>

                <div className="ch-modal-items-list" style={{ marginTop: 14 }}>
                  {addOrderData.items.length === 0
                    ? <div className="ch-modal-items-empty">No items yet — fill in the fields above and click Add Item.</div>
                    : addOrderData.items.map((item, i) => (
                      <div key={i} className="ch-modal-item-row">
                        <div className="ch-modal-item-info">
                          <div className="ch-modal-item-name">{item.name}</div>
                          <div className="ch-modal-item-meta">×{item.quantity} · ₱{fmtP(item.price)} each</div>
                        </div>
                        <span className="ch-modal-item-subtotal">₱{fmtP(item.price * item.quantity)}</span>
                        <button className="ch-modal-item-remove" onClick={() => removeItem(i)} title="Remove">✕</button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="ch-add-modal-footer">
              <div className="ch-add-modal-total">
                Order Total: <span>₱{fmtP(addOrderData.total)}</span>
              </div>
              <div className="ch-add-modal-footer-btns">
                <button className="ch-btn-neutral" onClick={resetAddModal}>Cancel</button>
                <button className="ch-btn-primary" onClick={handleAddOrder} disabled={!canSubmit}>Place Order</button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {notification && (
        <div className="ch-notification">
          <span className="ch-notification-icon">
            {notification.type === 'success' ? '✅' : notification.type === 'loading' ? '⏳' : '❌'}
          </span>
          <div className="ch-notification-body">
            <h4>{notification.type === 'success' ? 'Success' : notification.type === 'error' ? 'Error' : 'Processing'}</h4>
            <p>{notification.message}</p>
          </div>
          <button className="ch-notification-close" onClick={() => setNotification(null)}>&times;</button>
        </div>
      )}
    </>
  );
};

export default Order;