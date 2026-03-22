import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cosProduse, setCosProduse] = useState(() => {
    try {
      const saved = localStorage.getItem("cos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cos", JSON.stringify(cosProduse));
  }, [cosProduse]);

  const adaugaInCos = (produs) => {
    setCosProduse((prev) => {
      const existent = prev.find((p) => p.id === produs.id);

      if (existent) {
        return prev.map((p) =>
          p.id === produs.id
            ? { ...p, cantitate: p.cantitate + 1 }
            : p
        );
      }

      return [...prev, { ...produs, cantitate: 1 }];
    });
  };

  const elimina1DinCos = (id) => {
    setCosProduse((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, cantitate: p.cantitate - 1 } : p
        )
        .filter((p) => p.cantitate > 0)
    );
  };

  const eliminaCompletDinCos = (id) => {
    setCosProduse((prev) => prev.filter((p) => p.id !== id));
  };

  const golesteCos = () => {
    setCosProduse([]);
  };

  return (
    <CartContext.Provider
      value={{
        cosProduse,
        adaugaInCos,
        elimina1DinCos,
        eliminaCompletDinCos,
        golesteCos,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};