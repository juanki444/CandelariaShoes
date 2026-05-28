import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // array of product IDs
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => set((state) => {
        const isAlreadyIn = state.items.includes(productId);
        if (isAlreadyIn) {
          return { items: state.items.filter(id => id !== productId) };
        } else {
          return { items: [...state.items, productId] };
        }
      }),
      isInWishlist: (productId) => get().items.includes(productId),
      getWishlistCount: () => get().items.length,
    }),
    {
      name: 'candelaria-wishlist',
    }
  )
);
