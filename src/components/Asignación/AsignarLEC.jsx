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
  const [selectedLEC, setSelectedLEC] = useState(null);

  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [localidades, setLocalidades] = useState([]);

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

  useEffect(() => {
    const fetchLEC = async () => {
      const response = await axios.get(`${apiUrl}/asignacion/lecs/`);
      setLecList(response.data);
    };

    fetchLEC();
    setEstados(
      Object.keys(lugares).map((estado) => ({ label: estado, value: estado }))
    );
  }, [apiUrl]);

  const handleEstadoChange = (e) => {
    const estadoSeleccionado = e.value;
    setEstado(estadoSeleccionado);
    setMunicipios(
      lugares[estadoSeleccionado]?.municipios.map((municipio) => ({
        label: municipio,
        value: municipio,
      })) || []
    );
    setLocalidades(
      lugares[estadoSeleccionado]?.pueblos.map((localidad) => ({
        label: localidad,
        value: localidad,
      })) || []
    );
    setMunicipio("");
    setLocalidad("");
  };

  const handleMunicipioChange = (e) => {
    setMunicipio(e.value);
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

      const responseLEC = await axios.get(`${apiUrl}/asignacion/lecs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          estado: estado,
          municipio: municipio,
          localidad: localidad,
        },
      });
      setFilteredLEC(responseLEC.data);

      const responseCentros = await axios.get(`${apiUrl}/asignacion/centros/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          estado: estado,
          municipio: municipio,
        },
      });
      setCentrosList(responseCentros.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInscribirLEC = () => {
    if (selectedLEC && selectedCentro) {
      const nuevaAsignacion = {
        lecId: selectedLEC.id,
        lecNombre: selectedLEC.nombre,
        centroId: selectedCentro.id,
        centroNombre: selectedCentro.clave_centro_trabajo,
        estado: selectedCentro.estado,
        municipio: selectedCentro.municipio,
        localidad: selectedCentro.nombre_localidad,
      };
      setAsignaciones([...asignaciones, nuevaAsignacion]);
    }
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
            options={estados}
            onChange={handleEstadoChange}
            placeholder="Seleccione un estado"
          />

          <label>Municipio:</label>
          <Dropdown
            value={municipio}
            options={municipios}
            onChange={handleMunicipioChange}
            placeholder="Seleccione un municipio"
          />

          <label>Localidad:</label>
          <Dropdown
            value={localidad}
            options={localidades}
            onChange={handleLocalidadChange}
            placeholder="Seleccione una localidad"
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
          selectionMode="single"
          selection={selectedLEC}
          onSelectionChange={(e) => setSelectedLEC(e.value)}
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
            value={estado}
            options={estados}
            onChange={(e) => setEstado(e.value)}
            placeholder="Selecciona un estado"
          />

          <label>Municipio:</label>
          <Dropdown
            value={municipio}
            options={municipios}
            onChange={(e) => setMunicipio(e.value)}
            placeholder="Selecciona un municipio"
            disabled={!estado}
          />

          <Button
            label="Buscar"
            onClick={handleFilterChange}
            style={{ marginTop: "2%" }}
          />
        </div>
        <DataTable
          value={centrosList.filter((centro) => centro.estado === estado)}
          responsiveLayout="scroll"
          selectionMode="single"
          selection={selectedCentro}
          onSelectionChange={(e) => setSelectedCentro(e.value)}
          style={{ marginTop: "20px" }}
        >
          <Column field="clave_centro_trabajo" header="CCT" />
          <Column field="nombre_turno" header="Turno" />
          <Column field="nivel_educativo" header="Nivel Educativo" />
          <Column field="codigo_postal" header="CP" />
          <Column field="domicilio" header="Domicilio" />
          <Column field="vacantes" header="Vacantes" />
        </DataTable>
      </div>

      {/* Tercer tercio */}
      <div style={{ width: "33%", marginRight: "2%" }}>
        <h2>LEC Asignados</h2>
        <Button
          label="Inscribir LEC"
          onClick={handleInscribirLEC}
          style={{ marginBottom: "2%" }}
          disabled={!selectedLEC || !selectedCentro}
        />
        <DataTable
          value={asignaciones.filter(
            (asignacion) => asignacion.centroId === selectedCentro?.id
          )}
          responsiveLayout="scroll"
        >
          <Column field="lecNombre" header="Nombre del LEC" />
          <Column field="estado" header="Estado" />
          <Column field="municipio" header="Municipio" />
          <Column field="localidad" header="Localidad" />
        </DataTable>
      </div>
    </div>
  );
};

export default AsignarLEC;