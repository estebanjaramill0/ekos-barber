import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Catalogo() {
  const [cortes, setCortes] = useState([]);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchCortes = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Obtén el token
                const response = await axios.get(`${API_URL}/get_cortes`, {
          headers: {
            Authorization: token // ✅ Envíalo en la cabecera
          }
        });
        
        if (response.data && Array.isArray(response.data)) {
          setCortes(response.data);
        } else {
          setError("No se obtuvieron datos");
        }
      } catch (error) {
        setError("Error al obtener los cortes");
        console.error("Error:", error);
      }
    };

    fetchCortes();
  }, []);

  const handleSeleccionCorte = (corte) => {
    sessionStorage.setItem("corteSeleccionado", JSON.stringify(corte));
    localStorage.setItem("corte_id", corte.id); // ✅ Guarda el ID del corte en localStorage

    history.push("/Barberos", { corte: corte.nombre }); // Puedes pasarlo también por state
  };

  return (
    <div>
          <br />
         <div style={{ display: "flex", justifyContent: "flex-end" }}>
  <button
    onClick={() => {
      window.location.href = "/"; // Redirigir a la página de inicio
    }}
    style={{
      padding: "10px",
      cursor: "pointer",
      backgroundColor: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "5px"
    }}
  >
    Volver a inicio
  </button>
</div>
      <br />
      <div className="contenedorCat">
        <h1 className="titulo">Catálogo</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="container">
          {cortes.map((corte) => (
            <div className="caja" key={corte.id}>
              {corte.imagen && (
                <img
                  src={corte.imagen}
                  alt={corte.nombre}
                  className="imagen-corte"
                />
              )}
              <button
                className="b"
                onClick={() => handleSeleccionCorte(corte)}
              >
                {corte.nombre.toUpperCase()}
              </button>
              <p>
                <strong>Descripción:</strong> {corte.descripcion}
              </p>
              <p>
                <strong>Duración:</strong> {corte.duracion_min} min
              </p>
              <p>
                <strong>Precio:</strong> ${corte.precio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
