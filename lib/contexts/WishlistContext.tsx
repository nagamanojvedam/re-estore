'use client';

import { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { addToWishlist, clearWishlist, getWishlist, removeFromWishlist } from '@/lib/data/wishlist';

export interface WishlistItem {
  productId: any; // Ideally types would be shared
  addedAt?: Date;
}

export type AddToWishlistAction = (productId: string) => Promise<void>;
export type RemoveFromWishlistAction = (productId: string) => Promise<void>;
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
        const data = await getWishlist();
        setWishlist(data);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setWishlist([]);
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  const handleAddToWishlist: AddToWishlistAction = async (productId) => {
    try {
        // Optimistic update could be done here, but for now wait for server
      setLoadingWishlist(true);
      const updatedWishlist = await addToWishlist(productId);
      setWishlist(updatedWishlist);
    } catch(err) {
        console.error(err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleRemoveFromWishlist: RemoveFromWishlistAction = async (productId) => {
    try {
      setLoadingWishlist(true);
      const updatedWishlist = await removeFromWishlist(productId);
      setWishlist(updatedWishlist);
    } catch(err) {
        console.error(err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleClearWishlist: ClearWishlistAction = async () => {
    try {
      setLoadingWishlist(true);
      await clearWishlist();
      setWishlist([]);
    } catch(err) {
        console.error(err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const value: WishlistContextState = {
    wishlist,
    loadingWishlist,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    clearWishlist: handleClearWishlist,
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
