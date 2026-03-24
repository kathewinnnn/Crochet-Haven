import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Track selected items for checkout
  const [selectedItems, setSelectedItems] = useState(() => {
    const savedSelected = localStorage.getItem('selectedItems');
    return savedSelected ? JSON.parse(savedSelected) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
  }, [selectedItems]);

  const toggleSelected = (productId, selectedImage) => {
    setSelectedItems(prev => {
      const key = `${productId}-${selectedImage}`;
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      }
      return [...prev, key];
    });
  };

  const selectAll = () => {
    const allKeys = cart.map(item => `${item.id}-${item.selectedImage}`);
    setSelectedItems(allKeys);
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const getSelectedItems = () => {
    return cart.filter(item => selectedItems.includes(`${item.id}-${item.selectedImage}`));
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      // Check if product already exists in cart (by both id AND selectedImage)
      const existingItem = prevCart.find(item => 
        item && item.id === product.id && item.selectedImage === product.selectedImage
      );
      if (existingItem) {
        // Increment quantity
        return prevCart.map(item => 
          item && item.id === product.id && item.selectedImage === product.selectedImage
            ? { ...item, quantity: (item.quantity || 1) + 1, addedAt: Date.now() }
            : item
        );
      }
      // Add new item with quantity 1 and timestamp
      return [...prevCart, { ...product, quantity: 1, addedAt: Date.now() }];
    });
  };

  const incrementQuantity = (productId, selectedImage) => {
    setCart(prevCart => {
      return prevCart.map(item =>
        item && item.id === productId && item.selectedImage === selectedImage
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const decrementQuantity = (productId, selectedImage) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item && item.id === productId && item.selectedImage === selectedImage);
      if (item && item.quantity > 1) {
        return prevCart.map(item =>
          item && item.id === productId && item.selectedImage === selectedImage
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart;
    });
  };

  const removeFromCart = (productId, selectedImage) => {
    setCart(prevCart => {
      return prevCart.filter(item => item && !(item.id === productId && item.selectedImage === selectedImage));
    });
  };

  const clearCart = () => {
    setCart([]);
    setSelectedItems([]);
  };

  // Total items (sum of quantities)
  const totalItems = cart.reduce((sum, item) => {
    const qty = item && item.quantity ? Number(item.quantity) : 1;
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);

  const value = {
    cart,
    setCart,
    totalItems,
    addToCart,
    removeFromCart,
    clearCart,
    incrementQuantity,
    decrementQuantity,
    selectedItems,
    toggleSelected,
    selectAll,
    deselectAll,
    getSelectedItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
