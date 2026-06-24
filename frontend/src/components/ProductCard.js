import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { Link } from "react-router-dom";

function ProductCard({ produs }) {
  const { adaugaInCos } = useContext(CartContext);
  const { adaugaInWishlist, stergeDinWishlist, esteInWishlist } = useContext(WishlistContext);

  const [avgRating, setAvgRating] = useState(0);

  const specificatii = produs.specificatii?.split("\n") || [];
  const esteAdaugat = esteInWishlist(produs.id);

  useEffect(() => {
    let active = true;

    const loadAverage = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/reviews/${produs.id}/average`);
        const data = await res.json();
        if (active) setAvgRating(Number(data) || 0);
      } catch {
        if (active) setAvgRating(0);
      }
    };

    loadAverage();

    return () => {
      active = false;
    };
  }, [produs.id]);

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
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {produs.imagine1 ? (
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
                }}
              />
            ) : (
              <p style={{ textAlign: "center" }}>Imagine Produs</p>
            )}
          </div>

          <h3 style={{ color: "#ff4d4d", marginBottom: "6px" }}>{produs.nume}</h3>

          <div style={{ color: "#ffcc66", marginBottom: "8px", fontSize: "14px" }}>
            {"★".repeat(Math.round(avgRating))}
            {"☆".repeat(5 - Math.round(avgRating))}
            {" "}
            ({avgRating.toFixed(1)})
          </div>

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
          {Number(produs.pret).toFixed(2)} RON
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