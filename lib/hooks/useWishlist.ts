import { useContext } from 'react';
import { WishlistContext } from '../contexts/WishlistContext';

function useWishlist() {
  const context = useContext(WishlistContext);

  if (context === undefined) throw new Error("Wishlist context used outside it's provider");

  return context;
}

export { useWishlist };
