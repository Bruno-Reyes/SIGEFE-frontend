import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const DetalleCandidato = () => {
<<<<<<< HEAD

  const location = useLocation();
  const candidato = location.state?.candidato;
=======
    const location = useLocation();
    const navigate = useNavigate();
    const candidato = location.state?.candidato;
>>>>>>> 2362d67e4e0b9bb309d97ba44a4ed7afa77ab9f9

  if (!candidato) {
    return <p>No hay datos para mostrar</p>;
  }

<<<<<<< HEAD
  // Filtrar campos que no deseas mostrar
  const { id, usuario, ...candidatoFiltrado } = candidato;
=======
    const handleBack = () => {
        navigate('/candidatos');
    };

    // Filtrar campos que no deseas mostrar
    const { id, usuario, ...candidatoFiltrado } = candidato;
>>>>>>> 2362d67e4e0b9bb309d97ba44a4ed7afa77ab9f9

  const data = Object.entries(candidatoFiltrado).map(([key, value]) => ({
    campo: key,
    valor: value,
  }));

<<<<<<< HEAD
  return (
    <div style={{ padding: '16px' }}>
      <DataTable value={data} responsiveLayout="scroll" header = "Detalle del Candidato">
        <Column field="campo" header="Campo" />
        <Column field="valor" header="Valor" />
      </DataTable>
    </div>
  );

=======
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
    );
>>>>>>> 2362d67e4e0b9bb309d97ba44a4ed7afa77ab9f9
};

export default DetalleCandidato;

