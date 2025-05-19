import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SeleccionarFechaHora = () => {
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState("");
  const [horariosBarbero, setHorariosBarbero] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const queryParams = new URLSearchParams(window.location.search);
  const barberoId = queryParams.get("barbero_id");
  const usuarioId = localStorage.getItem("usuario_id");
  const corteId = localStorage.getItem("corte_id");

  useEffect(() => {
    if (barberoId) {
      axios
        .get(`http://localhost:5000/get_horarios/${barberoId}`)
        .then((response) => {
          setHorariosBarbero(response.data);
        })
        .catch(() => {
          setError("Error al obtener los horarios del barbero.");
        });
    }
  }, [barberoId]);

  const handleFechaChange = (date) => {
    setFecha(date);
    setMensaje("");
    setError("");
  };

  const handleHoraChange = (event) => {
    setHora(event.target.value);
    setMensaje("");
    setError("");
  };

  const verificarYGuardarReserva = async () => {
    if (!fecha || !hora) {
      setError("Por favor, selecciona una fecha y una hora.");
      return;
    }

    const diasSemana = {
      sunday: "Domingo",
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
    };

    const diaSeleccionado = diasSemana[fecha.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()];

    if (!diaSeleccionado) {
      setError("Error al obtener el día seleccionado.");
      return;
    }

    const horarioBarbero = horariosBarbero.find((horario) => horario.dia === diaSeleccionado);

    if (!horarioBarbero) {
      setError(`No hay horario disponible para el día ${diaSeleccionado}`);
      return;
    }

    const horaInicio = horarioBarbero.hora_inicio.slice(0, 5);
    const horaFin = horarioBarbero.hora_fin.slice(0, 5);

    if (hora < horaInicio || hora > horaFin) {
      setError(`La hora seleccionada no está dentro del horario disponible (${horaInicio} - ${horaFin}).`);
      return;
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se ha proporcionado el token de autenticación.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/guardar_reserva?usuario_id=${usuarioId}&barbero_id=${barberoId}&corte_id=${corteId}&fecha_cita=${fecha.toISOString().split("T")[0]}&hora_cita=${hora}&estado=pendiente`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje("Reserva guardada exitosamente.");

    } catch (error) {
      setError("Error al guardar la reserva.");
    }
  };
  
  return (
    <div>
      <h1>Seleccionar Fecha y Hora</h1>
      <DatePicker selected={fecha} onChange={handleFechaChange} dateFormat="dd/MM/yyyy" />
      <input type="time" value={hora} onChange={handleHoraChange} />
      <button onClick={verificarYGuardarReserva}>Guardar</button>
      <br/>    
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <a style={{ color: "green" }} href="/">{mensaje}</a>}

    </div>
  );
};

export default SeleccionarFechaHora;
