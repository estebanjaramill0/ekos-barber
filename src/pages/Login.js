import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom"; // Para redirigir sin recargar
import "../css/Login.css"; // Importamos los estilos CSS

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory(); // Redirección sin actualizar el DOM

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Guarda el token
        localStorage.setItem("username", response.data.username); // Guarda el nombre del usuario
        localStorage.setItem("usuario_id", response.data.usuario_id); // Guarda el ID del usuario

        setMessage("Inicio de sesión exitoso");
        history.push("/"); // Redirige a la página Home.js sin recargar
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="containerPrincipal"> 
      <div className="containerSecundario">
        <h2 className="titulo_Login">Login</h2> 
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        <form onSubmit={handleLogin}>
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
          <button className="btn_btn-primary" type="submit">Iniciar sesión</button> {/* Estilo de botón */}
        </form>
      </div>
    </div>
  );
};

export default Login;
