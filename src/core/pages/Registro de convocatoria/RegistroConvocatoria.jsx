import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

export const RegistroConvocatoria = () => {
  const [formValues, setFormValues] = useState({
    nombreConvocatoria: '',
    fechaRegistro: null,
    fechaEntregaResultados: null,
    maxParticipantes: null
  });

  const handleInputChange = (e, field) => {
    setFormValues({ ...formValues, [field]: e.target ? e.target.value : e.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar el formulario (ej. API)
    console.log('Datos de la convocatoria:', formValues);
  };

  return (
    <div className="p-d-flex p-flex-column p-ai-center p-mt-4">
      <div className="p-card p-p-4 p-shadow-3 p-mb-4" style={{ width: '50%' }}>
        <h2>Registro de Convocatoria CONAFE</h2>

        <Divider />
        
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="p-field p-grid p-my-2">
            <label htmlFor="nombreConvocatoria" className="p-col-12 p-md-4">Nombre de la Convocatoria</label>
            <div className="p-col-12 p-md-8">
              <InputText
                id="nombreConvocatoria"
                value={formValues.nombreConvocatoria}
                onChange={(e) => handleInputChange(e, 'nombreConvocatoria')}
                placeholder="Ingresa el nombre de la convocatoria"
                required
              />
            </div>
          </div>

          <div className="p-field p-grid p-my-2">
            <label htmlFor="fechaRegistro" className="p-col-12 p-md-4">Fecha de Registro</label>
            <div className="p-col-12 p-md-8">
              <Calendar
                id="fechaRegistro"
                value={formValues.fechaRegistro}
                onChange={(e) => handleInputChange(e, 'fechaRegistro')}
                placeholder="Selecciona la fecha de registro"
                dateFormat="dd/mm/yy"
                showIcon
                required
              />
            </div>
          </div>

          <div className="p-field p-grid p-my-2">
            <label htmlFor="fechaEntregaResultados" className="p-col-12 p-md-4">Fecha de Entrega de Resultados</label>
            <div className="p-col-12 p-md-8">
              <Calendar
                id="fechaEntregaResultados"
                value={formValues.fechaEntregaResultados}
                onChange={(e) => handleInputChange(e, 'fechaEntregaResultados')}
                placeholder="Selecciona la fecha de entrega de resultados"
                dateFormat="dd/mm/yy"
                showIcon
                required
              />
            </div>
          </div>

          <div className="p-field p-grid p-my-2">
            <label htmlFor="maxParticipantes" className="p-col-12 p-md-4">Cantidad Máxima de Participantes</label>
            <div className="p-col-12 p-md-8">
              <InputNumber
                id="maxParticipantes"
                value={formValues.maxParticipantes}
                onValueChange={(e) => handleInputChange(e, 'maxParticipantes')}
                placeholder="Ingresa la cantidad máxima de participantes"
                required
                min={1}
              />
            </div>
          </div>

          <div className="p-d-flex p-jc-end p-mt-4">
            <Button label="Registrar Convocatoria" icon="pi pi-check" className="p-button-success" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

