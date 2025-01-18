import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import lugares from '../../tools/lugares_mexico.json';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const apiUrl = import.meta.env.VITE_API_URL;

const refreshToken = async () => {
    try {
        const refreshToken = JSON.parse(localStorage.getItem('refresh-token'));
        const response = await axios.post(`${apiUrl}/auth/token/refresh/`, {
            refresh: refreshToken,
        });
        const newAccessToken = response.data.access;
        localStorage.setItem('access-token', JSON.stringify(newAccessToken));
        return newAccessToken;
    } catch (error) {
        console.error('Error al refrescar el token:', error);
        throw new Error('No se pudo renovar el token de acceso.');
    }
};

const GenerarReportesCapacitacion = () => {
    const [estadoCentro, setEstadoCentro] = useState("");
    const [municipioCentro, setMunicipioCentro] = useState([]);
    const [municipiosCentro, setMunicipiosCentro] = useState([]);
    const [centrosFiltrados, setCentrosFiltrados] = useState([]);
    const [selectedCentro, setSelectedCentro] = useState(null);
    const [reportData, setReportData] = useState([]);
    const toast = useRef(null);

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

            const response = await axios.get(`${apiUrl}/capacitacion/progreso-lec/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    centro_id: centro.id,
                },
            });

            setReportData(response.data);
        } catch (error) {
            console.error("Error al obtener el reporte:", error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al obtener el reporte. Por favor, intente nuevamente.',
                life: 3000,
            });
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4');
        
        // Configurar el título
        doc.setFontSize(16);
        doc.text(`Reporte de Capacitaciones - Centro ${selectedCentro.clave_centro_trabajo}`, 14, 10);
        
        // Información del centro
        doc.setFontSize(12);
        doc.text(`CCT: ${selectedCentro.clave_centro_trabajo}`, 14, 20);
        doc.text(`Estado: ${selectedCentro.estado}`, 14, 25);
        doc.text(`Municipio: ${selectedCentro.municipio}`, 14, 30);
        doc.text(`Localidad: ${selectedCentro.nombre_localidad}`, 14, 35);
        doc.text(`Nivel Educativo: ${selectedCentro.nivel_educativo}`, 14, 40);
        doc.text(`Turno: ${selectedCentro.nombre_turno}`, 14, 45);
        doc.text(`Domicilio: ${selectedCentro.domicilio}`, 14, 50);

        // Preparar los datos para la tabla
        const tableData = reportData.map(row => {
            const baseData = [
                row.nombre,
                row.tipo_capacitacion,
                row.num_sesiones,
                row.asistencias,
                row.progreso,
                row.promedio
            ];

            // Agregar calificaciones dinámicas
            row.calificaciones.forEach(cal => {
                baseData.push(cal || '-');
            });

            return baseData;
        });

        // Preparar las columnas
        const maxSesiones = Math.max(...reportData.map(plan => plan.num_sesiones));
        const dynamicHeaders = Array.from({ length: maxSesiones }, (_, i) => `S${i + 1}`);
        
        const headers = [
            'Nombre del LEC',
            'Tipo de Capacitación',
            'Número de Sesiones',
            'Asistencias',
            'Progreso',
            'Promedio',
            ...dynamicHeaders
        ];

        // Generar la tabla
        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 55,
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [247, 123, 114],
                textColor: [255, 255, 255]
            },
            theme: 'grid'
        });

        // Guardar el PDF
        doc.save(`Reporte_${selectedCentro.clave_centro_trabajo}.pdf`);
        
        toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'PDF generado correctamente',
            life: 3000,
        });
    };

    const renderDynamicColumns = (reportData) => {
        if (reportData.length === 0) return [];
        
        const maxSesiones = Math.max(...reportData.map(plan => plan.num_sesiones));
        const columns = [];

        for (let i = 0; i < maxSesiones; i++) {
            columns.push(
                <Column
                    key={`S${i + 1}`}
                    field={`S${i + 1}`}
                    header={`S${i + 1}`}
                    body={(rowData) => {
                        const calificacion = rowData.calificaciones[i] || '-';
                        return <span>{calificacion}</span>;
                    }}
                    style={{ width: '60px', textAlign: 'center' }}
                />
            );
        }
        return columns;
    };

    return (
        <div>
            <Toast ref={toast} />
            <h2>Generar Reportes de Capacitación Continua</h2>
            <div style={{ display: "flex", marginRight: "5%" }}>
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
                <div style={{ width: "65%", textAlign: "center" }}>
                    {selectedCentro && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <h2>Reporte de Capacitaciones del Centro Comunitario {selectedCentro.clave_centro_trabajo}</h2>
                                <Button 
                                    icon="pi pi-file-pdf" 
                                    label="Exportar PDF" 
                                    severity="danger"
                                    onClick={handleExportPDF}
                                    style={{ backgroundColor: '#f77b72' }}
                                />
                            </div>
                            <DataTable value={reportData} responsiveLayout="scroll" className="mt-4">
                                <Column field="nombre" header="Nombre del LEC" />
                                <Column field="tipo_capacitacion" header="Tipo de Capacitación" />
                                <Column field="num_sesiones" header="Número de Sesiones" />
                                <Column field="asistencias" header="Asistencias" />
                                <Column field="progreso" header="Progreso" />
                                <Column field='promedio' header="Promedio"/>
                                {renderDynamicColumns(reportData)}
                            </DataTable>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerarReportesCapacitacion;
