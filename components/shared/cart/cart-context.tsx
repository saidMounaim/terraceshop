"use client";

import React, {
  createContext,
  useContext,
  useState,
  useOptimistic,
} from "react";

type CartContextType = {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartQuantity: number;
  updateCartQuantity: (qty: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const updateCartQuantity = (qty: number) => setCartQuantity(qty);

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        cartQuantity,
        updateCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
