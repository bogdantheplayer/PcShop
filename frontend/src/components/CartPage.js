import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function CartPage() {
  const navigate = useNavigate();

  const {
    cosProduse,
    elimina1DinCos,
    eliminaCompletDinCos,
    golesteCos,
    adaugaInCos,
  } = useContext(CartContext);

  const [recomandari, setRecomandari] = useState([]);
  const [loadingReco, setLoadingReco] = useState(false);
  const [eroareReco, setEroareReco] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const total = cosProduse
    .reduce((suma, p) => suma + Number(p.pret) * Number(p.cantitate), 0)
    .toFixed(2);

  const cartSignature = useMemo(() => {
    return JSON.stringify(
      cosProduse.map((p) => ({
        id: p.id,
        categorie: p.categorie,
        producator: p.producator,
        cantitate: p.cantitate,
      }))
    );
  }, [cosProduse]);

  useEffect(() => {
    if (!cosProduse || cosProduse.length === 0) {
      setRecomandari([]);
      setEroareReco("");
      return;
    }

    const storageKey = "reco_" + cartSignature;

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecomandari(parsed);
        return;
      } catch {}
    }

    const controller = new AbortController();

    const fetchReco = async () => {
      setLoadingReco(true);
      setEroareReco("");

      try {
        const payload = {
          cartProductIds: cosProduse.map((p) => p.id),
          cartCategories: cosProduse.map((p) => p.categorie).filter(Boolean),
          cartProducers: cosProduse.map((p) => p.producator).filter(Boolean),
        };

        const res = await fetch("http://localhost:8080/api/recomandari/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Eroare recomandări (HTTP ${res.status}). ${txt}`);
        }

        const data = await res.json();
        const finalData = Array.isArray(data) ? data : [];

        setRecomandari(finalData);
        localStorage.setItem(storageKey, JSON.stringify(finalData));
      } catch (e) {
        if (e.name === "AbortError") return;
        setEroareReco(e.message || "Eroare la recomandări.");
        setRecomandari([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoadingReco(false);
        }
      }
    };

    fetchReco();

    return () => controller.abort();
  }, [cartSignature]);

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
      total: Number(total),
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
                    React.createElement("div", { key: "info" }, [
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
                        `${Number(p.pret).toFixed(2)} RON × ${p.cantitate}`
                      ),
                    ]),

                    React.createElement("div", { key: "butoane" }, [
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
                    ]),
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

            React.createElement(
              "div",
              { key: "recoWrap", style: { marginTop: "28px" } },
              [
                React.createElement(
                  "h3",
                  {
                    key: "recoTitle",
                    style: { marginBottom: "12px", color: "#ff9800" },
                  },
                  "✨ Recomandări pentru tine"
                ),

                loadingReco
                  ? React.createElement(
                      "p",
                      { key: "recoLoading", style: { opacity: 0.9 } },
                      "Se generează recomandările..."
                    )
                  : null,

                eroareReco
                  ? React.createElement(
                      "div",
                      {
                        key: "recoErr",
                        style: {
                          backgroundColor: "#3a1f1f",
                          padding: "12px",
                          borderRadius: "10px",
                          marginBottom: "10px",
                        },
                      },
                      eroareReco
                    )
                  : null,

                !loadingReco && !eroareReco && recomandari.length === 0
                  ? React.createElement(
                      "p",
                      { key: "recoEmpty", style: { opacity: 0.85 } },
                      "Momentan nu avem recomandări."
                    )
                  : null,

                !loadingReco && !eroareReco && recomandari.length > 0
                  ? React.createElement(
                      "div",
                      {
                        key: "recoList",
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          maxWidth: "900px",
                        },
                      },
                      recomandari.map((p) =>
                        React.createElement(
                          "div",
                          {
                            key: "reco_" + p.id,
                            style: {
                              backgroundColor: "#282c34",
                              borderRadius: "12px",
                              padding: "12px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "10px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                            },
                          },
                          [
                            React.createElement("div", { key: "left" }, [
                              React.createElement(
                                "div",
                                { key: "n", style: { fontWeight: "bold" } },
                                p.nume
                              ),
                              React.createElement(
                                "div",
                                {
                                  key: "d",
                                  style: { opacity: 0.85, fontSize: "14px" },
                                },
                                `${p.categorie || "-"} • ${
                                  p.producator || "-"
                                } • ${Number(p.pret).toFixed(2)} RON`
                              ),
                            ]),

                            React.createElement(
                              "div",
                              {
                                key: "actions",
                                style: { display: "flex", gap: "10px" },
                              },
                              [
                                React.createElement(
                                  "button",
                                  {
                                    key: "viewBtn",
                                    onClick: () => navigate(`/produs/${p.id}`),
                                    style: {
                                      backgroundColor: "#6c757d",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "10px",
                                      padding: "8px 12px",
                                      cursor: "pointer",
                                      minWidth: "130px",
                                    },
                                  },
                                  "🔎 Vezi produs"
                                ),
                                React.createElement(
                                  "button",
                                  {
                                    key: "addBtn",
                                    onClick: () => adaugaInCos(p),
                                    style: {
                                      backgroundColor: "#4CAF50",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "10px",
                                      padding: "8px 12px",
                                      cursor: "pointer",
                                      minWidth: "120px",
                                    },
                                  },
                                  "➕ Adaugă"
                                ),
                              ]
                            ),
                          ]
                        )
                      )
                    )
                  : null,
              ]
            ),
          ],
    ]
  );
}

export default CartPage;