"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Cargar el carrito desde localStorage después de montar en el cliente
  useEffect(() => {
    const storedCart = localStorage.getItem("vapor_cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Error al parsear el carrito desde localStorage:", error);
      }
    }
    setIsMounted(true);
  }, []);

  // Persistir cambios en localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("vapor_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);
  const addToCart = (game) => {
    const gameId = game.id_game || game.game_id;
    if (!gameId) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => (item.id_game || item.game_id) === gameId
      );

      if (existingItem) {
        return prevCart.map((item) =>
          (item.id_game || item.game_id) === gameId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...game, quantity: 1 }];
    });
  };

  const removeFromCart = (gameId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => (item.id_game || item.game_id) !== gameId)
    );
  };

  const incrementQuantity = (gameId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.id_game || item.game_id) === gameId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (gameId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => (item.id_game || item.game_id) === gameId
      );

      if (!existingItem) return prevCart;

      if (existingItem.quantity <= 1) {
        return prevCart.filter((item) => (item.id_game || item.game_id) !== gameId);
      }

      return prevCart.map((item) =>
        (item.id_game || item.game_id) === gameId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calcular totales
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + parseFloat(item.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isMounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
