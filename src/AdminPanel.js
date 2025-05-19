import React, { useState } from "react";
import TableView from "./components/TableView";

const AdminPanel = () => {
  const [selectedTable, setSelectedTable] = useState(null);

  const tables = ["usuarios", "barberos", "reservas", "cortes"]; // Nombres de las tablas

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

      <h1 className="titulo" >Panel de Administrador</h1>
      <div>
        <h2>Selecciona una tabla:</h2>
        <br/>
        {tables.map((table) => (
          <button key={table} onClick={() => setSelectedTable(table)}>
            {table}
          </button>
        ))}
      </div>
      {selectedTable && <TableView tableName={selectedTable} />}
    </div>
  );
};

export default AdminPanel;