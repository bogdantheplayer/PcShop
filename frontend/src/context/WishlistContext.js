import React, { createContext, useState } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const adaugaInWishlist = (produs) => {
    setWishlist((prev) => {
      // evita duplicate
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
      value={{ wishlist, adaugaInWishlist, stergeDinWishlist, esteInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
