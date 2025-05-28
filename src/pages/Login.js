import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../css/Login.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("usuario_id", response.data.usuario_id);

        setMessage("Inicio de sesión exitoso");
        history.push("/");
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
          <button className="btn_btn-primary" type="submit">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;