import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

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

    return (
        <div style={{ padding: '16px', maxWidth: '800px', margin: 'auto' }}>
            <Toast ref={toast} />
            <h2>Asignar Equipo a Centros Comunitarios</h2>
            <DataTable value={equipos} paginator rows={10} responsiveLayout="scroll">
                <Column field="nombre_equipo" header="Nombre del Equipo" sortable></Column>
                <Column field="cantidad_disponible" header="Cantidad Disponible" sortable></Column>
                <Column field="descripcion" header="Descripción" sortable></Column>
                <Column field="categoria" header="Categoría" sortable></Column>
            </DataTable>
        </div>
    );
};

export default AsignarEquipoCentro;
