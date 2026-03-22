import React, { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function AiBuilderPage() {
  const { adaugaInCos } = useContext(CartContext);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Salut! Sunt AI Builder pentru PC-uri. Spune-mi ce tip de sistem vrei, bugetul, dacă preferi Intel/AMD, NVIDIA/AMD, pentru ce îl folosești și orice alte preferințe ai.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recomandari, setRecomandari] = useState([]);
  const messagesEndRef = useRef(null);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, recomandari, loading]);

  const trimiteMesaj = async () => {
    const mesaj = input.trim();
    if (!mesaj || loading) return;

    const updatedMessages = [...messages, { role: "user", content: mesaj }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/ai-builder/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: mesaj,
          history: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Eroare AI Builder (HTTP ${res.status}). ${txt}`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "Am analizat cerințele tale și am pregătit o configurație.",
        },
      ]);

      setRecomandari(Array.isArray(data.produse) ? data.produse : []);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            e.message || "A apărut o eroare la generarea configurației.",
        },
      ]);
      setRecomandari([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      trimiteMesaj();
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1e1e1e",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "18px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: "#b388ff" }}>🧠 AI Builder PC</h1>
          <p style={{ margin: "8px 0 0 0", opacity: 0.85 }}>
            Spune ce PC vrei, iar AI-ul îți propune componente pe care le poți adăuga direct în coș.
          </p>
        </div>

        <Link to="/" style={{ textDecoration: "none" }}>
          <button
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "10px 14px",
              cursor: "pointer",
            }}
          >
            ⬅ Înapoi la magazin
          </button>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.9fr",
          gap: "18px",
          alignItems: "start",
        }}
        className="ai-builder-layout"
      >
        <div
          style={{
            backgroundColor: "#282c34",
            borderRadius: "14px",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
            minHeight: "75vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: "6px",
              marginBottom: "14px",
              maxHeight: "62vh",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    backgroundColor: msg.role === "user" ? "#007bff" : "#20242b",
                    color: "white",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "12px" }}>
                <div
                  style={{
                    maxWidth: "80%",
                    backgroundColor: "#20242b",
                    color: "white",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  AI Builder gândește configurația...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "stretch",
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: Vreau un PC de gaming la 5000 lei pentru 1080p, prefer AMD și SSD rapid..."
              style={{
                flex: 1,
                resize: "none",
                minHeight: "80px",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #444",
                backgroundColor: "#1b1d22",
                color: "white",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            <button
              onClick={trimiteMesaj}
              disabled={loading || !input.trim()}
              style={{
                minWidth: "120px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: loading || !input.trim() ? "#555" : "#6f42c1",
                color: "white",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                fontWeight: "bold",
                padding: "12px",
              }}
            >
              Trimite
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#282c34",
            borderRadius: "14px",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#ff9800" }}>🔧 Componente recomandate</h2>

          {recomandari.length === 0 ? (
            <p style={{ opacity: 0.85 }}>
              După ce discuți cu AI Builder, aici vor apărea componentele propuse.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recomandari.map((p) => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: "#1f2329",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                    {p.nume}
                  </div>

                  <div style={{ fontSize: "14px", opacity: 0.85, marginBottom: "8px" }}>
                    {p.categorie || "-"} • {p.producator || "-"}
                  </div>

                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#28a745",
                      marginBottom: "10px",
                    }}
                  >
                    {Number(p.pret).toFixed(2)} RON
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <Link to={`/produs/${p.id}`} style={{ textDecoration: "none" }}>
                      <button
                        style={{
                          backgroundColor: "#6c757d",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 10px",
                          cursor: "pointer",
                        }}
                      >
                        🔎 Vezi produs
                      </button>
                    </Link>

                    <button
                      onClick={() => adaugaInCos(p)}
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        cursor: "pointer",
                      }}
                    >
                      ➕ Adaugă în coș
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .ai-builder-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AiBuilderPage;