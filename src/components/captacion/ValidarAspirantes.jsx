// Crea un componenete de React que se llame ValidarAspirantes y diga Hola
import React, { useState, useEffect, useRef } from "react";
import Loader from "../main/loader";
import axios from "axios";
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const apiUrl = import.meta.env.VITE_API_URL;

const ValidarAspirantes = () => {

    const [candidatos, setCandidatos] = useState([]);
    const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    // Función para cargar los candidatos desde el backend
    const obtenerCandidatos = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("access-token"));
            const response = await axios.get(`${apiUrl}/captacion/candidatos/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setCandidatos(response.data); // Guardamos los datos de las convocatorias
            setLoading(false); // Detenemos el indicador de carga
        } catch (error) {
            setLoading(false); // Detenemos el indicador de carga
            const errorMessage = error.response?.data?.detail || 'Error';
            console.log(error);

            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 3000,
            });
        }
    };

    // Usamos useEffect para obtener las convocatorias al cargar el componente
    useEffect(() => {
        obtenerCandidatos();
    }, []);


    return (

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Toast /> {/* Componente para notificaciones (en este caso, opcional si no se usa) */}
            <div style={{ flex: 1, marginRight: '10px' }}>
                {/* Renderizar el loader mientras se hace la peticion */}
                {loading ? <Loader /> : null}

                <div style={{
                    height: '70vh',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                    boxSizing: 'border-box',
                }}>
                    {/* Componente DataTable para mostrar las convocatorias */}
                    <DataTable
                        value={candidatos} // Recibe las convocatorias como prop
                        responsiveLayout="scroll"
                        scrollable
                        scrollHeight="flex"
                        style={{ flex: 1 }}
                        size="small"
                        stripedRows
                        selectionMode="single"
                        selection={candidatoSeleccionado}
                        onSelectionChange={(e) => setCandidatoSeleccionado(e.value)}
                        dataKey="id"
                    >
                        <Column field="nombres" header="Nombre" sortable />
                        <Column field="apellido_paterno" header="Apellido paterno" sortable />
                        <Column field="estado" header="Procedencia" sortable />
                    </DataTable>

                </div>
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>

                {candidatoSeleccionado ? <div>
                    <h3>Detalles del Candidato</h3>
                    <p><strong>CURP:</strong> {candidatoSeleccionado.curp}</p>
                    <p><strong>Nombres:</strong> {candidatoSeleccionado.nombres}</p>
                    <p><strong>Apellido Paterno:</strong> {candidatoSeleccionado.apellido_paterno}</p>
                    <p><strong>Apellido Materno:</strong> {candidatoSeleccionado.apellido_materno}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {candidatoSeleccionado.fecha_nacimiento}</p>
                    <p><strong>Género:</strong> {candidatoSeleccionado.genero}</p>
                    <p><strong>Talla Playera:</strong> {candidatoSeleccionado.talla_playera}</p>
                    <p><strong>Talla Pantalón:</strong> {candidatoSeleccionado.talla_pantalon}</p>
                    <p><strong>Talla Calzado:</strong> {candidatoSeleccionado.talla_calzado}</p>
                    <p><strong>Peso:</strong> {candidatoSeleccionado.peso}</p>
                    <p><strong>Estatura:</strong> {candidatoSeleccionado.estatura}</p>
                    <p><strong>Afecciones:</strong> {candidatoSeleccionado.afecciones}</p>
                    <p><strong>Banco:</strong> {candidatoSeleccionado.banco}</p>
                    <p><strong>CLABE:</strong> {candidatoSeleccionado.clabe}</p>
                    <p><strong>Nivel de Estudios:</strong> {candidatoSeleccionado.nivel_estudios}</p>
                    <p><strong>Nivel de Estudios Deseado:</strong> {candidatoSeleccionado.nivel_estudios_deseado}</p>
                    <p><strong>Experiencia en Ciencia:</strong> {candidatoSeleccionado.experiencia_ciencia}</p>
                    <p><strong>Experiencia en Arte:</strong> {candidatoSeleccionado.experiencia_arte}</p>
                    <p><strong>Interés en Desarrollo Comunitario:</strong> {candidatoSeleccionado.interes_desarrollo_comunitario ? 'Sí' : 'No'}</p>
                    <p><strong>Razones de Interés:</strong> {candidatoSeleccionado.razones_interes}</p>
                    <p><strong>Profesión de Interés:</strong> {candidatoSeleccionado.profesion_interes}</p>
                    <p><strong>Interés en Incorporación:</strong> {candidatoSeleccionado.interes_incorporacion}</p>
                    <p><strong>Código Postal:</strong> {candidatoSeleccionado.codigo_postal}</p>
                    <p><strong>Estado:</strong> {candidatoSeleccionado.estado}</p>
                    <p><strong>Colonia:</strong> {candidatoSeleccionado.colonia}</p>
                    <p><strong>Municipio:</strong> {candidatoSeleccionado.municipio}</p>
                    <p><strong>Localidad:</strong> {candidatoSeleccionado.localidad}</p>
                    <p><strong>Calle:</strong> {candidatoSeleccionado.calle}</p>
                    <p><strong>Número Exterior:</strong> {candidatoSeleccionado.numero_exterior}</p>
                    <p><strong>Número Interior:</strong> {candidatoSeleccionado.numero_interior}</p>
                    <p><strong>Certificado:</strong> {candidatoSeleccionado.certificado}</p>
                    <p><strong>Identificación:</strong> {candidatoSeleccionado.identificacion}</p>
                    <p><strong>Estado de Cuenta:</strong> {candidatoSeleccionado.estado_cuenta}</p>
                    <p><strong>Estado de Aceptación:</strong> {candidatoSeleccionado.estado_aceptacion}</p>
                </div> : null}
            </div>

        </div>
    )

}

export default ValidarAspirantes;

// "curp": "ZISW9961C97ECKC5",
// "nombres": "Ana",
// "apellido_paterno": "Gómez",
// "apellido_materno": "Gallardo",
// "fecha_nacimiento": "1964-10-28",
// "genero": "O",
// "talla_playera": "S",
// "talla_pantalon": "XXL",
// "talla_calzado": "32",
// "peso": "108.27",
// "estatura": "2.00",
// "afecciones": "Hipertensión",
// "banco": "BanCoppel",
// "clabe": "417800680535717595",
// "nivel_estudios": "Secundaria",
// "nivel_estudios_deseado": "Secundaria",
// "experiencia_ciencia": "Física",
// "experiencia_arte": "Ninguna",
// "interes_desarrollo_comunitario": false,
// "razones_interes": "Razón 5",
// "profesion_interes": "Profesión 3",
// "interes_incorporacion": "Interés 2",
// "codigo_postal": "24969",
// "estado": "Campeche",
// "colonia": "La Palma",
// "municipio": "Asientos",
// "localidad": "Cosío",
// "calle": "Gómez",
// "numero_exterior": "966",
// "numero_interior": "33",
// "certificado": "/",
// "identificacion": "/",
// "estado_cuenta": "/",
// "estado_aceptacion": "Pendiente",