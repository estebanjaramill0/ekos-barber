import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const TableView = ({ tableName }) => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const token = localStorage.getItem("token");
  const [usuarios, setUsuarios] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [cortes, setCortes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (tableName === "reservas") {
      fetchUsuarios();
      fetchBarberos();
      fetchCortes();
    }
  }, [tableName]);

  const fetchUsuarios = async () => {
    const response = await axios.get(`${API_URL}/admin/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsuarios(response.data);
  };

  const fetchBarberos = async () => {
    const response = await axios.get(`${API_URL}/admin/barberos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBarberos(response.data);
  };

  const fetchCortes = async () => {
    const response = await axios.get(`${API_URL}/admin/cortes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCortes(response.data);
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/${tableName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleAdd = async () => {
    try {
      let newRowToSave = { ...newRow };

      if (tableName === "reservas") {
        newRowToSave = {
          ...newRow,
          usuario_id: getIdFromName(newRow.usuario, usuarios),
          barbero_id: getIdFromName(newRow.barbero, barberos),
          corte_id: getIdFromName(newRow.corte, cortes),
        };
        delete newRowToSave.usuario;
        delete newRowToSave.barbero;
        delete newRowToSave.corte;
      }

      await axios.post(
        `${API_URL}/admin/${tableName}`,
        newRowToSave,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
      setNewRow({});
    } catch (error) {
      console.error("Error al agregar el registro:", error);
    }
  };

  const handleEdit = (id, row) => {
    setEditingRowId(id);
    setEditedRow(row);
  };

  const handleSave = async (id) => {
    try {
      if (tableName === "reservas") {
        const updatedRow = {
          ...editedRow,
          usuario_id: getIdFromName(editedRow.usuario, usuarios),
          barbero_id: getIdFromName(editedRow.barbero, barberos),
          corte_id: getIdFromName(editedRow.corte, cortes),
        };
        delete updatedRow.usuario;
        delete updatedRow.barbero;
        delete updatedRow.corte;

        await axios.put(
          `${API_URL}/admin/${tableName}/${id}`,
          updatedRow,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.put(
          `${API_URL}/admin/${tableName}/${id}`,
          editedRow,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setEditingRowId(null);
      fetchData();
      setErrorMessage("Registro exitoso");
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      setErrorMessage("No se pudo guardar el registro. Por favor, verifica los datos e inténtalo de nuevo.");
    }
  };

  // Función para obtener el ID a partir del nombre
  const getIdFromName = (name, list) => {
    const item = list.find((item) => item.nombre === name);
    return item ? item.id : null;
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/${tableName}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      {errorMessage && (
        errorMessage === "Registro exitoso" ? (
          <div style={{ color: "green", marginBottom: "1rem" }}>
            {errorMessage}
          </div>
        ) : (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {errorMessage}
          </div>
        )
      )}

      <h2>Tabla: {tableName}</h2>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "auto",
            minWidth: "600px",
          }}
        >
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    style={{
                      padding: "0.5rem",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                      backgroundColor: "#f4f4f4",
                    }}
                  >
                    {key}
                  </th>
                ))}
              <th
                style={{
                  padding: "0.5rem",
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: "#f4f4f4",
                }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                {Object.keys(row).map((key) => (
                  <td
                    key={key}
                    title={row[key]}
                    style={{
                      padding: "0.5rem",
                      borderBottom: "1px solid #ddd",
                      wordWrap: "break-word",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {editingRowId === row.id ? (
                      <input
                        type="text"
                        value={editedRow[key] || ""}
                        onChange={(e) =>
                          setEditedRow({ ...editedRow, [key]: e.target.value })
                        }
                        style={{ width: "100%" }}
                      />
                    ) : (
                      row[key]
                    )}
                  </td>
                ))}
                <td
                  style={{
                    padding: "0.5rem",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {editingRowId === row.id ? (
                    <button onClick={() => handleSave(row.id)}>Guardar</button>
                  ) : (
                    <button onClick={() => handleEdit(row.id, row)}>Editar</button>
                  )}
                  <button onClick={() => handleDelete(row.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <td
                    key={key}
                    style={{
                      padding: "0.5rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <input
                      type="text"
                      placeholder={key}
                      value={newRow[key] || ""}
                      onChange={(e) =>
                        setNewRow({ ...newRow, [key]: e.target.value })
                      }
                      style={{ width: "100%" }}
                    />
                  </td>
                ))}
              <td
                style={{
                  padding: "0.5rem",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <button onClick={handleAdd}>Agregar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;