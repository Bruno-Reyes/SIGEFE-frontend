import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AsignarLEC = () => {
  const [lecList, setLecList] = useState([]);
  const [centrosList, setCentrosList] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [selectedCentro, setSelectedCentro] = useState(null);
  const [filteredLEC, setFilteredLEC] = useState([]);
  const [estado, setEstado] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLEC = async () => {
      const response = await axios.get(`${apiUrl}/lec`);
      setLecList(response.data);
      setFilteredLEC(response.data);
    };

    const fetchCentros = async () => {
      const response = await axios.get(`${apiUrl}/centros`);
      setCentrosList(response.data);
    };

    const fetchEstados = async () => {
      const response = await axios.get(`${apiUrl}/estados`);
      setEstados(response.data);
    };

    fetchLEC();
    fetchCentros();
    fetchEstados();
  }, [apiUrl]);

  const fetchMunicipios = async (estadoId) => {
    const response = await axios.get(`${apiUrl}/municipios?estado=${estadoId}`);
    setMunicipios(response.data);
  };

  const fetchLocalidades = async (municipioId) => {
    const response = await axios.get(`${apiUrl}/localidades?municipio=${municipioId}`);
    setLocalidades(response.data);
  };

  const sugerirAsignaciones = () => {
    // Lógica para sugerir asignaciones basadas en los criterios
    const sugerencias = lecList.map(lec => {
      const centro = centrosList.find(centro => centro.ubicacion === lec.ubicacion);
      return centro ? { id: `${lec.id}-${centro.id}`, lecNombre: lec.nombre, centroNombre: centro.nombre, lecId: lec.id, centroId: centro.id } : null;
    }).filter(sugerencia => sugerencia !== null);
    setAsignaciones(sugerencias);
  };

  const aceptarAsignacion = async (asignacion) => {
    try {
      await axios.post(`${apiUrl}/asignaciones`, asignacion);
      alert(`Asignación aceptada: ${asignacion.lecNombre} -> ${asignacion.centroNombre}`);
    } catch (error) {
      console.error("Error al aceptar la asignación:", error);
    }
  };

  const ajustarAsignacion = (asignacion) => {
    // Lógica para ajustar la asignación manualmente
    const manualAsignacion = prompt("Ingrese el ID del LEC y el ID del Centro Comunitario separados por una coma (ej. 1,2)");
    if (manualAsignacion) {
      const [lecId, centroId] = manualAsignacion.split(',').map(id => parseInt(id.trim()));
      const lec = lecList.find(lec => lec.id === lecId);
      const centro = centrosList.find(centro => centro.id === centroId);
      if (lec && centro) {
        const nuevaAsignacion = { id: `${lec.id}-${centro.id}`, lecNombre: lec.nombre, centroNombre: centro.nombre, lecId: lec.id, centroId: centro.id };
        aceptarAsignacion(nuevaAsignacion);
      } else {
        alert("LEC o Centro Comunitario no encontrado.");
      }
    }
  };

  const handleFilterChange = () => {
    let filtered = lecList;
    if (estado) filtered = filtered.filter(lec => lec.estado === estado);
    if (municipio) filtered = filtered.filter(lec => lec.municipio === municipio);
    if (localidad) filtered = filtered.filter(lec => lec.localidad === localidad);
    setFilteredLEC(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [estado, municipio, localidad]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
      <div>
        <h2>LEC Disponibles</h2>
        <div>
          <label>Estado:</label>
          <select value={estado} onChange={(e) => { setEstado(e.target.value); fetchMunicipios(e.target.value); }}>
            <option value="">Seleccione un estado</option>
            {estados.map(estado => (
              <option key={estado.id} value={estado.id}>{estado.nombre}</option>
            ))}
          </select>
          <label>Municipio:</label>
          <select value={municipio} onChange={(e) => { setMunicipio(e.target.value); fetchLocalidades(e.target.value); }}>
            <option value="">Seleccione un municipio</option>
            {municipios.map(municipio => (
              <option key={municipio.id} value={municipio.id}>{municipio.nombre}</option>
            ))}
          </select>
          <label>Localidad:</label>
          <select value={localidad} onChange={(e) => setLocalidad(e.target.value)}>
            <option value="">Seleccione una localidad</option>
            {localidades.map(localidad => (
              <option key={localidad.id} value={localidad.id}>{localidad.nombre}</option>
            ))}
          </select>
          <button onClick={handleFilterChange}>Buscar</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Municipio</th>
              <th>Localidad</th>
            </tr>
          </thead>
          <tbody>
            {filteredLEC.map(lec => (
              <tr key={lec.id}>
                <td>{lec.nombre}</td>
                <td>{lec.estado}</td>
                <td>{lec.municipio}</td>
                <td>{lec.localidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Centros Comunitarios</h2>
        <ul>
          {centrosList.map(centro => (
            <li key={centro.id} onClick={() => setSelectedCentro(centro)} style={{ cursor: 'pointer', backgroundColor: selectedCentro?.id === centro.id ? 'lightgray' : 'white' }}>
              {centro.nombre}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>LEC Asignados</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Municipio</th>
              <th>Localidad</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones.filter(asignacion => asignacion.centroId === selectedCentro?.id).map(asignacion => (
              <tr key={asignacion.id}>
                <td>{asignacion.lecNombre}</td>
                <td>{asignacion.estado}</td>
                <td>{asignacion.municipio}</td>
                <td>{asignacion.localidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ gridColumn: '1 / span 3', textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => ajustarAsignacion()}>Asignar al centro comunitario seleccionado</button>
        <button onClick={sugerirAsignaciones}>Obtener sugerencia de asignación</button>
      </div>
    </div>
  );
};

export default AsignarLEC;