import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast"; // Importar Toast
import lugares from "../../tools/lugares_mexico.json";

const AsignarLEC = () => {
  const toast = useRef(null); // Referencia para el Toast

  // Estado para las listas principales
  const [lecList, setLecList] = useState([]);
  const [filteredLEC, setFilteredLEC] = useState([]);
  const [centrosList, setCentrosList] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [lecAsignado, setLecAsignado] = useState(null); // Nuevo estado para almacenar el LEC asignado
  const [lecsAsignados, setLecsAsignados] = useState([]); // Nuevo estado para almacenar los LECs asignados
  
  // Estado para selecciones
  const [selectedLEC, setSelectedLEC] = useState(null);
  const [selectedCentro, setSelectedCentro] = useState(null);

  // Estado para filtros de LEC
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  // Estado para filtros de Centros
  const [estadoCentro, setEstadoCentro] = useState("");
  const [municipioCentro, setMunicipioCentro] = useState("");
  const [municipiosCentro, setMunicipiosCentro] = useState([]);
  const [centrosFiltrados, setCentrosFiltrados] = useState([]);

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

  // Actualizar municipios cuando cambia el estado (para LEC)
  useEffect(() => {
    if (estado && lugares[estado]) {
      setMunicipios(
        lugares[estado].municipios.map((municipio) => ({
          label: municipio,
          value: municipio,
        }))
      );
      // Reset dependientes
      setMunicipio("");
      setLocalidad("");
      setLocalidades([]);
    }
  }, [estado]);

  // Actualizar municipios cuando cambia el estado (para Centros)
  useEffect(() => {
    if (estadoCentro && lugares[estadoCentro]) {
      setMunicipiosCentro(
        lugares[estadoCentro].municipios.map((municipio) => ({
          label: municipio,
          value: municipio,
        }))
      );
      // Reset dependiente
      setMunicipioCentro("");
    }
  }, [estadoCentro]);

  // Actualizar localidades cuando cambia el municipio
  useEffect(() => {
    if (estado && municipio && lugares[estado]) {
      setLocalidades(
        lugares[estado].pueblos.map((pueblo) => ({
          label: pueblo,
          value: pueblo,
        }))
      );
    }
  }, [estado, municipio]);

  // Handlers para LEC
  const handleEstadoChange = (e) => {
    setEstado(e.value);
  };

  const handleMunicipioChange = (e) => {
    setMunicipio(e.value);
  };

  const handleLocalidadChange = (e) => {
    setLocalidad(e.value);
  };

  // Handlers para Centros
  const handleEstadoCentroChange = (e) => {
    setEstadoCentro(e.value);
  };

  const handleMunicipioCentroChange = (e) => {
    setMunicipioCentro(e.value);
  };

  // Función para buscar LEC
const handleFilterChange = async () => {
  if (!estado || !municipio || !localidad) {
    toast.current.show({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Por favor complete todos los campos: Estado, Municipio y Localidad.',
      life: 3000,
    });
    return;
  }

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
        estado,
        municipio,
        localidad,
      },
    });
    setFilteredLEC(response.data);
  } catch (error) {
    console.error("Error al buscar LECs:", error);
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al buscar LECs. Por favor, intente nuevamente.',
      life: 3000,
    });
  }
};


  // Función para buscar Centros
  const handleBuscarCentros = async () => {
    if (!estadoCentro || !municipioCentro) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos: Estado y Municipio.',
        life: 3000,
      });
      return;
    }

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
    } catch (error) {
      console.error("Error al buscar centros:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al buscar centros. Por favor, intente nuevamente.',
        life: 3000,
      });
    }
  };

  // Función para asignar LEC
  const handleAsignarLEC = async () => {
    if (!selectedLEC) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor seleccione un LEC y un centro para asignar.',
        life: 3000,
      });
      return;
    } else if (!selectedCentro) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor seleccione un centro para asignar.',
        life: 3000,
      });
      return;
    }

    try {
      let token = JSON.parse(localStorage.getItem("access-token"));
      if (!token) {
        token = await refreshToken();
      }

      const response = await axios.post(
        `${apiUrl}/asignacion/asignar-lec/`,
        {
          lec_id: selectedLEC.id, // Asegúrate de que selectedLEC tiene un campo `id`
          centro_id: selectedCentro.id, // Asegúrate de que selectedCentro tiene un campo `id`
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Actualizar el estado con la información del LEC asignado
      setLecAsignado({
        lecNombre: `${selectedLEC.nombre} `,
        cct: selectedCentro.clave_centro_trabajo,
        estado: selectedCentro.estado,
        municipio: selectedCentro.municipio,
      });

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'LEC asignado correctamente.',
        life: 3000,
      });
    } catch (error) {
      console.error("Error al asignar LEC:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al asignar LEC. Por favor, intente nuevamente.',
        life: 3000,
      });
    }

    setSelectedLEC(null);
    setSelectedCentro(null);
    handleFilterChange();
    handleBuscarCentros();
  };

  const handleCentroSelect = async (centro) => {
    setSelectedCentro(centro);

    try {
      let token = JSON.parse(localStorage.getItem("access-token"));
      if (!token) {
        token = await refreshToken();
      }

      const response = await axios.get(
        `${apiUrl}/asignacion/lecs/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            centro_asignado: centro.id, // Filtrar por el centro asignado
          },
        }
      );

      setLecsAsignados(response.data); // Actualizar el estado con los LECs asignados
    } catch (error) {
      console.error("Error al obtener LECs asignados:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al obtener LECs asignados. Por favor, intente nuevamente.',
        life: 3000,
      });
    }
  };

  const handleEliminarLEC = async (lecId) => {
    try {
      let token = JSON.parse(localStorage.getItem("access-token"));
      if (!token) {
        token = await refreshToken();
      }

      await axios.delete(`${apiUrl}/asignacion/eliminar-lec/${lecId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'LEC eliminado correctamente.',
        life: 3000,
      });
      handleCentroSelect(selectedCentro); // Refrescar la lista de LECs asignados
    } catch (error) {
      console.error("Error al eliminar LEC:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al eliminar LEC. Por favor, intente nuevamente.',
        life: 3000,
      });
    }
  };

  const eliminarTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={() => handleEliminarLEC(rowData.id)}
      />
    );
  };

  return (
    <div style={{ display: "flex", marginRight: "5%" }}>
      <Toast ref={toast} /> {/* Componente Toast */}
      {/* Sección de LEC Disponibles */}
      <div style={{ width: "33%", marginRight: "2%" }}>
        <h2>LEC Disponibles</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label>Estado:</label>
            <Dropdown
              value={estado}
              options={Object.keys(lugares).map((estado) => ({
                label: estado,
                value: estado,
              }))}
              onChange={handleEstadoChange}
              placeholder="Seleccione un estado"
              className="w-full mt-1"
            />
          </div>

          <div>
            <label>Municipio:</label>
            <Dropdown
              value={municipio}
              options={municipios}
              onChange={handleMunicipioChange}
              placeholder="Seleccione un municipio"
              disabled={!estado}
              className="w-full mt-1"
            />
          </div>

          <div>
            <label>Localidad:</label>
            <Dropdown
              value={localidad}
              options={localidades}
              onChange={handleLocalidadChange}
              placeholder="Seleccione una localidad"
              disabled={!municipio}
              className="w-full mt-1"
            />
          </div>

          <Button
            label="Buscar"
            onClick={handleFilterChange}
            className="mt-2"
          />
        </div>

        <DataTable
          value={filteredLEC}
          selection={selectedLEC}
          onSelectionChange={(e) => setSelectedLEC(e.value)} // selectedLEC incluirá el id
          selectionMode="single"
          responsiveLayout="scroll"
          className="mt-4"
        >
          <Column selectionMode="single" headerStyle={{ width: "3rem" }} />
          <Column field="nombre" header="Nombre" />
          <Column field="estado" header="Estado" />
          <Column field="municipio" header="Municipio" />
          <Column field="localidad" header="Localidad" />
        </DataTable>
      </div>

      {/* Sección de Centros Comunitarios */}
      <div style={{ width: "33%", marginRight: "2%" }}>
        <h2>Centros Comunitarios</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label>Estado:</label>
            <Dropdown
              value={estadoCentro}
              options={Object.keys(lugares).map((estado) => ({
                label: estado,
                value: estado,
              }))}
              onChange={handleEstadoCentroChange}
              placeholder="Seleccione un estado"
              className="w-full mt-1"
            />
          </div>

          <div>
            <label>Municipio:</label>
            <Dropdown
              value={municipioCentro}
              options={municipiosCentro}
              onChange={handleMunicipioCentroChange}
              placeholder="Seleccione un municipio"
              disabled={!estadoCentro}
              className="w-full mt-1"
            />
          </div>

          <Button
            label="Buscar"
            onClick={handleBuscarCentros}
            className="mt-2"
          />
        </div>

        <DataTable
          value={centrosFiltrados}
          selection={selectedCentro}
          onSelectionChange={(e) => handleCentroSelect(e.value)}
          selectionMode="single"
          responsiveLayout="scroll"
          className="mt-4"
          scrollHeight="400px"
        >
          <Column selectionMode="single" headerStyle={{ width: "3rem" }} />
          <Column field="clave_centro_trabajo" header="CCT" />
          <Column field="nombre_turno" header="Turno" />
          <Column field="nivel_educativo" header="Nivel Educativo" />
          <Column field="codigo_postal" header="CP" />
          <Column field="domicilio" header="Domicilio" />
          <Column field="vacantes" header="Vacantes" />
        </DataTable>
      </div>

      {/* Sección de LEC Asignados */}
      <div style={{ width: "33%" }}>
        <h2>LEC Asignados</h2>
        <Button
          label="Asignar"
          onClick={handleAsignarLEC}
          disabled={!selectedLEC || !selectedCentro}
          className="mb-4"
        />

        <DataTable
          value={lecsAsignados}
          responsiveLayout="scroll"
        >
          <Column field="nombre" header="Nombre del LEC" />
          <Column field="cct_centro_asignado" header="CCT" />
          <Column field="estado_centro_asignado" header="Estado" />
          <Column field="municipio_centro_asignado" header="Municipio" />
          <Column body={eliminarTemplate} header="Eliminar" />
        </DataTable>
      </div>
    </div>
  );
};

export default AsignarLEC;