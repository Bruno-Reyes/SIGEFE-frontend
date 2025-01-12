import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import axios from 'axios';
import materias from '../../tools/materias_nivel_educativo.json';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

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

const nivelEducativoOptions = [
    { label: 'Preescolar', value: 'Preescolar' },
    { label: 'Primaria', value: 'Primaria' },
    { label: 'Secundaria', value: 'Secundaria' },
];

const RegistrarCalificaciones = () => {
    const [grupo, setGrupo] = useState('');
    const [grado, setGrado] = useState('');
    const [nivelEducativo, setNivelEducativo] = useState('');
    const [data, setData] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [calificaciones, setCalificaciones] = useState({});
    const toast = useRef(null);

    const handleSearch = async () => {
        if (!grado || !grupo || !nivelEducativo) {
            toast.current.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, complete todos los campos: Grado, Grupo y Nivel Educativo.',
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
                    grado: grado || undefined,
                    grupo: grupo || undefined,
                    nivel_educativo: nivelEducativo || undefined,
                    // nombre: nombreCompleto || undefined, // Nuevo parámetro para filtrar por nombre completo
                },
            });

            setData(response.data);

            // Obtener calificaciones existentes
            const calificacionesResponse = await axios.get(`${apiUrl}/control_escolar/calificaciones/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    grado: grado || undefined,
                    grupo: grupo || undefined,
                    nivel_educativo: nivelEducativo || undefined,
                },
            });

            const calificacionesData = calificacionesResponse.data.reduce((acc, calificacion) => {
                const { id_estudiante, bimestre, materia, calificacion: value } = calificacion;
                if (!acc[id_estudiante]) {
                    acc[id_estudiante] = {};
                }
                const materiaIndex = materias[nivelEducativo]?.Materias.indexOf(materia);
                if (materiaIndex !== -1) {
                    acc[id_estudiante][`bimestre${bimestre}_materia${materiaIndex}`] = value;
                }
                return acc;
            }, {});

            setCalificaciones(calificacionesData);
        } catch (error) {
            console.error('Error al obtener los detalles de los estudiantes y calificaciones:', error);
        }
    };

    const nombreCompletoTemplate = (rowData) => {
        return `${rowData.apellido_paterno} ${rowData.apellido_materno} ${rowData.nombre}`;
    };

    // Generate header group
    const headerGroup = () => {
        const nivel = nivelEducativo || undefined;
        const materiasNivel = materias[nivel]?.Materias || [];
        
        return (
            <ColumnGroup>
                <Row>
                    <Column header="Nombre del Alumno" rowSpan={2} style={{ width: '26%', border: '1px solid black' }} />
                    <Column header="Grado" rowSpan={2} style={{ width: '1%', border: '1px solid black' }} />
                    <Column header="Grupo" rowSpan={2} style={{ width: '1%', border: '1px solid black' }} />
                    <Column header="Bimestre 1" colSpan={materiasNivel.length} style={{ border: '1px solid black', textAlign: 'center', justifyContent: 'center' }} />
                    <Column header="Bimestre 2" colSpan={materiasNivel.length} style={{ border: '1px solid black', textAlign: 'center', justifyContent: 'center' }} />
                    <Column header="Bimestre 3" colSpan={materiasNivel.length} style={{ border: '1px solid black', textAlign: 'center', justifyContent: 'center' }} />
                    <Column header="Promedio" rowSpan={2} style={{ width: '1%', border: '1px solid black' }} />
                </Row>
                <Row>
                    {[1, 2, 3].map(bimestre => (
                        materiasNivel.map((materia, index) => (
                            <Column 
                                key={`header_${bimestre}_${index}`}
                                header={
                                    <div className="rotated-header">
                                        {materia}
                                    </div>
                                }
                                style={{ border: '1px solid black' }}
                            />
                        ))
                    ))}
                </Row>
            </ColumnGroup>
        );
    };

    const handleCalificacionChange = (value, estudianteId, bimestre, materiaIndex) => {
        setCalificaciones(prevState => ({
            ...prevState,
            [estudianteId]: {
                ...prevState[estudianteId],
                [`bimestre${bimestre}_materia${materiaIndex}`]: value
            }
        }));
    };

    const calculatePromedio = (calificaciones) => {
        const values = Object.values(calificaciones).filter(value => value !== undefined && value !== null);
        const sum = values.reduce((acc, value) => acc + parseFloat(value), 0);
        return values.length > 0 ? (sum / values.length).toFixed(2) : null;
    };

    const handleConfirm = async () => {
        setShowConfirmDialog(false);
        try {
            let token = JSON.parse(localStorage.getItem('access-token'));
            if (!token) {
                token = await refreshToken();
            }

            const calificacionesArray = [];
            for (const estudianteId in calificaciones) {
                let promedio = calculatePromedio(calificaciones[estudianteId]);
                for (let bimestre = 1; bimestre <= 3; bimestre++) {
                    const nivel = nivelEducativo || undefined;
                    const materiasNivel = materias[nivel]?.Materias || [];
                    materiasNivel.forEach((materia, index) => {
                        const calificacion = calificaciones[estudianteId][`bimestre${bimestre}_materia${index}`];
                        if (calificacion !== undefined && calificacion !== null) {
                            calificacionesArray.push({
                                id_estudiante: estudianteId,
                                materia,
                                calificacion: parseFloat(calificacion), // Asegúrate de que la calificación sea un número
                                grado,
                                grupo,
                                bimestre,
                                promedio: parseFloat(promedio) // Guardar el promedio
                            });
                        }
                    });
                }
            }

            await axios.post(`${apiUrl}/control_escolar/calificaciones/bulk_create/`, calificacionesArray, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Calificaciones registradas:', calificacionesArray);
            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Calificaciones registradas correctamente.',
                life: 3000,
            });
        } catch (error) {
            console.error('Error al registrar las calificaciones:', error);
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Hubo un problema al registrar las calificaciones: ${JSON.stringify(error.response.data)}`,
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Hubo un problema al registrar las calificaciones.',
                    life: 3000,
                });
            }
        }
    };

    // Generate regular columns
    const generateColumns = () => {
        const nivel = nivelEducativo || undefined;
        const materiasNivel = materias[nivel]?.Materias || [];
        const columns = [];

        [1, 2, 3].forEach(bimestre => {
            materiasNivel.forEach((_, index) => {
                columns.push(
                    <Column
                        key={`bimestre${bimestre}_materia${index}`}
                        body={(rowData) => (
                            <InputNumber
                                value={calificaciones[rowData.id]?.[`bimestre${bimestre}_materia${index}`] || ''}
                                onValueChange={(e) => handleCalificacionChange(e.value, rowData.id, bimestre, index)}
                                min={1}
                                max={10}
                                mode="decimal"
                                inputStyle={{ width: '100%', padding: '0' }}
                            />
                        )}
                        bodyStyle={{ border: '1px solid black', textAlign: 'center' }}
                    />
                );
            });
        });

        // Agregar columna de promedio
        columns.push(
            <Column
                key="promedio"
                header="Promedio"
                body={(rowData) => {
                    const promedio = calculatePromedio(calificaciones[rowData.id] || {});
                    return <span>{promedio}</span>;
                }}
                bodyStyle={{ border: '1px solid black', textAlign: 'center' }}
            />
        );

        return columns;
    };

    const handleRegisterClick = () => {
        setShowConfirmDialog(true);
    };

    const handleCancel = () => {
        setShowConfirmDialog(false);
    };

    return (
        <div>
            <Toast ref={toast} />
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5%', marginTop: '2%' }}>
                <h1>Registrar Calificaciones</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2%', marginLeft: '5%' }}>
                <InputText
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                    placeholder="Grado"
                    style={{ width: '10%' }}
                />
                <InputText
                    value={grupo}
                    onChange={(e) => setGrupo(e.target.value)}
                    placeholder="Grupo"
                    style={{ width: '10%', marginLeft: '1%' }}
                />
                <Dropdown
                    value={nivelEducativo}
                    options={nivelEducativoOptions}
                    onChange={(e) => setNivelEducativo(e.value)}
                    placeholder="Nivel Educativo"
                    style={{ width: '15%', marginLeft: '1%' }}
                />
                <Button
                    label="Buscar"
                    icon="pi pi-search"
                    className="p-button-success"
                    style={{ marginLeft: '1%' }}
                    onClick={handleSearch}
                />
                <Button
                    label="Registrar Calificaciones"
                    icon="pi pi-pencil"
                    className="p-button-info" 
                    style={{ marginLeft: '1%'}}
                    onClick={handleRegisterClick}
                />
            </div>

            <div style={{ margin: '2% 5%' }}>
                <DataTable 
                    value={data} 
                    style={{ width: '100%' }} 
                    autoLayout 
                    headerColumnGroup={headerGroup()}
                >
                    <Column field="nombreCompleto" body={nombreCompletoTemplate} style={{ width: "26%" }} />
                    <Column field="grado" style={{ width: "1%" }} bodyStyle={{ textAlign: 'center', border: '1px solid black' }} />
                    <Column field="grupo" style={{ width: "1%" }} bodyStyle={{ textAlign: 'center', border: '1px solid black' }} />
                    {generateColumns()}
                </DataTable>
            </div>
            <Dialog
                header="Confirmación"
                visible={showConfirmDialog}
                style={{ width: '50vw' }}
                footer={
                    <div>
                        <Button label="No" icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
                        <Button label="Sí" icon="pi pi-check" onClick={handleConfirm} autoFocus />
                    </div>
                }
                onHide={handleCancel}
            >
                <p>¿Estás seguro de registrar las calificaciones ingresadas?</p>
            </Dialog>
            <style jsx>{`
                .rotated-header {
                    transform: rotate(-90deg);
                    display: flex;
                    width: 20px;
                    height: 80px;
                    font-size: 12px;
                    align-items: center;
                    justify-content: center;
                    white-space: normal;
                }
                .p-datatable .p-datatable-tbody > tr > td {
                    border: 1px solid black;
                }
                .p-datatable .p-datatable-thead > tr > th {
                    border: 1px solid black;
                    white-space: normal;
                }
            `}</style>
        </div>
    );
};

export default RegistrarCalificaciones;