import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import { useLocation, useHistory } from "react-router-dom";
import { Button } from "reactstrap";

export default function Barberos() {
  const [barberos, setBarberos] = useState([]);
  const location = useLocation();
  const history = useHistory();

  const corte = location.state?.corte || "";

  useEffect(() => {
    axios
      .get("http://localhost:5000/get_barberos")
      .then((response) => {
        setBarberos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener barberos:", error);
      });
  }, []);

  const handleReserva = (barbero) => {
    if (!barbero || !barbero.id) {
      console.error("Error: No se pudo obtener el ID del barbero.");
      return;
    }

    sessionStorage.setItem("barberoSeleccionado", JSON.stringify(barbero));
    localStorage.setItem("barbero_id", barbero.id); // ✅ Guarda el ID del barbero en localStorage

    console.log("Barbero guardado:", barbero);

    history.push(`/Horarios?barbero_id=${barbero.id}`);
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
        <h1 className="titulo">Barberos disponibles</h1>
        <div className="container">
          {barberos.length > 0 ? (
            barberos.map((barbero) => (
              <div key={barbero.id} className="caja">
                <img src={barbero.foto} alt={barbero.nombre} />
                <h1 className="barberos">{barbero.nombre}</h1>
                <p>Especialidad: {barbero.especialidad}</p>
                <p>ID: {barbero.id}</p>
                <Button className="b" onClick={() => handleReserva(barbero)}>
                  Horarios
                </Button>
              </div>
            ))
          ) : (
            <p>No hay barberos disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}