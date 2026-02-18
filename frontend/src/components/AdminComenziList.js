import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminComenziList() {
  const [comenzi, setComenzi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState("");
  const [expanded, setExpanded] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user && user.rol === "ADMIN";

  const handleAuthError = (msg) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setEroare(msg || "Sesiunea a expirat sau nu ai drepturi. Te rog autentifică-te din nou.");
    setLoading(false);

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1200);
  };

  const incarcaComenzi = async () => {
    setLoading(true);
    setEroare("");

    try {
      const res = await fetch("http://localhost:8080/api/admin/comenzi", {
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
      setComenzi(Array.isArray(data) ? data : []);
    } catch (e) {
      setEroare(e.message || "Eroare la încărcare comenzi.");
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

    incarcaComenzi();
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
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>🧾 Admin - Comenzi</h1>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/admin" style={{ textDecoration: "none" }}>
            <button style={btn}>⬅ Panou Admin</button>
          </Link>
          <button onClick={incarcaComenzi} style={btn} disabled={loading}>
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

      {!loading && !eroare && comenzi.length === 0 && (
        <p style={{ marginTop: "15px" }}>Nu există comenzi.</p>
      )}

      {!loading && !eroare && comenzi.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {comenzi.map((c) => (
              <li
                key={c.id}
                style={{
                  backgroundColor: "#282c34",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", cursor: "pointer" }}
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                >
                  <div>
                    <div style={{ fontWeight: "bold" }}>Comanda #{c.id}</div>
                    <div style={{ opacity: 0.9, fontSize: "14px" }}>
                      Utilizator: {c.utilizatorId} • Total: {c.total} lei • Data:{" "}
                      {c.dataComanda ? new Date(c.dataComanda).toLocaleString() : "-"}
                    </div>
                  </div>
                  <div style={{ opacity: 0.9 }}>{expanded === c.id ? "▲" : "▼"}</div>
                </div>

                {expanded === c.id && (
                  <div style={{ marginTop: "12px", borderTop: "1px solid #444", paddingTop: "12px" }}>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                      <button
                        style={{ ...btn, backgroundColor: "#ffc107", color: "black" }}
                        onClick={() => navigate(`/admin/comenzi/edit/${c.id}`)}
                      >
                        ✏️ Edit
                      </button>
                    </div>

                    <h4 style={{ margin: "10px 0" }}>Produse:</h4>
                    <ul style={{ marginTop: 0 }}>
                      {(c.produse || []).map((p, idx) => (
                        <li key={idx}>
                          {p.numeProdus} — {p.cantitate} buc × {p.pret} lei
                        </li>
                      ))}
                    </ul>

                    <h4 style={{ margin: "10px 0" }}>Facturare / Livrare:</h4>
                    <div style={{ opacity: 0.9, fontSize: "14px" }}>
                      <div><b>Adresă:</b> {c.adresa}</div>
                      <div><b>Oraș:</b> {c.oras}</div>
                      <div><b>Județ:</b> {c.judet}</div>
                      <div><b>Țară:</b> {c.tara}</div>
                      <div><b>Cod poștal:</b> {c.codPostal}</div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
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

export default AdminComenziList;
