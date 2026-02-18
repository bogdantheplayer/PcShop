import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminAlegeProdusStergere() {
  const [produse, setProduse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user && user.rol === "ADMIN";

  const handleAuthError = (msg) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setEroare(msg || "Sesiunea a expirat sau nu ai drepturi. Te rog autentifică-te din nou.");
    setLoading(false);
    setDeletingId(null);

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1200);
  };

  const incarcaProduse = async () => {
    setLoading(true);
    setEroare("");

    try {
      const res = await fetch("http://localhost:8080/api/admin/produse", {
        headers: { Authorization: "Bearer " + token },
      });

      if (res.status === 401 || res.status === 403) {
        handleAuthError("Sesiunea a expirat sau nu ești ADMIN. Te redirecționez către login...");
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Eroare HTTP ${res.status}. ${text}`);
      }

      const data = await res.json();
      setProduse(Array.isArray(data) ? data : []);
    } catch (e) {
      setEroare(e.message || "Eroare la încărcare produse.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    if (!token) {
      handleAuthError("Nu ești autentificat. Te redirecționez către login...");
      return;
    }

    incarcaProduse();
  }, []);

  const stergeProdus = async (produs) => {
    const ok = window.confirm(
      `Sigur vrei să ștergi produsul?\n\n#${produs.id} — ${produs.nume}`
    );
    if (!ok) return;

    setDeletingId(produs.id);

    try {
      const res = await fetch(`http://localhost:8080/api/admin/produse/${produs.id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      if (res.status === 401 || res.status === 403) {
        handleAuthError("Sesiunea a expirat sau nu ai drepturi. Te redirecționez către login...");
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Nu s-a putut șterge (HTTP ${res.status}). ${text}`);
      }

      setProduse((prev) => prev.filter((p) => p.id !== produs.id));
      alert(" Produs șters!");
    } catch (e) {
      alert(e.message || "Eroare la ștergere.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: "20px", color: "white" }}>
        <h2>Acces interzis</h2>
        <p>Doar ADMIN poate vedea această pagină.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <h1 style={{ margin: 0 }}>❌ Alege produs pentru ștergere</h1>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/admin" style={{ textDecoration: "none" }}>
            <button style={btn}>⬅ Panou Admin</button>
          </Link>
          <button onClick={incarcaProduse} style={btn} disabled={loading || deletingId !== null}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading && <p style={{ marginTop: "15px" }}>Se încarcă...</p>}
      {eroare && (
        <div style={{ marginTop: "15px", backgroundColor: "#3a1f1f", padding: "12px", borderRadius: "10px" }}>
          <strong>Eroare:</strong> {eroare}
        </div>
      )}

      {!loading && !eroare && produse.length === 0 && (
        <p style={{ marginTop: "15px" }}>Nu există produse în baza de date.</p>
      )}

      {!loading && !eroare && produse.length > 0 && (
        <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "800px" }}>
          {produse.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: "#282c34",
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold" }}>
                  #{p.id} — {p.nume}
                </div>
                <div style={{ opacity: 0.85, fontSize: "14px" }}>
                  {p.categorie} • {p.producator} • {p.pret} RON • stoc: {p.stoc}
                </div>
              </div>

              <button
                onClick={() => stergeProdus(p)}
                disabled={deletingId === p.id}
                style={{
                  ...dangerBtn,
                  opacity: deletingId === p.id ? 0.7 : 1,
                }}
              >
                {deletingId === p.id ? "Se șterge..." : "❌ Șterge"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const btn = {
  backgroundColor: "#6c757d",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  minWidth: "140px",
  height: "36px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
};

const dangerBtn = {
  backgroundColor: "#dc3545",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  minWidth: "120px",
  height: "36px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
};

export default AdminAlegeProdusStergere;
