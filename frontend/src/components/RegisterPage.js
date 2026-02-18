import React, { useState } from "react";

function RegisterPage() {
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [parola, setParola] = useState("");
  const [mesaj, setMesaj] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nume, email, username, parola }),
    });

    const text = await res.text();
    setMesaj(text);
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Înregistrare</h2>
      <input type="text" placeholder="Nume" value={nume} onChange={(e) => setNume(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Parola" value={parola} onChange={(e) => setParola(e.target.value)} />
      <button onClick={handleRegister} style={{ marginTop: "10px", padding: "8px 15px" }}>
        Înregistrează-te
      </button>
      <p>{mesaj}</p>
    </div>
  );
}

export default RegisterPage;
