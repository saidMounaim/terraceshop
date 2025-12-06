import { create } from "zustand";

interface CartState {
  isOpen: boolean;
  cartQuantity: number;
  openCart: () => void;
  closeCart: () => void;
  setQuantity: (qty: number) => void;
  addItemOptimistic: (amount: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  cartQuantity: 0,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  setQuantity: (qty) => set({ cartQuantity: qty }),

  addItemOptimistic: (amount) =>
    set((state) => ({ cartQuantity: state.cartQuantity + amount })),
}));
