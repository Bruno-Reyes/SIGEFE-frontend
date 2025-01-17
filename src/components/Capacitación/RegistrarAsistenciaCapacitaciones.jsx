import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import axios from 'axios';
import lugares from '../../tools/lugares_mexico.json';

const RegistrarAsistenciaCapacitaciones = () => {
    const [asistentes, setAsistentes] = useState([]);
    const [estadoCentro, setEstadoCentro] = useState("");
    const [municipioCentro, setMunicipioCentro] = useState([]);
    const [municipiosCentro, setMunicipiosCentro] = useState([]);
    const [centrosFiltrados, setCentrosFiltrados] = useState([]);
    const [selectedCentro, setSelectedCentro] = useState(null);
    const [lecsPendientes, setLecsPendientes] = useState([]);
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
        // Lógica para obtener LECs con capacitación pendiente
        try {
            let token = JSON.parse(localStorage.getItem("access-token"));
            if (!token) {
                token = await refreshToken();
            }
            const response = await axios.get(`${apiUrl}/capacitacion/lecs-pendientes/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    centro_id: centro.id,
                },
            });
            setLecsPendientes(response.data);
        } catch (error) {
            console.error("Error al obtener LECs pendientes:", error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al obtener LECs pendientes. Por favor, intente nuevamente.',
                life: 3000,
            });
        }
    };

    const handleGuardarRegistro = () => {
        // Lógica para guardar el registro
    };

    const renderDynamicColumns = () => {
        if (lecsPendientes.length === 0) return null;

        const numSesiones = lecsPendientes[0].numSesiones;
        const columns = [];

        for (let i = 1; i <= numSesiones; i++) {
            columns.push(
                <Column
                    key={`S${i}`}
                    field={`S${i}`}
                    header={`S${i}`}
                    body={(rowData) => (
                        <InputNumber
                            value={rowData[`S${i}`]}
                            onValueChange={(e) => {
                                const updatedLecs = lecsPendientes.map((lec) =>
                                    lec.id === rowData.id ? { ...lec, [`S${i}`]: e.value } : lec
                                );
                                setLecsPendientes(updatedLecs);
                            }}
                            min={1}
                            max={10}
                        />
                    )}
                />
            );
            columns.push(
                <Column
                    key={`Asistencia${i}`}
                    field={`Asistencia${i}`}
                    header={`Asistencia ${i}`}
                    body={(rowData) => (
                        <Checkbox
                            checked={rowData[`Asistencia${i}`]}
                            onChange={(e) => {
                                const updatedLecs = lecsPendientes.map((lec) =>
                                    lec.id === rowData.id ? { ...lec, [`Asistencia${i}`]: e.checked } : lec
                                );
                                setLecsPendientes(updatedLecs);
                            }}
                        />
                    )}
                />
            );
        }

        return columns;
    };

    return (
        <div>
            <Toast ref={toast} />
            <h2>Registrar Asistencia y Evaluaciones de Capacitaciónes</h2>
            <div style={{ display: "flex", marginRight: "5%" }}>
                <div style={{ width: "35%", marginRight: "2%" }}>
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
                <div style={{ width: "65%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <Button label="Guardar Registro" onClick={handleGuardarRegistro} className="p-button-success" />
                    <DataTable value={lecsPendientes} className="mt-4" responsiveLayout="scroll">
                        <Column field="nombre" header="Nombre del LEC" />
                        {renderDynamicColumns()}
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default RegistrarAsistenciaCapacitaciones;
