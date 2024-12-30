import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import lugares from "../../tools/lugares_mexico.json";

const AsignarLEC = () => {
  const [lecList, setLecList] = useState([]);
  const [filteredLEC, setFilteredLEC] = useState([]);
  const [centrosList, setCentrosList] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [selectedCentro, setSelectedCentro] = useState(null);

  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [estadoCentro, setEstadoCentro] = useState("");
  const [municipioCentro, setMunicipioCentro] = useState("");
  const [centrosFiltrados, setCentrosFiltrados] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

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

  const handleEstadoChange = (e) => {
    const estadoSeleccionado = e.value;
    setEstado(estadoSeleccionado);

    if (lugares[estadoSeleccionado]) {
      setMunicipios(
        lugares[estadoSeleccionado].municipios.map((municipio) => ({
          label: municipio,
          value: municipio,
        }))
      );
      setLocalidades([]);
      setMunicipio("");
      setLocalidad("");
    } else {
      setMunicipios([]);
      setLocalidades([]);
    }
  };

  const handleMunicipioChange = (e) => {
    const municipioSeleccionado = e.value;
    setMunicipio(municipioSeleccionado);

    if (lugares[estado]) {
      setLocalidades(
        lugares[estado].pueblos.map((pueblo) => ({
          label: pueblo,
          value: pueblo,
        }))
      );
    } else {
      setLocalidades([]);
    }
  };

  const handleLocalidadChange = (e) => {
    setLocalidad(e.value);
  };

  const handleFilterChange = async () => {
    try {
      let token = JSON.parse(localStorage.getItem("access-token"));
      if (!token) {
        token = await refreshToken();
      }
      const response = await axios.get(`${apiUrl}/asignacion/lecs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          estado: (estado),
    municipio: (municipio),
    localidad: (localidad),
        },
      });
      console.log("Response data:", response.data); // Verificar la respuesta de la API
      setFilteredLEC(response.data);
    } catch (error) {
      console.error('Error fetching LEC data:', error);
    }
  };

  const handleBuscarCentros = async () => {
    try {
      let token = JSON.parse(localStorage.getItem("access-token"));
      if (!token) {
        token = await refreshToken();
      }
      const response = await axios.get(`${apiUrl}/asignacion/centros/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          estado: estadoCentro,
          municipio: municipioCentro,
        },
      });
      setCentrosFiltrados(response.data);
      console.log("Estado",estado,municipio);
    } catch (error) {
      console.error('Error fetching centros data:', error);
    }
  };

  const handleEstadoCentroChange = (e) => {
    const estadoSeleccionado = e.value;
    setEstadoCentro(estadoSeleccionado);

    if (lugares[estadoSeleccionado]) {
      setMunicipios(
        lugares[estadoSeleccionado].municipios.map((municipio) => ({
          label: municipio,
          value: municipio,
        }))
      );
      setMunicipioCentro("");
    } else {
      setMunicipios([]);
    }
  };

  const handleMunicipioCentroChange = (e) => {
    setMunicipioCentro(e.value);
  };

  return (
    <div style={{ display: "flex", marginRight: "5%" }}>
      {/* Primer tercio */}
      <div style={{ width: "33%", marginRight: "2%" }}>
        <h2>LEC Disponibles</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "5%" }}>
          <label>Estado:</label>
          <Dropdown
            value={estado}
            options={Object.keys(lugares).map((estado) => ({
              label: estado,
              value: estado,
            }))}
            onChange={handleEstadoChange}
            placeholder="Seleccione un estado"
          />

          <label>Municipio:</label>
          <Dropdown
            value={municipio}
            options={municipios}
            onChange={handleMunicipioChange}
            placeholder="Seleccione un municipio"
            disabled={!estado}
          />

          <label>Localidad:</label>
          <Dropdown
            value={localidad}
            options={localidades}
            onChange={handleLocalidadChange}
            placeholder="Seleccione una localidad"
            disabled={!municipio}
          />

          <Button
            label="Buscar"
            onClick={handleFilterChange}
            style={{ marginTop: "2%" }}
          />
        </div>

        <DataTable
          value={filteredLEC}
          responsiveLayout="scroll"
          style={{ marginTop: "2%" }}
        >
          <Column field="nombre" header="Nombre" />
          <Column field="estado" header="Estado" />
          <Column field="municipio" header="Municipio" />
          <Column field="localidad" header="Localidad" />
        </DataTable>
      </div>

      {/* Segundo tercio */}
      <div style={{ width: "33%", marginRight: "2%" }}>
        <h2>Centros Comunitarios</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "5%" }}>
          <label>Estado:</label>
          <Dropdown
            value={estadoCentro}
            options={Object.keys(lugares).map((estado) => ({
              label: estado,
              value: estado,
            }))}
            onChange={handleEstadoCentroChange}
            placeholder="Seleccione un estado"
          />

          <label>Municipio:</label>
          <Dropdown
            value={municipioCentro}
            options={municipios}
            onChange={handleMunicipioCentroChange}
            placeholder="Seleccione un municipio"
            disabled={!estadoCentro}
          />

          <Button
            label="Buscar"
            onClick={handleBuscarCentros}
            style={{ marginTop: "2%" }}
          />
        </div>
        <DataTable
  value={centrosFiltrados}
  responsiveLayout="scroll"
  style={{ marginTop: "20px", maxHeight: "20%", overflowY: "auto" }}
>
  <Column field="clave_centro_trabajo" header="CCT" />
  <Column field="nombre_turno" header="Turno" />
  <Column field="nivel_educativo" header="Nivel Educativo" />
  <Column field="codigo_postal" header="CP" />
  <Column field="domicilio" header="Domicilio" />
</DataTable>
      </div>

      {/* Tercer tercio */}
      <div style={{ width: "33%", marginRight: "2%" }}>
        <h2>LEC Asignados</h2>
        <DataTable
          value={asignaciones.filter(
            (asignacion) => asignacion.centroId === selectedCentro?.id
          )}
          responsiveLayout="scroll"
        >
          <Column field="lecNombre" header="Nombre del LEC" />
        </DataTable>
      </div>
    </div>
  );
};

export default AsignarLEC;