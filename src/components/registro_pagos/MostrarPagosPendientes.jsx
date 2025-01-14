import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog"; 
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import "./PagosView.css";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const apiUrl = import.meta.env.VITE_API_URL;

const MostrarPagosPendientes = () => {
  // Estados
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPago, setSelectedPago] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const toast = useRef(null);

  // Obtener información del usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const userEmail = localStorage.getItem("email");

  // Validaciones basadas en el correo electrónico
  const puedeEditar = true;//userEmail === "coord_nac_rrhh@example.com" || userEmail === "dep_finanzas@example.com";

  const estadosConfirmacion = [
    { label: "Recibido", value: "recibido" },
    { label: "No Recibido", value: "no_recibido" }
  ];

  // Opciones de estados y conceptos
  const estados = [
    { label: "Pendiente", value: "pendiente" },
    { label: "Pagado", value: "pagado" },
    { label: "Fallido", value: "fallido" }
  ];

//TODO: Bloquear cuando el valor de confirmación pase a recibido

  const conceptos = [
    { label: "Beca", value: "Beca" },
    { label: "Seguimiento", value: "Seguimiento" },
    { label: "Continuación", value: "Continuación" }
  ];

  // Función para actualizar el monto del pago
  
  const actualizarMonto = async (pagoId, nuevoMonto) => {
    try {
        // Convertir el monto a número y asegurarnos de que no sea NaN
        const montoNumerico = parseFloat(nuevoMonto);
        if (isNaN(montoNumerico)) {
            toast.current.show({
                severity: "warn",
                summary: "Monto inválido",
                detail: "Por favor ingrese un número válido.",
                life: 3000,
            });
            return;
        }

        // Obtener el token de autenticación
        const token = JSON.parse(localStorage.getItem("access-token"));

        // Hacer la solicitud PATCH al backend
        await axios.patch(`${apiUrl}/pagos/actualizar-monto/${pagoId}/`, 
        { monto: montoNumerico }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Actualizar el estado de los pagos en la tabla
        setPagos((prevPagos) =>
            prevPagos.map((pago) =>
                pago.id === pagoId ? { ...pago, monto: montoNumerico } : pago
            )
        );

        // Mostrar mensaje de éxito
        toast.current.show({
            severity: "success",
            summary: "Monto Actualizado",
            detail: "El monto del pago ha sido actualizado con éxito.",
            life: 3000,
        });
    } catch (error) {
        // Manejo de errores
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo actualizar el monto del pago.",
            life: 3000,
        });
    }
};


const montoTemplate = (rowData) => {
    if (userEmail === "coord_nac_rrhh@example.com" || userEmail === "dep_finanzas@example.com") {
        return (
            <InputNumber
                value={rowData.monto}
                onValueChange={(e) => actualizarMonto(rowData.id, e.value)}
                mode="currency"
                currency="USD"
                locale="en-US"
                minFractionDigits={2}
            />
        );
    }
    return <span>${parseFloat(rowData.monto).toFixed(2)}</span>;
};

  // Función para obtener pagos pendientes
  const obtenerPagosPendientes = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("access-token"));
      const response = await axios.get(`${apiUrl}/pagos/pendientes/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPagos(response.data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los pagos pendientes.",
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un nuevo pago
  const agregarPago = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("access-token"));
      const nuevoPago = {
        usuario: usuario.id,
        concepto: "Beca",
        monto: 4123.5,
        estatus: "pendiente"
      };
      const response = await axios.post(`${apiUrl}/pagos/registrar/`, nuevoPago, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPagos((prevPagos) => [...prevPagos, response.data]);
      toast.current.show({
        severity: "success",
        summary: "Pago agregado",
        detail: "El pago ha sido registrado con éxito.",
        life: 3000
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo registrar el pago.",
        life: 3000
      });
    }
  };

  // Función para eliminar un pago
  const eliminarPago = async (pagoId) => {
    try {
      const token = JSON.parse(localStorage.getItem("access-token"));
      await axios.delete(`${apiUrl}/pagos/eliminar/${pagoId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPagos((prevPagos) => prevPagos.filter((pago) => pago.id !== pagoId));
      toast.current.show({
        severity: "success",
        summary: "Pago eliminado",
        detail: "El pago ha sido eliminado con éxito.",
        life: 3000
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el pago.",
        life: 3000
      });
    }
  };

  // Función para renderizar los botones de acción
  const actionTemplate = (rowData) => {
    if (puedeEditar) {
      return (
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => eliminarPago(rowData.id)}
          tooltip="Eliminar"
        />
      );
    }
    return <span>Acción no permitida</span>;
  };

  // Función para confirmar la acción del usuario
  const confirmarActualizacion = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("access-token"));
      const endpoint = selectedPago.confirmacion_lec === "recibido" ? `${apiUrl}/pagos/confirmar/${selectedPago.id}/` : `${apiUrl}/pagos/rechazar/${selectedPago.id}/`;

      await axios.patch(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.current.show({
        severity: "success",
        summary: "Confirmación Actualizada",
        detail: "La confirmación ha sido actualizada con éxito.",
        life: 3000
      });
      obtenerPagosPendientes();
      setShowConfirmDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar la confirmación.",
        life: 3000
      });
    }
  };

  // Función para manejar la selección en el Dropdown
  const handleConfirmacionChange = (pago, nuevaConfirmacion) => {
    setSelectedPago({ ...pago, confirmacion_lec: nuevaConfirmacion });
    setShowConfirmDialog(true);
  };

  // Función para renderizar la columna de Confirmación LEC
  const confirmacionTemplate = (rowData) => {
    if (puedeEditar) {
      return (
        <Dropdown
          value={rowData.confirmacion_lec}
          options={estadosConfirmacion}
          onChange={(e) => handleConfirmacionChange(rowData, e.value)}
          placeholder="Seleccionar"
        />
      );
    }
    return <span>{rowData.confirmacion_lec || "Sin Confirmación"}</span>;
  };

  // Función para exportar a Excel
    const exportarAExcel = () => {
        const nombreArchivo = "PagosPendientes.xlsx";
        
        // Crear una hoja de cálculo con los datos de la tabla
        const hojaDeCalculo = XLSX.utils.json_to_sheet(pagos);

        // Crear el libro de Excel
        const libroDeExcel = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libroDeExcel, hojaDeCalculo, "Pagos");

        // Guardar el archivo
        XLSX.writeFile(libroDeExcel, nombreArchivo);
    };

    // Función para exportar a PDF
    const exportarAPDF = () => {
        const doc = new jsPDF();

        // Crear una tabla en el PDF con los datos de la tabla
        doc.autoTable({
            head: [['Usuario', 'Concepto', 'Monto', 'Estatus', 'Fecha de Pago']],
            body: pagos.map(pago => [
                pago.usuario,
                pago.concepto,
                `$${parseFloat(pago.monto).toFixed(2)}`,
                pago.estatus,
                pago.fecha_pago
            ]),
        });

        // Guardar el archivo PDF
        doc.save('PagosPendientes.pdf');
    };

  // Obtener pagos pendientes al cargar la vista
  useEffect(() => {
    obtenerPagosPendientes();
  }, []);

  return (
    <div className="pagos-view">
      <Toast ref={toast} />
      <h2>Pagos Pendientes</h2>

      <div className="export-buttons">
            <Button
                label="Exportar a Excel"
                icon="pi pi-file-excel"
                className="p-button-success"
                onClick={exportarAExcel}
            />
            <Button
                label="Exportar a PDF"
                icon="pi pi-file-pdf"
                className="p-button-danger"
                onClick={exportarAPDF}
            />
        </div>

      <ConfirmDialog
        visible={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        message={`¿Estás seguro de actualizar la confirmación a "${selectedPago?.confirmacion_lec}"?`}
        header="Confirmar Actualización"
        icon="pi pi-exclamation-triangle"
        accept={confirmarActualizacion}
        reject={() => setShowConfirmDialog(false)}
      />

      <div className="summary-cards">
        <Card title="Total Pagos" className="p-shadow-2">
          <p>{pagos.length}</p>
        </Card>
        <Card title="Pendientes" className="p-shadow-2">
          <p>{pagos.filter((pago) => pago.confirmacion_lec === "no_recibido").length}</p>
        </Card>
        <Card title="Confirmado" className="p-shadow-2">
          <p>{pagos.filter((pago) => pago.confirmacion_lec === "recibido").length}</p>
        </Card>
      </div>

      {puedeEditar && (
        <Button label="Agregar Pago" icon="pi pi-plus" onClick={agregarPago} />
      )}

      <DataTable value={pagos} loading={loading} responsiveLayout="scroll" dataKey="id">
        <Column field="usuario" header="Usuario" sortable />
        <Column field="concepto" header="Concepto" sortable />
        <Column field="monto" header="Monto" body={montoTemplate} sortable />
        <Column field="estatus" header="Estatus" sortable />
        <Column field="fecha_pago" header="Fecha de Pago" sortable />
        <Column field="confirmacion_lec" header="Confirmación LEC" body={confirmacionTemplate} />
      </DataTable>
    </div>
  );
};

export default MostrarPagosPendientes;
