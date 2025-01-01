import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Candidatos = () => {
    const navigate = useNavigate();
    const [Candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true); // Indicador de carga
    const apiUrl = import.meta.env.VITE_API_URL;

    const refreshToken = async () => {
        try {
            const refreshToken = JSON.parse(localStorage.getItem("refresh-token"));
            const response = await axios.post(`${apiUrl}/auth/token/refresh/`, {
                refresh: refreshToken,
            });
            const newAccessToken = response.data.access;
            localStorage.setItem("access-token", JSON.stringify(newAccessToken));
            return newAccessToken;
        } catch (error) {
            console.error("Error al refrescar el token:", error);
            throw new Error("No se pudo renovar el token de acceso.");
        }
    };

    const obtenerCandidatos = async () => {
        try {
            let token = JSON.parse(localStorage.getItem("access-token"));
            if (!token) {
                token = await refreshToken();
            }

            const response = await axios.get(`${apiUrl}/captacion/candidatos/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log( response.data )

            setCandidatos(response.data); // Guardamos los datos reales
            setLoading(false); // Detenemos el indicador de carga

        } catch (error) {
            setLoading(false);
            console.error("Error al cargar los candidatos:", error);
        }
    };

    useEffect(() => {
        obtenerCandidatos();
    }, []);

    const handleViewRecord = (id) => {
        const candidato = Candidatos.find((candidato) => candidato.id === id);
        navigate(`/detalle/${id}`, { state: { candidato } });
    };

    const handleAccept = (id) => {
        alert(`Aceptar candidato con ID: ${id}`);
        // Aquí puedes implementar la lógica para aceptar al candidato
    };

    const handleReject = (id) => {
        alert(`Rechazar candidato con ID: ${id}`);
        // Aquí puedes implementar la lógica para rechazar al candidato
    };

    const actionBodyTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: '10px' }}>
            <Button
                label="Aceptar"
                icon="pi pi-check"
                className="p-button-success"
                onClick={() => handleAccept(rowData.id)}
            />
            <Button
                label="Rechazar"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={() => handleReject(rowData.id)}
            />
        </div>
    );

    const viewButtonTemplate = (rowData) => (
        <Button
            icon="pi pi-pen-to-square"
            className="p-button-info"
            onClick={() => handleViewRecord(rowData.id)}
        />
    );

    return (
        <div style={{ padding: '16px' }}>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <DataTable value={Candidatos} responsiveLayout="scroll" header="Candidatos">
                    <Column header="Ver Registro" body={viewButtonTemplate} style={{ width: '150px' }} />
                    <Column field="nombres" header="Nombre" sortable />
                    <Column field="apellido_paterno" header="Apellido Paterno" sortable />
                    <Column field="apellido_materno" header="Apellido Materno" sortable />
                    <Column body={actionBodyTemplate} header="Opciones" style={{ width: '250px' }} />
                </DataTable>
            )}
        </div>
    );
};

export default Candidatos;
