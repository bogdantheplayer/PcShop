import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cosProduse, setCosProduse] = useState([]);

  const adaugaInCos = (produs) => {
  const index = cosProduse.findIndex(p => p.id === produs.id);
  if (index !== -1) {
    const cosNou = [...cosProduse];
    cosNou[index].cantitate += 1;
    setCosProduse(cosNou);
  } else {
    setCosProduse([...cosProduse, { ...produs, cantitate: 1 }]);
  }
};

const elimina1DinCos = (id) => {
  const index = cosProduse.findIndex(p => p.id === id);
  if (index !== -1) {
    const cosNou = [...cosProduse];
    if (cosNou[index].cantitate > 1) {
      cosNou[index].cantitate -= 1;
    } else {
      cosNou.splice(index, 1);
    }
    setCosProduse(cosNou);
  }
};

const eliminaCompletDinCos = (id) => {
  const cosNou = cosProduse.filter(p => p.id !== id);
  setCosProduse(cosNou);
};

  const golesteCos = () => {
    setCosProduse([]);
  };

  return (
    <CartContext.Provider value={{ cosProduse, adaugaInCos, elimina1DinCos, eliminaCompletDinCos, golesteCos }}>
      {children}
    </CartContext.Provider>
  );
};
