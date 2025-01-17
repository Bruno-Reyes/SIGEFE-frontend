import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import lugares from '../../tools/lugares_mexico.json';

const RegistrarPlanCapacitacion = () => {
    const [fechaVisita, setFechaVisita] = useState(null);
    const [estadoCentro, setEstadoCentro] = useState("");
    const [municipioCentro, setMunicipioCentro] = useState([]);
    const [municipiosCentro, setMunicipiosCentro] = useState([]);
    const [centrosFiltrados, setCentrosFiltrados] = useState([]);
    const [selectedCentro, setSelectedCentro] = useState(null);
    const [lecsAsignados, setLecsAsignados] = useState([]);
    const [numSesiones, setNumSesiones] = useState(1);
    const [fechasSesiones, setFechasSesiones] = useState([]);
    const [modalidad, setModalidad] = useState(null);
    const [selectedLecs, setSelectedLecs] = useState([]); // Agregar este estado
    const toast = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (estadoCentro && lugares[estadoCentro]) {
            setMunicipiosCentro(
                lugares[estadoCentro].municipios.map((municipio) => ({
                    label: municipio,
                    value: municipio,
                }))
            );
            setMunicipioCentro("");
        }
    }, [estadoCentro]);

    const handleEstadoCentroChange = (e) => {
        setEstadoCentro(e.value);
    };

    const handleMunicipioCentroChange = (e) => {
        setMunicipioCentro(e.value);
    };

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
                        centro_asignado: centro.id,
                    },
                }
            );

            setLecsAsignados(response.data);
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

    const handleNumSesionesChange = (e) => {
        const num = e.value;
        setNumSesiones(num);
        setFechasSesiones(Array(num).fill(null));
    };

    const handleFechaSesionChange = (index, date) => {
        const newFechas = [...fechasSesiones];
        newFechas[index] = date;
        setFechasSesiones(newFechas);
    };

    const handleRegistrar = () => {
        // Lógica para registrar el plan de capacitación
    };

    return (
        <div style={{ display: "flex", marginRight: "5%" }}>
            <Toast ref={toast} />
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
            <div style={{ width: "33%", marginRight: "2%" }}>
                <h2>LEC Inscritos en el centro seleccionado</h2>
                <DataTable
                    value={lecsAsignados}
                    selection={selectedLecs}
                    onSelectionChange={(e) => setSelectedLecs(e.value)}
                    selectionMode="multiple"
                    responsiveLayout="scroll"
                    className="mt-4"
                    scrollHeight="400px"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                    <Column field="nombre" header="Nombre del LEC" />
                    <Column field="cct_centro_asignado" header="CCT" />
                    <Column field="estado_centro_asignado" header="Estado" />
                    <Column field="municipio_centro_asignado" header="Municipio" />
                </DataTable>
            </div>

            {/* Sección de Registro de Plan */}
            <div style={{ width: "33%" }}>
                
                <h2>Registrar Plan de Capacitación Continua</h2>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button label="Registrar Plan" onClick={handleRegistrar} className="mb-4" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <label style={{ marginRight: "1rem" }}>Número de Sesiones:</label>
                    <Dropdown
                        value={numSesiones}
                        options={[...Array(9).keys()].map(i => ({ label: `${i + 1}`, value: i + 1 }))}
                        onChange={handleNumSesionesChange}
                        placeholder="Seleccione el número de sesiones"
                        style={{ width: "25%" }}
                    />
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <label>Modalidad:</label>
                    <Dropdown
                        value={modalidad}
                        options={[
                            { label: 'Virtual', value: 'Virtual' },
                            { label: 'Presencial', value: 'Presencial' }
                        ]}
                        onChange={(e) => setModalidad(e.value)}
                        placeholder="Seleccione la modalidad"
                        className="w-full mt-1"
                    />
                </div>
                {fechasSesiones.map((fecha, index) => (
                    <div key={index} style={{ marginTop: "1rem" }}>
                        <label>{`S${index + 1} Fecha:`}</label>
                        <Calendar 
                            value={fecha} 
                            onChange={(e) => handleFechaSesionChange(index, e.value)} 
                            style={{ height: "2rem" }} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegistrarPlanCapacitacion;
