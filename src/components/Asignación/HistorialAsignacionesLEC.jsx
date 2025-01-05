import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext"; 
import { Toast } from "primereact/toast"; 

const HistorialAsignacionesLEC = () => {
  const toast = useRef(null); // Referencia para el Toast

  // Estado para las listas principales
  const [historialLECs, setHistorialLECs] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Función para refrescar el token
  const refreshToken = async () => {
    try {
      const refreshToken = JSON.parse(localStorage.getItem("refresh-token"));
      const response = await axios.post(`${apiUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
      const newAccessToken = response.data.access;
      localStorage.setItem("access-token", JSON.stringify(newAccessToken));
      return newAccessToken;
    } catch (error) {
      console.error("Error al refrescar el token:", error);
      throw new Error("No se pudo renovar el token de acceso.");
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        let token = JSON.parse(localStorage.getItem("access-token"));
        if (!token) {
          token = await refreshToken();
        }
        // Aquí puedes cargar datos iniciales si es necesario
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleConsultarHistorial = async () => {
    if (!nombre || !apellidoPaterno || !apellidoMaterno) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos: nombre, apellido paterno y apellido materno.',
        life: 3000,
      });
      return;
    }

    try {
      let token = JSON.parse(localStorage.getItem("access-token"));
      if (!token) {
        token = await refreshToken();
      }
      const response = await axios.get(`${apiUrl}/asignacion/historial-lec/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          nombre: nombre,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
        },
      });
      console.log("Historial de LECs:", response.data);
      setHistorialLECs(response.data);

    } catch (error) {
      console.error("Error al consultar historial:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al consultar historial. Por favor, intente nuevamente.',
        life: 3000,
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
      <Toast ref={toast} /> {/* Componente Toast */}
      {/* Sección de búsqueda */}
      <div style={{ width: "33%", padding: "1rem" }}>
        <h2>Consultar Historial de LECs</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label>Nombre:</label>
            <InputText
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingrese el nombre"
              className="w-full mt-1"
            />
          </div>
          <div>
            <label>Apellido Paterno:</label>
            <InputText
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
              placeholder="Ingrese el apellido paterno"
              className="w-full mt-1"
            />
          </div>
          <div>
            <label>Apellido Materno:</label>
            <InputText
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
              placeholder="Ingrese el apellido materno"
              className="w-full mt-1"
            />
          </div>
          <Button
            label="Consultar Historial"
            onClick={handleConsultarHistorial}
            className="mt-2"
          />
        </div>
      </div>

      {/* Sección de resultados */}
      <div style={{ width: "50%", padding: "1rem" }}>
        <h2>Resultados</h2>
        <DataTable value={historialLECs} responsiveLayout="scroll">
          <Column field="centro" header="Centro" />
          <Column field="estado" header="Estado" />
          <Column field="municipio" header="Municipio" />
          <Column field="fecha_asignacion" header="Fecha de asignación" />
        </DataTable>
      </div>
    </div>
  );
};

export default HistorialAsignacionesLEC;