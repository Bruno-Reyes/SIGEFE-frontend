import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog'; // Importar Dialog
import { Chart } from 'primereact/chart'; // Importar Chart

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

const DashboardCapacitaciones = () => {
    const [data, setData] = useState({
        labels: ['Región 1', 'Región 2', 'Región 3'],
        datasets: [
            {
                label: 'Asistencia',
                backgroundColor: '#42A5F5',
                data: [65, 59, 80]
            },
            {
                label: 'Evaluaciones',
                backgroundColor: '#66BB6A',
                data: [28, 48, 40]
            }
        ]
    });

    return (
        <div>
            <h2>Dashboard Nacional de Desempeño en Capacitación Continua</h2>
            <Chart type="bar" data={data} />
        </div>
    );
};

export default DashboardCapacitaciones;
