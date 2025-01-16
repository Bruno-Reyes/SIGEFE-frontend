import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './MainView.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Becas = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [curpSearch, setCurpSearch] = useState('');
  const [selectedScholarshipFilter, setSelectedScholarshipFilter] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isBulkDialogVisible, setIsBulkDialogVisible] = useState(false)
  const [tiposBecas, setTiposBecas] = useState([]);
  const navigate = useNavigate();
  const toast = useRef(null);

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

  let token = JSON.parse(localStorage.getItem('access-token'));
  if (!token) {
    token = refreshToken();
  }

  const fetchCombinedUsers = async () => {
    try {
      const [usersResponse, detailsResponse, scholarshipsResponse] = await Promise.all([
        axios.get(`${apiUrl}/auth/lec/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/captacion/lecs`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/pagos/lideres-lec-con-becas`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const usersData = usersResponse.data;
      const detailsData = detailsResponse.data;
      const scholarshipsData = scholarshipsResponse.data;

      const combinedData = usersData.map((user) => {
        const userDetails = detailsData.find((detail) => detail.usuario === user.id) || {};
        const userScholarship = scholarshipsData.find((scholarship) => scholarship.usuario === user.id) || null;

        return {
          id: user.id,
          name: `${userDetails.nombres || ''} ${userDetails.apellido_paterno || ''} ${userDetails.apellido_materno || ''}`.trim(),
          email: user.email,
          curp: userDetails.curp || 'N/A',
          status: userScholarship ? userScholarship.tipo_beca.tipo : 'Sin asignar',
          acceptanceState: userDetails.estado_aceptacion || 'Pendiente',
          state: userDetails.estado || 'N/A',
          municipality: userDetails.municipio || 'N/A',
        };
      });

      setUsers(combinedData);
    } catch (error) {
      console.error('Error al obtener datos combinados:', error);
    }
  };

  useEffect(() => {
    const fetchTiposBecas = async () => {
      try {
        const response = await axios.get(`${apiUrl}/pagos/tipos_becas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mappedScholarships = response.data.map((item) => ({ id: item.id, tipo: item.tipo }));
        setTiposBecas(mappedScholarships);
      } catch (error) {
        console.error('Error al obtener tipos de becas:', error);
      }
    };

    fetchTiposBecas();
    fetchCombinedUsers();
  }, [token]);

  const filteredUsers = users.filter((user) => {
    const curpMatch = curpSearch === '' || user.curp.toLowerCase().includes(curpSearch.toLowerCase());
    const stateMatch = !selectedState || user.state === selectedState;
    const municipalityMatch = !selectedMunicipality || user.municipality === selectedMunicipality;
    const scholarshipMatch = !selectedScholarshipFilter || user.status === selectedScholarshipFilter;

    return curpMatch && stateMatch && municipalityMatch && scholarshipMatch;
  });

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToPdf = (data, fileName) => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Nombre', 'Email', 'CURP', 'Estado de Aceptación', 'Estado', 'Municipio', 'Tipo de Beca']],
      body: data.map((item) => [
        item.id,
        item.name,
        item.email,
        item.curp,
        item.acceptanceState,
        item.state,
        item.municipality,
        item.status,
      ]),
    });
    doc.save(`${fileName}.pdf`);
  };

  const exportExcel = () => {
    exportToExcel(filteredUsers, 'Becas');
  };

  const exportPdf = () => {
    exportToPdf(filteredUsers, 'Becas');
  };

  const clearFilter = () => {
    setSelectedState(null);
    setSelectedMunicipality(null);
    setCurpSearch('');
    setSelectedScholarshipFilter(null);
  };

  const openAssignDialog = (user) => {
    setSelectedUser(user);
    setIsDialogVisible(true);
  };

  const openBulkAssignDialog = () => {
    setIsBulkDialogVisible(true);
  };

  const handleConsultClick = (rowData) => {
    localStorage.setItem('usuario-to-check-id', rowData.id);
    localStorage.setItem('usuario-to-check-email', rowData.email);
    localStorage.setItem('usuario-to-check-nombre', rowData.name);
    navigate('/usuario');
  };

  const assignScholarship = async () => {
    try {
      // Verificar si el usuario ya tiene una beca asignada
      const currentScholarship = selectedUser.status;
  
      // Obtener el ID del tipo de beca seleccionado
      const selectedScholarshipId = tiposBecas.find((beca) => beca.tipo === selectedScholarship)?.id;
  
      // Validar si ya tiene una beca asignada y si es diferente a la seleccionada
      if (currentScholarship && currentScholarship !== selectedScholarship && currentScholarship !== "Sin asignar") {
        // Si tiene beca y se selecciona una diferente, editar el registro 
        await axios.patch(
          `${apiUrl}/pagos/editar/${selectedUser.id}/`,
          {
            tipo_beca_id: selectedScholarshipId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Beca actualizada exitosamente' });
      } else if (currentScholarship === "Sin asignar") {
        // Si no tiene beca asignada, crear un nuevo registro
        await axios.post(
          `${apiUrl}/pagos/asignar-beca/`,
          {
            tipo_beca: selectedScholarshipId,
            usuario: selectedUser.id,
            estatus: 1,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Beca asignada exitosamente' });
      } else {
        // Si la beca seleccionada es la misma que la actual, no hacer nada
        toast.current.show({ severity: 'info', summary: 'Sin cambios', detail: 'La beca seleccionada ya está asignada.' });
      }
  
      setIsDialogVisible(false);
      fetchCombinedUsers();
    } catch (error) {
      console.error('Error al asignar o editar la beca:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo asignar la beca.' });
    }
  };

  const bulkAssignScholarships = async () => {
    try {
      for (const user of filteredUsers) {
        setSelectedUser(user);
        await assignScholarship();
      }
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Becas asignadas exitosamente' });
      setIsBulkDialogVisible(false);
      fetchCombinedUsers();
    } catch (error) {
      console.error('Error al asignar becas en grupo:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo asignar las becas.' });
    }
  };
  
  return (
    <div className="container mt-4 gov-mx-style">
      <Toast ref={toast} />
      <header className="text-center mb-4">
        <h1>Gestión de Líderes Educativos</h1>
        <p className="lead">Administración de becas para líderes de educación comunitaria</p>
      </header>

      <main>
        <div className="mb-3">
          <label htmlFor="curp-search" className="form-label">Buscar por CURP:</label>
          <InputText
            id="curp-search"
            value={curpSearch}
            onChange={(e) => setCurpSearch(e.target.value)}
            placeholder="Ingresa el CURP"
            className="form-control mb-3"
          />

          <label htmlFor="state-filter" className="form-label">Filtrar por Estado y Municipio:</label>
          <div className="d-flex align-items-center gap-2">
            <Dropdown
              id="state-filter"
              value={selectedState}
              options={[...new Set(users.map((user) => user.state))].filter((state) => state !== 'N/A')}
              onChange={(e) => setSelectedState(e.value)}
              placeholder="Selecciona un estado"
              className="w-100"
            />
            <Dropdown
              id="municipality-filter"
              value={selectedMunicipality}
              options={[...new Set(users.map((user) => user.municipality))].filter((municipality) => municipality !== 'N/A')}
              onChange={(e) => setSelectedMunicipality(e.value)}
              placeholder="Selecciona un municipio"
              className="w-100"
            />
          </div>

          <label htmlFor="scholarship-filter" className="form-label">Filtrar por Tipo de Beca:</label>
          <Dropdown
            id="scholarship-filter"
            value={selectedScholarshipFilter}
            options={tiposBecas.map((beca) => beca.tipo)}
            onChange={(e) => setSelectedScholarshipFilter(e.value)}
            placeholder="Selecciona un tipo de beca"
            className="w-100"
          />

          <button className="btn btn-secondary mt-3" onClick={clearFilter}>Limpiar Filtros</button>
          {filteredUsers.length > 0 && (
            <button className="btn btn-warning mt-3" onClick={openBulkAssignDialog}>
              Asignar Beca a Grupo
            </button>
          )}
          <div className="export-buttons">
            <Button icon="pi pi-file-excel" label="Exportar a Excel" className="p-button-success" onClick={exportExcel} />
            <Button icon="pi pi-file-pdf" label="Exportar a PDF" className="p-button-danger" onClick={exportPdf} />
          </div>
        </div>

        <DataTable value={filteredUsers} className="p-datatable-striped" paginator rows={10}>
          <Column field="id" header="ID" sortable />
          <Column field="name" header="Nombre" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="curp" header="CURP" sortable />
          <Column field="acceptanceState" header="Estado de Aceptación" sortable />
          <Column field="state" header="Estado" sortable />
          <Column field="municipality" header="Municipio" sortable />
          <Column field="status" header="Tipo de Beca" sortable />
          <Column
            header="Opciones"
            body={(rowData) => (
              <div className="actions">
                <Button label="Asignar beca" className="p-button-warning" onClick={() => openAssignDialog(rowData)} />
                <Button label="Consultar" className="p-button-info" onClick={() => handleConsultClick(rowData)} />
              </div>
            )}
          />
        </DataTable>

        <Dialog
          header="Asignar Beca"
          visible={isDialogVisible}
          style={{ width: '30vw' }}
          onHide={() => setIsDialogVisible(false)}
          footer={
            <div>
              <Button
                label="Aceptar"
                icon="pi pi-check"
                onClick={assignScholarship}
                disabled={!selectedScholarship}
              />
              <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={() => setIsDialogVisible(false)}
                className="p-button-secondary"
              />
            </div>
          }
        >
          <p>Seleccione el tipo de beca para {selectedUser?.name}:</p>
          <Dropdown
            value={selectedScholarship}
            options={tiposBecas.map((beca) => beca.tipo)}
            onChange={(e) => setSelectedScholarship(e.value)}
            placeholder="Selecciona una beca"
            className="w-100"
          />
        </Dialog>

        <Dialog
          header="Asignar Beca a Grupo"
          visible={isBulkDialogVisible}
          style={{ width: '30vw' }}
          onHide={() => setIsBulkDialogVisible(false)}
          footer={
            <div>
              <Button
                label="Aceptar"
                icon="pi pi-check"
                onClick={bulkAssignScholarships}
                disabled={!selectedScholarship}
              />
              <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={() => setIsBulkDialogVisible(false)}
                className="p-button-secondary"
              />
            </div>
          }
        >
          <p>Seleccione el tipo de beca para los usuarios filtrados:</p>
          <Dropdown
            value={selectedScholarship}
            options={tiposBecas.map((beca) => beca.tipo)}
            onChange={(e) => setSelectedScholarship(e.value)}
            placeholder="Selecciona una beca"
            className="w-100"
          />
        </Dialog>

      </main>
    </div>
  );
};

export default Becas;
