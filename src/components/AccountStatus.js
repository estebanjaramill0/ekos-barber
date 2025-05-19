import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AccountStatus() {
  const [userInfo, setUserInfo] = useState(null); // Estado para la información del usuario
  const [reservas, setReservas] = useState([]); // Estado para las reservas del usuario
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get("http://localhost:5000/account", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data.user);
        setReservas(response.data.reservas);
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };

    fetchAccountInfo();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Estado de Cuenta</h1>

      <section>
        <h2>Información del Usuario</h2>
        {userInfo ? (
          <div>
            <p>
              <strong>Nombre:</strong> {userInfo.nombre}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {userInfo.telefono}
            </p>
          </div>
        ) : (
          <p>Cargando información del usuario...</p>
        )}
      </section>

      <section>
        <h2>Reservas</h2>
        {reservas.length > 0 ? (
          <ul>
            {reservas.map((reserva) => (
              <li key={reserva.id} style={{ marginBottom: "1rem" }}>
                <p>
                  <strong>Fecha:</strong> {reserva.fecha_cita}
                </p>
                <p>
                  <strong>Hora:</strong> {reserva.hora_cita}
                </p>
                <p>
                  <strong>Barbero:</strong> {reserva.barbero}
                </p>
                <p>
                  <strong>Corte:</strong> {reserva.corte}
                </p>
                <p>
                  <strong>Estado:</strong> {reserva.estado}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes reservas registradas.</p>
        )}
      </section>
    </div>
  );
}