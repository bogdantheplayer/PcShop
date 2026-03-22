import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function Header({ onSearch }) {
  const { cosProduse } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const nrProduseCos = cosProduse.reduce((total, item) => total + item.cantitate, 0);
  const nrProduseWishlist = wishlist.length;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef();

  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const adminMenuRef = useRef();

  const isAdmin = user && user.rol === "ADMIN";

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setShowAdminMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const parola = e.target.parola.value;

    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, parola }),
    });

    const token = await res.text();

    if (token.startsWith("ey")) {
      localStorage.setItem("token", token);

      const meRes = await fetch("http://localhost:8080/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await meRes.json();

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      setShowAuthModal(false);
      setShowUserMenu(false);
      setShowAdminMenu(false);
    } else {
      alert("Eroare login: " + token);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const nume = e.target.nume.value;
    const username = e.target.username.value;
    const email = e.target.email.value;
    const parola = e.target.parola.value;

    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nume, username, email, parola }),
    });

    const msg = await res.text();
    alert(msg);

    if (msg.includes("succes")) setIsLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowUserMenu(false);
    setShowAdminMenu(false);
  };

  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  return (
    <>
      <header style={{ padding: "10px 20px", backgroundColor: "#282c34", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              <h2>🛒 Magazin</h2>
            </Link>

            <input
              type="text"
              placeholder="Caută produse..."
              onChange={handleSearch}
              style={{
                padding: "6px 12px",
                fontSize: "16px",
                borderRadius: "20px",
                border: "none",
                width: "250px",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isAdmin && (
              <div ref={adminMenuRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setShowAdminMenu((p) => !p)}
                  style={{
                    backgroundColor: "#ff9800",
                    color: "black",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  🛠 Admin ▾
                </button>

                {showAdminMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      backgroundColor: "#2c2c2c",
                      color: "#fff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                      zIndex: 1000,
                      width: "220px",
                    }}
                  >
                    <Link
                      to="/admin"
                      style={adminLinkStyle}
                      onClick={() => setShowAdminMenu(false)}
                    >
                      🧭 Panou Admin
                    </Link>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div ref={menuRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  style={{
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                    padding: "8px 12px",
                    border: "1px solid #444",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  👤 {user.username || user.email} ▾
                </button>

                {showUserMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      backgroundColor: "#2c2c2c",
                      color: "#fff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                      zIndex: 1000,
                      width: "200px",
                    }}
                  >
                    <Link
                      to="/cont"
                      style={{ display: "block", padding: "8px", color: "#fff", textDecoration: "none" }}
                      onClick={() => setShowUserMenu(false)}
                    >
                      📄 Detalii cont
                    </Link>

                    <Link
                      to="/comenzi"
                      style={{ display: "block", padding: "8px", color: "#fff", textDecoration: "none" }}
                      onClick={() => setShowUserMenu(false)}
                    >
                      📦 Comenzile mele
                    </Link>

                    <Link
                      to="/facturare"
                      style={{ display: "block", padding: "8px", color: "#fff", textDecoration: "none" }}
                      onClick={() => setShowUserMenu(false)}
                    >
                      🧾 Date facturare
                    </Link>

                    <button
                      onClick={handleLogout}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px",
                        border: "none",
                        background: "transparent",
                        color: "red",
                        textAlign: "left",
                        cursor: "pointer",
                        marginTop: "5px",
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setIsLogin(true);
                }}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            )}

            <Link to="/ai-builder">
              <button
                style={{
                  backgroundColor: "#6f42c1",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🧠 AI Builder
              </button>
            </Link>

            <Link to="/wishlist" style={{ position: "relative" }}>
              <button
                style={{
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                ❤️ Wishlist
                {nrProduseWishlist > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {nrProduseWishlist}
                  </span>
                )}
              </button>
            </Link>

            <Link to="/cos" style={{ position: "relative" }}>
              <button
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                🛒 Coș
                {nrProduseCos > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {nrProduseCos}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              color: "black",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            {isLogin ? (
              <>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label>
                    <input name="email" type="email" required style={{ width: "100%", padding: "8px" }} />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label>Parolă:</label>
                    <input name="parola" type="password" required style={{ width: "100%", padding: "8px" }} />
                  </div>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "10px 15px",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Autentificare
                  </button>
                </form>

                <p style={{ marginTop: "15px" }}>
                  Nu ai cont?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#007bff",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Creează unul
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2>Înregistrare</h2>
                <form onSubmit={handleRegister}>
                  <div style={{ marginBottom: "10px" }}>
                    <label>Nume:</label>
                    <input name="nume" type="text" required style={{ width: "100%", padding: "8px" }} />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label>Username:</label>
                    <input name="username" type="text" required style={{ width: "100%", padding: "8px" }} />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label>
                    <input name="email" type="email" required style={{ width: "100%", padding: "8px" }} />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label>Parolă:</label>
                    <input name="parola" type="password" required style={{ width: "100%", padding: "8px" }} />
                  </div>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "10px 15px",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Creează cont
                  </button>
                </form>

                <p style={{ marginTop: "15px" }}>
                  Ai deja cont?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#007bff",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Autentifică-te
                  </button>
                </p>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              style={{
                marginTop: "15px",
                backgroundColor: "gray",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Închide
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const adminLinkStyle = {
  display: "block",
  padding: "8px",
  color: "#fff",
  textDecoration: "none",
};

export default Header;