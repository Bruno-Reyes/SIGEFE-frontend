import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog'; // Importar Dialog

import axios from 'axios';
import lugares from '../../tools/lugares_mexico.json'; // Importar lugares

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
    const [apellido_paterno, setApellidoPaterno] = useState('');
    const [apellido_materno, setNombreApellidoMaterno] = useState('');
    const [data, setData] = useState([]);
    const [isSearchSuccessful, setIsSearchSuccessful] = useState(false); // Estado para habilitar el botón
    const [isDropdownsSelected, setIsDropdownsSelected] = useState(false); // Estado para habilitar el botón
    const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Estado para mostrar el popup
    const toast = useRef(null);

    const [showDropdowns, setShowDropdowns] = useState(false); // Estado para mostrar dropdowns
    const [estado, setEstado] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [cct, setCct] = useState('');
    const [municipios, setMunicipios] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [ccts, setCcts] = useState([]);
    const [cctCentroAsignado, setCctCentroAsignado] = useState(''); // Estado para almacenar el CCT del LEC
    const [cctEstudiante, setCctEstudiante] = useState(''); // Estado para almacenar el CCT del estudiante

    useEffect(() => {
        if (estado && lugares[estado]) {
            setMunicipios(lugares[estado].municipios.map(municipio => ({ label: municipio, value: municipio })));
            setMunicipio('');
            setLocalidad('');
            setCct('');
            setLocalidades([]);
            setCcts([]);
        }
    }, [estado]);

    useEffect(() => {
        const fetchLocalidades = async () => {
            if (municipio) {
                try {
                    let token = JSON.parse(localStorage.getItem('access-token'));
                    if (!token) {
                        token = await refreshToken();
                    }
                    const response = await axios.get(`${apiUrl}/asignacion/centros/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        params: { municipio }
                    });
                    const uniqueLocalidades = [...new Set(response.data.map(centro => centro.nombre_localidad))];
                    setLocalidades(uniqueLocalidades.map(localidad => ({ label: localidad, value: localidad })));
                    setLocalidad('');
                    setCct('');
                    setCcts([]);
                } catch (error) {
                    console.error('Error al cargar las localidades:', error);
                }
            }
        };
        fetchLocalidades();
    }, [municipio]);

    useEffect(() => {
        const fetchCCTs = async () => {
            if (localidad) {
                try {
                    let token = JSON.parse(localStorage.getItem('access-token'));
                    if (!token) {
                        token = await refreshToken();
                    }
                    const response = await axios.get(`${apiUrl}/asignacion/centros/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        params: { nombre_localidad: localidad }
                    });
                    const uniqueCCTs = [...new Set(response.data.map(centro => centro.clave_centro_trabajo))];
                    setCcts(uniqueCCTs.map(cct => ({ label: cct, value: cct })));
                    setCct('');
                } catch (error) {
                    console.error('Error al cargar los CCTs:', error);
                }
            }
        };
        fetchCCTs();
    }, [localidad]);

    useEffect(() => {
        setIsDropdownsSelected(estado && municipio && localidad && cct);
    }, [estado, municipio, localidad, cct]);

    const handleSearch = async () => {
        if (!nombreAlumno || !apellido_paterno || !apellido_materno) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, ingrese el nombre, apellido paterno y apellido materno del alumno.', life: 3000 });
            return;
        }
        try {
            let token = JSON.parse(localStorage.getItem('access-token'));
            if (!token) {
                token = await refreshToken();
            }
            // Obtener el centro de trabajo del alumno
            const estudianteResponse = await axios.get(`${apiUrl}/control_escolar/estudiantes/`, {
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

            if (estudianteResponse.data.length > 0) {
                const estudianteId = estudianteResponse.data[0].id;
                setCctEstudiante(estudianteResponse.data[0].centro_educativo); // Guardar el CCT del estudiante

                // Obtener el historial migratorio del alumno
                const historialResponse = await axios.get(`${apiUrl}/control_escolar/historial_migratorio/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        id_estudiante: estudianteId,
                    },
                });

                if (historialResponse.status === 200) {
                    const historialData = historialResponse.data;

                    // Obtener detalles del centro comunitario
                    const centroPromises = historialData.map(async (historial) => {
                        const centroResponse = await axios.get(`${apiUrl}/asignacion/centros/`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                            params: {
                                clave_centro_trabajo: historial.clave_centro_trabajo,
                            },
                        });

                        if (centroResponse.status === 200 && centroResponse.data.length > 0) {
                            const centro = centroResponse.data[0];
                            return {
                                ...historial,
                                estado: centro.estado,
                                municipio: centro.municipio,
                                nombre_localidad: centro.nombre_localidad,
                            };
                        } else {
                            return historial;
                        }
                    });

                    const historialCompleto = await Promise.all(centroPromises);
                    setData(historialCompleto);
                    setIsSearchSuccessful(true); // Habilitar el botón

                    // Obtener el email del LEC desde el local storage
                    const email = localStorage.getItem('email');

                    // Obtener el CCT del LEC
                    const lecResponse = await axios.get(`${apiUrl}/asignacion/lecs?email=${email}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (lecResponse.status === 200 && lecResponse.data.length > 0) {
                        setCctCentroAsignado(lecResponse.data[0].cct_centro_asignado); // Guardar el CCT del LEC
                    }
                } else {
                    console.error("Error al obtener el historial migratorio:", historialResponse.data);
                    throw new Error('Error al obtener el historial migratorio');
                }
            } else {
                setData([]);
                setIsSearchSuccessful(false); // Deshabilitar el botón
            }
        } catch (error) {
            console.error('Error al buscar el historial migratorio:', error);
            setIsSearchSuccessful(false); // Deshabilitar el botón
        }
    };

    const handleRegisterChange = () => {
        setShowDropdowns(true);
        setIsDropdownsSelected(false); // Deshabilitar el botón de "Inscribir a nuevo centro"
    };

    const handleInscribirClick = async () => {
        try {
            let token = JSON.parse(localStorage.getItem('access-token'));
            if (!token) {
                token = await refreshToken();
            }

            // Obtener el ID del estudiante
            const estudianteResponse = await axios.get(`${apiUrl}/control_escolar/estudiantes/`, {
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

            if (estudianteResponse.data.length > 0) {
                const estudianteId = estudianteResponse.data[0].id;

                // Obtener el email del LEC desde el local storage
                const email = localStorage.getItem('email');

                // Obtener el CCT del LEC
                const lecResponse = await axios.get(`${apiUrl}/asignacion/lecs?email=${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (lecResponse.status !== 200) {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo obtener el CCT del LEC.',
                        life: 3000,
                    });
                    return;
                }

                const lecData = lecResponse.data[0]; // Acceder al primer elemento del array
                const cct_centro_asignado = lecData.cct_centro_asignado;
                console.log('CCT LEC:', cct_centro_asignado);
                console.log('CCT Estudiante:', estudianteResponse.data[0].centro_educativo);

                // Verificar si el LEC tiene control sobre el estudiante
                if (estudianteResponse.data[0].centro_educativo !== cct_centro_asignado) {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'El LEC no tiene control sobre este estudiante.',
                        life: 3000,
                    });
                    return;
                }

                setShowConfirmDialog(true);
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se encontró el estudiante.',
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error al verificar el control del LEC sobre el estudiante:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un problema al verificar el control del LEC sobre el estudiante.',
                life: 3000,
            });
        }
    };

    const handleConfirm = async () => {
        setShowConfirmDialog(false);
        try {
            let token = JSON.parse(localStorage.getItem('access-token'));
            if (!token) {
                token = await refreshToken();
            }

            // Obtener el ID del estudiante
            const estudianteResponse = await axios.get(`${apiUrl}/control_escolar/estudiantes/`, {
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

            if (estudianteResponse.data.length > 0) {
                const estudianteId = estudianteResponse.data[0].id;

                // Registrar el nuevo historial migratorio
                const fechaInscripcion = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
                const email = localStorage.getItem('email'); // Obtener el email del local storage

                const historialResponse = await axios.post(`${apiUrl}/control_escolar/historial_migratorio/`, {
                            id_estudiante: estudianteId,
                            fecha_inscripcion: fechaInscripcion,
                            clave_centro_trabajo: cct,
                            email: localStorage.getItem('email'),
                          }, {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              'Content-Type': 'application/json',
                            }
                          });

                if (historialResponse.status === 201) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `El alumno ${apellido_paterno} ${apellido_materno} ${nombreAlumno} ha sido inscrito en el centro ${cct}.`,
                        life: 3000,
                    });
                    handleSearch(); // Actualizar la tabla con el nuevo historial

                    // Ocultar la sección de selección de datos del nuevo centro
                    setShowDropdowns(false);
                    setIsDropdownsSelected(false); // Deshabilitar el botón de "Inscribir a nuevo centro"
                } else {
                    console.error("Error al registrar el historial migratorio:", historialResponse.data);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Hubo un problema al inscribir al alumno en el nuevo centro.',
                        life: 3000,
                    });
                }
            } else {
                console.error("No se encontró el estudiante.");
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se encontró el estudiante.',
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error al inscribir al alumno en el nuevo centro:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un problema al inscribir al alumno en el nuevo centro.',
                life: 3000,
            });
        }
    };

    const handleCancel = () => {
        setShowConfirmDialog(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options).replace(/\//g, '-');
    };

    return (
        <div>
            <Toast ref={toast} />
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5%', marginTop: '2%' }}>
                <h1>Historial de Inscripciones en Centros Comunitarios del Alumno</h1>
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
                    onChange={(e) => setNombreApellidoMaterno(e.target.value)} 
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
                <Button 
                    label="Registrar cambio de centro" 
                    className="p-button-warning" 
                    style={{ marginLeft: '10px' }} 
                    icon="pi pi-arrow-right-arrow-left"
                    onClick={handleRegisterChange}
                    disabled={!isSearchSuccessful || cctCentroAsignado !== cctEstudiante} // Deshabilitar botón
                />
                <Button 
                    label="Inscribir a nuevo centro" 
                    className="p-button-info" 
                    style={{ marginLeft: '10px' }} 
                    icon="pi pi-pencil" // Agrega el icono de lápiz
                    disabled={!isDropdownsSelected} // Deshabilitar botón
                    onClick={handleInscribirClick} // Mostrar popup
                />
            </div>
            {showDropdowns && (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5%', marginTop: '2%' }}>
                        <h2>Seleccione los datos del nuevo centro para inscribir al alumno</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2%', marginLeft: '5%' }}>
                        <Dropdown
                            value={estado}
                            options={Object.keys(lugares).map(estado => ({ label: estado, value: estado }))}
                            onChange={(e) => setEstado(e.value)}
                            placeholder="Seleccione un estado"
                            style={{ width: '15%', marginRight: '1%' }}
                        />
                        <Dropdown
                            value={municipio}
                            options={municipios}
                            onChange={(e) => setMunicipio(e.value)}
                            placeholder="Seleccione un municipio"
                            style={{ width: '15%', marginRight: '1%' }}
                            disabled={!estado}
                        />
                        <Dropdown
                            value={localidad}
                            options={localidades}
                            onChange={(e) => setLocalidad(e.value)}
                            placeholder="Seleccione una localidad"
                            style={{ width: '15%', marginRight: '1%' }}
                            disabled={!municipio}
                        />
                        <Dropdown
                            value={cct}
                            options={ccts}
                            onChange={(e) => setCct(e.value)}
                            placeholder="Seleccione un CCT"
                            style={{ width: '15%', marginRight: '1%' }}
                            disabled={!localidad}
                        />
                    </div>
                </>
            )}
            <DataTable value={data} style={{ width: '88%' , marginLeft: '5%'}} autoLayout>
                <Column field="estado" header="Estado" />
                <Column field="municipio" header="Municipio" />
                <Column field="nombre_localidad" header="Localidad" />
                <Column field="clave_centro_trabajo" header="CCT" />
                <Column field="fecha_inscripcion" header="Fecha de inscripción al centro" body={(rowData) => formatDate(rowData.fecha_inscripcion)} />
            </DataTable>
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
                <p>¿Está seguro de inscribir al alumno {apellido_paterno} {apellido_materno} {nombreAlumno} al centro {cct}?</p>
            </Dialog>
        </div>
    );
};

export default GestionHistorialMigratorio;
