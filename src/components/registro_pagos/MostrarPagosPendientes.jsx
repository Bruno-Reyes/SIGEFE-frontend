import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog"; 
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
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
  const [newPaymentDialog, setNewPaymentDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
    usuario: '',
    monto: '',
    estatus: 'pendiente',
  });
  const [usuariosConBecas, setUsuariosConBecas] = useState([]);
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

  const conceptos = [
    { label: "Beca", value: "Beca" },
    { label: "Seguimiento", value: "Seguimiento" },
    { label: "Continuación", value: "Continuación" }
  ];

const montoTemplate = (rowData) => {
  // Deshabilitar edición si la confirmación LEC es "recibido"
  if (rowData.confirmacion_lec === "recibido") {
    return <span>${parseFloat(rowData.monto).toFixed(2)}</span>;
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

  const agregarPago = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('access-token'));
      await axios.post(`${apiUrl}/pagos/registrar/`, newPayment, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.current.show({
        severity: 'success',
        summary: 'Pago Registrado',
        detail: 'El nuevo pago ha sido registrado con éxito',
        life: 3000,
      });
  
      setNewPaymentDialog(false);
      obtenerPagosPendientes();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo registrar el pago',
        life: 3000,
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

  const confirmarActualizacionDirecta = async (pago, nuevaConfirmacion) => {
    try {
      const token = JSON.parse(localStorage.getItem("access-token"));
      const endpoint = nuevaConfirmacion === "recibido"
        ? `${apiUrl}/pagos/confirmar/${pago.id}/`
        : `${apiUrl}/pagos/rechazar/${pago.id}/`;
  
      await axios.patch(endpoint, {}, {  // Enviamos un objeto vacío ya que el backend no necesita datos adicionales
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.current.show({
        severity: "success",
        summary: "Confirmación Actualizada",
        detail: "La confirmación ha sido actualizada con éxito.",
        life: 3000,
      });
  
      obtenerPagosPendientes();
    } catch (error) {
      console.error('Error al actualizar confirmación:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.error || "No se pudo actualizar la confirmación.",
        life: 3000,
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
    // Validación: Mostrar solo texto si el usuario es coord_nac_rrhh@example.com o dep_finanzas@example.com
    if (userEmail === "coord_nac_rrhh@example.com" || userEmail === "dep_finanzas@example.com") {
      return <span>{rowData.confirmacion_lec || "Sin Confirmación"}</span>;
    }
  
    // Validación: Si el valor es "Recibido", mostrar solo texto y bloquear edición
    if (rowData.confirmacion_lec === "recibido") {
      return <span>{rowData.confirmacion_lec}</span>;
    }
  
    // Mostrar Dropdown solo si el usuario tiene permisos y el valor no es "Recibido"
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
  
    // Mostrar el valor como texto si no se cumplen las condiciones anteriores
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
        
        // Configurar el título y estilo
        doc.setFontSize(16);
        doc.text('Reporte de Pagos Pendientes', 14, 20);
        doc.setFontSize(12);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

        // Crear una tabla en el PDF con los datos de la tabla
        doc.autoTable({
            startY: 40,
            head: [['Usuario', 'Concepto', 'Monto', 'Estatus', 'Fecha de Pago', 'Confirmación']],
            body: pagos.map(pago => [
                pago.nombre_usuario,  // Usar nombre_usuario en lugar de usuario
                pago.concepto,
                `$${parseFloat(pago.monto).toFixed(2)}`,
                pago.estatus,
                new Date(pago.fecha_pago).toLocaleDateString(),
                pago.confirmacion_lec || 'Sin confirmar'
            ]),
            styles: {
                fontSize: 10,
                cellPadding: 3,
                halign: 'left'
            },
            headStyles: {
                fillColor: [40, 84, 11]
            }
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
      <h2>Historial de Pagos</h2>

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
          message={`¿Estás seguro de actualizar la confirmación a "Recibido"? Esta acción no se podrá deshacer.`}
          header="Confirmar Actualización"
          icon="pi pi-exclamation-triangle"
          accept={() => confirmarActualizacionDirecta(selectedPago, selectedPago.confirmacion_lec)}
          reject={() => setShowConfirmDialog(false)}
        />
        <Dialog
          header="Agregar Nuevo Pago"
          visible={newPaymentDialog}
          style={{ width: '50vw' }}
          onHide={() => setNewPaymentDialog(false)}
          footer={
            <div>
              <Button label="Cancelar" icon="pi pi-times" onClick={() => setNewPaymentDialog(false)} />
              <Button label="Guardar" icon="pi pi-check" onClick={agregarPago} />
            </div>
          }
        >
  <div className="p-fluid">
    <div className="p-field">
      <label htmlFor="usuario">Usuario</label>
      <Dropdown
        id="usuario"
        value={newPayment.usuario}
        options={usuariosConBecas
          .filter(u => u.nombre_completo && u.nombre_completo.trim() !== '')
          .map((u) => ({
            label: `${u.nombre_completo} - ${u.tipo_beca?.tipo || 'Sin beca'}`,
            value: u.usuario
          }))}
        onChange={(e) => {
          const selectedUser = usuariosConBecas.find((u) => u.usuario === e.value);
          setNewPayment({
            ...newPayment,
            usuario: e.value,
            concepto: selectedUser?.tipo_beca?.tipo || ''
          });
        }}
        placeholder="Seleccionar Usuario"
        filter={true}
        filterBy="label"
      />
    </div>
    <div className="p-field">
      <label htmlFor="monto">Monto</label>
      <InputNumber
        id="monto"
        value={newPayment.monto}
        onValueChange={(e) => setNewPayment({ ...newPayment, monto: e.value })}
        mode="currency"
        currency="USD"
        locale="en-US"
        minFractionDigits={2}
      />
    </div>
  </div>
</Dialog>


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

      <DataTable 
        value={pagos} 
        loading={loading} 
        responsiveLayout="scroll" 
        dataKey="id"
        paginator 
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
      >
        <Column field="nombre_usuario" header="Usuario" sortable />
        <Column field="concepto" header="Concepto" sortable />
        <Column field="monto" header="Monto" body={montoTemplate} sortable />
        <Column field="fecha_pago" header="Fecha de Pago" sortable />
        <Column field="confirmacion_lec" header="Confirmación LEC" body={confirmacionTemplate} />
      </DataTable>
    </div>
  );
};

export default MostrarPagosPendientes;
