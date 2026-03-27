import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import API_BASE_URL from '../../apiConfig';

const API_URL = `${API_BASE_URL}/products`;

const sharedStyles = `
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
    overflow-x: hidden;
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
  .ch-header {
    position: relative;
    background: var(--warm-white);
    border-bottom: 1px solid var(--border);
  }

  .ch-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ch-logo-block {
    display: flex;
    align-items: center;
    gap: 16px;
    text-decoration: none;
  }

  .ch-logo-yarn {
    font-size: 2.2rem;
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
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--charcoal);
    line-height: 1;
  }

  .ch-logo-text span { color: var(--rose); }

  .ch-tagline {
    font-size: 0.72rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 5px;
    font-weight: 400;
  }

  .ch-nav-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
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
    padding: 56px 60px;
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
    background: radial-gradient(circle, rgba(232,114,138,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .ch-banner-inner {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

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

  .ch-banner-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--amber);
  }

  .ch-banner-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.8rem;
    font-weight: 800;
    color: var(--warm-white);
    line-height: 1.1;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }

  .ch-banner-title em { font-style: italic; color: var(--blush); }

  .ch-banner-sub {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.45);
    font-weight: 300;
    letter-spacing: 0.03em;
  }

  /* ─── MAIN CONTENT ─── */
  .ch-products-body {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 60px 80px;
  }

  /* ─── INTRO STATS BAR ─── */
  .ch-intro-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--warm-white);
    border-radius: 4px;
    border: 1px solid var(--border);
    padding: 24px 36px;
    margin-bottom: 56px;
  }

  .ch-intro-bar-text h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--charcoal);
    margin-bottom: 4px;
  }

  .ch-intro-bar-text p {
    font-size: 0.85rem;
    color: var(--muted);
    font-weight: 300;
  }

  .ch-intro-stats {
    display: flex;
    gap: 0;
    border-left: 1px solid var(--border);
  }

  .ch-intro-stat {
    padding: 0 36px;
    border-right: 1px solid var(--border);
    text-align: center;
  }

  .ch-intro-stat-num {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--rose);
    line-height: 1;
  }

  .ch-intro-stat-lbl {
    display: block;
    font-size: 0.65rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 5px;
  }

  /* ─── SECTION LABEL ─── */
  .ch-section-label {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
    margin-top: 56px;
  }

  .ch-section-label:first-child { margin-top: 0; }

  .ch-section-icon {
    font-size: 1.6rem;
    line-height: 1;
  }

  .ch-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--charcoal);
  }

  .ch-section-count {
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    background: var(--warm-white);
    border: 1px solid var(--border);
    padding: 4px 12px;
    border-radius: 20px;
  }

  .ch-section-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ─── PRODUCT CAROUSEL WRAPPER ─── */
  .ch-carousel-wrapper {
    position: relative;
    margin-bottom: 8%;
  }

  /* ─── PRODUCT ROW ─── */
  .ch-products-row {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 12px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .ch-products-row::-webkit-scrollbar { height: 4px; }
  .ch-products-row::-webkit-scrollbar-track { background: transparent; }
  .ch-products-row::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  /* ─── CAROUSEL CONTROLS — hidden on desktop ─── */
  .ch-carousel-controls {
    display: none;
  }

  /* ─── PRODUCT CARD ─── */
  .ch-product-card {
    flex: 0 0 240px;
    background: var(--warm-white);
    border-radius: 4px;
    border: 1px solid var(--border);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
  }

  .ch-product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(44,36,32,0.1);
  }

  .ch-product-image-wrap {
    position: relative;
    height: 180px;
    background: linear-gradient(145deg, #f7e8d8, #f0cfc4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    overflow: hidden;
  }

  .ch-product-overlay {
    position: absolute;
    inset: 0;
    background: rgba(44,36,32,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .ch-product-card:hover .ch-product-overlay { opacity: 1; }

  .ch-quick-view-btn {
    background: var(--warm-white);
    color: var(--rose);
    border: none;
    padding: 10px 22px;
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transform: translateY(8px);
    transition: all 0.25s ease;
  }

  .ch-product-card:hover .ch-quick-view-btn { transform: translateY(0); }
  .ch-quick-view-btn:hover { background: var(--rose); color: #fff; }

  .ch-product-info {
    padding: 18px 20px;
  }

  .ch-product-name {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--charcoal);
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ch-product-desc {
    font-size: 0.78rem;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-weight: 300;
  }

  .ch-product-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }

  .ch-product-price {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--rose);
  }

  .ch-add-btn {
    padding: 8px 16px;
    background: var(--charcoal);
    color: var(--cream);
    border: none;
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .ch-add-btn:hover { background: var(--rose); transform: scale(1.04); }

  /* ─── MODAL ─── */
  .ch-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(44,36,32,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: ch-fade-in 0.2s ease;
  }

  @keyframes ch-fade-in { from { opacity: 0; } to { opacity: 1; } }

  .ch-modal {
    background: var(--warm-white);
    border-radius: 4px;
    max-width: 760px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: ch-slide-up 0.3s ease;
  }

  @keyframes ch-slide-up {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ch-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(44,36,32,0.08);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 1.2rem;
    color: var(--muted);
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ch-modal-close:hover { background: var(--rose); color: #fff; }

  .ch-qv-image {
    background: linear-gradient(145deg, #f7e8d8, #f0cfc4);
    padding: 50px;
    text-align: center;
    position: relative;
  }

  .ch-qv-image img {
    max-width: 100%;
    max-height: 320px;
    border-radius: 4px;
    object-fit: contain;
  }

  .ch-qv-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: var(--warm-white);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1rem;
    color: var(--rose);
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(44,36,32,0.14);
    transition: all 0.2s ease;
  }

  .ch-qv-nav:hover { transform: translateY(-50%) scale(1.1); background: var(--rose); color: #fff; }
  .ch-qv-nav-prev { left: 16px; }
  .ch-qv-nav-next { right: 16px; }

  .ch-qv-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 18px;
  }

  .ch-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.45);
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .ch-dot.active { background: var(--warm-white); transform: scale(1.3); }

  .ch-qv-details {
    padding: 32px 36px;
  }

  .ch-qv-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.7rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 8px;
  }

  .ch-qv-badge {
    display: inline-block;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--terracotta);
    border: 1px solid rgba(212,115,94,0.3);
    padding: 4px 12px;
    border-radius: 2px;
    margin-bottom: 18px;
  }

  .ch-qv-desc {
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.8;
    margin-bottom: 24px;
    font-weight: 300;
  }

  .ch-qv-price {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--rose);
    margin-bottom: 24px;
    display: block;
  }

  .ch-qv-actions {
    display: flex;
    gap: 12px;
  }

  .ch-btn-add-main {
    flex: 1;
    padding: 16px 28px;
    background: var(--charcoal);
    color: var(--cream);
    border: none;
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .ch-btn-add-main::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--rose);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 0;
  }

  .ch-btn-add-main:hover::after { transform: translateX(0); }
  .ch-btn-add-main span { position: relative; z-index: 1; }

  .ch-btn-close {
    flex: 1;
    padding: 16px 28px;
    background: var(--rose);
    color: var(--cream);
    border: none;
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ch-btn-close:hover { background: var(--deep-rose); }

  .ch-select-body {
    padding: 40px;
  }

  .ch-select-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 8px;
  }

  .ch-select-desc {
    font-size: 0.88rem;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 24px;
    font-weight: 300;
  }

  .ch-select-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--terracotta);
    margin-bottom: 18px;
  }

  .ch-select-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .ch-image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 12px;
    margin-bottom: 24px;
  }

  .ch-image-option {
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: all 0.25s ease;
    position: relative;
    background: var(--cream);
  }

  .ch-image-option:hover { border-color: var(--rose); transform: scale(1.04); }
  .ch-image-option.selected { border-color: var(--rose); box-shadow: 0 0 0 3px rgba(232,114,138,0.2); }

  .ch-image-option img {
    width: 100%;
    height: 90px;
    object-fit: cover;
    display: block;
  }

  .ch-image-option-lbl {
    display: block;
    text-align: center;
    padding: 6px;
    background: var(--warm-white);
    color: var(--muted);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .ch-selected-check {
    position: absolute;
    top: 6px;
    right: 6px;
    background: var(--rose);
    color: #fff;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
  }

  .ch-qty-row {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 16px 20px;
    background: var(--cream);
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .ch-qty-label {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--charcoal);
  }

  .ch-qty-controls {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 2px;
    overflow: hidden;
    background: var(--warm-white);
  }

  .ch-qty-btn {
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    color: var(--rose);
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ch-qty-btn:hover { background: var(--rose); color: #fff; }

  .ch-qty-val {
    width: 44px;
    text-align: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--charcoal);
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    line-height: 36px;
  }

  .ch-select-price {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--rose);
    margin-bottom: 20px;
    display: block;
  }

  .ch-submit-btn {
    width: 100%;
    padding: 18px;
    background: var(--charcoal);
    color: var(--cream);
    border: none;
    border-radius: 2px;
    font-family: 'Lato', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .ch-submit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--rose);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 0;
  }

  .ch-submit-btn:hover::after { transform: translateX(0); }
  .ch-submit-btn span { position: relative; z-index: 1; }
  .ch-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .ch-submit-btn:disabled::after { display: none; }

  /* ─── LOADING ─── */
  .ch-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 60px;
    gap: 20px;
  }

  .ch-spinner {
    width: 52px;
    height: 52px;
    border: 3px solid var(--border);
    border-top-color: var(--rose);
    border-radius: 50%;
    animation: ch-spin 0.9s linear infinite;
  }

  @keyframes ch-spin { to { transform: rotate(360deg); } }

  .ch-loading p {
    font-size: 0.9rem;
    color: var(--muted);
    letter-spacing: 0.08em;
  }

  /* ─── EMPTY STATE ─── */
  .ch-empty {
    text-align: center;
    padding: 100px 40px;
  }

  .ch-empty-icon { font-size: 4rem; display: block; margin-bottom: 20px; }

  .ch-empty h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    color: var(--charcoal);
    margin-bottom: 12px;
  }

  .ch-empty p {
    font-size: 0.9rem;
    color: var(--muted);
    margin-bottom: 28px;
    font-weight: 300;
  }

  .ch-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 30px;
    background: var(--charcoal);
    color: var(--cream);
    text-decoration: none;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: 2px;
    transition: background 0.2s ease;
    position: relative;
    overflow: hidden;
    border: none;
    cursor: pointer;
  }

  .ch-btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--rose);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 0;
  }

  .ch-btn-primary:hover::after { transform: translateX(0); }
  .ch-btn-primary span { position: relative; z-index: 1; }

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

  /* ═══════════════════════════════════════
     SHARED CAROUSEL CONTROL STYLES
  ═══════════════════════════════════════ */
  .ch-carousel-controls {
    display: none;
  }

  .ch-carousel-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: var(--warm-white);
    color: var(--muted);
    line-height: 1;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .ch-carousel-arrow:hover:not(:disabled) {
    border-color: var(--rose);
    color: var(--rose);
    background: rgba(232, 114, 138, 0.07);
  }

  .ch-carousel-arrow:disabled {
    opacity: 0.25;
    cursor: default;
  }

  .ch-carousel-dots {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .ch-carousel-dot {
    border-radius: 50%;
    background: rgba(212, 115, 94, 0.25);
    transition: all 0.25s ease;
    flex-shrink: 0;
  }

  .ch-carousel-dot.active {
    background: var(--rose);
    border-radius: 3px;
  }

  /* ─── Responsive ─── */
  @media (max-width: 900px) {
    .ch-page { margin-left: 0; }
    .ch-header-inner { padding: 24px 30px; }
    .ch-page-banner { padding: 40px 30px; }
    .ch-banner-title { font-size: 2.2rem; }
    .ch-products-body { padding: 40px 30px 60px; }
    .ch-intro-bar { flex-direction: column; align-items: flex-start; gap: 20px; }
    .ch-intro-stats { border-left: none; border-top: 1px solid var(--border); padding-top: 20px; width: 100%; justify-content: space-around; }
    .ch-intro-stat { border-right: none; padding: 0 20px; }
    .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 28px 30px; }
  }

  @media (max-width: 580px) {
    .ch-product-card { flex: 0 0 200px; }
    .ch-qv-details { padding: 24px; }
    .ch-qv-actions { flex-direction: column; }
    .ch-select-body { padding: 28px 24px; }
    .ch-banner-title { font-size: 1.8rem; }
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    .ch-page { margin-left: 160px; }
    .ch-header-inner, .ch-page-banner, .ch-products-body { padding-left: 24px; padding-right: 24px; }
    .ch-banner-title { font-size: 2rem; }
    .ch-intro-bar { flex-direction: column; align-items: flex-start; gap: 16px; }
    .ch-intro-stats { border-left: none; border-top: 1px solid var(--border); padding-top: 16px; width: 100%; justify-content: space-around; }
    .ch-intro-stat { border-right: none; padding: 0 16px; }
    .ch-footer { flex-direction: column; gap: 12px; text-align: center; padding: 24px; }
    .ch-carousel-controls { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 14px 0 4px; }
    .ch-carousel-arrow { width: 34px; height: 34px; font-size: 1.1rem; }
    .ch-carousel-dot { width: 7px; height: 7px; }
    .ch-carousel-dot.active { width: 20px; }
    .ch-products-row { scrollbar-width: none; }
    .ch-products-row::-webkit-scrollbar { display: none; }
  }

  @media (max-width: 768px) {
    .ch-page { margin-left: 0; padding-top: 56px; }
    .ch-header-inner { padding: 14px 16px 14px 68px; margin-left: -50px; }
    .ch-logo-yarn { font-size: 1.8rem; }
    .ch-logo-text { font-size: 1.3rem; }
    .ch-tagline { display: none; }
    .ch-nav-cta { padding: 9px 14px; font-size: 0.72rem; }
    .ch-page-banner { padding: 28px 16px; }
    .ch-banner-title { font-size: 1.7rem; }
    .ch-products-body { padding: 28px 16px 48px; }
    .ch-intro-bar { padding: 16px; flex-direction: column; gap: 12px; margin-bottom: 32px; }
    .ch-intro-stats { border-left: none; border-top: 1px solid var(--border); padding-top: 12px; width: 100%; display: flex; justify-content: space-around; }
    .ch-intro-stat { border-right: none; padding: 0 12px; }
    .ch-intro-stat-num { font-size: 1.4rem; }
    .ch-section-label { margin-top: 32px; }
    .ch-section-title { font-size: 1.3rem; }
    .ch-product-card { flex: 0 0 200px; }
    .ch-qv-details { padding: 20px; }
    .ch-qv-actions { flex-direction: column; }
    .ch-qv-name { font-size: 1.3rem; }
    .ch-select-body { padding: 20px; }
    .ch-footer { flex-direction: column; gap: 10px; text-align: center; padding: 20px 16px; }
    .ch-section-count { width: 25%; }
    .ch-carousel-controls { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 10px 0 2px; }
    .ch-carousel-arrow { width: 28px; height: 28px; font-size: 0.85rem; }
    .ch-carousel-dot { width: 6px; height: 6px; }
    .ch-carousel-dot.active { width: 16px; }
    .ch-products-row { scrollbar-width: none; }
    .ch-products-row::-webkit-scrollbar { display: none; }
  }

  @media (max-width: 480px) {
    .ch-product-card { flex: 0 0 175px; }
    .ch-image-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

/* ─── CategoryCarousel ─── */
const CategoryCarousel = ({ products, categoryEmojis, category, onQuickView, onAddClick }) => {
  const rowRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const total = products.length;

  const handleScroll = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth + 16 || 216;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIdx(Math.min(idx, total - 1));
  }, [total]);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = (idx) => {
    const el = rowRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth + 16 || 216;
    el.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
    setActiveIdx(idx);
  };

  const goPrev = () => scrollTo(Math.max(0, activeIdx - 1));
  const goNext = () => scrollTo(Math.min(total - 1, activeIdx + 1));

  return (
    <div className="ch-carousel-wrapper">
      <div className="ch-products-row" ref={rowRef}>
        {products.map(product => (
          <div key={product.id} className="ch-product-card">
            <div className="ch-product-image-wrap">
              <span>{categoryEmojis[category] || "🧶"}</span>
              <div className="ch-product-overlay">
                <button className="ch-quick-view-btn" onClick={() => onQuickView(product)}>
                  Quick View
                </button>
              </div>
            </div>
            <div className="ch-product-info">
              <div className="ch-product-name">{product.name}</div>
              <div className="ch-product-desc">{product.description}</div>
              <div className="ch-product-footer">
                <span className="ch-product-price">₱{Number(product.price).toFixed(2)}</span>
                <button className="ch-add-btn" onClick={() => onAddClick(product)}>Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ch-carousel-controls" aria-hidden="true">
        <button
          className="ch-carousel-arrow"
          onClick={goPrev}
          disabled={activeIdx === 0}
          aria-label="Previous product"
        >
          ‹
        </button>
        <div className="ch-carousel-dots">
          {products.map((_, idx) => (
            <span
              key={idx}
              className={`ch-carousel-dot${idx === activeIdx ? ' active' : ''}`}
            />
          ))}
        </div>
        <button
          className="ch-carousel-arrow"
          onClick={goNext}
          disabled={activeIdx === total - 1}
          aria-label="Next product"
        >
          ›
        </button>
      </div>
    </div>
  );
};

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showQuickViewModal, setShowQuickViewModal] = useState(false);
  const [productToShow, setProductToShow] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categoryEmojis = {
    "Accessories & Bouquet": "🌸",
    "Bags": "👜",
    "Clothing": "🧣",
    "Home Decor": "🏠"
  };

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  const closeImageModal = () => {
    setShowImageModal(false);
    setProductToShow(null);
    setSelectedImageIndex(null);
    setQuantity(1);
  };

  const handleAddClick = (product) => {
    setProductToShow(product);
    setCurrentImageIndex(0);
    setSelectedImageIndex(null);
    setQuantity(1);
    setShowImageModal(true);
  };

  const handleQuickView = (product) => {
    setProductToShow(product);
    setCurrentImageIndex(0);
    setShowQuickViewModal(true);
  };

  const handleSubmitAddToCart = () => {
    if (selectedImageIndex === null) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...productToShow, selectedImage: productToShow.images[selectedImageIndex] });
    }
    closeImageModal();
  };

  // ── Buy Now: navigate directly to checkout via router state (do NOT add to cart) ──
  const handleBuyNow = (product, imageIndex) => {
    const item = {
      ...product,
      selectedImage: product.images[imageIndex],
      quantity: 1,
    };
    setShowQuickViewModal(false);
    navigate('/user/checkout', { state: { buyNowItem: item } });
  };

  const Header = () => (
    <header className="ch-header">
      <div className="ch-header-inner">
        <Link to="/user/home" className="ch-logo-block" style={{ textDecoration: 'none' }}>
          <span className="ch-logo-yarn">🧶</span>
          <div>
            <div className="ch-logo-text">Crochet <span>Haven</span></div>
            <div className="ch-tagline">Stitched with love, for you</div>
          </div>
        </Link>
        <Link to="/user/cart" className="ch-nav-cta">Cart 🛒</Link>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="ch-footer">
      <div className="ch-footer-logo">🧶 Crochet Haven</div>
      <p className="ch-footer-copy">© 2026 Crochet Haven. Made with ❤️ and yarn.</p>
    </footer>
  );

  if (loading) return (
    <>
      <style>{sharedStyles}</style>
      <div className="ch-page">
        <Header />
        <div className="ch-loading">
          <div className="ch-spinner" />
          <p>Loading beautiful products…</p>
        </div>
        <Footer />
      </div>
    </>
  );

  if (products.length === 0) return (
    <>
      <style>{sharedStyles}</style>
      <div className="ch-page">
        <Header />
        <div className="ch-products-body">
          <div className="ch-empty">
            <span className="ch-empty-icon">📦</span>
            <h3>No Products Yet</h3>
            <p>Our collection is being updated. Check back soon!</p>
            <button className="ch-btn-primary" onClick={fetchProducts}><span>Refresh</span></button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="ch-page">
        <Header />

        {/* ── BANNER ── */}
        <div className="ch-page-banner">
          <div className="ch-banner-inner">
            <p className="ch-banner-eyebrow">Handcrafted Selection</p>
            <h1 className="ch-banner-title">Our <em>Crochet</em> Collection</h1>
            <p className="ch-banner-sub">Each piece crafted with high-quality yarns and a passion for detail</p>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="ch-products-body">

          {/* Stats bar */}
          <div className="ch-intro-bar">
            <div className="ch-intro-bar-text">
              <h2>Browse by Category</h2>
              <p>Discover your next favourite handmade piece</p>
            </div>
            <div className="ch-intro-stats">
              <div className="ch-intro-stat">
                <span className="ch-intro-stat-num">{products.length}</span>
                <span className="ch-intro-stat-lbl">Products</span>
              </div>
              <div className="ch-intro-stat">
                <span className="ch-intro-stat-num">{Object.keys(groupedProducts).length}</span>
                <span className="ch-intro-stat-lbl">Categories</span>
              </div>
            </div>
          </div>

          {/* Category Sections */}
          {Object.keys(groupedProducts).map(category => (
            <div key={category}>
              <div className="ch-section-label">
                <span className="ch-section-icon">{categoryEmojis[category] || "🧶"}</span>
                <h3 className="ch-section-title">{category}</h3>
                <span className="ch-section-count">{groupedProducts[category].length} items</span>
                <div className="ch-section-line" />
              </div>

              <CategoryCarousel
                products={groupedProducts[category]}
                categoryEmojis={categoryEmojis}
                category={category}
                onQuickView={handleQuickView}
                onAddClick={handleAddClick}
              />
            </div>
          ))}
        </div>

        <Footer />

        {/* ── IMAGE SELECT MODAL ── */}
        {showImageModal && productToShow && (
          <div className="ch-modal-overlay" onClick={closeImageModal}>
            <div className="ch-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
              <button className="ch-modal-close" onClick={closeImageModal}>×</button>
              <div className="ch-select-body">
                <div className="ch-select-name">{productToShow.name}</div>
                <div className="ch-select-desc">{productToShow.description}</div>
                <div className="ch-select-label">Choose a Variant</div>
                <div className="ch-image-grid">
                  {productToShow.images?.map((img, idx) => (
                    <div
                      key={idx}
                      className={`ch-image-option ${selectedImageIndex === idx ? 'selected' : ''}`}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      <img src={img} alt={`Variant ${idx + 1}`} />
                      <span className="ch-image-option-lbl">Var {idx + 1}</span>
                      {selectedImageIndex === idx && <div className="ch-selected-check">✓</div>}
                    </div>
                  ))}
                </div>

                {selectedImageIndex !== null && (
                  <div className="ch-qty-row">
                    <span className="ch-qty-label">Quantity</span>
                    <div className="ch-qty-controls">
                      <button className="ch-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                      <span className="ch-qty-val">{quantity}</span>
                      <button className="ch-qty-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
                    </div>
                  </div>
                )}

                <span className="ch-select-price">₱{Number(productToShow.price).toFixed(2)}</span>
                <button
                  className="ch-submit-btn"
                  onClick={handleSubmitAddToCart}
                  disabled={selectedImageIndex === null}
                >
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── QUICK VIEW MODAL ── */}
        {showQuickViewModal && productToShow && (
          <div className="ch-modal-overlay" onClick={() => setShowQuickViewModal(false)}>
            <div className="ch-modal" onClick={e => e.stopPropagation()}>
              <button className="ch-modal-close" onClick={() => setShowQuickViewModal(false)}>×</button>
              <div className="ch-qv-image">
                <img src={productToShow.images[currentImageIndex]} alt={productToShow.name} />
                {productToShow.images.length > 1 && (
                  <>
                    <button
                      className="ch-qv-nav ch-qv-nav-prev"
                      onClick={() => setCurrentImageIndex((currentImageIndex - 1 + productToShow.images.length) % productToShow.images.length)}
                    >❮</button>
                    <button
                      className="ch-qv-nav ch-qv-nav-next"
                      onClick={() => setCurrentImageIndex((currentImageIndex + 1) % productToShow.images.length)}
                    >❯</button>
                  </>
                )}
                <div className="ch-qv-dots">
                  {productToShow.images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`ch-dot ${idx === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              </div>
              <div className="ch-qv-details">
                <div className="ch-qv-name">{productToShow.name}</div>
                <span className="ch-qv-badge">{categoryEmojis[productToShow.category] || "🧶"} {productToShow.category}</span>
                <p className="ch-qv-desc">{productToShow.description}</p>
                <span className="ch-qv-price">₱{Number(productToShow.price).toFixed(2)}</span>
                <div className="ch-qv-actions">
                  {/* ── Buy Now: skip cart page, go directly to checkout ── */}
                  <button
                    className="ch-btn-close"
                    onClick={() => handleBuyNow(productToShow, currentImageIndex)}
                  >
                    Buy Now
                  </button>
                  <button
                    className="ch-btn-add-main"
                    onClick={() => {
                      addToCart({ ...productToShow, selectedImage: productToShow.images[currentImageIndex] });
                      setShowQuickViewModal(false);
                    }}
                  >
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;