import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

// ─── Derive a per-user storage key ───────────────────────────────────────────
// Reads from 'token' / 'user' — the same keys Login.js actually writes.
const getUserKey = () => {
  try {
    // 1. ch_user (written by Register via userStorage)
    const chRaw = localStorage.getItem('ch_user');
    if (chRaw) {
      const p = JSON.parse(chRaw);
      const id = p?.id || p?.username || p?.email;
      if (id) return `cart_${id}`;
    }
  } catch { /* ignore */ }

  try {
    // 2. user (written by Login.js)
    const uRaw = localStorage.getItem('user');
    if (uRaw) {
      const p = JSON.parse(uRaw);
      const id = p?.id || p?.username || p?.email;
      if (id) return `cart_${id}`;
    }
  } catch { /* ignore */ }

  try {
    // 3. Decode whichever JWT token key exists
    const token =
      localStorage.getItem('ch_token') ||
      localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload?.id || payload?.username || payload?.email;
      if (id) return `cart_${id}`;
    }
  } catch { /* ignore */ }

  return 'cart_guest';
};

const safeRead = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const CartProvider = ({ children }) => {
  const [userKey,       setUserKey]       = useState(getUserKey);
  const [cart,          setCart]          = useState(() => safeRead(getUserKey(), []));
  const [selectedItems, setSelectedItems] = useState(() => safeRead(`${getUserKey()}_selected`, []));

  // Re-sync whenever login / logout fires 'userAuthChanged'
  useEffect(() => {
    const refresh = () => {
      const newKey = getUserKey();
      setUserKey(newKey);
      setCart(safeRead(newKey, []));
      setSelectedItems(safeRead(`${newKey}_selected`, []));
    };
    window.addEventListener('userAuthChanged', refresh);
    window.addEventListener('storage',         refresh);
    return () => {
      window.removeEventListener('userAuthChanged', refresh);
      window.removeEventListener('storage',         refresh);
    };
  }, []);

  // Persist
  useEffect(() => { localStorage.setItem(userKey, JSON.stringify(cart)); },          [cart,          userKey]);
  useEffect(() => { localStorage.setItem(`${userKey}_selected`, JSON.stringify(selectedItems)); }, [selectedItems, userKey]);

  // ── Cart operations ──────────────────────────────────────────────────────

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const exists = prev.find(
        i => i?.id === product.id && i?.selectedImage === product.selectedImage
      );
      if (exists) {
        return prev.map(i =>
          i?.id === product.id && i?.selectedImage === product.selectedImage
            ? { ...i, quantity: (i.quantity || 1) + (product.quantity || 1), addedAt: Date.now() }
            : i
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1, addedAt: Date.now() }];
    });
  }, []);

  const removeFromCart = useCallback((productId, selectedImage) => {
    setCart(prev => prev.filter(i => !(i?.id === productId && i?.selectedImage === selectedImage)));
    setSelectedItems(prev => prev.filter(k => k !== `${productId}-${selectedImage}`));
  }, []);

  const incrementQuantity = useCallback((productId, selectedImage) => {
    setCart(prev => prev.map(i =>
      i?.id === productId && i?.selectedImage === selectedImage
        ? { ...i, quantity: (i.quantity || 1) + 1 } : i
    ));
  }, []);

  const decrementQuantity = useCallback((productId, selectedImage) => {
    setCart(prev => prev.map(i =>
      i?.id === productId && i?.selectedImage === selectedImage && (i.quantity || 1) > 1
        ? { ...i, quantity: i.quantity - 1 } : i
    ));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedItems([]);
  }, []);

  // ── Selection operations ─────────────────────────────────────────────────

  const toggleSelected = useCallback((productId, selectedImage) => {
    const key = `${productId}-${selectedImage}`;
    setSelectedItems(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }, []);

  const selectAll = useCallback(() => {
    setCart(current => {
      setSelectedItems(current.map(i => `${i.id}-${i.selectedImage}`));
      return current;
    });
  }, []);

  const deselectAll = useCallback(() => setSelectedItems([]), []);

  const getSelectedItems = useCallback(() =>
    cart.filter(i => selectedItems.includes(`${i.id}-${i.selectedImage}`)),
  [cart, selectedItems]);

  // ── Derived ──────────────────────────────────────────────────────────────

  const totalItems = cart.reduce((sum, i) => {
    const qty = i?.quantity ? Number(i.quantity) : 1;
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart, setCart, totalItems,
      addToCart, removeFromCart, clearCart,
      incrementQuantity, decrementQuantity,
      selectedItems, toggleSelected, selectAll, deselectAll, getSelectedItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;