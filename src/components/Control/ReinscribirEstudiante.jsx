import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import jsPDF from 'jspdf';

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
    const [mostrarBotonReinscribir, setMostrarBotonReinscribir] = useState(false);
    const toast = useRef(null);

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
        if (!nombreAlumno || !apellido_paterno || !apellido_materno) {
            toast.current.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, complete todos los campos: Nombre, Apellido Paterno y Apellido Materno.',
                life: 3000,
            });
            return;
        }

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

                // Verificar si algún estudiante tiene el estatus "Ciclo Escolar Completado"
                const mostrarBoton = estudiantes.some(est => {
                    const calificacionesEstudiante = calificacionesResponse.data.filter(cal => cal.id_estudiante === est.id);
                    const materiasInscritas = calificacionesEstudiante.length;
                    const materiasCalificadas = calificacionesEstudiante.filter(cal => cal.calificacion !== null && parseFloat(cal.calificacion) > 0).length;
                    const promedio = materiasCalificadas > 0 ? calificacionesEstudiante.reduce((acc, cal) => acc + parseFloat(cal.calificacion), 0) / materiasCalificadas : 0;
                    return materiasCalificadas === materiasInscritas && promedio >= 6;
                });
                setMostrarBotonReinscribir(mostrarBoton);
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

        if (materiasCalificadas === materiasInscritas && promedio >= 6) {
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ backgroundColor: 'green', borderRadius: '10px', padding: '5px', color: 'white' }}>Ciclo Escolar Completado</span>
                    <Button label="Generar Certificado" icon="pi pi-file-pdf" className="p-button-secondary" style={{ marginLeft: '10px', borderRadius: '10px', padding: '5px', color: 'white' }} onClick={() => generarCertificado(estudiante)} />
                </div>
            );
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

    const generarCertificado = (estudiante) => {
        const doc = new jsPDF();
        doc.text(`Certificado de Finalización`, 20, 20);
        doc.text(`El alumno ${estudiante.nombre} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}`, 20, 30);
        doc.text(`inscrito en el grado ${estudiante.grado} y grupo ${estudiante.grupo},`, 20, 40);
        doc.text(`ha completado exitosamente el ciclo escolar.`, 20, 50);
        doc.save(`Certificado_${estudiante.nombre}_${estudiante.apellido_paterno}.pdf`);
    };

    const reinscribirSiguienteGrupo = () => {
        // Lógica para reinscribir al siguiente grupo
        console.log('Reinscribir al siguiente grupo');
    };

    return (
        <div>
            <Toast ref={toast} />
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
                    style={{ marginLeft: '1%' }} 
                    onClick={handleSearch}
                />
                {mostrarBotonReinscribir && (
                    <Button 
                        label="Reinscribir al siguiente grado" 
                        icon="pi pi-pencil" 
                        className="p-button-info" 
                        style={{ marginLeft: '1%' }} 
                        onClick={reinscribirSiguienteGrupo}
                    />
                )}
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
