import React, { useState } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [parola, setParola] = useState("");
  const [mesaj, setMesaj] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, parola }),
    });

    const text = await res.text();
    setMesaj(text);
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "8px" }}
      />
      <input
        type="password"
        placeholder="Parola"
        value={parola}
        onChange={(e) => setParola(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "8px" }}
      />
      <button onClick={handleLogin} style={{ padding: "8px 15px" }}>
        Login
      </button>
      <p>{mesaj}</p>
    </div>
  );
}

export default LoginPage;