// Acceder a los candidatos validos -- backend
import { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { Column } from 'primereact/column'
import { Paginator } from 'primereact/paginator'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog' // Importar ConfirmDialog

export const Candidatos = () => {
  const [convocatorias, setConvocatorias] = useState([])

  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [candidatos, setCandidatos] = useState([])
  const [flag, setFlag] = useState(false)

  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(15)
  const toast = useRef(null)
  const API_URL = import.meta.env.VITE_API_URL
  const token = JSON.parse(localStorage.getItem('access-token'))

  const getConvocatorias = async () => {
    const response = await fetch(`${API_URL}/captacion/consultar-convocatorias/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
    )
    const data = await response.json()
    setConvocatorias(data)
    
  }

  const postData = async () => {
    const { id } = convocatorias.find(element => element.lugar_convocatoria === selectedConvocatoria)
    const response = await fetch(`${API_URL}/captacion/consultar-inscritos-validos/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "id_convocatoria": id }),
    }
    )
    const data = await response.json()
    const nuevosDatos = data.candidatos.map(item => {
      return {
        ...item.usuario,
        inscripcion_id: item.inscripcion_id
      };
    });
    setCandidatos(nuevosDatos);
  }

  useEffect(() => {
    getConvocatorias()
  }, [])

  const ciudades = []
  convocatorias.map(convocatoria => {
    ciudades.push(convocatoria.lugar_convocatoria)
  })

  const handleAction = async (id, action) => {
    try {
      await fetch(`${API_URL}/captacion/cambiar-aceptacion/${id}/${action}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      setFlag(!flag)
      toast.current.show({
        severity: action === 'aceptar' ? 'success' : 'warn',
        summary: `Candidato ${action === 'aceptar' ? 'Aceptado' : 'Rechazado'}`,
        detail: `El candidato ha sido ${action === 'aceptar' ? 'aceptado' : 'rechazado'}.`,
        life: 3000,
      })
      // Llamar a postData para actualizar la tabla
      postData();
    } catch (error) {
      console.error(`Error al ${action} al candidato:`, error)
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: `Hubo un problema al ${action} al candidato.`,
        life: 3000,
      })
    }
  }

  const confirmAction = (id, action) => {
    confirmDialog({
      message: `¿Estás seguro de que deseas ${action === 'aceptar' ? 'Aceptar' : 'Rechazar'} al candidato?`,
      header: `${action === 'aceptar' ? 'Aceptar' : 'Rechazar'} Candidato`,
      icon: `pi ${action === 'aceptar' ? 'pi-check-circle' : 'pi-times-circle'}`,
      acceptClassName: action === 'aceptar' ? 'p-button-success' : 'p-button-danger',
      accept: () => handleAction(id, action),
      reject: () => {
        toast.current.show({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'No se realizó ninguna acción.',
          life: 2000,
        })
      },
    })
  }

  const actionBodyTemplate = (rowData) => (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button
        label="Aceptar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => confirmAction(rowData.inscripcion_id, 'aceptar')}
      />
      <Button
        label="Rechazar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => confirmAction(rowData.inscripcion_id, 'rechazar')}
      />
    </div>
  )

  const viewButtonTemplate = (rowData) => (
    <Button
      icon="pi pi-pen-to-square"
      className="p-button-info"
      onClick={() => {
        const candidato = candidatos.find((candidato) => candidato.id === rowData.id)
        navigate(`/detalle/${rowData.id}`, { state: { candidato } })
      }}
    />
  )

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }
  const paginatedCandidatos = candidatos.slice(first, first + rows)

  return (
    <>
      <Toast ref={toast} />
      <h1>Aceptación de candidatos en convocatorias</h1>
      <div className="card flex justify-content-center" style={{ marginTop: '1%', marginBottom: '1%' }}>
        <Dropdown
          value={selectedConvocatoria}
          onChange={(e) => setSelectedConvocatoria(e.value)}
          options={ciudades}
          optionLabel="name"
          placeholder="Selecciona una convocatoria"
          className="w-full md:w-14rem"
          checkmark={true}
          highlightOnSelect={false}
        />
        <Button
          label="Buscar"
          icon="pi pi-search"
          onClick={postData}
          className="p-button-rounded p-button-success"
          style={{ marginLeft: '1%' }}
        />
      </div>
      <ConfirmDialog />
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
        totalRecords={candidatos.length}
        rowsPerPageOptions={[15, 30, 45]}
        onPageChange={onPageChange}
      />
    </>
  )
}
