import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// ─── Import the consistent user ID resolver ──────────────────────────────────
import { resolveUserId } from '../pages/userStorage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

// ─── Derive a per-user storage key ───────────────────────────────────────────
// Uses the same user ID resolution logic as Orders.js, Profile.js, etc.
// This ensures cart data persists across devices when logged in with same credentials.
const getUserKey = () => {
  const userId = resolveUserId();
  console.log('Cart Debug - Resolved user ID for cart key:', userId);
  return userId ? `cart_${userId}` : 'cart_guest';
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
  const [cart,          setCart]          = useState(() => {
    const initialKey = getUserKey();
    const initialCart = safeRead(initialKey, []);
    console.log('Cart Debug - Initial load:', { key: initialKey, items: initialCart.length });
    return initialCart;
  });
  const [selectedItems, setSelectedItems] = useState(() => {
    const initialKey = getUserKey();
    return safeRead(`${initialKey}_selected`, []);
  });

  // Re-sync whenever login / logout fires 'userAuthChanged' or storage changes
  useEffect(() => {
    const refresh = () => {
      const oldKey = userKey;
      const newKey = getUserKey();

      if (oldKey !== newKey) {
        console.log('Cart Debug - User key changed:', { from: oldKey, to: newKey });

        // Save current cart to old key before switching (in case user logs out and back in)
        if (oldKey !== 'cart_guest' && cart.length > 0) {
          localStorage.setItem(oldKey, JSON.stringify(cart));
          localStorage.setItem(`${oldKey}_selected`, JSON.stringify(selectedItems));
          console.log('Cart Debug - Saved cart to old key before switching');
        }

        // Load cart from new key
        const newCart = safeRead(newKey, []);
        const newSelected = safeRead(`${newKey}_selected`, []);

        setUserKey(newKey);
        setCart(newCart);
        setSelectedItems(newSelected);

        console.log('Cart Debug - Loaded cart from new key:', {
          key: newKey,
          cartItems: newCart.length,
          selectedItems: newSelected.length
        });
      }
    };

    window.addEventListener('userAuthChanged', refresh);
    window.addEventListener('storage',         refresh);

    return () => {
      window.removeEventListener('userAuthChanged', refresh);
      window.removeEventListener('storage',         refresh);
    };
  }, [userKey, cart, selectedItems]);

  // Persist cart data whenever it changes
  useEffect(() => {
    if (userKey) {
      localStorage.setItem(userKey, JSON.stringify(cart));
      console.log('Cart Debug - Persisted cart:', { key: userKey, items: cart.length });
    }
  }, [cart, userKey]);

  useEffect(() => {
    if (userKey) {
      localStorage.setItem(`${userKey}_selected`, JSON.stringify(selectedItems));
      console.log('Cart Debug - Persisted selected items:', { key: userKey, selected: selectedItems.length });
    }
  }, [selectedItems, userKey]);

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

  const removeSelectedItems = useCallback(() => {
    setCart(prev => prev.filter(i => !selectedItems.includes(`${i.id}-${i.selectedImage}`)));
    setSelectedItems([]);
  }, [selectedItems]);

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
      addToCart, removeFromCart, clearCart, removeSelectedItems,
      incrementQuantity, decrementQuantity,
      selectedItems, toggleSelected, selectAll, deselectAll, getSelectedItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;