import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const MostrarPagosPendientes = () => {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nuevoPago, setNuevoPago] = useState(false);
    const toast = React.useRef(null);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const userEmail = localStorage.getItem("email");
    const usertipo = localStorage.getItem("tipo_usuario");

    const estadosConfirmacion = [
        { label: "Recibido", value: "recibido" },
        { label: "No Recibido", value: "no_recibido" },
        { label: "Error", value: "error" },
    ];

    const conceptos = [
        { label: "Beca", value: "Beca" },
        { label: "Seguimiento", value: "Seguimiento" },
        { label: "Continuacion", value: "Continuacion" },
    ];

    const estados = [
        { label: "Pendiente", value: "pendiente" },
        { label: "Pagado", value: "pagado" },
        { label: "Fallido", value: "fallido" },
    ];

    const obtenerPagosPendientes = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("access-token"));
            const response = await axios.get(`${apiUrl}/pagos/pendientes/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPagos(response.data);
        } catch (error) {
            const mensajeError = error.response?.data?.detail || "Error al cargar los pagos pendientes.";
            toast.current.show({ severity: "error", summary: "Error", detail: mensajeError, life: 3000 });
        } finally {
            setLoading(false);
        }
    };
    

    const guardarConfirmacion = async (pagoId, confirmacion) => {
        console.log("Pago ID:", pagoId, "Confirmación:", confirmacion);
        try {
            console.log("Pago ID:", pagoId, "Confirmación:", confirmacion);

            const token = JSON.parse(localStorage.getItem("access-token"));
            await axios.patch(`${apiUrl}/pagos/gestion/${pagoId}/`, { confirmacion_lec: confirmacion }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Actualizar el estado local para reflejar el cambio
            setPagos((prevPagos) =>
                prevPagos.map((pago) =>
                    pago.id === pagoId ? { ...pago, confirmacion_lec: confirmacion } : pago
                )
            );

            console.log("Pago ID:", pagoId, "Confirmación:", confirmacion);

            toast.current.show({ severity: "success", summary: "Actualizado", detail: "Confirmación actualizada con éxito", life: 3000 });
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo actualizar la confirmación", life: 3000 });
        }
    };

    const editarEstatus = async (pagoId, estatus) => {
        try {
            const token = JSON.parse(localStorage.getItem("access-token"));
            await axios.patch(`${apiUrl}/pagos/gestion/${pagoId}/`, { estatus: estatus }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPagos((prevPagos) =>
                prevPagos.map((pago) =>
                    pago.id === pagoId ? { ...pago, estatus: estatus } : pago
                )
            );

            toast.current.show({ severity: "success", summary: "Actualizado", detail: "Estatus actualizado con éxito", life: 3000 });
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo actualizar el estatus", life: 3000 });
        }
    };

    const editarPago = async (pagoId, data) => {
        try {
            const token = JSON.parse(localStorage.getItem("access-token"));
            await axios.patch(`${apiUrl}/pagos/gestion/${pagoId}/`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Actualizar el estado local para reflejar el cambio
            setPagos((prevPagos) =>
                prevPagos.map((pago) =>
                    pago.id === pagoId ? { ...pago, ...data } : pago
                )
            );

            toast.current.show({ severity: "success", summary: "Actualizado", detail: "Pago actualizado con éxito", life: 3000 });
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo actualizar el pago", life: 3000 });
        }
    };

    const agregarPago = async () => {
         
        try {
            const token = JSON.parse(localStorage.getItem("access-token"));
    
            // Datos predefinidos válidos
            const nuevoPago = {
                usuario: 1, // ID de un usuario válido en la base de datos
                concepto: "Beca", // Uno de los conceptos válidos
                monto: 1000.00, // Monto fijo
                estatus: "pendiente", // Estado por defecto
                fecha_pago: new Date().toISOString().split("T")[0], // Fecha actual
            };
        
            // Enviar el pago al backend
            const response = await axios.post(`${apiUrl}/pagos/registrar/`, nuevoPago, {
                headers: { Authorization: `Bearer ${token}` },
            });
        
            // Actualizar la lista de pagos si la solicitud fue exitosa
            setPagos((prevPagos) => [...prevPagos, response.data.data]);
        
            toast.current.show({ severity: "success", summary: "Nuevo Pago", detail: "Pago creado con éxito", life: 3000 });
        } catch (error) {
            const mensajeError = error.response?.data?.detail || "No se pudo crear el pago.";
            toast.current.show({ severity: "error", summary: "Error", detail: mensajeError, life: 3000 });
        }
        
    };
    
    const estatusTemplate = (rowData) => {
        if (userEmail === "dep_finanzas@example.com") {
            return (
                <Dropdown
                    value={rowData.estatus}
                    options={estados}
                    onChange={(e) => editarEstatus(rowData.id, e.value)}
                    placeholder="Seleccionar"
                />
            );
        }
        return <span>{rowData.estatus}</span>;
    };

    const confirmacionTemplate = (rowData) => {
        if (userEmail === "coord_nac_rrhh@example.com" || userEmail === "dep_finanzas@example.com"  ) {
            // Mostrar el valor actual como texto para otros usuarios
            return <span>{rowData.confirmacion_lec || "Sin Confirmación"}</span>;
        } else{
            // Solo permitir editar la columna si es el dueño del pago
            return (
                <Dropdown
                    value={rowData.confirmacion_lec}
                    options={estadosConfirmacion}
                    onChange={(e) => guardarConfirmacion(rowData.id, e.value)}
                    placeholder="Seleccionar"
                />
            );
        }
        
    };

    const editableTemplate = (field, options = null) => (rowData) => {
        if (userEmail === "coord_nac_rrhh@example.com") {
            // Permitir la edición de las columnas
            if (field === "concepto" ) {
                return (
                    <Dropdown
                        value={rowData[field]}
                        options={options}
                        onChange={(e) => editarPago(rowData.id, { [field]: e.value })}
                    />
                );
            } else if (field === "fecha_pago") {
                return (
                    <Calendar
                        value={new Date(rowData[field])}
                        onChange={(e) => editarPago(rowData.id, { [field]: e.value.toISOString().split("T")[0] })}
                        dateFormat="yy-mm-dd"
                    />
                );
            }
            return (
                <InputText
                    value={rowData[field]}
                    onChange={(e) => editarPago(rowData.id, { [field]: e.target.value })}
                />
            );
        }
        // Mostrar el valor actual como texto para otros usuarios
        return <span>{rowData[field]}</span>;
    };

    useEffect(() => {
        obtenerPagosPendientes();
    }, []);

    return (
        <div>
            <Toast ref={toast} />
            <h2>Pagos Pendientes</h2>
            {userEmail === "coord_nac_rrhh@example.com" && (
                <Button label="Agregar Nuevo Pago" icon="pi pi-plus" className="p-mb-3" onClick={agregarPago} />
            )}
            <DataTable value={pagos} loading={loading} responsiveLayout="scroll" dataKey="id">
                <Column field="usuario" header="Usuario" body={editableTemplate("usuario")} />
                <Column field="concepto" header="Concepto" body={editableTemplate("concepto", conceptos)} />
                <Column field="monto" header="Monto" body={editableTemplate("monto")} />
                <Column field="estatus" header="Estatus" body={estatusTemplate} />
                <Column field="fecha_pago" header="Fecha de Pago" body={editableTemplate("fecha_pago")} />
                <Column header="Confirmación LEC" body={confirmacionTemplate} />
            </DataTable>
        </div>
    );
};

export default MostrarPagosPendientes;
