import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const Candidatos = () => {
    const candidatos = [
        { id: 1, nombre: 'Juan', apellidoPaterno: 'Pérez', apellidoMaterno: 'López' },
        { id: 2, nombre: 'María', apellidoPaterno: 'González', apellidoMaterno: 'Ramírez' },
        { id: 3, nombre: 'Carlos', apellidoPaterno: 'Hernández', apellidoMaterno: 'Martínez' },
    ];

    const handleViewRecord = (id) => {
        alert(`Ver registro del candidato con ID: ${id}`);
    };

    const handleAccept = (id) => {
        alert(`Aceptar candidato con ID: ${id}`);
    };

    const handleReject = (id) => {
        alert(`Rechazar candidato con ID: ${id}`);
    };

    const actionBodyTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: '10px' }}>
            <Button
                label="Aceptar"
                icon="pi pi-check"
                className="p-button-success"
                onClick={() => handleAccept(rowData.id)}
            />
            <Button
                label="Rechazar"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={() => handleReject(rowData.id)}
            />
        </div>
    );

    const viewButtonTemplate = (rowData) => (
        <Button
            icon="pi pi-pen-to-square"
            className="p-button-info"
            onClick={() => handleViewRecord(rowData.id)}
        />
    );

    return (
        <div style={{ padding: '16px' }}>
            <DataTable value={candidatos} responsiveLayout="scroll" header = "Candidatos">
                <Column body={viewButtonTemplate} style={{ width: '150px' }} />
                <Column field="nombre" header="Nombre" sortable />
                <Column field="apellidoPaterno" header="Apellido Paterno" sortable />
                <Column field="apellidoMaterno" header="Apellido Materno" sortable />
                <Column body={actionBodyTemplate} header="Opciones" style={{ width: '250px' }} />
            </DataTable>
        </div>
    );
};

export default Candidatos;
