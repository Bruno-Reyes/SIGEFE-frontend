import { useLocation, useNavigate } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

const DetalleCandidato = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const candidato = location.state?.candidato

  if (!candidato) {
    return <p>No hay datos para mostrar</p>
  }

  const handleBack = () => {
    navigate('/candidatos')
  }

  // Filtrar campos que no deseas mostrar
  const { id, usuario, ...candidatoFiltrado } = candidato

  const data = Object.entries(candidatoFiltrado).map(([key, value]) => ({
    campo: key,
    valor: value,
  }))

  return (
    <div style={{ padding: '16px' }}>
      <Button
        label="Regresar"
        icon="pi pi-arrow-left"
        className="p-button-secondary"
        onClick={handleBack}
        style={{ marginBottom: '1rem' }}
      />
      <DataTable value={data} responsiveLayout="scroll" header="Detalle del Candidato">
        <Column field="campo" header="Campo" />
        <Column field="valor" header="Valor" />
      </DataTable>
    </div>
  )
}

export default DetalleCandidato

