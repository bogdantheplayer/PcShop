import React from "react";
import { useNavigate } from "react-router-dom";

function GhidPage() {
  const navigate = useNavigate();

  const card = {
    backgroundColor: "#282c34",
    padding: "22px",
    borderRadius: "18px",
    marginBottom: "20px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const miniCard = {
    backgroundColor: "#20242b",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const title = {
    color: "#17a2b8",
    marginTop: 0,
  };


  const step = {
    backgroundColor: "#1b1d22",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "10px",
    border: "1px solid rgba(255,255,255,0.07)",
  };

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #20242b, #343a46)",
          padding: "32px",
          borderRadius: "22px",
          marginBottom: "24px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
        }}
      >

        <h1 style={{ color: "#17a2b8", marginTop: 0, fontSize: "36px" }}>
          📖 Ghid complet de utilizare
        </h1>

        <p style={{ opacity: 0.9, maxWidth: "950px", lineHeight: 1.7 }}>
          Aici găsești explicații pentru toate funcționalitățile magazinului:
          produse, coș, wishlist, AI Builder, review-uri, cont utilizator și
          administrare produse.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "18px" }}>
          <button onClick={() => navigate(-1)} style={backBtn}>
            ⬅ Înapoi
          </button>

        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        <div style={miniCard}>🏠 Produse<br /><span style={small}>Navigare și căutare</span></div>
        <div style={miniCard}>🛒 Coș<br /><span style={small}>Comenzi și recomandări</span></div>
        <div style={miniCard}>❤️ Wishlist<br /><span style={small}>Produse favorite</span></div>
        <div style={miniCard}>🧠 AI Builder<br /><span style={small}>Configurare PC cu AI</span></div>
        <div style={miniCard}>⭐ Review-uri<br /><span style={small}>Rating și opinii</span></div>
        <div style={miniCard}>🛠 Admin<br /><span style={small}>Gestionare produse</span></div>
      </div>

      <div style={card}>
        <h2 style={title}>🏠 Pagina principală</h2>
        <p>
          Pagina principală afișează produsele disponibile în magazin sub formă
          de carduri. Fiecare card conține imaginea produsului, numele,
          categoria, prețul și acțiuni rapide.
        </p>

        <div style={step}>1. Cauți produsul dorit folosind bara de căutare.</div>
        <div style={step}>2. Deschizi pagina produsului pentru detalii complete.</div>
        <div style={step}>3. Adaugi produsul în coș sau îl salvezi în wishlist.</div>
      </div>

      <div style={card}>
        <h2 style={title}>📦 Pagina produsului</h2>
        <p>
          Pagina produsului oferă toate informațiile importante: galerie de
          imagini, stoc, preț, producător, descriere, specificații și review-uri.
        </p>

        <ul>
          <li>imaginea principală poate fi schimbată din miniaturi;</li>
          <li>produsele pot fi adăugate în coș;</li>
          <li>produsele pot fi adăugate sau eliminate din wishlist;</li>
          <li>utilizatorii autentificați pot scrie review-uri;</li>
          <li>rating-ul mediu este afișat direct pe pagină.</li>
        </ul>

        <div style={infoBox}>
          💡 Sfat: verifică stocul și review-urile înainte să adaugi produsul în coș.
        </div>
      </div>

      <div style={card}>
        <h2 style={title}>🛒 Coș de cumpărături</h2>
        <p>
          Coșul conține produsele pe care utilizatorul dorește să le cumpere.
          Produsele pot fi modificate înainte de plasarea comenzii.
        </p>

        <div style={step}>1. Adaugi produse în coș.</div>
        <div style={step}>2. Modifici cantitatea sau elimini produse.</div>
        <div style={step}>3. Completezi datele de facturare.</div>
        <div style={step}>4. Plasezi comanda.</div>

        <div style={warnBox}>
          🔐 Pentru plasarea unei comenzi este necesară autentificarea.
        </div>
      </div>

      <div style={card}>
        <h2 style={title}>✨ Recomandări AI în coș</h2>
        <p>
          Sistemul de recomandări analizează produsele din coș și propune
          componente complementare. De exemplu, dacă ai o placă video, sistemul
          poate recomanda procesor, sursă, carcasă sau SSD.
        </p>

        <ul>
          <li>evită produsele deja aflate în coș;</li>
          <li>încearcă să recomande componente compatibile;</li>
          <li>permite vizualizarea produsului recomandat;</li>
          <li>permite adăugarea rapidă în coș.</li>
        </ul>
      </div>

      <div style={card}>
        <h2 style={title}>❤️ Wishlist</h2>
        <p>
          Wishlist-ul permite salvarea produselor preferate pentru mai târziu.
          Este util când utilizatorul vrea să compare mai multe componente.
        </p>

        <ul>
          <li>adăugare produs în wishlist;</li>
          <li>ștergere produs din wishlist;</li>
          <li>număr de produse afișat în header;</li>
          <li>persistență după refresh prin localStorage.</li>
        </ul>
      </div>

      <div style={card}>
        <h2 style={title}>🧠 AI Builder PC</h2>
        <p>
          AI Builder este un asistent conversațional care ajută utilizatorul să
          creeze o configurație de PC pe baza cerințelor introduse.
        </p>

        <div style={step}>1. Scrii ce tip de PC dorești.</div>
        <div style={step}>2. Menționezi bugetul și scopul sistemului.</div>
        <div style={step}>3. AI-ul analizează produsele disponibile.</div>
        <div style={step}>4. Primești componente recomandate.</div>
        <div style={step}>5. Poți adăuga componentele direct în coș.</div>

        <div style={exampleBox}>
          Exemplu: „Vreau un PC de gaming la 5000 lei pentru 1080p, prefer AMD și vreau SSD rapid.”
        </div>
      </div>

      <div style={card}>
        <h2 style={title}>⭐ Review-uri și rating</h2>
        <p>
          Sistemul de review-uri permite utilizatorilor autentificați să lase
          opinii despre produse.
        </p>

        <ul>
          <li>doar utilizatorii logați pot adăuga review;</li>
          <li>un utilizator poate avea un singur review per produs;</li>
          <li>review-ul poate fi editat;</li>
          <li>review-ul poate fi șters;</li>
          <li>rating-ul mediu este calculat automat.</li>
        </ul>

        <div style={warnBox}>
          🔐 Pentru adăugarea, editarea sau ștergerea unui review este necesar login.
        </div>
      </div>

      <div style={card}>
        <h2 style={title}>👤 Cont utilizator</h2>
        <p>
          Utilizatorii pot crea cont, se pot autentifica și pot accesa
          funcționalități personalizate.
        </p>

        <ul>
          <li>înregistrare cont nou;</li>
          <li>autentificare cu email și parolă;</li>
          <li>vizualizare detalii cont;</li>
          <li>vizualizare comenzi plasate;</li>
          <li>completare date de facturare;</li>
          <li>delogare.</li>
        </ul>
      </div>

      <div style={card}>
        <h2 style={title}>🛠 Panou administrator</h2>
        <p>
          Panoul de administrare este disponibil doar pentru utilizatorii cu rol
          ADMIN. Administratorul poate gestiona produsele magazinului.
        </p>

        <ul>
          <li>adăugare produse noi;</li>
          <li>editare produse existente;</li>
          <li>ștergere produse;</li>
          <li>modificare preț și stoc;</li>
          <li>modificare descriere și specificații;</li>
          <li>adăugare sau schimbare URL-uri imagini.</li>
        </ul>
      </div>

      <div style={card}>
        <h2 style={title}>🔐 Roluri în aplicație</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Funcționalitate</th>
                <th style={th}>Utilizator nelogat</th>
                <th style={th}>Utilizator logat</th>
                <th style={th}>Administrator</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}>Vizualizare produse</td>
                <td style={td}>Da</td>
                <td style={td}>Da</td>
                <td style={td}>Da</td>
              </tr>
              <tr>
                <td style={td}>Adăugare în coș</td>
                <td style={td}>Da</td>
                <td style={td}>Da</td>
                <td style={td}>Da</td>
              </tr>
              <tr>
                <td style={td}>Plasare comandă</td>
                <td style={td}>Nu</td>
                <td style={td}>Da</td>
                <td style={td}>Da</td>
              </tr>
              <tr>
                <td style={td}>Review-uri</td>
                <td style={td}>Nu</td>
                <td style={td}>Da</td>
                <td style={td}>Da</td>
              </tr>
              <tr>
                <td style={td}>Administrare produse</td>
                <td style={td}>Nu</td>
                <td style={td}>Nu</td>
                <td style={td}>Da</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={card}>
        <h2 style={title}>❓ Întrebări frecvente</h2>

        <h4>De ce trebuie să fiu autentificat?</h4>
        <p>
          Pentru acțiuni precum plasarea comenzilor și adăugarea review-urilor,
          aplicația trebuie să știe ce utilizator face acțiunea.
        </p>

        <h4>Pot scrie mai multe review-uri la același produs?</h4>
        <p>
          Nu. Fiecare utilizator poate adăuga un singur review pentru un produs,
          dar îl poate edita sau șterge.
        </p>

        <h4>Ce face AI Builder?</h4>
        <p>
          AI Builder analizează cerințele utilizatorului și propune componente
          existente în magazin.
        </p>

        <h4>Cum schimb imaginile unui produs?</h4>
        <p>
          Administratorul poate edita URL-urile imaginilor din pagina de editare
          produs.
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={homeBtn}>
          ⬆ Înapoi sus
        </button>
      </div>
    </div>
  );
}

const backBtn = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: "bold",
};

const homeBtn = {
  backgroundColor: "#17a2b8",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: "bold",
};

const small = {
  fontSize: "13px",
  opacity: 0.75,
};

const infoBox = {
  backgroundColor: "rgba(23,162,184,0.15)",
  border: "1px solid rgba(23,162,184,0.35)",
  padding: "12px",
  borderRadius: "12px",
  marginTop: "12px",
};

const warnBox = {
  backgroundColor: "rgba(255,193,7,0.14)",
  border: "1px solid rgba(255,193,7,0.35)",
  padding: "12px",
  borderRadius: "12px",
  marginTop: "12px",
};

const exampleBox = {
  backgroundColor: "#1b1d22",
  padding: "14px",
  borderRadius: "12px",
  marginTop: "12px",
  borderLeft: "4px solid #17a2b8",
};

const th = {
  padding: "12px",
  backgroundColor: "#1b1d22",
  border: "1px solid rgba(255,255,255,0.1)",
  textAlign: "left",
};

const td = {
  padding: "12px",
  border: "1px solid rgba(255,255,255,0.1)",
};

export default GhidPage;