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
                const centroTrabajo = estudianteResponse.data[0].centro_educativo;

                // Obtener los detalles del centro de trabajo
                const centroResponse = await axios.get(`${apiUrl}/asignacion/centros/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        clave_centro_trabajo: centroTrabajo,
                    },
                });

                if (centroResponse.headers['content-type'].includes('application/json')) {
                    const centroData = centroResponse.data.map(item => ({
                        ...item,
                        fecha_inscripcion_centro: estudianteResponse.data[0].fecha_inscripcion_centro // Agregar la fecha de inscripción
                    }));
                    setData(centroData);
                    setIsSearchSuccessful(true); // Habilitar el botón
                } else {
                    throw new Error('La respuesta no es JSON');
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
    };

    const handleInscribirClick = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirm = () => {
        setShowConfirmDialog(false);
        // Lógica para inscribir al alumno en el nuevo centro
        toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: `El alumno ${apellido_paterno} ${apellido_materno} ${nombreAlumno} ha sido inscrito en el centro ${cct}.`,
            life: 3000,
        });
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
                    disabled={!isSearchSuccessful} // Deshabilitar botón
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
                <Column field="fecha_inscripcion_centro" header="Fecha de inscripción al centro" body={(rowData) => formatDate(rowData.fecha_inscripcion_centro)} />
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
