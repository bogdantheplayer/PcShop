import React from "react";
import { Link } from "react-router-dom";

function AdminPage() {
    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: "#1e1e1e",
                minHeight: "100vh",
                color: "white",
            }}
        >
            <h1 style={{ marginBottom: "20px", color: "#ff9800" }}>
                🛠 Pagină de administrare
            </h1>

            <div
                style={{
                    maxWidth: "420px",
                    backgroundColor: "#282c34",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                }}
            >
                <p style={{ marginTop: 0, opacity: 0.9 }}>
                    Alege o acțiune:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Link to="/admin/produse" style={{ textDecoration: "none" }}>
                        <button style={btnStyle}>📦 Listă produse</button>
                    </Link>

                    <Link to="/admin/produse/adauga" style={{ textDecoration: "none" }}>
                        <button style={btnStyle}>➕ Adaugă produs</button>
                    </Link>

                    <Link to="/admin/produse/editare" style={{ textDecoration: "none" }}>
                        <button style={btnStyle}>✏️ Editare produs</button>
                    </Link>
                    
                    <Link to="/admin/comenzi" style={{ textDecoration: "none" }}>
                        <button style={btnStyle}>🧾 Comenzi</button>
                    </Link>

                    <Link to="/admin/produse/stergere" style={{ textDecoration: "none" }}>
                        <button style={{ ...btnStyle, backgroundColor: "#dc3545" }}>
                            ❌ Ștergere produs
                        </button>
                    </Link>
                </div>

                <div style={{ marginTop: "18px" }}>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <button
                            style={{
                                ...btnStyle,
                                backgroundColor: "#6c757d",
                            }}
                        >
                            ⬅ Înapoi la magazin
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

const btnStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#1e1e1e",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
};

export default AdminPage;
