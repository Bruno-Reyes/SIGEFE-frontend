import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import materias from '../../tools/materias_nivel_educativo.json';

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
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentMaterias, setStudentMaterias] = useState([]);

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

                // Agregar materias al estudiante basándose en el grado.
                const estudiantesConMaterias = response.data.map((estudiante) => ({
                    ...estudiante,
                    materias: materias[estudiante.nivel_educativo] || [],
                }));

                setData(estudiantesConMaterias);
                console.log(estudiantesConMaterias);
            } catch (error) {
                console.error('Error al obtener los detalles de los estudiantes:', error);
            }
        };

        fetchEstudiante();
    }, []);

    // Actualizar materias cuando se selecciona un estudiante.
    useEffect(() => {

        console.log(selectedStudent)
        if (selectedStudent && Array.isArray(selectedStudent.materias.Materias)) {
            console.log(  selectedStudent )
            setStudentMaterias(selectedStudent.materias.Materias.map((materia) => ({
                materia,
                bimestre1: '0',
                bimestre2: '0',
                bimestre3: '0',
            })));
        } else {
            setStudentMaterias([]); // Si no hay materias o no hay estudiante seleccionado
        }
    }, [selectedStudent]);

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

            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '5%', marginRight: '5%' }}>
                {/* Tabla de estudiantes */}
                <DataTable
                    value={data}
                    style={{ width: '45%' }}
                    autoLayout
                    selectionMode="single"
                    selection={selectedStudent}
                    onSelectionChange={(e) => setSelectedStudent(e.value)}
                >
                    <Column field="nombre" header="Nombre completo" />
                    <Column field="grado" header="Grado" />
                    <Column field="grupo" header="Grupo" />
                </DataTable>

                {/* Tabla de materias y calificaciones */}
                <DataTable value={studentMaterias} style={{ width: '45%' }} autoLayout>
                    <Column field="materia" header="Materia" />
                    <Column field="bimestre1" header="Bimestre 1" />
                    <Column field="bimestre2" header="Bimestre 2" />
                    <Column field="bimestre3" header="Bimestre 3" />
                </DataTable>
            </div>
        </div>
    );
};

export default RegistrarCalificaciones;


