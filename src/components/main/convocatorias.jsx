import React from 'react';
import RegistroConvocatoria from '../captacion/RegistroConvocatoria';
import MostrarConvocatorias from '../captacion/MostrarConvocatorias';

const Convocatorias = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, marginRight: '10px' }}>
                <RegistroConvocatoria />
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>
                <MostrarConvocatorias />
            </div>
        </div>
    );
};

export default Convocatorias;