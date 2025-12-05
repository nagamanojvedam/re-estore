'use client';

import { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '@/lib/services/api'; // <-- Ensure this import path is correct

export interface WishlistItem {
  productId: string;
  name?: string;
  price?: number;
  image?: string;
}

export type AddToWishlistAction = (productId: WishlistItem['productId']) => Promise<void>;
export type RemoveFromWishlistAction = (productId: WishlistItem['productId']) => Promise<void>;
export type ClearWishlistAction = () => Promise<void>;

export interface WishlistContextState {
  wishlist: WishlistItem[];
  loadingWishlist: boolean;
  addToWishlist: AddToWishlistAction;
  removeFromWishlist: RemoveFromWishlistAction;
  clearWishlist: ClearWishlistAction;
}

const WishlistContext = createContext<WishlistContextState | null>(null);

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setWishlist([]);
      setLoadingWishlist(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoadingWishlist(true);
        const res = await api.get('/users/wishlist');
        setWishlist(res.data.data.wishlist);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setWishlist([]);
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  const addToWishlist: AddToWishlistAction = async (productId) => {
    try {
      setLoadingWishlist(true);
      const res = await api.post(`/users/wishlist/${productId}`);
      setWishlist(res.data.data.wishlist);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const removeFromWishlist: RemoveFromWishlistAction = async (productId) => {
    try {
      setLoadingWishlist(true);
      const res = await api.delete(`/users/wishlist/${productId}`);
      setWishlist(res.data.data.wishlist);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const clearWishlist: ClearWishlistAction = async () => {
    try {
      setLoadingWishlist(true);
      await api.delete('/users/wishlist');
      setWishlist([]);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const value: WishlistContextState = {
    wishlist,
    loadingWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

// Custom hook for safety + autocomplete
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export { WishlistContext };
