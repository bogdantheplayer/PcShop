import React, { useState, useEffect } from "react";

function Facturare() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    adresa: "",
    oras: "",
    judet: "",
    tara: "",
    codPostal: ""
  });

  useEffect(() => {
    // verificam daca exista user logat
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));

    // verificam daca exista date de facturare salvate
    const saved = localStorage.getItem("facturare");
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    // salvez in localStorage pentru a fi disponibile si la checkout
    localStorage.setItem("facturare", JSON.stringify(form));

    alert("Datele de facturare au fost salvate!");
  };

  if (!user)
    return (
      <h2 style={{ padding: "20px", color: "white" }}>
        Trebuie să te loghezi pentru a accesa această pagină.
      </h2>
    );

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2 style={{ marginBottom: "20px" }}>💳 Date facturare</h2>

      <form
        onSubmit={handleSave}
        style={{
          maxWidth: "400px",
          backgroundColor: "#2c2c2c",
          padding: "20px",
          borderRadius: "10px"
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>Adresă:</label>
          <input
            type="text"
            name="adresa"
            value={form.adresa}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Oraș:</label>
          <input
            type="text"
            name="oras"
            value={form.oras}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Județ:</label>
          <input
            type="text"
            name="judet"
            value={form.judet}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Țară:</label>
          <input
            type="text"
            name="tara"
            value={form.tara}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Cod poștal:</label>
          <input
            type="text"
            name="codPostal"
            value={form.codPostal}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "10px 15px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Salvează
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px",
  backgroundColor: "#1e1e1e",
  border: "1px solid #444",
  color: "white",
  borderRadius: "5px"
};

export default Facturare;
