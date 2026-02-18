import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function AdminComandaEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user && user.rol === "ADMIN";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eroare, setEroare] = useState("");

  const [comanda, setComanda] = useState(null);
  const [form, setForm] = useState({
    adresa: "",
    oras: "",
    judet: "",
    tara: "",
    codPostal: "",
  });

  const handleAuthError = (msg) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setEroare(msg || "Sesiunea a expirat sau nu ai drepturi.");
    setLoading(false);
    setSaving(false);
    setTimeout(() => navigate("/", { replace: true }), 1200);
  };

  const incarca = async () => {
    setLoading(true);
    setEroare("");

    try {
      const res = await fetch(`http://localhost:8080/api/admin/comenzi/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });

      if (res.status === 401 || res.status === 403) {
        handleAuthError("Sesiunea a expirat sau nu ești ADMIN.");
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Eroare HTTP ${res.status}. ${text}`);
      }

      const data = await res.json();
      setComanda(data);
      setForm({
        adresa: data.adresa || "",
        oras: data.oras || "",
        judet: data.judet || "",
        tara: data.tara || "",
        codPostal: data.codPostal || "",
      });
    } catch (e) {
      setEroare(e.message || "Eroare la încărcare comandă.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    if (!token) return handleAuthError("Nu ești autentificat.");
    incarca();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEroare("");

    try {
      const res = await fetch(`http://localhost:8080/api/admin/comenzi/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401 || res.status === 403) {
        handleAuthError("Sesiunea a expirat sau nu ești ADMIN.");
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Eroare la salvare (HTTP ${res.status}). ${text}`);
      }

      alert(" Comanda a fost actualizată!");
      navigate(-1);
    } catch (e2) {
      setEroare(e2.message || "Eroare la salvare.");
    } finally {
      setSaving(false);
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
        <h1 style={{ margin: 0 }}>✏️ Edit comandă #{id}</h1>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button style={btn} type="button" onClick={() => navigate(-1)}>⬅ Înapoi</button>
          <Link to="/admin/comenzi" style={{ textDecoration: "none" }}>
            <button style={btn}>🧾 Toate comenzile</button>
          </Link>
        </div>
      </div>

      {loading && <p style={{ marginTop: "15px" }}>Se încarcă...</p>}
      {eroare && (
        <div style={{ marginTop: "15px", backgroundColor: "#3a1f1f", padding: "12px", borderRadius: "10px" }}>
          <strong>Eroare:</strong> {eroare}
        </div>
      )}

      {!loading && comanda && (
        <form
          onSubmit={handleSave}
          style={{
            marginTop: "15px",
            maxWidth: "700px",
            backgroundColor: "#282c34",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ opacity: 0.9, marginBottom: "12px" }}>
            <b>Total:</b> {comanda.total} lei • <b>Utilizator:</b> {comanda.utilizatorId}
          </div>

          <div style={row}>
            <label style={label}>Adresă</label>
            <input name="adresa" value={form.adresa} onChange={handleChange} style={input} />
          </div>

          <div style={row}>
            <label style={label}>Oraș</label>
            <input name="oras" value={form.oras} onChange={handleChange} style={input} />
          </div>

          <div style={row}>
            <label style={label}>Județ</label>
            <input name="judet" value={form.judet} onChange={handleChange} style={input} />
          </div>

          <div style={row}>
            <label style={label}>Țară</label>
            <input name="tara" value={form.tara} onChange={handleChange} style={input} />
          </div>

          <div style={row}>
            <label style={label}>Cod poștal</label>
            <input name="codPostal" value={form.codPostal} onChange={handleChange} style={input} />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ ...btn, backgroundColor: "#28a745", width: "100%", marginTop: "10px" }}
          >
            {saving ? "Se salvează..." : "💾 Salvează"}
          </button>

        </form>
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

const row = { marginBottom: "12px", display: "flex", flexDirection: "column", gap: "6px" };
const label = { fontWeight: "bold", opacity: 0.95 };
const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#1e1e1e",
  color: "white",
};

export default AdminComandaEdit;
