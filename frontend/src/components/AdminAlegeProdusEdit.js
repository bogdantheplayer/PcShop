import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminAlegeProdusEdit() {
  const [produse, setProduse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user && user.rol === "ADMIN";

  const handleAuthError = (msg) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setEroare(msg || "Sesiunea a expirat. Te rog autentifică-te din nou.");
    setLoading(false);
    setTimeout(() => navigate("/", { replace: true }), 1200);
  };

  useEffect(() => {
    if (!isAdmin) return;
    if (!token) return handleAuthError("Nu ești autentificat. Te redirecționez către login...");

    (async () => {
      try {
        const res = await fetch("http://localhost:8080/api/admin/produse", {
          headers: { Authorization: "Bearer " + token }
        });

        if (res.status === 401 || res.status === 403) {
          return handleAuthError("Nu ai acces sau sesiunea a expirat. Te redirecționez...");
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
    })();
  }, []);

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
        <h1 style={{ margin: 0 }}>✏️ Alege produs pentru editare</h1>
        <Link to="/admin" style={{ textDecoration: "none" }}>
          <button style={btn}>⬅ Panou Admin</button>
        </Link>
      </div>

      {loading && <p style={{ marginTop: "15px" }}>Se încarcă...</p>}
      {eroare && (
        <div style={{ marginTop: "15px", backgroundColor: "#3a1f1f", padding: "12px", borderRadius: "10px" }}>
          <strong>Eroare:</strong> {eroare}
        </div>
      )}

      {!loading && !eroare && produse.length === 0 && <p style={{ marginTop: "15px" }}>Nu există produse.</p>}

      {!loading && !eroare && produse.length > 0 && (
        <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "700px" }}>
          {produse.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/admin/produse/edit/${p.id}`)}
              style={{
                ...btn,
                justifyContent: "space-between",
                width: "100%",
                height: "auto",
                padding: "12px",
              }}
            >
              <span>#{p.id} — {p.nume}</span>
              <span style={{ opacity: 0.9 }}>✏️</span>
            </button>
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

export default AdminAlegeProdusEdit;
