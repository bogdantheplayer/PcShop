import React, { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const adaugaInWishlist = (produs) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === produs.id)) return prev;
      return [...prev, produs];
    });
  };

  const stergeDinWishlist = (id) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  const esteInWishlist = (id) => {
    return wishlist.some((p) => p.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        adaugaInWishlist,
        stergeDinWishlist,
        esteInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};