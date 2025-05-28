require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cors());

// Conexión a la base de datos 'usuarios'
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "usuarios"
});

db.connect(err => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
  } else {
    console.log("Conectado a la base de datos MySQL");
  }
});

const jwtSecret = process.env.JWT_SECRET || "secreto";
const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("Token recibido en el servidor:", token);

  if (!token) {
    return res.status(403).json({ error: "Token no proporcionado" });
  }

  const tokenSinBearer = token.startsWith("Bearer ") ? token.slice(7) : token;
  jwt.verify(tokenSinBearer, jwtSecret, (err, decoded) => {
    if (err) {
      console.error("Token inválido:", err);
      return res.status(401).json({ error: "Token inválido o expirado" });
    }
    req.user = decoded;
    next();
  });
};


// server.js
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: "Error al verificar contraseña" });

      if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

      const token = jwt.sign(
        { usuario_id: user.id, username: user.username }, // Guardamos el id como usuario_id
        jwtSecret,
        { expiresIn: "1h" }
      );

      // Enviar también el usuario_id y el username en la respuesta
      res.json({ message: "Login exitoso", token, usuario_id: user.id, username: user.username });
    });
  });
});



// Ruta protegida para obtener cortes
app.get("/get_cortes", verificarToken, (req, res) => {
  const sql = "SELECT * FROM cortes";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener cortes:", err);
      return res.status(500).json({ error: "Error al obtener cortes" });
    }
    res.json(results);
  });
});

// Ruta para obtener todos los barberos
app.get("/get_barberos", (req, res) => {
  const sql = "SELECT id, nombre, especialidad, foto FROM barberos";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener barberos:", err);
      return res.status(500).json({ error: "Error al obtener barberos" });
    }
    res.json(results);
  });
});

// Ruta para obtener horarios de un barbero
app.get("/get_horarios/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT dia_semana AS dia, hora_inicio, hora_fin FROM horarios_barberos WHERE barbero_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener horarios:", err);
      return res.status(500).json({ error: "Error al obtener horarios" });
    }
    res.json(results);
  });
});

// Ruta para verificar disponibilidad de horario
app.get("/verificar_disponibilidad", (req, res) => {
  const { barbero_id, fecha_cita, hora_cita } = req.query;

  if (!barbero_id || !fecha_cita || !hora_cita) {
    return res.status(400).json({ error: "Todos los parámetros son obligatorios" });
  }

  const sql = "SELECT COUNT(*) AS total FROM reservas WHERE barbero_id = ? AND fecha_cita = ? AND hora_cita = ?";
  
  db.query(sql, [barbero_id, fecha_cita, hora_cita], (err, results) => {
    if (err) {
      console.error("Error al verificar disponibilidad:", err);
      return res.status(500).json({ error: "Error al verificar disponibilidad" });
    }

    const disponible = results[0].total === 0;
    res.json({ disponible });
  });
});

// Ruta para guardar una reserva (ahora utilizando GET)
app.get("/guardar_reserva", verificarToken, (req, res) => {
  const { usuario_id, barbero_id, corte_id, fecha_cita, hora_cita, estado } = req.query;

  if (!usuario_id || !barbero_id || !corte_id || !fecha_cita || !hora_cita || !estado) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO reservas (usuario_id, barbero_id, corte_id, fecha_cita, hora_cita, estado) VALUES (?, ?, ?, ?, ?, ?)";
  
  db.query(sql, [usuario_id, barbero_id, corte_id, fecha_cita, hora_cita, estado], (err, results) => {
    if (err) {
      console.error("Error al guardar la reserva:", err);
      return res.status(500).json({ error: "Error al guardar la reserva" });
    }
    res.json({ message: "Reserva guardada exitosamente", reserva_id: results.insertId });
  });
});






//PANEL DE ADMINISTRACION
// Ruta para obtener datos de una tabla específica

app.get("/admin/:tabla", verificarToken, (req, res) => {
  const { tabla } = req.params;

  let sql;
  if (tabla === "reservas") {
    sql = `
      SELECT 
        reservas.id,
        usuarios.nombre AS usuario,
        barberos.nombre AS barbero,
        cortes.nombre AS corte,
        reservas.fecha_cita,
        reservas.hora_cita,
        reservas.estado
      FROM reservas
      JOIN usuarios ON reservas.usuario_id = usuarios.id
      JOIN barberos ON reservas.barbero_id = barberos.id
      JOIN cortes ON reservas.corte_id = cortes.id
    `;
  } else {
    sql = `SELECT * FROM ??`;
  }

  db.query(sql, [tabla], (err, results) => {
    if (err) {
      console.error(`Error al obtener datos de la tabla ${tabla}:`, err);
      return res.status(500).json({ error: `Error al obtener datos de la tabla ${tabla}` });
    }
    res.json(results);
  });
});

// Ruta para agregar un nuevo registro a una tabla
app.post("/admin/:tabla", verificarToken, (req, res) => {
  const { tabla } = req.params;
  const datos = req.body;

  const sql = `INSERT INTO ?? SET ?`;
  db.query(sql, [tabla, datos], (err, results) => {
    if (err) {
      console.error(`Error al insertar datos en la tabla ${tabla}:`, err);
      return res.status(500).json({ error: `Error al insertar datos en la tabla ${tabla}` });
    }
    res.json({ message: "Registro agregado exitosamente", id: results.insertId });
  });
});

// Ruta para actualizar un registro en una tabla
app.put("/admin/:tabla/:id", verificarToken, (req, res) => {
  const { tabla, id } = req.params;
  const datos = req.body;

  const sql = `UPDATE ?? SET ? WHERE id = ?`;
  db.query(sql, [tabla, datos, id], (err, results) => {
    if (err) {
      console.error(`Error al actualizar datos en la tabla ${tabla}:`, err);
      return res.status(500).json({ error: `Error al actualizar datos en la tabla ${tabla}` });
    }
    res.json({ message: "Registro actualizado exitosamente" });
  });
});

// Ruta para eliminar un registro de una tabla
app.delete("/admin/:tabla/:id", verificarToken, (req, res) => {
  const { tabla, id } = req.params;

  const sql = `DELETE FROM ?? WHERE id = ?`;
  db.query(sql, [tabla, id], (err, results) => {
    if (err) {
      console.error(`Error al eliminar datos de la tabla ${tabla}:`, err);
      return res.status(500).json({ error: `Error al eliminar datos de la tabla ${tabla}` });
    }
    res.json({ message: "Registro eliminado exitosamente" });
  });
});

// Ruta para obtener información del usuario 

// ...existing code...

app.get("/account", verificarToken, (req, res) => {
  console.log("Usuario autenticado:", req.user); // <-- Agrega esto
  const usuario_id = req.user.usuario_id;
 
  // Obtener información del usuario
  const sqlUser = "SELECT id, nombre, email, telefono FROM usuarios WHERE id = ?";
  db.query(sqlUser, [usuario_id], (err, userResults) => {
    if (err || userResults.length === 0) {
      return res.status(500).json({ error: "Error al obtener información del usuario" });
    }
    const user = userResults[0];

    // Obtener reservas del usuario
    const sqlReservas = `
      SELECT 
        reservas.id,
        reservas.fecha_cita,
        reservas.hora_cita,
        reservas.estado,
        barberos.nombre AS barbero,
        cortes.nombre AS corte
      FROM reservas
      JOIN barberos ON reservas.barbero_id = barberos.id
      JOIN cortes ON reservas.corte_id = cortes.id
      WHERE reservas.usuario_id = ?
      ORDER BY reservas.fecha_cita DESC, reservas.hora_cita DESC
    `;
    db.query(sqlReservas, [usuario_id], (err, reservasResults) => {
      if (err) {
        return res.status(500).json({ error: "Error al obtener reservas" });
      }
      res.json({ user, reservas: reservasResults });
    });
  });
});

// ...existing code...




// Iniciar el servidor
app.listen(5000, () => {
  console.log("Servidor corriendo en el puerto 5000");
});
