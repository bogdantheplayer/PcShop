import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const PaginaProdus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produs, setProdus] = useState(null);
  const { adaugaInCos } = useContext(CartContext);
  const { adaugaInWishlist, stergeDinWishlist, esteInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    fetch(`http://localhost:8080/api/produse/${id}`)
      .then((res) => res.json())
      .then((data) => setProdus(data))
      .catch((err) => console.error("Eroare la încărcare produs:", err));
  }, [id]);

  if (!produs) {
    return <div style={{ padding: "20px", color: "white" }}>Se încarcă produsul...</div>;
  }

  const esteAdaugat = esteInWishlist(produs.id);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ◀ Înapoi
      </button>

      <h2>{produs.nume}</h2>
      <p><strong>Categorie:</strong> {produs.categorie}</p>
      <p><strong>Producător:</strong> {produs.producator}</p>
      <p><strong>Descriere:</strong> {produs.descriere}</p>
      <p><strong>Specificații:</strong><br /> <pre>{produs.specificatii}</pre></p>
      <p><strong>Preț:</strong> {produs.pret} Lei</p>
      <p><strong>Stoc:</strong> {produs.stoc} bucăți</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px", maxWidth: "300px" }}>
        <button
          onClick={() => adaugaInCos(produs)}
          style={{
            padding: "10px 15px",
            backgroundColor: "#28a745",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
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
            padding: "10px 15px",
            backgroundColor: esteAdaugat ? "#ffc107" : "#007bff",
            border: "none",
            borderRadius: "5px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {esteAdaugat ? "Șterge din wishlist" : "Adaugă în wishlist"}
        </button>
      </div>
    </div>
  );
};

export default PaginaProdus;
