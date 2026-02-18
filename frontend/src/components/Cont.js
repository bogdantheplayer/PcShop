import React, { useState, useEffect } from "react";

function Cont() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ nume: "", username: "", email: "", telefon: "" });

  // Încarcă user-ul din localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setFormData({
        nume: parsed.nume || "",
        username: parsed.username || "",
        email: parsed.email || "",
        telefon: parsed.telefon || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/utilizatori/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        alert("Datele au fost actualizate!");
      } else {
        alert("Eroare la salvare!");
      }
    } catch (err) {
      console.error("Eroare update profil:", err);
      alert("A apărut o eroare!");
    }
  };

  if (!user) {
    return <p style={{ padding: "20px", color: "white" }}>Trebuie să te loghezi pentru a accesa această pagină.</p>;
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2 style={{ marginBottom: "20px" }}>👤 Datele contului</h2>

      <div style={{ maxWidth: "400px", backgroundColor: "#2c2c2c", padding: "20px", borderRadius: "10px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Nume:</label>
          <input
            type="text"
            name="nume"
            value={formData.nume}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#1e1e1e",
              border: "1px solid #444",
              color: "white",
              borderRadius: "5px"
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#1e1e1e",
              border: "1px solid #444",
              color: "white",
              borderRadius: "5px"
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#444",
              border: "1px solid #666",
              color: "gray",
              borderRadius: "5px"
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Telefon:</label>
          <input
            type="text"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            placeholder="Adaugă numărul de telefon"
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#1e1e1e",
              border: "1px solid #444",
              color: "white",
              borderRadius: "5px"
            }}
          />
        </div>

        <button
          onClick={handleSave}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Salvează modificările
        </button>
      </div>
    </div>
  );
}

export default Cont;
