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

const ReinscribirEstudiante = () => {
    const [nombreAlumno, setNombreAlumno] = useState('');
    const [apellido_paterno, setApellidoPaterno] = useState('');
    const [apellido_materno, setApellidoMaterno] = useState('');
    const [data, setData] = useState([]);
    const [calificaciones, setCalificaciones] = useState([]);

    useEffect(() => {
        // Aquí puedes cargar los datos desde un JSON o una API
        const fetchData = async () => {
            const response = await fetch('/path/to/your/json');
            const result = await response.json();
            setData(result);
        };
        fetchData();
    }, []);

    const handleSearch = async () => {
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
                params: {
                    nombre: nombreAlumno,
                    apellido_paterno: apellido_paterno,
                    apellido_materno: apellido_materno,
                },
            });

            if (response.data.length > 0) {
                const estudiantes = response.data;
                setData(estudiantes);

                const calificacionesResponse = await axios.get(`${apiUrl}/control_escolar/calificaciones/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        id_estudiante__in: estudiantes.map(est => est.id).join(','),
                    },
                });
                setCalificaciones(calificacionesResponse.data);
            } else {
                setData([]);
                console.warn('No se encontraron estudiantes con los criterios de búsqueda proporcionados.');
            }
        } catch (error) {
            console.error('Error al buscar estudiantes:', error);
        }
    };

    const calcularEstatus = (estudiante) => {
        const calificacionesEstudiante = calificaciones.filter(cal => cal.id_estudiante === estudiante.id);
        const materiasInscritas = calificacionesEstudiante.length;
        const materiasCalificadas = calificacionesEstudiante.filter(cal => cal.calificacion !== null && parseFloat(cal.calificacion) > 0).length;
        const promedio = materiasCalificadas > 0 ? calificacionesEstudiante.reduce((acc, cal) => acc + parseFloat(cal.calificacion), 0) / materiasCalificadas : 0;
        console.log('calificacionesEstudiante:', calificacionesEstudiante);
        console.log('materiasInscritas:', materiasInscritas);
        console.log('materiasCalificadas:', materiasCalificadas);
        console.log('promedio:', promedio);
        

        if (materiasCalificadas === materiasInscritas && promedio >= 6) {
            return <span style={{ backgroundColor: 'green', borderRadius: '10px', padding: '5px', color: 'white' }}>Ciclo Escolar Completado</span>;
        } else if (materiasCalificadas < materiasInscritas) {
            return <span style={{ backgroundColor: 'gray', borderRadius: '10px', padding: '5px', color: 'white' }}>Cursando Ciclo Escolar</span>;
        } else if (materiasCalificadas === materiasInscritas && promedio < 6) {
            return <span style={{ backgroundColor: 'red', borderRadius: '10px', padding: '5px', color: 'white' }}>Ciclo Escolar Reprobado</span>;
        }
    };

    const calcularPromedio = (estudiante) => {
        const calificacionesEstudiante = calificaciones.filter(cal => cal.id_estudiante === estudiante.id);
        const materiasCalificadas = calificacionesEstudiante.filter(cal => cal.calificacion !== null);
        const promedio = materiasCalificadas.length > 0 ? materiasCalificadas.reduce((acc, cal) => acc + parseFloat(cal.calificacion), 0) / materiasCalificadas.length : 0;
        return promedio.toFixed(2);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5%', marginTop: '2%' }}>
                <h1>Reinscribir Estudiante</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2%', marginLeft: '5%' }}>
                <InputText 
                    value={apellido_paterno} 
                    onChange={(e) => setApellidoPaterno(e.target.value)} 
                    placeholder="Apellido Paterno del alumno" 
                    style={{ width: '10%', marginRight: '1%' }} 
                />
                <InputText 
                    value={apellido_materno} 
                    onChange={(e) => setApellidoMaterno(e.target.value)} 
                    placeholder="Apellido Materno del alumno" 
                    style={{ width: '10%', marginRight: '1%' }} 
                />
                <InputText 
                    value={nombreAlumno} 
                    onChange={(e) => setNombreAlumno(e.target.value)} 
                    placeholder="Nombre del alumno" 
                    style={{ width: '10%', marginRight: '1%' }} 
                />
                <Button 
                    label="Buscar" 
                    icon="pi pi-search" 
                    className="p-button-success" 
                    style={{ marginLeft: '10px' }} 
                    onClick={handleSearch}
                />
            </div>
            <DataTable value={data} style={{ width: '88%' , marginLeft: '5%'}} autoLayout>
                <Column field="nivel_educativo" header="Nivel Escolar" />
                <Column field="grado" header="Grado" />
                <Column field="grupo" header="Grupo" />
                <Column header="Promedio" body={calcularPromedio} />
                <Column field="estatus" header="Estatus" body={calcularEstatus} />
            </DataTable>
        </div>
    );
};

export default ReinscribirEstudiante;
