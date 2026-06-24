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

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comentariu, setComentariu] = useState("");
  const [myReview, setMyReview] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const { adaugaInCos } = useContext(CartContext);
  const { adaugaInWishlist, stergeDinWishlist, esteInWishlist } =
    useContext(WishlistContext);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const parseJsonSafe = async (res) => {
    const text = await res.text();

    if (!text || !text.trim()) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setErr("");

      try {
        const res = await fetch(`http://localhost:8080/api/produse/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await parseJsonSafe(res);

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

    const loadReviews = async () => {
      setLoadingReviews(true);

      try {
        const res = await fetch(`http://localhost:8080/api/reviews/${id}`);
        const data = await parseJsonSafe(res);

        if (active) {
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch {
        if (active) setReviews([]);
      } finally {
        if (active) setLoadingReviews(false);
      }
    };

    const loadMyReview = async () => {
      if (!token) {
        if (active) setMyReview(null);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/api/reviews/${id}/my-review`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (!res.ok) {
          if (active) setMyReview(null);
          return;
        }

        const data = await parseJsonSafe(res);

        if (active) {
          if (!data || !data.id) {
            setMyReview(null);
            return;
          }

          setMyReview(data);
          setRating(Number(data.rating) || 5);
          setComentariu(data.comentariu || "");
        }
      } catch {
        if (active) setMyReview(null);
      }
    };

    const loadAverage = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/reviews/${id}/average`);
        const data = await parseJsonSafe(res);

        if (active) {
          setAvgRating(Number(data) || 0);
        }
      } catch {
        if (active) setAvgRating(0);
      }
    };

    load();
    loadReviews();
    loadMyReview();
    loadAverage();

    return () => {
      active = false;
    };
  }, [id, token]);

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

  const recalcAverage = (list) => {
    const sum = list.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return list.length ? sum / list.length : 0;
  };

  const trimiteReview = async () => {
  if (!user || !token) {
    alert("Trebuie să fii logat pentru a adăuga review.");
    return;
  }

  if (!comentariu.trim()) {
    alert("Scrie un comentariu.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/reviews/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        rating,
        comentariu,
      }),
    });

    const text = await res.text();
    console.log("STATUS REVIEW:", res.status);
    console.log("BODY REVIEW:", text);

    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      throw new Error(data?.message || `HTTP ${res.status}`);
    }

    const updatedReviews = [data, ...reviews];
    setReviews(updatedReviews);
    setMyReview(data);
    setComentariu("");
    setRating(5);

    const sum = updatedReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    setAvgRating(updatedReviews.length ? sum / updatedReviews.length : 0);
  } catch (e) {
    console.error("Eroare review:", e);
    alert(e.message || "Eroare la salvarea review-ului.");
  }
};

  const updateReview = async () => {
    if (!myReview?.id) {
      alert("Nu există review de actualizat.");
      return;
    }

    if (!comentariu.trim()) {
      alert("Scrie un comentariu.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${myReview.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          rating,
          comentariu,
        }),
      });

      const data = await parseJsonSafe(res);

      if (!res.ok) {
        throw new Error(data?.message || "Eroare la actualizare.");
      }

      if (!data) {
        throw new Error("Serverul nu a returnat review-ul actualizat.");
      }

      setMyReview(data);
      setEditMode(false);

      const updatedReviews = reviews.map((r) => (r.id === data.id ? data : r));
      setReviews(updatedReviews);
      setAvgRating(recalcAverage(updatedReviews));
    } catch (e) {
      alert(e.message || "Eroare la editare.");
    }
  };

  const deleteReview = async () => {
    if (!myReview?.id) {
      alert("Nu există review de șters.");
      return;
    }

    if (!window.confirm("Sigur vrei să ștergi review-ul?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${myReview.id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await parseJsonSafe(res);

      if (!res.ok) {
        throw new Error(data?.message || "Eroare la ștergere.");
      }

      const updatedReviews = reviews.filter((r) => r.id !== myReview.id);
      setReviews(updatedReviews);
      setMyReview(null);
      setEditMode(false);
      setComentariu("");
      setRating(5);
      setAvgRating(recalcAverage(updatedReviews));
    } catch (e) {
      alert(e.message || "Eroare la ștergere.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          color: "white",
          background: "#1e1e1e",
          minHeight: "100vh",
        }}
      >
        Se încarcă produsul...
      </div>
    );
  }

  if (err || !produs) {
    return (
      <div
        style={{
          padding: "20px",
          color: "white",
          background: "#1e1e1e",
          minHeight: "100vh",
        }}
      >
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
    <div
      style={{
        padding: "20px",
        color: "white",
        background: "#1e1e1e",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
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
        className="produs-grid"
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
              backgroundColor: "#181a1f",
              width: "100%",
              aspectRatio: "4 / 3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={galleryImages[imgIndex] || placeholderImages[0]}
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

          <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
            {galleryImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                style={{
                  border:
                    i === imgIndex
                      ? "2px solid #ff9800"
                      : "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  padding: "0",
                  cursor: "pointer",
                  background: "#181a1f",
                  overflow: "hidden",
                  width: "120px",
                  height: "75px",
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
                    objectFit: "contain",
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

            <div style={{ color: "#ffcc66", fontSize: "18px" }}>
              {"★".repeat(Math.round(avgRating))}
              {"☆".repeat(5 - Math.round(avgRating))}
              {" "}
              ({avgRating.toFixed(1)})
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
                  backgroundColor:
                    (Number(produs.stoc) || 0) <= 0 ? "#555" : "#28a745",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  cursor:
                    (Number(produs.stoc) || 0) <= 0 ? "not-allowed" : "pointer",
                  fontWeight: 800,
                }}
              >
                ➕ Adaugă în coș
              </button>

              <button
                onClick={() =>
                  esteAdaugat
                    ? stergeDinWishlist(produs.id)
                    : adaugaInWishlist(produs)
                }
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
                {esteAdaugat
                  ? "★ În wishlist (apasă pentru ștergere)"
                  : "☆ Adaugă în wishlist"}
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

              <div
                style={{
                  marginTop: "18px",
                  paddingTop: "18px",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: "10px", fontSize: "18px" }}>
                  ⭐ Review-uri
                </div>

                {loadingReviews ? (
                  <div style={{ opacity: 0.85 }}>Se încarcă review-urile...</div>
                ) : reviews.length === 0 ? (
                  <div style={{ opacity: 0.85, marginBottom: "16px" }}>
                    Nu există review-uri încă.
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginBottom: "16px",
                    }}
                  >
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          backgroundColor: "#1b1d22",
                          borderRadius: "12px",
                          padding: "12px",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                          {r.username || "Utilizator"}
                        </div>

                        <div style={{ color: "#ffcc66", marginBottom: "6px" }}>
                          {"★".repeat(Number(r.rating) || 0)}
                          {"☆".repeat(5 - (Number(r.rating) || 0))}
                        </div>

                        <div style={{ opacity: 0.92, lineHeight: 1.5 }}>
                          {r.comentariu}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!user ? (
                  <div style={{ opacity: 0.85 }}>
                    Trebuie să fii logat pentru a adăuga un review.
                  </div>
                ) : myReview && !editMode ? (
                  <div
                    style={{
                      backgroundColor: "#1f2d1f",
                      borderRadius: "12px",
                      padding: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ marginBottom: "10px" }}>
                      Ai adăugat deja un review pentru acest produs.
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => {
                          setEditMode(true);
                          setRating(Number(myReview.rating) || 5);
                          setComentariu(myReview.comentariu || "");
                        }}
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          padding: "10px 14px",
                          cursor: "pointer",
                        }}
                      >
                        ✏️ Editează
                      </button>

                      <button
                        onClick={deleteReview}
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          padding: "10px 14px",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Șterge
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#1b1d22",
                      borderRadius: "12px",
                      padding: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: "10px" }}>
                      {editMode ? "Editează review" : "Adaugă review"}
                    </div>

                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      style={{
                        marginBottom: "10px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #444",
                        backgroundColor: "#111",
                        color: "white",
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={4}>4</option>
                      <option value={3}>3</option>
                      <option value={2}>2</option>
                      <option value={1}>1</option>
                    </select>

                    <textarea
                      value={comentariu}
                      onChange={(e) => setComentariu(e.target.value)}
                      placeholder="Scrie opinia ta despre produs..."
                      style={{
                        width: "100%",
                        minHeight: "100px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #444",
                        backgroundColor: "#111",
                        color: "white",
                        resize: "vertical",
                        marginBottom: "10px",
                      }}
                    />

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        onClick={editMode ? updateReview : trimiteReview}
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          padding: "10px 14px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        {editMode ? "Salvează modificările" : "Trimite review"}
                      </button>

                      {editMode && (
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setRating(Number(myReview?.rating) || 5);
                            setComentariu(myReview?.comentariu || "");
                          }}
                          style={{
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            cursor: "pointer",
                          }}
                        >
                          Renunță
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .produs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PaginaProdus;