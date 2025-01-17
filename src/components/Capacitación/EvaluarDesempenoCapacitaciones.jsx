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

const EvaluarDesempenoCapacitaciones = () => {
    const [evaluaciones, setEvaluaciones] = useState([]);

    const handleEvaluar = () => {
        // Lógica para evaluar el desempeño
    };

    return (
        <div>
            <h2>Evaluar Desempeño en Capacitación</h2>
            <DataTable value={evaluaciones}>
                <Column field="nombre" header="Nombre" />
                <Column field="desempeno" header="Desempeño" />
            </DataTable>
            <Button label="Evaluar" onClick={handleEvaluar} />
        </div>
    );
};

export default EvaluarDesempenoCapacitaciones;
