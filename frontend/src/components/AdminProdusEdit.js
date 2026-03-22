import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function AdminProdusEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user && user.rol === "ADMIN";

  const [loading, setLoading] = useState(true);
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
    imagine1: "",
    imagine2: "",
    imagine3: ""
  });

  const handleAuthError = (msg) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setEroare(msg || "Sesiunea a expirat sau nu ai drepturi. Te rog autentifică-te din nou.");
    setLoading(false);
    setSaving(false);

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1200);
  };

  const incarcaProdus = async () => {
    setLoading(true);
    setEroare("");

    try {
      const res = await fetch(`http://localhost:8080/api/produse/${id}`);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Eroare la încărcare produs (HTTP ${res.status}). ${text}`);
      }

      const data = await res.json();

      setForm({
        nume: data.nume || "",
        descriere: data.descriere || "",
        categorie: data.categorie || "",
        producator: data.producator || "",
        pret: data.pret ?? 0,
        stoc: data.stoc ?? 0,
        specificatii: data.specificatii || "",
        imagine1: data.imagine1 || "",
        imagine2: data.imagine2 || "",
        imagine3: data.imagine3 || ""
      });
    } catch (e) {
      setEroare(e.message || "Eroare la încărcarea produsului.");
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

    incarcaProdus();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "pret" || name === "stoc" ? Number(value) : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEroare("");

    try {
      const res = await fetch(`http://localhost:8080/api/admin/produse/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });

      if (res.status === 401 || res.status === 403) {
        handleAuthError("Sesiunea a expirat sau nu ești ADMIN. Te redirecționez către login...");
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Eroare la salvare (HTTP ${res.status}). ${text}`);
      }

      alert("Produs actualizat cu succes!");
      navigate("/admin/produse/editare");
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
        <h1 style={{ margin: 0 }}>✏️ Edit produs #{id}</h1>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/admin/produse/editare" style={{ textDecoration: "none" }}>
            <button style={btn}>⬅ Înapoi</button>
          </Link>
          <button onClick={incarcaProdus} style={btn} disabled={loading || saving}>
            🔄 Reîncarcă
          </button>
        </div>
      </div>

      {loading && <p style={{ marginTop: "15px" }}>Se încarcă produsul...</p>}

      {eroare && (
        <div style={{ marginTop: "15px", backgroundColor: "#3a1f1f", padding: "12px", borderRadius: "10px" }}>
          <strong>Eroare:</strong> {eroare}
        </div>
      )}

      {!loading && (
        <form
          onSubmit={handleSave}
          style={{
            marginTop: "15px",
            maxWidth: "700px",
            backgroundColor: "#282c34",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
          }}
        >
          <div style={row}>
            <label style={label}>Nume</label>
            <input
              name="nume"
              value={form.nume}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          <div style={row}>
            <label style={label}>Categorie</label>
            <input
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          <div style={row}>
            <label style={label}>Producător</label>
            <input
              name="producator"
              value={form.producator}
              onChange={handleChange}
              style={input}
            />
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
              placeholder="ex: Memorie 8GB GDDR6, HDMI, PCIe 4.0..."
            />
          </div>

          <div style={row}>
            <label style={label}>Imagine 1 (URL)</label>
            <input
              name="imagine1"
              value={form.imagine1}
              onChange={handleChange}
              style={input}
              placeholder="https://..."
            />
          </div>

          <div style={row}>
            <label style={label}>Imagine 2 (URL)</label>
            <input
              name="imagine2"
              value={form.imagine2}
              onChange={handleChange}
              style={input}
              placeholder="https://..."
            />
          </div>

          <div style={row}>
            <label style={label}>Imagine 3 (URL)</label>
            <input
              name="imagine3"
              value={form.imagine3}
              onChange={handleChange}
              style={input}
              placeholder="https://..."
            />
          </div>

          {(form.imagine1 || form.imagine2 || form.imagine3) && (
            <div style={{ marginTop: "10px" }}>
              <div style={{ ...label, marginBottom: "8px" }}>Preview imagini</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[form.imagine1, form.imagine2, form.imagine3]
                  .filter(Boolean)
                  .map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      style={{
                        width: "150px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #444",
                        backgroundColor: "#1e1e1e"
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              ...btn,
              backgroundColor: "#28a745",
              width: "100%",
              marginTop: "10px"
            }}
          >
            {saving ? "Se salvează..." : "💾 Salvează modificările"}
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
  gap: "6px"
};

const row = { marginBottom: "12px", display: "flex", flexDirection: "column", gap: "6px" };
const label = { fontWeight: "bold", opacity: 0.95 };
const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#1e1e1e",
  color: "white"
};

export default AdminProdusEdit;