import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

function ProductList() {
  const [produse, setProduse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/produse")
      .then(res => setProduse(res.data))
      .catch(err => console.error("Eroare produse:", err));
  }, []);

  const produseFiltrate = produse.filter(p =>
    p.nume.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="text"
        placeholder="Cauta produs..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ padding: "8px", width: "300px", marginBottom: "20px" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {produseFiltrate.map((produs) => (
          <ProductCard key={produs.id} produs={produs} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
