import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

function CartPage() {
  const { cosProduse, elimina1DinCos, eliminaCompletDinCos, golesteCos } =
    useContext(CartContext);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const total = cosProduse.reduce((suma, p) => suma + p.pret * p.cantitate, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert("Trebuie să fii logat pentru a plasa o comandă.");
      return;
    }

    if (cosProduse.length === 0) {
      alert("Coșul este gol.");
      return;
    }

    const billingData = JSON.parse(localStorage.getItem("facturare")) || {
      adresa: "Necunoscută",
      oras: "Necunoscut",
      judet: "Necunoscut",
      tara: "România",
      codPostal: "000000",
    };

    const comanda = {
      utilizatorId: user.id,
      total: total,
      dataComanda: new Date().toISOString(),
      ...billingData,
      produse: cosProduse.map((p) => ({
        numeProdus: p.nume,
        cantitate: p.cantitate,
        pret: p.pret,
      })),
    };

    try {
      const res = await fetch("http://localhost:8080/api/comenzi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token, 
        },
        body: JSON.stringify(comanda),
      });

      if (res.ok) {
        const saved = await res.json();
        alert("Comanda a fost plasată cu succes! ID: " + saved.id);
        golesteCos();
      } else {
        // încearcă să citești un mesaj din backend, dacă există
        let msg = "";
        try {
          msg = await res.text();
        } catch (e) {
          msg = "";
        }

        if (res.status === 401 || res.status === 403) {
          alert(
            "Nu ai acces (token invalid/expirat sau fără permisiuni). Fă logout/login.\n" +
              (msg ? "Detalii: " + msg : "")
          );
        } else {
          alert(
            "Eroare la plasarea comenzii! (HTTP " +
              res.status +
              ")\n" +
              (msg ? "Detalii: " + msg : "")
          );
        }
      }
    } catch (err) {
      console.error("Eroare checkout:", err);
      alert("Eroare la server / conexiune!");
    }
  };

  return React.createElement(
    "div",
    {
      style: {
        padding: "20px",
        backgroundColor: "#1e1e1e",
        minHeight: "100vh",
        color: "white",
      },
    },
    [
      React.createElement(
        "h2",
        { key: "titlu", style: { marginBottom: "20px", color: "#ff4d4d" } },
        "🛒 Coș de cumpărături"
      ),

      cosProduse.length === 0
        ? React.createElement("p", { key: "gol" }, "Coșul este gol.")
        : [
            React.createElement(
              "ul",
              {
                key: "lista",
                style: { listStyle: "none", padding: 0, marginBottom: "20px" },
              },
              cosProduse.map((p, idx) =>
                React.createElement(
                  "li",
                  {
                    key: idx,
                    style: {
                      backgroundColor: "#282c34",
                      padding: "15px",
                      marginBottom: "10px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                    },
                  },
                  [
                    React.createElement(
                      "div",
                      { key: "info" },
                      [
                        React.createElement(
                          "strong",
                          {
                            key: "nume",
                            style: { fontSize: "16px", color: "#ff4d4d" },
                          },
                          p.nume
                        ),
                        React.createElement(
                          "p",
                          {
                            key: "detalii",
                            style: { margin: "5px 0", fontSize: "14px" },
                          },
                          `${p.pret} RON × ${p.cantitate}`
                        ),
                      ]
                    ),

                    React.createElement(
                      "div",
                      { key: "butoane" },
                      [
                        React.createElement(
                          "button",
                          {
                            key: "minus1",
                            onClick: () => elimina1DinCos(p.id),
                            style: {
                              backgroundColor: "#ffc107",
                              color: "black",
                              padding: "6px 10px",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                              marginRight: "8px",
                            },
                          },
                          "-1"
                        ),

                        React.createElement(
                          "button",
                          {
                            key: "sterge",
                            onClick: () => eliminaCompletDinCos(p.id),
                            style: {
                              backgroundColor: "#dc3545",
                              color: "white",
                              padding: "6px 10px",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                            },
                          },
                          "❌ Șterge"
                        ),
                      ]
                    ),
                  ]
                )
              )
            ),

            React.createElement(
              "h3",
              { key: "total", style: { marginBottom: "20px" } },
              [
                "Total: ",
                React.createElement(
                  "span",
                  { key: "sum", style: { color: "#28a745" } },
                  `${total} RON`
                ),
              ]
            ),

            React.createElement(
              "div",
              {
                key: "actBtns",
                style: { display: "flex", gap: "15px" },
              },
              [
                React.createElement(
                  "button",
                  {
                    key: "goleste",
                    onClick: golesteCos,
                    style: {
                      backgroundColor: "#6c757d",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    },
                  },
                  "🗑️ Golește coșul"
                ),

                React.createElement(
                  "button",
                  {
                    key: "checkout",
                    onClick: handleCheckout,
                    style: {
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    },
                  },
                  "✅ Plasează comanda"
                ),
              ]
            ),
          ],
    ]
  );
}

export default CartPage;
