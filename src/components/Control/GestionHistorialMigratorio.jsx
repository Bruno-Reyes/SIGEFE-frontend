import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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

const GestionHistorialMigratorio = () => {
    const [nombreAlumno, setNombreAlumno] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        // Aquí puedes cargar los datos desde un JSON o una API
        const fetchData = async () => {
            const response = await fetch('/path/to/your/json');
            const result = await response.json();
            setData(result);
        };
        fetchData();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5%', marginTop: '2%' }}>
                <h1>Historial de Inscripciones en Centros Comunitarios del Alumno</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2%', marginLeft: '5%' }}>
            <InputText 
                    value={nombreAlumno} 
                    onChange={(e) => setNombreAlumno(e.target.value)} 
                    placeholder="Nombre del alumno" 
                    style={{ width: '20%' }} 
                />
                <Button 
                    label="Buscar" 
                    icon="pi pi-search" 
                    className="p-button-success" 
                    style={{ marginLeft: '10px' }} 
                />
                <Button 
                    label="Registrar cambio de centro" 
                    className="p-button-warning" 
                    style={{ marginLeft: '10px' }} 
                />
                <Button 
                    label="Inscribir a nuevo centro" 
                    className="p-button-info" 
                    style={{ marginLeft: '10px' }} 
                />
            </div>
            <DataTable value={data} style={{ width: '88%' , marginLeft: '5%'}} autoLayout>
                <Column field="cct" header="CCT" />
                <Column field="estado" header="Estado" />
                <Column field="municipio" header="Municipio" />
                <Column field="localidad" header="Localidad" />
            </DataTable>
        </div>
    );
};

export default GestionHistorialMigratorio;
