import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import axios from 'axios';

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

const ConsultarProgresoCapacitacion = () => {
    const [progreso, setProgreso] = useState([]);
    const toast = useRef(null);

    const fetchProgreso = async () => {
        try {
            let token = JSON.parse(localStorage.getItem("access-token"));
            if (!token) {
                token = await refreshToken();
            }
            
            const email = localStorage.getItem('email');
            console.log(email);
            const response = await axios.get(`${apiUrl}/capacitacion/progreso-lec/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    email: email
                }
            });

            // Transformar los datos para mostrar en la tabla
            const progresoFormateado = response.data.map(plan => ({
                nombreCapacitacion: `${plan.centro}`,
                modalidad: `${plan.modalidad}`,
                num_sesiones: plan.num_sesiones,
                fechas: plan.fechas_sesiones,
                progreso: plan.progreso,
                promedio: plan.promedio,
                asistencias: Object.values(plan.asistencias).filter(Boolean).length,
                calificaciones: Object.values(plan.calificaciones)
            }));

            setProgreso(progresoFormateado);
        } catch (error) {
            console.error("Error al obtener el progreso:", error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al obtener el progreso. Por favor, intente nuevamente.',
                life: 3000,
            });
        }
    };

    useEffect(() => {
        fetchProgreso();
    }, []);

    const renderDynamicColumns = (progresoData) => {
        if (progresoData.length === 0) return [];
        
        // Encontrar el máximo número de sesiones entre todos los planes
        const maxSesiones = Math.max(...progresoData.map(plan => plan.num_sesiones));
        const columns = [];

        // Crear columnas para cada sesión
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
        <div className="card">
            <Toast ref={toast} />
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5%', marginTop: '2%' }}>
                <h2>Consultar Progreso de Capacitación</h2>
            </div>
            
            <div style={{ width: "95%", margin: "auto", overflowX: "auto" }}>
                <DataTable 
                    value={progreso} 
                    responsiveLayout="scroll"
                    scrollable 
                    scrollHeight="400px"
                >
                    <Column 
                        field="nombreCapacitacion" 
                        header="Centro" 
                    />
                    <Column 
                        field="modalidad" 
                        header="Modalidad" 
                    />
                    <Column 
                        field="num_sesiones" 
                        header="Total Sesiones" 
                    />
                    <Column 
                        field="asistencias" 
                        header="Sesiones Asistidas" 
                    />
                    {renderDynamicColumns(progreso)}
                    <Column 
                        field="promedio" 
                        header="Promedio" 
                    />
                    <Column 
                        field="progreso" 
                        header="Progreso" 
                        body={(rowData) => (
                            <div>
                                <ProgressBar 
                                    value={rowData.progreso} 
                                    showValue={true}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </div>
        </div>
    );
};

export default ConsultarProgresoCapacitacion;
