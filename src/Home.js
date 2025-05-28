import React from "react";
import { useHistory } from "react-router-dom"; // Para redirigir después de cerrar sesión
import "./styles.css";

export default function Home() {
  const history = useHistory(); // Usamos useHistory para redirigir al Login después de cerrar sesión
  const username = localStorage.getItem("username") || "Invitado";

  const handleLogout = () => {
    // Eliminamos la información de sesión almacenada en localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    
    // Redirigimos al usuario a la página de Login
    history.push("/Login");
  };

  return (
    <div>
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", margin: "10px"}}>
       {username !== "Invitado" && (
      <a
          href="#"
          onClick={() => history.push("/AccountStatus")}
          style={{ cursor: "pointer", textDecoration: "underline", color: "black" }}
        >
          Estado de cuenta, {username}!
        </a>
      )}

        {username !== "Invitado" && (
          <button
            onClick={handleLogout}
            style={{
              marginLeft: "20px", 
              padding: "10px", 
              cursor: "pointer", 
              backgroundColor: "#f44336", 
              color: "white", 
              border: "none", 
              borderRadius: "5px"
            }}
          >
            Cerrar sesión
          </button>
        )}
      </div>
  
      <nav className="navegacion">
        <ul className="menu">
        {username !== "Invitado" && (
          <li>
            <a className="a" href="/Catalogo">
              Reserva Online
            </a>
          </li>
          )}
          <li>
            <a className="a" href="/Recomendaciones">
              Recomendaciones
            </a>
          </li>
          <li>
            <a className="a">Nosotros</a>
            <div className="submenu">
              <a className="a" href="/Quienessomos">
                Quienes somos
              </a>
              <a className="a" href="/Mision">
                Misión
              </a>
            </div>
          </li>
          <li>
            <a className="a">Redes sociales</a>
            <div className="submenu">
              <a className="a" href="mailto:ekosbarber@gmail.com">
                Gmail
              </a>
              <a
                className="a"
                href="https://www.instagram.com/ekosbarber/"
              >
                Instagram
              </a>
            </div>
          </li>
          
          {username == "Invitado" && (
          <li>
            <a className="a" href="/Register">
              Registro
            </a>
          </li>
          )}
          
          {username == "Invitado" && (
          <li>
            <a className="a" href="/Login">
              Login
            </a>
          </li>
          )}
          
        {username == "esteban" && (
          <li>
            <a className="a" href="/AdminPanel">
              Panel de Administrador
            </a>
          </li>
          )}

        </ul>
      </nav>
      <br></br>

      <h1 className="titulo">Bienvenidos a Eko´s-Barber</h1>
      <h1>Estilo, precisión y una experiencia única en cada visita.</h1>
      <br></br>

      <section className="standards">
        <h2>🔥 ¿Qué ofrecemos?</h2>
        <ul>
           <blockquote>
            ✅ <strong>Cortes clásicos y modernos</strong> – Desde estilos
            tradicionales hasta las últimas tendencias.
           </blockquote>
           <blockquote>
            ✅ <strong>Afeitados y arreglos de barba</strong> – Con productos de
            primera calidad.
           </blockquote>
           <blockquote>
            ✅ <strong>Tratamientos capilares y faciales</strong> – Para cuidar tu
            cabello y piel.
           </blockquote>
           <blockquote>
            ✅ <strong>Atención personalizada</strong> – Servicio adaptado a cada
            cliente.
           </blockquote>
        </ul>
      </section>

      <section className="standards">
        <h2>⭐ Nuestros estándares</h2>
         <blockquote>
          En <strong>Eko’s Barber</strong>, priorizamos la <strong>limpieza, puntualidad</strong> y <strong>satisfacción del cliente</strong>. Usamos herramientas higienizadas, productos premium y técnicas actualizadas para garantizar un servicio impecable.
        </blockquote>
      </section>

      <section className="standards">
        <h2>💬 Opiniones de nuestros clientes</h2>
        <blockquote>
          ✨ "¡Excelente servicio! Me encantó mi corte y la atención fue de
          primera. Sin duda, volveré." – <strong>Luis R.</strong>
        </blockquote>
        <blockquote>
          ✨ "Un ambiente relajado y profesional. El mejor afeitado que he tenido
          en mucho tiempo." – <strong>Carlos M.</strong>
        </blockquote>
        <blockquote>
          ✨ "Siempre salgo con el corte perfecto. Los barberos saben exactamente
          lo que hacen." – <strong>Miguel P.</strong>
        </blockquote>
      </section>

      <footer>
        <p>
          📅 <strong>Agenda tu cita hoy y vive la experiencia Eko’s Barber. ¡Te
          esperamos!</strong>
        </p>
      </footer>
    </div>
  );
}
