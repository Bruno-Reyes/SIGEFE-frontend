import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Checkbox } from 'primereact/checkbox';

export const RegistroCandidato = () => {
  const [formValues, setFormValues] = useState({
    // Información personal
    curp: '', nombres: '', apellidoPaterno: '', apellidoMaterno: '',
    fechaNacimiento: null, genero: '', nacionalidad: '',
    tallaPlayera: '', tallaPantalon: '', tallaCalzado: '', peso: '', estatura: '', edad: '',
    // Datos Bancarios
    banco: '', cuentaBancaria: '', clabe: '',
    // Información de Contacto
    correo: '', telefonoFijo: '', telefonoMovil: '',
    // Educación y Preferencias
    nivelEducativoLEC: '', nivelEducativoServicio: '', gustoCiencia: '', experienciaArte: '',
    interesComunitario: false, razonLEC: '', profesionInteres: '', 
    requisitoTitulacion: false, interesesIncorporacion: '',
    // Dirección
    codigoPostal: '', estado: '', colonia: '', municipio: '', localidad: '',
    calle: '', numeroExterior: '', numeroInterior: '',
    // Preferencias de Participación
    estadoParticipacion: '', cicloEscolar: '', medioInformacion: '', municipioServicio: ''
  });

  const handleInputChange = (e, field) => {
    setFormValues({ ...formValues, [field]: e.target ? e.target.value : e.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del candidato:', formValues);
  };

  return (
    <div className="p-d-flex p-flex-column p-ai-center p-mt-4">
      <div className="p-card p-p-4 p-shadow-3 p-mb-4" style={{ width: '90%' }}>
        <h2>Registro de Candidato</h2>
        <Divider />

        <form onSubmit={handleSubmit} className="p-fluid">

          {/* Información Personal */}
          <h3>Información Personal</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="curp">CURP</label>
              <InputText id="curp" value={formValues.curp} onChange={(e) => handleInputChange(e, 'curp')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nombres">Nombre(s)</label>
              <InputText id="nombres" value={formValues.nombres} onChange={(e) => handleInputChange(e, 'nombres')} required />
            </div>

            {/* Otros campos personales */}
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="apellidoPaterno">Apellido Paterno</label>
              <InputText id="apellidoPaterno" value={formValues.apellidoPaterno} onChange={(e) => handleInputChange(e, 'apellidoPaterno')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="apellidoMaterno">Apellido Materno</label>
              <InputText id="apellidoMaterno" value={formValues.apellidoMaterno} onChange={(e) => handleInputChange(e, 'apellidoMaterno')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <Calendar id="fechaNacimiento" value={formValues.fechaNacimiento} onChange={(e) => handleInputChange(e, 'fechaNacimiento')} showIcon required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="genero">Género</label>
              <Dropdown id="genero" value={formValues.genero} options={[{label: 'Masculino', value: 'M'}, {label: 'Femenino', value: 'F'}]} onChange={(e) => handleInputChange(e, 'genero')} placeholder="Selecciona el género" required />
            </div>
            
            {/* Nacionalidad, Tallas, Peso, etc. */}
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nacionalidad">Nacionalidad</label>
              <InputText id="nacionalidad" value={formValues.nacionalidad} onChange={(e) => handleInputChange(e, 'nacionalidad')} required />
            </div>
            {/* ... (agregar los campos restantes en la misma estructura) */}
          </div>

          {/* Datos Bancarios */}
          <Divider />
          <h3>Datos Bancarios</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="banco">Banco</label>
              <Dropdown id="banco" value={formValues.banco} options={[{label: 'Bancomer', value: 'Bancomer'}, {label: 'Otro', value: 'Otro'}]} onChange={(e) => handleInputChange(e, 'banco')} placeholder="Selecciona el banco" required />
            </div>
            {/* ...Cuenta y CLABE */}
          </div>

          {/* Información de Contacto */}
          <Divider />
          <h3>Información de Contacto</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="correo">Correo Electrónico</label>
              <InputText id="correo" value={formValues.correo} onChange={(e) => handleInputChange(e, 'correo')} required />
            </div>
            {/* Teléfono Fijo y Móvil */}
          </div>

          {/* Educación y Preferencias */}
          <Divider />
          <h3>Educación y Preferencias</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nivelEducativoLEC">Nivel Educativo del LEC</label>
              <InputText id="nivelEducativoLEC" value={formValues.nivelEducativoLEC} onChange={(e) => handleInputChange(e, 'nivelEducativoLEC')} />
            </div>
            {/* Otros campos educativos */}
          </div>

          {/* Dirección */}
          <Divider />
          <h3>Dirección</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="codigoPostal">Código Postal</label>
              <InputText id="codigoPostal" value={formValues.codigoPostal} onChange={(e) => handleInputChange(e, 'codigoPostal')} />
            </div>
            {/* Otros campos de dirección */}
          </div>

          {/* Preferencias de Participación */}
          <Divider />
          <h3>Preferencias de Participación</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="estadoParticipacion">Estado en el que desea participar</label>
              <InputText id="estadoParticipacion" value={formValues.estadoParticipacion} onChange={(e) => handleInputChange(e, 'estadoParticipacion')} />
            </div>
            {/* Otros campos de preferencias */}
          </div>

          {/* Botón de Envío */}
          <div className="p-d-flex p-jc-end p-mt-4">
            <Button label="Registrar Candidato" icon="pi pi-check" className="p-button-success" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};
