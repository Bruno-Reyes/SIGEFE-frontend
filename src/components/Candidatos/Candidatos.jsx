import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; // Importar ConfirmDialog
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paginator } from 'primereact/paginator';

const Candidatos = () => {
    const navigate = useNavigate();
    const [Candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(15);

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
    
            // Filtrar candidatos con estado_aceptacion pendiente
            const candidatosPendientes = response.data.filter(
                (candidato) => candidato.estado_aceptacion === "Pendiente"
            );
    
            setCandidatos(candidatosPendientes);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error al cargar los candidatos:", error);
        }
    };

    useEffect(() => {
        obtenerCandidatos();
    }, []);

    const handleAction = async (id, action) => {
        try {
            let token = JSON.parse(localStorage.getItem("access-token"));
            if (!token) {
                token = await refreshToken();
            }

            await axios.patch(`${apiUrl}/captacion/detalles_usuario/${id}/${action}/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setCandidatos((prevCandidatos) =>
                prevCandidatos.filter((candidato) => candidato.id !== id)
            );

            toast.current.show({
                severity: action === "aceptar" ? "success" : "warn",
                summary: `Candidato ${action === "aceptar" ? "Aceptado" : "Rechazado"}`,
                detail: `El candidato con ID ${id} ha sido ${action === "aceptar" ? "aceptado" : "rechazado"}.`,
                life: 3000,
            });
        } catch (error) {
            console.error(`Error al ${action} al candidato:`, error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Hubo un problema al ${action} al candidato.`,
                life: 3000,
            });
        }
    };

    const confirmAction = (id, action) => {
        confirmDialog({
            message: `¿Estás seguro de que deseas ${action === "aceptar" ? "aceptar" : "rechazar"} al candidato con ID ${id}?`,
            header: `${action === "aceptar" ? "Aceptar" : "Rechazar"} Candidato`,
            icon: `pi ${action === "aceptar" ? "pi-check-circle" : "pi-times-circle"}`,
            acceptClassName: action === "aceptar" ? "p-button-success" : "p-button-danger",
            accept: () => handleAction(id, action),
            reject: () => {
                toast.current.show({
                    severity: "info",
                    summary: "Cancelado",
                    detail: `No se realizó ninguna acción.`,
                    life: 2000,
                });
            },
        });
    };

    const actionBodyTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: '10px' }}>
            <Button
                label="Aceptar"
                icon="pi pi-check"
                className="p-button-success"
                onClick={() => confirmAction(rowData.id, "aceptar")}
            />
            <Button
                label="Rechazar"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={() => confirmAction(rowData.id, "rechazar")}
            />
        </div>
    );

    const viewButtonTemplate = (rowData) => (
        <Button
            icon="pi pi-pen-to-square"
            className="p-button-info"
            onClick={() => {
                const candidato = Candidatos.find((candidato) => candidato.id === rowData.id);
                navigate(`/detalle/${rowData.id}`, { state: { candidato } });
            }}
        />
    );

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const paginatedCandidatos = Candidatos.slice(first, first + rows);

    return (
        <div style={{ padding: '16px' }}>
            <Toast ref={toast} />
            <ConfirmDialog /> {/* ConfirmDialog */}
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <>
                    <DataTable value={paginatedCandidatos} responsiveLayout="scroll" header="Candidatos" paginator={false}>
                        <Column header="Ver Registro" body={viewButtonTemplate} style={{ width: '150px' }} />
                        <Column field="nombres" header="Nombre" sortable />
                        <Column field="apellido_paterno" header="Apellido Paterno" sortable />
                        <Column field="apellido_materno" header="Apellido Materno" sortable />
                        <Column body={actionBodyTemplate} header="Opciones" style={{ width: '250px' }} />
                    </DataTable>
                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={Candidatos.length}
                        rowsPerPageOptions={[15, 30, 45]}
                        onPageChange={onPageChange}
                    />
                </>
            )}
        </div>
    );
};

export default Candidatos;

