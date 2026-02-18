import React, { useEffect, useState } from "react";
import axios from "axios";

function ProduseList() {
  const [produse, setProduse] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/produse")
      .then(response => {
        setProduse(response.data);
      })
      .catch(error => {
        console.error("Eroare la preluarea produselor:", error);
      });
  }, []);

  return (
    <div>
      <h2>Lista de Produse</h2>
      <ul>
        {produse.map((produs) => (
          <li key={produs.id}>{produs.nume} - {produs.pret} RON</li>
        ))}
      </ul>
    </div>
  );
}

export default ProduseList;
