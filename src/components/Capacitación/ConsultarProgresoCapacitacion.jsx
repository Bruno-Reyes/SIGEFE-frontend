import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog'; // Importar Dialog


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

    return (
        <div>
            <h2>Consultar Progreso de Capacitación</h2>
            <DataTable value={progreso}>
                <Column field="sesion" header="Sesión" />
                <Column field="estado" header="Estado" />
            </DataTable>
        </div>
    );
};

export default ConsultarProgresoCapacitacion;
