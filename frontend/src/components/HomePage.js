import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "./ProductCard";
import FiltruSimplu from "./FiltruSimplu";

const HomePage = ({ searchTerm = "" }) => {
  const [produse, setProduse] = useState([]);
  const [categorieSelectata, setCategorieSelectata] = useState("Toate");
  const [sortOption, setSortOption] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [producatoriSelectati, setProducatoriSelectati] = useState([]);
  const [paginaCurenta, setPaginaCurenta] = useState(1);

  const { adaugaInCos } = useContext(CartContext);
  const categorii = [
    "Toate",
    "Procesor",
    "Placa video",
    "RAM",
    "Placa de baza",
    "HDD",
    "SSD",
    "Alimentare",
    "Carcasa",
    "Ventilatoare",
    "Coolere"
  ];

  const produsePePagina = 24;

  useEffect(() => {
    fetch("http://localhost:8080/api/produse")
      .then((res) => res.json())
      .then((data) => setProduse(data))
      .catch((err) => console.error("Eroare la încărcare produse:", err));
  }, []);

  const [minPrice, maxPrice] = priceRange;

  const produseFiltrate = produse
    .filter((produs) => {
      const categorieOk =
        categorieSelectata === "Toate" || produs.categorie === categorieSelectata;
      const cautareOk = produs.nume.toLowerCase().includes(searchTerm.toLowerCase());
      const intervalPretOk = produs.pret >= minPrice && produs.pret <= maxPrice;
      const producatorOk =
        producatoriSelectati.length === 0 || producatoriSelectati.includes(produs.producator);
      return categorieOk && cautareOk && intervalPretOk && producatorOk;
    })
    .sort((a, b) => {
      if (sortOption === "pret-crescator") return a.pret - b.pret;
      if (sortOption === "pret-descrescator") return b.pret - a.pret;
      return 0;
    });

  // paginare
  const indexStart = (paginaCurenta - 1) * produsePePagina;
  const produsePaginaCurenta = produseFiltrate.slice(indexStart, indexStart + produsePePagina);
  const numarPagini = Math.ceil(produseFiltrate.length / produsePePagina);

  const schimbaPagina = (pagina) => {
    if (pagina >= 1 && pagina <= numarPagini) {
      setPaginaCurenta(pagina);
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll sus
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* bara filtre + categorii */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <FiltruSimplu
          sortOption={sortOption}
          onSortChange={setSortOption}
          onPriceRangeChange={setPriceRange}
          onProducatorChange={setProducatoriSelectati}
        />

        {categorii.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategorieSelectata(categorieSelectata === cat ? "Toate" : cat);
              setPaginaCurenta(1); // reset pagina
            }}
            style={{
              backgroundColor: categorieSelectata === cat ? "#ff4d4d" : "#1e1e1e",
              color: categorieSelectata === cat ? "black" : "white",
              padding: "6px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* lista produse */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {produsePaginaCurenta.map((produs) => (
          <ProductCard key={produs.id} produs={produs} />
        ))}
      </div>

      {/* navigare pagini imbunatatita */}
      <div style={{ marginTop: "30px", textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
        {/* buton inapoi */}
        <button
          onClick={() => schimbaPagina(paginaCurenta - 1)}
          disabled={paginaCurenta === 1}
          style={{
            padding: "8px 12px",
            backgroundColor: "#ddd",
            border: "none",
            borderRadius: "4px",
            cursor: paginaCurenta === 1 ? "not-allowed" : "pointer"
          }}
        >
          &laquo;
        </button>

      {/* numere de pagina */}
      {Array.from({ length: numarPagini }, (_, i) => i + 1)
        .filter(nr => 
          nr === 1 || 
          nr === numarPagini || 
          Math.abs(nr - paginaCurenta) <= 2 // doar 2 inainte/dupa pagina curenta
        )
        .map((nr, i, arr) => {
          const prev = arr[i - 1];
          const showDots = prev && nr - prev > 1;

          return (
            <React.Fragment key={nr}>
              {showDots && <span style={{ padding: "8px 5px" }}>...</span>}
              <button
                onClick={() => schimbaPagina(nr)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: paginaCurenta === nr ? "#ff4d4d" : "#eee",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: paginaCurenta === nr ? "bold" : "normal"
                }}
             >
                {nr}
              </button>
            </React.Fragment>
          );
        })}

      {/* buton inainte */}
      <button
        onClick={() => schimbaPagina(paginaCurenta + 1)}
        disabled={paginaCurenta === numarPagini}
        style={{
          padding: "8px 12px",
          backgroundColor: "#ddd",
          border: "none",
          borderRadius: "4px",
          cursor: paginaCurenta === numarPagini ? "not-allowed" : "pointer"
        }}
      >
        &raquo;
      </button>
    </div>
    </div>
  );
};

export default HomePage;
