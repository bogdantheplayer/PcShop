import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "./ProductCard";

const WishlistPage = () => {
  const { wishlist } = useContext(WishlistContext);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#fff" }}>Produse în Wishlist</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {wishlist.length === 0 ? (
          <p style={{ color: "#ccc" }}>Nu ai adăugat produse în wishlist.</p>
        ) : (
          wishlist.map((produs) => <ProductCard key={produs.id} produs={produs} />)
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
