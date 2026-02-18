import React, { useState, useEffect, useRef } from "react";
import ReactSlider from "react-slider";
import "../App.css";

function FiltruSimplu({ sortOption, onSortChange, onPriceRangeChange, onProducatorChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [range, setRange] = useState([0, 20000]);
  const [producatoriSelectati, setProducatoriSelectati] = useState([]);

  const listaProducatori = ["Intel", "MSI", "Corsair", "ASUS", "Kingston", "Seagate", "NZXT", "Deepcool", "ARCTIC"];

  const dropdownRef = useRef();

  // inchidere la click in afara
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleSort = (option) => {
    onSortChange(sortOption === option ? "" : option);
  };

  const handleSliderChange = (values) => {
    setRange(values);
    onPriceRangeChange(values);
  };

  const handleInputChange = (e, index) => {
    const newRange = [...range];
    newRange[index] = Number(e.target.value);
    setRange(newRange);
    onPriceRangeChange(newRange);
  };

  const handleProducatorToggle = (producator) => {
    const nouSelectati = producatoriSelectati.includes(producator)
      ? producatoriSelectati.filter((p) => p !== producator)
      : [...producatoriSelectati, producator];

    setProducatoriSelectati(nouSelectati);
    onProducatorChange(nouSelectati);
  };

  return (
    <div style={{ position: "relative", marginRight: "15px" }} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        style={{
          backgroundColor: "#1e1e1e",
          color: "#fff",
          padding: "8px 12px",
          border: "1px solid #444",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Filtrează ▾
      </button>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            backgroundColor: "#2c2c2c",
            color: "#fff",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            zIndex: 1000,
            width: "260px",
          }}
        >
          {/* sortare */}
          <div style={{ marginBottom: "10px" }}>
            <strong>Sortare preț:</strong>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={sortOption === "pret-crescator"}
                  onChange={() => handleSort("pret-crescator")}
                />{" "}
                Preț crescător
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={sortOption === "pret-descrescator"}
                  onChange={() => handleSort("pret-descrescator")}
                />{" "}
                Preț descrescător
              </label>
            </div>
          </div>

          {/* slider pret */}
          <div style={{ marginBottom: "10px" }}>
            <strong>Interval preț:</strong>
            <div style={{ margin: "10px 0" }}>
              <ReactSlider
                min={0}
                max={20000}
                value={range}
                onChange={handleSliderChange}
                className="custom-slider"
                thumbClassName="thumb"
                trackClassName="track"
                pearling
                minDistance={100}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                <span>{range[0]} Lei</span>
                <span>{range[1]} Lei</span>
              </div>
            </div>

            {/* inputuri numerice */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <input
                type="number"
                value={range[0]}
                min="0"
                max={range[1]}
                onChange={(e) => handleInputChange(e, 0)}
                style={{
                  width: "100px",
                  padding: "5px",
                  backgroundColor: "#1e1e1e",
                  border: "1px solid #444",
                  color: "white",
                }}
              />
              <input
                type="number"
                value={range[1]}
                min={range[0]}
                max="20000"
                onChange={(e) => handleInputChange(e, 1)}
                style={{
                  width: "100px",
                  padding: "5px",
                  backgroundColor: "#1e1e1e",
                  border: "1px solid #444",
                  color: "white",
                }}
              />
            </div>
          </div>

          {/* filtrare Producator */}
          <div style={{ marginTop: "10px" }}>
            <strong>Producător:</strong>
            {listaProducatori.map((producator) => (
              <div key={producator}>
                <label>
                  <input
                    type="checkbox"
                    checked={producatoriSelectati.includes(producator)}
                    onChange={() => handleProducatorToggle(producator)}
                  />{" "}
                  {producator}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FiltruSimplu;
