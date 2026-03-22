import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { Link } from "react-router-dom";

function ProductCard({ produs }) {
  const { adaugaInCos } = useContext(CartContext);
  const { adaugaInWishlist, stergeDinWishlist, esteInWishlist } = useContext(WishlistContext);

  const specificatii = produs.specificatii?.split("\n") || [];
  const esteAdaugat = esteInWishlist(produs.id);

  const areImagine = produs.imagine1 && produs.imagine1.trim() !== "";

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        color: "#fff",
        borderRadius: "10px",
        padding: "15px",
        width: "250px",
        minHeight: "470px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Link
        to={`/produs/${produs.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div>
          <div
            style={{
              height: "150px",
              background: "#333",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: "6px",
            }}
          >
            {areImagine ? (
              <img
                src={produs.imagine1}
                alt={produs.nume}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.innerHTML =
                    '<p style="text-align:center;color:white;">Imagine Produs</p>';
                }}
              />
            ) : (
              <p style={{ textAlign: "center" }}>Imagine Produs</p>
            )}
          </div>

          <h3 style={{ color: "#ff4d4d" }}>{produs.nume}</h3>
          <p
            style={{
              fontStyle: "italic",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            Categorie: {produs.categorie}
          </p>

          <div style={{ fontSize: "14px", marginBottom: "10px" }}>
            {specificatii.slice(0, 4).map((spec, idx) => (
              <div key={idx}>• {spec}</div>
            ))}
          </div>
        </div>
      </Link>

      <div>
        <p style={{ fontWeight: "bold", fontSize: "18px" }}>
          {produs.pret.toFixed(2)} RON
        </p>

        <button
          onClick={() => adaugaInCos(produs)}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
            width: "100%",
          }}
        >
          Adaugă în coș
        </button>

        <button
          onClick={() =>
            esteAdaugat
              ? stergeDinWishlist(produs.id)
              : adaugaInWishlist(produs)
          }
          style={{
            backgroundColor: esteAdaugat ? "#ffc107" : "#007bff",
            color: "#fff",
            padding: "8px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
            width: "100%",
          }}
        >
          {esteAdaugat ? "Șterge din wishlist" : "Adaugă în wishlist"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;