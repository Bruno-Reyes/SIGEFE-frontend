import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './UserDetailView.css';

const UserDetailView = () => {
  const id = localStorage.getItem('usuario-to-check-id');
  const email = localStorage.getItem('usuario-to-check-email');
  const nombre = localStorage.getItem('usuario-to-check-nombre');
  const [userDetails, setUserDetails] = useState(null);
  const [scholarship, setScholarship] = useState(null);
  const [payments, setPayments] = useState([]);
  const [newPaymentDialog, setNewPaymentDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [newPayment, setNewPayment] = useState({
    usuario: id,
    concepto: '',
    monto: '',
    estatus: 'pendiente',
  });
  const toast = React.useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Función para obtener los detalles del usuario
  const fetchUserDetails = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('access-token'));

      const userResponse = await axios.get(`${apiUrl}/captacion/lec/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const scholarshipResponse = await axios.get(`${apiUrl}/pagos/beca-lec/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserDetails(userResponse.data);

      if (scholarshipResponse.data.length > 0) {
        setScholarship(scholarshipResponse.data[0].tipo_beca);
        setNewPayment((prevPayment) => ({
          ...prevPayment,
          concepto: scholarshipResponse.data[0].tipo_beca.tipo,
        }));
      } else {
        setScholarship(null);
      }
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
    }
  };

  // Función para obtener el historial de pagos
  const fetchUserPayments = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('access-token'));
      const paymentsResponse = await axios.get(`${apiUrl}/pagos/usuario/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayments(paymentsResponse.data);
    } catch (error) {
      console.error('Error al obtener historial de pagos:', error);
    }
  };

  // Función para agregar un nuevo pago
  const agregarPago = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('access-token'));

      const response = await axios.post(`${apiUrl}/pagos/registrar/`, newPayment, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.current.show({ severity: 'success', summary: 'Pago Creado', detail: 'Nuevo pago registrado con éxito', life: 3000 });

      await fetchUserPayments();

      setNewPaymentDialog(false);
      setNewPayment({
        usuario: id,
        concepto: scholarship?.tipo || '',
        monto: '',
        estatus: 'pendiente',
      });
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el pago', life: 3000 });
    }
  };

  const confirmarEliminarPago = (pagoId) => {
    setSelectedPaymentId(pagoId);
    setShowConfirmDialog(true);
  };

  const eliminarPago = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("access-token"));
      await axios.delete(`${apiUrl}/pagos/eliminar/${selectedPaymentId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.current.show({
        severity: "success",
        summary: "Pago Eliminado",
        detail: "El pago ha sido eliminado con éxito",
        life: 3000,
      });
  
      await fetchUserPayments();
      setShowConfirmDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el pago",
        life: 3000,
      });
    }
  };
  
  

  useEffect(() => {
    fetchUserDetails();
    fetchUserPayments();
  }, [id]);

  if (!userDetails) {
    return <p>Cargando detalles del usuario...</p>;
  }

  return (
    <div className="container mt-4 gov-mx-style">
      <header className="text-center mb-4">
        <h1>{nombre}</h1>
      </header>

      <main>
        {/* Información del usuario */}
        <div className="user-details-grid">
            <div>
                <h3>Información Personal</h3>
                <p><strong>CURP:</strong> {userDetails.curp}</p>
                <p><strong>Fecha de Nacimiento:</strong> {userDetails.fecha_nacimiento}</p>
                <p><strong>Género:</strong> {userDetails.genero === 'M' ? 'Masculino' : 'Femenino'}</p>
                <p><strong>Talla de Playera:</strong> {userDetails.talla_playera}</p>
                <p><strong>Talla de Pantalón:</strong> {userDetails.talla_pantalon}</p>
                <p><strong>Talla de Calzado:</strong> {userDetails.talla_calzado}</p>
                <p><strong>Peso:</strong> {userDetails.peso} kg</p>
                <p><strong>Estatura:</strong> {userDetails.estatura} cm</p>
                <p><strong>Afecciones:</strong> {userDetails.afecciones}</p>
            </div>
            <div>
                <h3>Información de Contacto</h3>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Estado:</strong> {userDetails.estado}</p>
                <p><strong>Municipio:</strong> {userDetails.municipio}</p>
                <p><strong>Localidad:</strong> {userDetails.localidad}</p>
                <p><strong>Calle:</strong> {userDetails.calle}</p>
                <p><strong>Número Exterior:</strong> {userDetails.numero_exterior}</p>
                <p><strong>Número Interior:</strong> {userDetails.numero_interior || 'N/A'}</p>
                <p><strong>Estado de Aceptación:</strong> {userDetails.estado_aceptacion}</p>
            </div>
        </div>

        {/* Información de beca */}
        <div className="scholarship-info">
          <h3>Información de Beca</h3>
          <div className="scholarship-card">
            <p><strong>Tipo de Beca Asignada:</strong> {scholarship?.tipo || 'Sin asignar'}</p>
            <p><strong>Monto de la Beca:</strong> ${scholarship?.monto || 'N/A'}</p>
          </div>
        </div>

        {/* Historial de Pagos */}
        <h3 className="mt-4">Historial de Pagos</h3>
        <Button label="Agregar Nuevo Pago" icon="pi pi-plus" className="mb-3" onClick={() => setNewPaymentDialog(true)} />
        <DataTable value={payments} className="p-datatable-striped">
          <Column field="fecha_pago" header="Fecha de Pago" sortable></Column>
          <Column field="concepto" header="Concepto"></Column>
          <Column field="monto" header="Monto"></Column>
          <Column field="confirmacion_lec" header="Confirmación LEC"></Column>
          <Column
            header="Opciones"
            body={(rowData) => (
              <Button
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => confirmarEliminarPago(rowData.id)}
                disabled={rowData.confirmacion_lec === "recibido"}
                tooltip={rowData.confirmacion_lec === "recibido" ? "No se puede eliminar un pago confirmado" : "Eliminar"}
              />
            )}
          />

        </DataTable>

        {/* Diálogo para agregar nuevo pago */}
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
              <label htmlFor="concepto">Concepto</label>
              <InputText id="concepto" value={newPayment.concepto} onChange={(e) => setNewPayment({ ...newPayment, concepto: e.target.value })} disabled />
            </div>
            <div className="p-field">
              <label htmlFor="monto">Monto</label>
              <InputText id="monto" value={newPayment.monto} onChange={(e) => setNewPayment({ ...newPayment, monto: e.target.value })} />
            </div>
          </div>
        </Dialog>

        <ConfirmDialog
          visible={showConfirmDialog}
          onHide={() => setShowConfirmDialog(false)}
          message="¿Estás seguro de que deseas eliminar este pago? Esta acción no se puede deshacer."
          header="Confirmar Eliminación"
          icon="pi pi-exclamation-triangle"
          accept={eliminarPago}
          reject={() => setShowConfirmDialog(false)}
        />

      </main>

      <Toast ref={toast} />

      <footer className="text-center mt-4">
        <p>&copy; 2024 Administración Pública. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default UserDetailView;
