import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminProdusAdauga() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user && user.rol === "ADMIN";

  const [saving, setSaving] = useState(false);
  const [eroare, setEroare] = useState("");

  const [form, setForm] = useState({
    nume: "",
    descriere: "",
    categorie: "",
    producator: "",
    pret: 0,
    stoc: 0,
    specificatii: "",
  });

  const handleAuthError = (msg) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setEroare(msg || "Sesiunea a expirat sau nu ai drepturi. Te rog autentifică-te din nou.");
    setSaving(false);

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "pret" || name === "stoc" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEroare("");

    if (!token) {
      handleAuthError("Nu ești autentificat. Te redirecționez către login...");
      return;
    }

    if (!form.nume || !form.categorie) {
      setEroare("Completează cel puțin: nume și categorie.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("http://localhost:8080/api/admin/produse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401 || res.status === 403) {
        handleAuthError("Sesiunea a expirat sau nu ești ADMIN. Te redirecționez către login...");
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Eroare la salvare (HTTP ${res.status}). ${text}`);
      }

      const saved = await res.json();
      alert(" Produs adăugat! ID: " + saved.id);

      navigate("/admin/produse");
    } catch (err) {
      setEroare(err.message || "Eroare la adăugare.");
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
        <h1 style={{ margin: 0 }}>➕ Adaugă produs</h1>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/admin" style={{ textDecoration: "none" }}>
            <button style={btn}>⬅ Panou Admin</button>
          </Link>
          <Link to="/admin/produse" style={{ textDecoration: "none" }}>
            <button style={btn}>📦 Lista produse</button>
          </Link>
        </div>
      </div>

      {eroare && (
        <div style={{ marginTop: "15px", backgroundColor: "#3a1f1f", padding: "12px", borderRadius: "10px" }}>
          <strong>Eroare:</strong> {eroare}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "15px",
          maxWidth: "700px",
          backgroundColor: "#282c34",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        <div style={row}>
          <label style={label}>Nume</label>
          <input name="nume" value={form.nume} onChange={handleChange} style={input} required />
        </div>

        <div style={row}>
          <label style={label}>Categorie</label>
          <input name="categorie" value={form.categorie} onChange={handleChange} style={input} required />
        </div>

        <div style={row}>
          <label style={label}>Producător</label>
          <input name="producator" value={form.producator} onChange={handleChange} style={input} />
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ ...row, flex: 1, minWidth: "200px" }}>
            <label style={label}>Preț (RON)</label>
            <input
              name="pret"
              type="number"
              step="0.01"
              value={form.pret}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          <div style={{ ...row, flex: 1, minWidth: "200px" }}>
            <label style={label}>Stoc</label>
            <input
              name="stoc"
              type="number"
              value={form.stoc}
              onChange={handleChange}
              style={input}
              required
            />
          </div>
        </div>

        <div style={row}>
          <label style={label}>Descriere</label>
          <textarea
            name="descriere"
            value={form.descriere}
            onChange={handleChange}
            style={{ ...input, minHeight: "90px" }}
          />
        </div>

        <div style={row}>
          <label style={label}>Specificații</label>
          <textarea
            name="specificatii"
            value={form.specificatii}
            onChange={handleChange}
            style={{ ...input, minHeight: "120px" }}
            placeholder="ex: Memorie 8GB, HDMI, PCIe 4.0..."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            ...btn,
            backgroundColor: "#28a745",
            width: "100%",
            marginTop: "10px",
          }}
        >
          {saving ? "Se salvează..." : "✅ Adaugă produs"}
        </button>
      </form>
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

export default AdminProdusAdauga;
