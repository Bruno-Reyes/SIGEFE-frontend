import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
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

    useEffect(() => {
        const fetchProgreso = async () => {
            try {
                let token = JSON.parse(localStorage.getItem('access-token'));
                if (!token) {
                    token = await refreshToken();
                }
                const response = await axios.get(`${apiUrl}/capacitacion/progreso/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setProgreso(response.data);
            } catch (error) {
                console.error('Error al obtener el progreso de capacitación:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al obtener el progreso de capacitación. Por favor, intente nuevamente.',
                    life: 3000,
                });
            }
        };

        fetchProgreso();
    }, []);

    return (
        <div>
            <Toast ref={toast} />
            <h2>Consultar Progreso de Capacitación</h2>
            <DataTable value={progreso} responsiveLayout="scroll">
                <Column field="nombreCapacitacion" header="Capacitación" />
                <Column field="sesion" header="Sesión" />
                <Column field="asistencia" header="Asistencia" body={(rowData) => (rowData.asistencia ? 'Sí' : 'No')} />
                <Column field="evaluacion" header="Evaluación" body={(rowData) => rowData.evaluacion || 'N/A'} />
            </DataTable>
        </div>
    );
};

export default ConsultarProgresoCapacitacion;
