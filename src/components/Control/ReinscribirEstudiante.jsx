import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import jsPDF from 'jspdf';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';

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
    const [showReinscribirDialog, setShowReinscribirDialog] = useState(false);
    const [nuevoNivelEducativo, setNuevoNivelEducativo] = useState('');
    const [nuevoGrado, setNuevoGrado] = useState('');
    const [nuevoGrupo, setNuevoGrupo] = useState('');
    const [isReinscribirFieldsFilled, setIsReinscribirFieldsFilled] = useState(false);
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);

    const nivelEducativoOptions = [
        { label: 'Preescolar', value: 'Preescolar' },
        { label: 'Primaria', value: 'Primaria' },
        { label: 'Secundaria', value: 'Secundaria' },
    ];

    const gradoOptions = {
        'Preescolar': [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
        ],
        'Primaria': [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' },
            { label: '6', value: '6' },
        ],
        'Secundaria': [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
        ],
    };

    useEffect(() => {
        setIsReinscribirFieldsFilled(nuevoNivelEducativo && nuevoGrado && nuevoGrupo);
    }, [nuevoNivelEducativo, nuevoGrado, nuevoGrupo]);

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
                        grado: estudiantes[0].grado,
                        grupo: estudiantes[0].grupo,
                    },
                });
                console.log('id', estudiantes.map(est => est.id).join(','));
                console.log('Grado', estudiantes[0].grado);
                console.log('Grupo', estudiantes[0].grupo);
                setCalificaciones(calificacionesResponse.data);
                console.log('Calificaciones:', calificacionesResponse.data);

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
    
        // Dibujar un borde decorativo
        doc.setLineWidth(1);
        doc.setDrawColor(0, 0, 0); // Negro
        doc.rect(10, 10, 190, 277, 'S'); // Rectángulo del borde
    
        // Título principal con un marco decorativo
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(0, 102, 204); // Azul
        doc.text('Certificado de Finalización', 105, 40, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 102, 204);
        doc.line(50, 45, 160, 45); // Línea decorativa bajo el título
    
        // Subtítulo
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Otorgado en reconocimiento al logro académico del estudiante', 105, 55, { align: 'center' });
    
        // Información del estudiante
        doc.setFont('times', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Por la presente se certifica que:`, 20, 80);
        doc.setFont('times', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(0, 51, 153);
        doc.text(`${estudiante.nombre} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}`, 105, 90, { align: 'center' });
    
        doc.setFont('times', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Inscrito en el nivel educativo: ${estudiante.nivel_educativo}`, 20, 110);
        doc.text(`Grado: ${estudiante.grado}   Grupo: ${estudiante.grupo}`, 20, 120);
        doc.text(`Ha completado exitosamente el ciclo escolar correspondiente.`, 20, 130);
    
        // Sección decorativa para la fecha y firma
        doc.setFont('times', 'italic');
        doc.text('Dado en la ciudad el día:', 20, 150);
        doc.setFont('times', 'bold');
        doc.text(new Date().toLocaleDateString(), 70, 150);
        
        // Firma decorativa
        doc.line(130, 170, 190, 170); // Línea para la firma
        doc.setFont('times', 'normal');
        doc.text('Firma del Director(a):', 130, 175);
    
        // Elementos decorativos en el pie de página
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('Sistema Integral de Gestión Educativa - SIGEFE', 105, 275, { align: 'center' });
    
        // Dibujar un pequeño diseño decorativo en el footer
        doc.setDrawColor(0, 102, 204);
        doc.line(60, 280, 150, 280); // Línea horizontal
        doc.circle(105, 280, 3, 'S'); // Círculo decorativo
    
        // Guardar el archivo
        doc.save(`Certificado_${estudiante.nombre}_${estudiante.apellido_paterno}.pdf`);
    };
    
    const handleReinscribirClick = () => {
        setShowReinscribirDialog(true);
    };

    const handleConfirmReinscripcion = async () => {
        try {
            let token = JSON.parse(localStorage.getItem('access-token'));
            if (!token) {
                token = await refreshToken();
            }
            // console.log('Reinscribir al estudiante...');
            // console.log('id_estudiante:', selectedEstudiante);
            // console.log('nuevo_nivel_educativo:', nuevoNivelEducativo);
            // console.log('nuevo_grado:', nuevoGrado);
            // console.log('nuevo_grupo:', nuevoGrupo);
            const response = await axios.post(`${apiUrl}/control_escolar/reinscribir_estudiante/`, {
                id_estudiante: selectedEstudiante.id,
                nuevo_nivel_educativo: nuevoNivelEducativo,
                nuevo_grado: nuevoGrado,
                nuevo_grupo: nuevoGrupo,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `El estudiante ha sido reinscrito correctamente.`,
                    life: 3000,
                });
                setShowReinscribirDialog(false);
            } else {
                throw new Error('Error al reinscribir el estudiante');
            }
        } catch (error) {
            console.error('Error al reinscribir el estudiante:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un problema al reinscribir el estudiante.',
                life: 3000,
            });
        }
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
                {mostrarBotonReinscribir && selectedEstudiante && (
                    <Button 
                        label="Reinscribir Alumno" 
                        icon="pi pi-pencil" 
                        className="p-button-info" 
                        style={{ marginLeft: '1%' }} 
                        onClick={() => handleReinscribirClick(selectedEstudiante)}
                    />
                )}
            </div>
            <DataTable value={data} style={{ width: '88%' , marginLeft: '5%'}} autoLayout selectionMode="single" onSelectionChange={(e) => setSelectedEstudiante(e.value)}>
                <Column field="nivel_educativo" header="Nivel Escolar" />
                <Column field="grado" header="Grado" />
                <Column field="grupo" header="Grupo" />
                <Column header="Promedio" body={calcularPromedio} />
                <Column field="estatus" header="Estatus" body={calcularEstatus} />
            </DataTable>
            <Dialog
                header="Reinscribir Estudiante"
                visible={showReinscribirDialog}
                style={{ width: '50vw' }}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowReinscribirDialog(false)} className="p-button-text" />
                        <Button label="Confirmar Inscripción" icon="pi pi-check" onClick={handleConfirmReinscripcion} disabled={!isReinscribirFieldsFilled} />
                    </div>
                }
                onHide={() => setShowReinscribirDialog(false)}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Dropdown
                        value={nuevoNivelEducativo}
                        options={nivelEducativoOptions}
                        onChange={(e) => setNuevoNivelEducativo(e.value)}
                        placeholder="Seleccione el nivel educativo"
                        style={{ width: '100%' }}
                    />
                    <Dropdown
                        value={nuevoGrado}
                        options={gradoOptions[nuevoNivelEducativo] || []}
                        onChange={(e) => setNuevoGrado(e.value)}
                        placeholder="Seleccione el grado"
                        style={{ width: '100%' }}
                        disabled={!nuevoNivelEducativo}
                    />
                    <InputText
                        value={nuevoGrupo}
                        onChange={(e) => setNuevoGrupo(e.target.value.toUpperCase())}
                        placeholder="Ingrese el grupo"
                        style={{ width: '100%' }}
                        disabled={!nuevoGrado}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default ReinscribirEstudiante;
