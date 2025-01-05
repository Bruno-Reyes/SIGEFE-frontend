import React from 'react';
import { useLocation } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const DetalleCandidato = () => {

  const location = useLocation();
  const candidato = location.state?.candidato;

  if (!candidato) {
    return <p>No hay datos para mostrar</p>;
  }

  // Filtrar campos que no deseas mostrar
  const { id, usuario, ...candidatoFiltrado } = candidato;

  const data = Object.entries(candidatoFiltrado).map(([key, value]) => ({
    campo: key,
    valor: value,
  }));

  return (
    <div style={{ padding: '16px' }}>
      <DataTable value={data} responsiveLayout="scroll" header = "Detalle del Candidato">
        <Column field="campo" header="Campo" />
        <Column field="valor" header="Valor" />
      </DataTable>
    </div>
  );

};

export default DetalleCandidato;

