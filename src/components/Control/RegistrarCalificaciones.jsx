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


const RegistrarCalificaciones = () => {
    const [grupo, setGrupo] = useState('');
    const [data, setData] = useState([]);


    useEffect(() => {

        const fetchEstudiante = async () => {
          try {
            let token = JSON.parse(localStorage.getItem('access-token'));
            if (!token) {
              token = await refreshToken();
            }
            const response = await axios.get(`${apiUrl}/control_escolar/estudiantes/`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
    
            setData(response.data);
            
          } catch (error) {
            console.error('Error al obtener los detalles de los estudiantes:', error);
          }
        };
    
        fetchEstudiante();
      }, []);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5%', marginTop: '2%' }}>
            <h1>Registrar Calificaciones</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2%', marginLeft: '5%' }}>
                <InputText 
                    value={grupo} 
                    onChange={(e) => setGrupo(e.target.value)} 
                    placeholder="Grupo" 
                    style={{ width: '20%' }} 
                />
                <Button 
                    label="Buscar" 
                    icon="pi pi-search" 
                    className="p-button-success" 
                    style={{ marginLeft: '10px' }} 
                />
            </div>

            <DataTable value={data} style={{ width: '88%' , marginLeft: '5%'}} autoLayout>
                <Column field="nombre" header="Nombre completo" />
                <Column field="grado" header="Grado" />
                <Column field="grupo" header="Grupo" />
                <Column field="bimestre1" header="Bimestre 1">
                    {data.map((item, index) => (
                        <Column key={index} field={`bimestre1.${index}`} header={`Bimestre 1 - ${index + 1}`} />
                    ))}
                </Column>
                <Column field="bimestre2" header="Bimestre 2">
                    {data.map((item, index) => (
                        <Column key={index} field={`bimestre2.${index}`} header={`Bimestre 2 - ${index + 1}`} />
                    ))}
                </Column>
                <Column field="bimestre3" header="Bimestre 3">
                    {data.map((item, index) => (
                        <Column key={index} field={`bimestre3.${index}`} header={`Bimestre 3 - ${index + 1}`} />
                    ))}
                </Column>
            </DataTable>
        </div>
    );
};

export default RegistrarCalificaciones;
