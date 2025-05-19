import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post("http://localhost/backend/register.php", {
        nombre,
        username,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.error || "Error al registrar usuario");
    }
  };

  return (
    <div className="containerPrincipal">
      <div className="containerSecundario"> 
        <h2 className="titulo_Login">Registro</h2> 
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            className="form-control" 
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <br /> <br />
          
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br /> <br />
          
          <input
            type="password"
            className="form-control" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br /> <br />
          
          <button className="btn_btn-primary" type="submit">Registrar</button> {/* Estilo de botón */}
        </form>
      </div>
    </div>
  );
};

export default Register;
