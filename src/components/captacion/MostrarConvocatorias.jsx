import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

const apiUrl = import.meta.env.VITE_API_URL;

const MostrarConvocatorias = () => {
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = React.useRef(null);

    // Función para obtener las convocatorias
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
        <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', padding: '16px', boxSizing: 'border-box' }}>
            <Toast ref={toast} /> {/* Componente para las notificaciones */}
            <h1 style={{ marginBottom: '16px' }}>Convocatorias</h1>

            {/* Componente DataTable para mostrar las convocatorias */}
            <DataTable
                value={convocatorias}
                loading={loading}
                responsiveLayout="scroll"
                scrollable // Habilita el desplazamiento
                scrollHeight="flex" // Limita la altura al espacio disponible
                style={{ flex: 1 }} // Asegura que se adapte al contenedor
            >
                <Column field="lugar_convocatoria" header="Lugar de la convocatoria" sortable />
                <Column field="fecha_limite_registro" header="Fecha límite de registro" sortable />
                <Column field="fecha_entrega_resultados" header="Fecha de entrega de resultados" sortable />
                <Column field="max_participantes" header="Máximo de participantes" sortable />
            </DataTable>
        </div>
    );
};

export default MostrarConvocatorias;
