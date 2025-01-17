import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const RegistrarAsistenciaCapacitaciones = () => {
    const [asistentes, setAsistentes] = useState([]);

    const handleRegistrarAsistencia = () => {
        // Lógica para registrar la asistencia
    };

    return (
        <div>
            <h2>Registrar Asistencia a Capacitación</h2>
            <DataTable value={asistentes}>
                <Column field="nombre" header="Nombre" />
                <Column field="asistencia" header="Asistencia" />
            </DataTable>
            <Button label="Registrar Asistencia" onClick={handleRegistrarAsistencia} />
        </div>
    );
};

export default RegistrarAsistenciaCapacitaciones;
