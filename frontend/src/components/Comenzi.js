import React, { useEffect, useState } from "react";

function Comenzi() {
  const [comenzi, setComenzi] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      console.warn("Nu ești autentificat");
      return;
    }

    fetch(`http://localhost:8080/api/comenzi/utilizator/${user.id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Eroare HTTP: " + res.status);
        }
        return res.json();
      })
      .then(data => {
        console.log("Comenzi primite:", data);
        setComenzi(data);
      })
      .catch(err => {
        console.error("Eroare la comenzi:", err);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Comenzile mele</h1>
      {comenzi.length === 0 ? (
        <p>Nu ai comenzi plasate încă.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {comenzi.map((c) => (
            <li key={c.id} style={{ marginBottom: "15px", border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
              <div
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
                onClick={() => toggleExpand(c.id)}
              >
                <span>
                  <strong>Comanda #{c.id}</strong> -{" "}
                  {new Date(c.dataComanda).toLocaleDateString()} - {c.total} lei
                </span>
                <span>{expanded === c.id ? "▲" : "▼"}</span>
              </div>

              {expanded === c.id && (
                <div style={{ marginTop: "10px", paddingLeft: "20px" }}>
                  {/* produse din comanda */}
                  <h4>Produse:</h4>
                  <ul>
                    {c.produse.map((p, idx) => (
                      <li key={idx}>
                        {p.numeProdus} - {p.cantitate} buc x {p.pret} lei
                      </li>
                    ))}
                  </ul>

                  {/* detalii facturare / livrare */}
                  <h4>Detalii facturare:</h4>
                  <p><strong>Adresă:</strong> {c.adresa}, {c.oras}, {c.judet}, {c.tara}, {c.codPostal}</p>

                  {/* info suplimentar */}
                  <p><strong>Data comenzii:</strong> {new Date(c.dataComanda).toLocaleString()}</p>
                  <p><strong>Total:</strong> {c.total} lei</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Comenzi;
