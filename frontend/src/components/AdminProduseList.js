import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminProduseList() {
  const [produse, setProduse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user && user.rol === "ADMIN";

  // auto logout
  const handleAuthError = (msg) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProduse([]);
    setEroare(msg || "Sesiunea a expirat sau nu ai drepturi. Te rog autentifică-te din nou.");
    setLoading(false);

    // duc utilizatorul la pagina principala
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1200);
  };

  const incarcaProduse = async () => {
    setLoading(true);
    setEroare("");

    try {
      const res = await fetch("http://localhost:8080/api/admin/produse", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      // daca nu e autorizat atunci auto logout
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

  const stergeProdus = async (id) => {
    const ok = window.confirm("Sigur vrei să ștergi produsul?");
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:8080/api/admin/produse/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      // daca nu e autorizat atunci auto logout
      if (res.status === 401 || res.status === 403) {
        handleAuthError("Sesiunea a expirat sau nu ai drepturi.");
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Nu s-a putut șterge (HTTP ${res.status}). ${text}`);
      }

      // refresh rapid local
      setProduse((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e.message || "Eroare la ștergere.");
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
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>📦 Listă produse</h1>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/admin" style={{ textDecoration: "none" }}>
            <button style={btn}>⬅ Panou Admin</button>
          </Link>
          <Link to="/admin/produse/adauga" style={{ textDecoration: "none" }}>
            <button style={{ ...btn, backgroundColor: "#28a745" }}>➕ Adaugă produs</button>
          </Link>
          <button onClick={incarcaProduse} style={btn}>🔄 Refresh</button>
        </div>
      </div>

      {loading && <p style={{ marginTop: "15px" }}>Se încarcă...</p>}

      {eroare && (
        <div style={{ marginTop: "15px", backgroundColor: "#3a1f1f", padding: "12px", borderRadius: "10px" }}>
          <strong>Eroare:</strong> {eroare}
          <div style={{ marginTop: "8px", opacity: 0.9 }}>
            Dacă ai fost delogat automat, fă login din nou (admin).
          </div>
        </div>
      )}

      {!loading && !eroare && produse.length === 0 && (
        <p style={{ marginTop: "15px" }}>Nu există produse în baza de date.</p>
      )}

      {!loading && !eroare && produse.length > 0 && (
        <div style={{ marginTop: "15px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Nume</th>
                <th style={th}>Categorie</th>
                <th style={th}>Producător</th>
                <th style={th}>Preț</th>
                <th style={th}>Stoc</th>
                <th style={th}>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {produse.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #444" }}>
                  <td style={td}>{p.id}</td>
                  <td style={td}>{p.nume}</td>
                  <td style={td}>{p.categorie}</td>
                  <td style={td}>{p.producator}</td>
                  <td style={td}>{p.pret} RON</td>
                  <td style={td}>{p.stoc}</td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => navigate(`/admin/produse/edit/${p.id}`)}
                        style={{ ...actionBtn, backgroundColor: "#ffc107", color: "black" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => stergeProdus(p.id)}
                        style={{ ...actionBtn, backgroundColor: "#dc3545" }}
                      >
                        ❌ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ marginTop: "10px", opacity: 0.8 }}>
            SE afișează {produse.length} produse.
          </p>
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

const actionBtn = {
  color: "white",
  padding: "6px 10px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const th = { textAlign: "left", padding: "10px", backgroundColor: "#282c34" };
const td = { padding: "10px" };

export default AdminProduseList;
