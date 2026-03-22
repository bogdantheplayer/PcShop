import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const PaginaProdus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produs, setProdus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [imgIndex, setImgIndex] = useState(0);

  const { adaugaInCos } = useContext(CartContext);
  const { adaugaInWishlist, stergeDinWishlist, esteInWishlist } =
    useContext(WishlistContext);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setErr("");

      try {
        const res = await fetch(`http://localhost:8080/api/produse/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (active) {
          setProdus(data);
          setImgIndex(0);
        }
      } catch (e) {
        if (active) setErr(e.message || "Eroare la încărcare produs.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  const esteAdaugat = produs ? esteInWishlist(produs.id) : false;

  const placeholderImages = useMemo(() => {
    const name = produs?.nume ? encodeURIComponent(produs.nume) : "Produs";
    return [
      `https://via.placeholder.com/1000x700/2b2f36/ffffff?text=${name}+1`,
      `https://via.placeholder.com/1000x700/2b2f36/ffffff?text=${name}+2`,
      `https://via.placeholder.com/1000x700/2b2f36/ffffff?text=${name}+3`,
    ];
  }, [produs?.nume]);

  const galleryImages = useMemo(() => {
    if (!produs) return placeholderImages;

    const dbImages = [produs.imagine1, produs.imagine2, produs.imagine3]
      .map((img) => (typeof img === "string" ? img.trim() : ""))
      .filter(Boolean);

    return dbImages.length > 0 ? dbImages : placeholderImages;
  }, [produs, placeholderImages]);

  const formatPret = (val) => {
    const n = Number(val);
    if (Number.isNaN(n)) return `${val} Lei`;
    return `${n.toFixed(2)} Lei`;
  };

  const badgeStock = (stoc) => {
    const s = Number(stoc) || 0;
    if (s <= 0) return { text: "Stoc epuizat", bg: "#dc3545" };
    if (s <= 5) return { text: "Stoc redus", bg: "#ffc107", color: "#111" };
    return { text: "În stoc", bg: "#28a745" };
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "white", background: "#1e1e1e", minHeight: "100vh" }}>
        Se încarcă produsul...
      </div>
    );
  }

  if (err || !produs) {
    return (
      <div style={{ padding: "20px", color: "white", background: "#1e1e1e", minHeight: "100vh" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 14px",
            cursor: "pointer",
          }}
        >
          ◀ Înapoi
        </button>
        <div
          style={{
            backgroundColor: "#2a2a2a",
            borderRadius: "14px",
            padding: "14px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Eroare: {err || "Produs inexistent."}
        </div>
      </div>
    );
  }

  const stock = badgeStock(produs.stoc);

  return (
    <div style={{ padding: "20px", color: "white", background: "#1e1e1e", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 14px",
            cursor: "pointer",
          }}
        >
          ◀ Înapoi
        </button>

        <div
          style={{
            padding: "8px 12px",
            borderRadius: "999px",
            backgroundColor: stock.bg,
            color: stock.color || "white",
            fontWeight: 700,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}
        >
          {stock.text} • {Number(produs.stoc) || 0}
        </div>
      </div>

      <div
        className="produs-layout"
        style={{
          marginTop: "16px",
          display: "grid",
          gridTemplateColumns: "1.35fr 1fr",
          gap: "18px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            backgroundColor: "#23262c",
            borderRadius: "16px",
            padding: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "#11151b",
              height: "620px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={galleryImages[imgIndex]}
              alt={produs.nume}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = placeholderImages[imgIndex] || placeholderImages[0];
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "12px",
              flexWrap: "wrap",
            }}
          >
            {galleryImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                style={{
                  border: i === imgIndex ? "2px solid #ff9800" : "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  padding: "0",
                  cursor: "pointer",
                  background: "#11151b",
                  overflow: "hidden",
                  width: "120px",
                  height: "80px",
                  flex: "0 0 auto",
                }}
                title={`Imagine ${i + 1}`}
              >
                <img
                  src={src}
                  alt={`${produs.nume} ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = placeholderImages[i] || placeholderImages[0];
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#23262c",
            borderRadius: "16px",
            padding: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "24px", fontWeight: 800, lineHeight: 1.2 }}>
              {produs.nume}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <span
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  fontSize: "13px",
                }}
              >
                {produs.categorie || "-"}
              </span>
              <span
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  fontSize: "13px",
                }}
              >
                {produs.producator || "-"}
              </span>
            </div>

            <div
              style={{
                marginTop: "6px",
                fontSize: "28px",
                fontWeight: 900,
                color: "#28a745",
              }}
            >
              {formatPret(produs.pret)}
            </div>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <button
                onClick={() => adaugaInCos(produs)}
                disabled={(Number(produs.stoc) || 0) <= 0}
                style={{
                  padding: "12px 14px",
                  backgroundColor: (Number(produs.stoc) || 0) <= 0 ? "#555" : "#28a745",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  cursor: (Number(produs.stoc) || 0) <= 0 ? "not-allowed" : "pointer",
                  fontWeight: 800,
                }}
              >
                ➕ Adaugă în coș
              </button>

              <button
                onClick={() => (esteAdaugat ? stergeDinWishlist(produs.id) : adaugaInWishlist(produs))}
                style={{
                  padding: "12px 14px",
                  backgroundColor: esteAdaugat ? "#ffc107" : "#007bff",
                  border: "none",
                  borderRadius: "12px",
                  color: esteAdaugat ? "#111" : "white",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                {esteAdaugat ? "★ În wishlist (apasă pentru ștergere)" : "☆ Adaugă în wishlist"}
              </button>
            </div>

            <div
              style={{
                marginTop: "14px",
                paddingTop: "14px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "10px",
                fontSize: "14px",
                opacity: 0.95,
              }}
            >
              <div>
                <div style={{ fontWeight: 800, marginBottom: "4px" }}>Descriere</div>
                <div style={{ opacity: 0.9, lineHeight: 1.5 }}>
                  {produs.descriere || "Fără descriere."}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 800, marginBottom: "6px" }}>Specificații</div>
                <pre
                  style={{
                    margin: 0,
                    backgroundColor: "#1b1d22",
                    padding: "12px",
                    borderRadius: "12px",
                    overflowX: "auto",
                    border: "1px solid rgba(255,255,255,0.08)",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.45,
                  }}
                >
                  {produs.specificatii || "—"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .produs-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PaginaProdus;