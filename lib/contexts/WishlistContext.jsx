"use client";

import { createContext, useEffect, useState } from "react";
import api from "@/lib/services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api
        .get("/users/wishlist")
        .then((res) => {
          setWishlist(res.data.data.wishlist);
        })
        .catch((err) => {
          console.error("Failed to fetch wishlist:", err);
          setWishlist([]);
        })
        .finally(() => setLoading(false));
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addToWishlist = async (productId) => {
    setLoading(true);
    const res = await api.post(`/users/wishlist/${productId}`);
    setWishlist(res.data.data.wishlist);
    setLoading(false);
  };

  const removeFromWishlist = async (productId) => {
    setLoading(true);
    const res = await api.delete(`/users/wishlist/${productId}`);
    setWishlist(res.data.data.wishlist);
    setLoading(false);
  };

  const clearWishlist = async () => {
    setLoading(true);
    await api.delete("/users/wishlist");
    setWishlist([]);
    setLoading(false);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loadingWishlist: loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export { WishlistContext, WishlistProvider };
