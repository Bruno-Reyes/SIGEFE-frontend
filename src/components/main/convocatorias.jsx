import React, { useState, useEffect } from 'react';
import RegistroConvocatoria from '../captacion/RegistroConvocatoria';
import MostrarConvocatorias from '../captacion/MostrarConvocatorias';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const Convocatorias = () => {
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = React.useRef(null);

    // Función para cargar convocatorias desde el backend
    const obtenerConvocatorias = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("access-token"));
            const response = await axios.get(`${apiUrl}/captacion/convocatorias/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setConvocatorias(response.data); // Guardamos los datos de las convocatorias
            setLoading(false); // Detenemos el indicador de carga
        } catch (error) {
            setLoading(false); // Detenemos el indicador de carga
            const errorMessage = error.response?.data?.detail || 'Hubo un problema al cargar las convocatorias';
            toast.current.show({
                severity: 'error',
                summary: 'Error al cargar convocatorias',
                detail: errorMessage,
                life: 3000,
            });
        }
    };

    // Usamos useEffect para obtener las convocatorias al cargar el componente
    useEffect(() => {
        obtenerConvocatorias();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, marginRight: '10px' }}>
                {/* Pasamos setConvocatorias y convocatorias */}
                <RegistroConvocatoria onRegistroExitoso={obtenerConvocatorias} />
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>
                <MostrarConvocatorias convocatorias={convocatorias} />
            </div>
        </div>
    );
};

export default Convocatorias;