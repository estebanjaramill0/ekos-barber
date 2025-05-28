import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AccountStatus() {
  const [userInfo, setUserInfo] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAccountInfo = async () => {
      setLoading(true);
      setErrorMsg("");
      if (!token) {
        setErrorMsg("No hay sesión activa. Por favor inicia sesión.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/account", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.user) {
          setUserInfo(response.data.user);
          setReservas(response.data.reservas || []);
        } else {
          setErrorMsg("No se encontró información del usuario.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrorMsg("Sesión expirada o token inválido. Por favor inicia sesión nuevamente.");
        } else if (error.response?.data?.error) {
          setErrorMsg(error.response.data.error);
        } else {
          setErrorMsg("No se pudo obtener la información del usuario.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, [token]);

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


      <h1 class="titulo">Estado de cuenta</h1>

      {loading ? (
        <p>Cargando información...</p>
      ) : errorMsg ? (
        <div style={{ color: "red" }}>{errorMsg}</div>
      ) : (
        <>
          <section>
            <h2>Información del Usuario</h2>
            {userInfo ? (
              <div >
                <p className="p">
                  <strong>Nombre:</strong> {userInfo.nombre}
                </p>
                <p className="p">
                  <strong>Email:</strong> {userInfo.email}
                </p>
                <p className="p">
                  <strong>Teléfono:</strong> {userInfo.telefono}
                </p>
              </div>
            ) : (
              <p className="p">No se encontró información del usuario.</p>
            )}
          </section>

          <section>
            <h2>Reservas</h2>
            {reservas && reservas.length > 0 ? (
              <ul>
                {reservas.map((reserva) => (
                  <li key={reserva.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
                    <p className="p">
                      <strong>Fecha:</strong> {reserva.fecha_cita}
                    </p>
                    <p className="p">
                      <strong>Hora:</strong> {reserva.hora_cita}
                    </p>
                    <p className="p">
                      <strong>Barbero:</strong> {reserva.barbero}
                    </p>
                    <p className="p">
                      <strong>Corte:</strong> {reserva.corte}
                    </p>
                    <p className="p">
                      <strong>Estado:</strong> {reserva.estado}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p">No tienes reservas registradas.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}