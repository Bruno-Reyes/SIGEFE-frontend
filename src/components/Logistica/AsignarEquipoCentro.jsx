import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import lugares from "../../tools/lugares_mexico.json";

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

const AsignarEquipoCentro = () => {
    const [equipos, setEquipos] = useState([]);
    const [estadoCentro, setEstadoCentro] = useState("");
    const [municipioCentro, setMunicipioCentro] = useState("");
    const [municipiosCentro, setMunicipiosCentro] = useState([]);
    const [centrosFiltrados, setCentrosFiltrados] = useState([]);
    const [selectedCentro, setSelectedCentro] = useState(null);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [equiposAsignados, setEquiposAsignados] = useState([]);
    const [cantidad, setCantidad] = useState(1);  // Nueva variable de estado para la cantidad
    const toast = React.useRef(null);

    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                let token = JSON.parse(localStorage.getItem("access-token"));
                if (!token) {
                    token = await refreshToken();
                }
                const response = await axios.get(`${apiUrl}/logistica/equipos/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setEquipos(response.data);
                console.log("Equipos obtenidos:", response.data); // Agregar un log para verificar los datos obtenidos
            } catch (error) {
                console.error('Error al obtener los equipos:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Hubo un problema al obtener los equipos.',
                    life: 3000,
                });
            }
        };

        fetchEquipos();
    }, []);

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
                detail: 'Hubo un problema al buscar centros.',
                life: 3000,
            });
        }
    };

    const handleCentroSelect = (centro) => {
        setSelectedCentro(centro);
    };

    const handleAsignarEquipo = async () => {
        if (!selectedEquipo || !selectedCentro) {
            toast.current.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor seleccione un equipo y un centro.',
                life: 3000,
            });
            return;
        }

        try {
            let token = JSON.parse(localStorage.getItem("access-token"));
            if (!token) {
                token = await refreshToken();
            }
            
        //API para registrar la asignación de un equipo a un centro comunitario

    

            setEquiposAsignados([...equiposAsignados, response.data]);
            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Equipo asignado correctamente.',
                life: 3000,
            });
        } catch (error) {
            console.error("Error al asignar equipo:", error);
            console.error("Detalles del error:", error.response.data);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un problema al asignar el equipo.',
                life: 3000,
            });
        }
    };

    return (
        <div style={{ padding: '16px', maxWidth: '100%', margin: 'auto' }}>
            <Toast ref={toast} />
            <h2>Asignar Equipo a Centros Comunitarios</h2>

            <div style={{ display: 'flex', gap: '2rem' }}>
                {/* Sección de Equipos */}
                <div style={{ flex: 1, width: "33%" }}>
                    <h3>Equipos Disponibles</h3>
                    <DataTable value={equipos} paginator rows={10} responsiveLayout="scroll" selection={selectedEquipo} onSelectionChange={(e) => setSelectedEquipo(e.value)} selectionMode="single">
                        <Column selectionMode="single" headerStyle={{ width: "3rem" }} />
                        <Column field="nombre_equipo" header="Nombre del Equipo" sortable></Column>
                        <Column field="cantidad_disponible" header="Cantidad Disponible" sortable></Column>
                        <Column field="descripcion" header="Descripción" sortable></Column>
                        <Column field="categoria" header="Categoría" sortable></Column>
                    </DataTable>
                </div>

                {/* Sección de Filtros y Centros */}
                <div style={{ flex: 1, width: "33%" }}>
                    <h3>Filtros y Centros</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
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

                {/* Sección de Asignación */}
                <div style={{ flex: 1, width: "33%" }}>
                    <h3>Asignación de Equipos</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            min="1"
                            className="w-full mt-1"
                        />
                    </div>
                    <Button
                        label="Asignar equipo al centro comunitario"
                        onClick={handleAsignarEquipo}
                        disabled={!selectedEquipo || !selectedCentro}
                        className="mb-4"
                    />

                    <DataTable
                        value={equiposAsignados}
                        responsiveLayout="scroll"
                    >
                        <Column field="nombre_equipo" header="Nombre del Equipo" />
                        <Column field="cantidad_disponible" header="Cantidad" />
                        <Column field="categoria" header="Categoría" />
                        <Column field="clave_centro_trabajo" header="CCT" />
                        <Column field="estado" header="Estado" />
                        <Column field="municipio" header="Municipio" />
                        <Column field="localidad" header="Localidad" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default AsignarEquipoCentro;
