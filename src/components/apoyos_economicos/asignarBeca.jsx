import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './MainView.css';

const Becas = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isBulkDialogVisible, setIsBulkDialogVisible] = useState(false);
  const [tiposBecas, setTiposBecas] = useState([]);

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
      // Realizar las tres peticiones en paralelo
      const [usersResponse, detailsResponse, scholarshipsResponse] = await Promise.all([
        axios.get(`${apiUrl}/auth/lec/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiUrl}/captacion/lecs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiUrl}/pagos/lideres-lec-con-becas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = usersResponse.data;
      const detailsData = detailsResponse.data;
      const scholarshipsData = scholarshipsResponse.data;

      // Combinar los datos usando el ID del usuario como clave común
      const combinedData = usersData.map((user) => {
        const userDetails = detailsData.find((detail) => detail.usuario === user.id) || {};
        const userScholarship = scholarshipsData.find((scholarship) => scholarship.usuario === user.id) || null;

        return {
          id: user.id,
          name: `${userDetails.nombres || ''} ${userDetails.apellido_paterno || ''} ${userDetails.apellido_materno || ''}`.trim(),
          email: user.email,
          status: userScholarship ? userScholarship.tipo_beca.tipo : 'Sin asignar',
          acceptanceState: userDetails.estado_aceptacion || 'Pendiente',
          state: userDetails.estado || 'N/A',
          municipality: userDetails.municipio || 'N/A',
        };
      });

      setUsers(combinedData);
      console.log('Usuarios combinados:', combinedData);
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
        console.log('Tipos de becas:', mappedScholarships);
      } catch (error) {
        console.error('Error al obtener tipos de becas:', error);
      }
    };

    fetchTiposBecas();
    fetchCombinedUsers();
  }, [token]);

  const filteredUsers = users.filter((user) => {
    return (
      (!selectedState || user.state === selectedState) &&
      (!selectedMunicipality || user.municipality === selectedMunicipality)
    );
  });

  const openAssignDialog = (user) => {
    setSelectedUser(user);
    setIsDialogVisible(true);
  };

  const assignScholarship = async () => {
    try {
      await axios.post(
        `${apiUrl}/pagos/asignar-beca/`,
        {
          tipo_beca: tiposBecas.find((beca) => beca.tipo === selectedScholarship)?.id,
          usuario: selectedUser.id,
          estatus: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsDialogVisible(false);
      setSelectedScholarship(null);
      fetchCombinedUsers(); // Recarga los usuarios combinados
    } catch (error) {
      console.error('Error al asignar la beca:', error);
    }
  };

  const openBulkAssignDialog = () => {
    setIsBulkDialogVisible(true);
  };

  const assignScholarshipToGroup = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.state === selectedState && user.municipality === selectedMunicipality
          ? { ...user, status: selectedScholarship }
          : user
      )
    );
    setIsBulkDialogVisible(false);
    setSelectedScholarship(null);
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="actions">
        <button className="btn-action" onClick={() => openAssignDialog(rowData)}>Asignar beca</button>
        <button className="btn-action">Consultar</button>
      </div>
    );
  };

  const clearFilter = () => {
    setSelectedState(null);
    setSelectedMunicipality(null);
  };

  const uniqueStates = [...new Set(users.map((user) => user.state))].filter((state) => state !== 'N/A');
  const uniqueMunicipalities = [...new Set(users.map((user) => user.municipality))].filter((municipality) => municipality !== 'N/A');

  return (
    <div className="container mt-4 gov-mx-style">
      <header className="text-center mb-4">
        <h1>Gestión de Líderes Educativos</h1>
        <p className="lead">Administración de becas para líderes de educación comunitaria</p>
      </header>

      <main>
        <div className="mb-3">
          <label htmlFor="state-filter" className="form-label">Filtrar por Estado y Municipio:</label>
          <div className="d-flex align-items-center gap-2">
            <Dropdown
              id="state-filter"
              value={selectedState}
              options={uniqueStates}
              onChange={(e) => setSelectedState(e.value)}
              placeholder="Selecciona un estado"
              className="w-100"
            />
            <Dropdown
              id="municipality-filter"
              value={selectedMunicipality}
              options={uniqueMunicipalities}
              onChange={(e) => setSelectedMunicipality(e.value)}
              placeholder="Selecciona un municipio"
              className="w-100"
            />
            <button className="btn btn-secondary" onClick={clearFilter}>Limpiar Filtro</button>
            {selectedState && selectedMunicipality && (
              <button className="btn btn-primary" onClick={openBulkAssignDialog}>Asignar Beca a Grupo</button>
            )}
          </div>
        </div>

        <DataTable value={filteredUsers} className="p-datatable-striped">
          <Column field="id" header="ID" sortable></Column>
          <Column field="name" header="Nombre" sortable></Column>
          <Column field="email" header="Email" sortable></Column>
          <Column field="acceptanceState" header="Estado de Aceptación" sortable></Column>
          <Column field="state" header="Estado" sortable></Column>
          <Column field="municipality" header="Municipio" sortable></Column>
          <Column field="status" header="Tipo de Beca" sortable></Column>
          <Column header="Opciones" body={actionTemplate}></Column>
        </DataTable>
      </main>

      <Dialog
        header="Asignar Beca"
        visible={isDialogVisible}
        style={{ width: '30vw' }}
        onHide={() => setIsDialogVisible(false)}
        footer={
          <div>
            <button className="btn btn-primary" onClick={assignScholarship} disabled={!selectedScholarship}>Aceptar</button>
            <button className="btn btn-secondary" onClick={() => setIsDialogVisible(false)}>Cancelar</button>
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
            <button className="btn btn-primary" onClick={assignScholarshipToGroup} disabled={!selectedScholarship}>Aceptar</button>
            <button className="btn btn-secondary" onClick={() => setIsBulkDialogVisible(false)}>Cancelar</button>
          </div>
        }
      >
        <p>Seleccione el tipo de beca para el grupo de "{selectedState} - {selectedMunicipality}"</p>
        <Dropdown
          value={selectedScholarship}
          options={tiposBecas.map((beca) => beca.tipo)}
          onChange={(e) => setSelectedScholarship(e.value)}
          placeholder="Selecciona una beca"
          className="w-100"
        />
      </Dialog>

      <footer className="text-center mt-4">
        <p>&copy; 2024 Administración Pública. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Becas;
