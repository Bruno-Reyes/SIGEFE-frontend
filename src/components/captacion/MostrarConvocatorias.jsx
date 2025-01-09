import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

const MostrarConvocatorias = ({ convocatorias }) => {
    return (
        <div
            style={{
                height: '70vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                boxSizing: 'border-box',
            }}
        >
            <Toast /> {/* Componente para notificaciones (en este caso, opcional si no se usa) */}
            <h1 style={{ marginBottom: '16px' }}>Convocatorias</h1>

            {/* Componente DataTable para mostrar las convocatorias */}
            <DataTable
                value={convocatorias} // Recibe las convocatorias como prop
                responsiveLayout="scroll"
                scrollable
                scrollHeight="flex"
                style={{ flex: 1 }}
            >
                <Column field="lugar_convocatoria" header="Lugar de la convocatoria" sortable />
                <Column field="fecha_limite_registro" header="Fecha límite de registro" sortable />
                <Column field="fecha_entrega_resultados" header="Fecha de entrega de resultados" sortable />
                <Column field="max_participantes" header="Máximo de participantes" sortable />
            </DataTable>
        </div>
    );
};

export default MostrarConvocatorias;
