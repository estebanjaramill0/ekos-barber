import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import { Link, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import SeleccionarFechaHora from "./SeleccionarFechaHora";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();

  // ✅ Obtener el ID del barbero desde la URL en React Router v5
  const queryParams = new URLSearchParams(location.search);
  const barberoId = queryParams.get("barbero_id");

  useEffect(() => {
    if (!barberoId) {
      setError("No se ha seleccionado un barbero.");
      return;
    }

    const fetchHorarios = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_horarios/${barberoId}`);
        if (response.data && Array.isArray(response.data)) {
          setHorarios(response.data);
        } else {
          setError("No se encontraron horarios para este barbero.");
        }
      } catch (error) {
        setError("Error al obtener los horarios");
        console.error("Error:", error);
      }
    };

    fetchHorarios();
  }, [barberoId]);

  return (
    <div className="fondo">

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

      <h1 className="titulo">Horarios</h1>
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && horarios.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>DÍAS</th>
              <th>HORAS</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario, index) => (
              <tr key={index}>
                <td>{horario.dia}</td>
                <td>{horario.hora_inicio} - {horario.hora_fin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Cargando horarios...</p>
      )}
      <br />
      <SeleccionarFechaHora />
      <br />
     
    </div>
  );
}
