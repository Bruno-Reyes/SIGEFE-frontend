import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Checkbox } from 'primereact/checkbox';
import { FileUpload } from 'primereact/fileupload';


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

  const nivelesEducativos = [
    { label: 'Inicial', value: 'Inicial' },
    { label: 'Preescolar', value: 'Preescolar' },
    { label: 'Primaria', value: 'Primaria' },
    { label: 'Secundaria', value: 'Secundaria' },
  ];

  const camposCiencia = [
    { label: 'Biología', value: 'Biología' },
    { label: 'Física', value: 'Física' },
    { label: 'Química', value: 'Química' },
    { label: 'Otro', value: 'Otro' },
  ];

  const camposArte = [
    { label: 'Música', value: 'Música' },
    { label: 'Teatro', value: 'Teatro' },
    { label: 'Artes Plásticas', value: 'Artes Plásticas' },
    { label: 'Literatura', value: 'Literatura' },
  ];

  const razonesLEC = [
    { label: 'Recibir apoyo económico para continuar estudios', value: 'Recibir apoyo económico' },
    { label: 'Tener experiencia como líder en educación comunitaria y compartir conocimientos', value: 'Experiencia como líder' },
    { label: 'No perder el año y realizar alguna actividad', value: 'No perder el año' },
    { label: 'Conocer personas y trabajar con niños', value: 'Conocer personas' },
    { label: 'Apoyar y participar en programas sociales', value: 'Apoyar en programas sociales' },
  ];

  const interesesOptions = [
    { label: 'Prácticas profesionales', value: 'Prácticas profesionales' },
    { label: 'Servicio social', value: 'Servicio social' },
    { label: 'Residencia profesional', value: 'Residencia profesional' },
    { label: 'Movilidad académica', value: 'Movilidad académica' },
    { label: 'Participación voluntaria', value: 'Participación voluntaria' },
  ];


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
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nacionalidad">Nacionalidad</label>
              <InputText id="nacionalidad" value={formValues.nacionalidad} onChange={(e) => handleInputChange(e, 'nacionalidad')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="tallaPlayera">Talla de Playera</label>
              <InputText id="tallaPlayera" value={formValues.tallaPlayera} onChange={(e) => handleInputChange(e, 'tallaPlayera')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="tallaPantalon">Talla de Pantalón</label>
              <InputText id="tallaPantalon" value={formValues.tallaPantalon} onChange={(e) => handleInputChange(e, 'tallaPantalon')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="tallaCalzado">Talla de Calzado</label>
              <InputText id="tallaCalzado" value={formValues.tallaCalzado} onChange={(e) => handleInputChange(e, 'tallaCalzado')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="peso">Peso (kg)</label>
              <InputNumber id="peso" value={formValues.peso} onChange={(e) => handleInputChange(e, 'peso')} required mode="decimal" minFractionDigits={2} />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="estatura">Estatura (cm)</label>
              <InputNumber id="estatura" value={formValues.estatura} onChange={(e) => handleInputChange(e, 'estatura')} required mode="decimal" minFractionDigits={2} />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="edad">Edad</label>
              <InputNumber id="edad" value={formValues.edad} onChange={(e) => handleInputChange(e, 'edad')} required />
            </div>
          </div>

          {/* Datos Bancarios */}
          <Divider />
          <h3>Datos Bancarios</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="banco">Banco</label>
              <Dropdown id="banco" value={formValues.banco} options={[{label: 'Bancomer', value: 'Bancomer'}, {label: 'Otro', value: 'Otro'}]} onChange={(e) => handleInputChange(e, 'banco')} placeholder="Selecciona el banco" required />
            </div>
            {formValues.banco === 'Bancomer' && (
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="cuentaBancaria">Cuenta Bancaria (solo en caso de Bancomer)</label>
                <InputText id="cuentaBancaria" value={formValues.cuentaBancaria} onChange={(e) => handleInputChange(e, 'cuentaBancaria')} required />
              </div>
            )}

            {formValues.banco === 'Otro' && (
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="clabe">CLABE (Banco diferente a Bancomer)</label>
                <InputText id="clabe" value={formValues.clabe} onChange={(e) => handleInputChange(e, 'clabe')} required />
              </div>
            )}
          </div>

          {/* Información de Contacto */}
          <Divider />
          <h3>Información de Contacto</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="correo">Correo Electrónico</label>
              <InputText id="correo" value={formValues.correo} onChange={(e) => handleInputChange(e, 'correo')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="telefonoFijo">Teléfono Fijo</label>
              <InputText id="telefonoFijo" value={formValues.telefonoFijo} onChange={(e) => handleInputChange(e, 'telefonoFijo')} />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="telefonoMovil">Teléfono Móvil</label>
              <InputText id="telefonoMovil" value={formValues.telefonoMovil} onChange={(e) => handleInputChange(e, 'telefonoMovil')} required />
            </div>
          </div>

          {/* Educación y Preferencias */}
          <Divider />
          <h3>Educación y Preferencias</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nivelEducativoLEC">Nivel Educativo del LEC</label>
              <InputText id="nivelEducativoLEC" value={formValues.nivelEducativoLEC} onChange={(e) => handleInputChange(e, 'nivelEducativoLEC')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nivelEducativoServicio">Nivel Educativo de Servicio Social</label>
              <Dropdown id="nivelEducativoServicio" value={formValues.nivelEducativoServicio} options={nivelesEducativos} onChange={(e) => handleInputChange(e, 'nivelEducativoServicio')} placeholder="Seleccione el nivel" required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="gustoCiencia">Experiencia en Ciencia</label>
              <Dropdown id="gustoCiencia" value={formValues.gustoCiencia} options={camposCiencia} onChange={(e) => handleInputChange(e, 'gustoCiencia')} placeholder="Seleccione la ciencia" required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="experienciaArte">Experiencia en Arte</label>
              <Dropdown id="experienciaArte" value={formValues.experienciaArte} options={camposArte} onChange={(e) => handleInputChange(e, 'experienciaArte')} placeholder="Seleccione el arte" required />
            </div>
            <div className="p-field-checkbox p-col-12">
              <Checkbox inputId="interesComunitario" checked={formValues.interesComunitario} onChange={(e) => handleCheckboxChange(e, 'interesComunitario')} />
              <label htmlFor="interesComunitario" className="p-ml-2">Interés en el desarrollo comunitario</label>
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="razonLEC">Razón para ser LEC</label>
              <Dropdown id="razonLEC" value={formValues.razonLEC} options={razonesLEC} onChange={(e) => handleInputChange(e, 'razonLEC')} placeholder="Seleccione la razón" required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="profesionInteres">Profesión de Interés</label>
              <InputText id="profesionInteres" value={formValues.profesionInteres} onChange={(e) => handleInputChange(e, 'profesionInteres')} />
            </div>
            <div className="p-field-checkbox p-col-12 p-md-6">
              <Checkbox inputId="requisitoTitulacion" checked={formValues.requisitoTitulacion} onChange={(e) => handleCheckboxChange(e, 'requisitoTitulacion')} />
              <label htmlFor="requisitoTitulacion" className="p-ml-2">¿Es requisito de titulación?</label>
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="interesesIncorporacion">Intereses de Incorporación</label>
              <Dropdown id="interesesIncorporacion" value={formValues.interesesIncorporacion} options={interesesOptions} onChange={(e) => handleInputChange(e, 'interesesIncorporacion')} placeholder="Seleccione una opción" required />
            </div>
          </div>

          {/* Dirección */}
          <Divider />
          <h3>Dirección</h3>
          <div className="p-grid">
          <div className="p-field p-col-12 p-md-6">
              <label htmlFor="codigoPostal">Código Postal</label>
              <InputText id="codigoPostal" value={formValues.codigoPostal} onChange={(e) => handleInputChange(e, 'codigoPostal')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="estado">Estado</label>
              <InputText id="estado" value={formValues.estado} onChange={(e) => handleInputChange(e, 'estado')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="colonia">Colonia</label>
              <InputText id="colonia" value={formValues.colonia} onChange={(e) => handleInputChange(e, 'colonia')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="municipio">Municipio o Alcaldía</label>
              <InputText id="municipio" value={formValues.municipio} onChange={(e) => handleInputChange(e, 'municipio')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="localidad">Localidad</label>
              <InputText id="localidad" value={formValues.localidad} onChange={(e) => handleInputChange(e, 'localidad')} />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="calle">Calle</label>
              <InputText id="calle" value={formValues.calle} onChange={(e) => handleInputChange(e, 'calle')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="numeroExterior">Número Exterior</label>
              <InputText id="numeroExterior" value={formValues.numeroExterior} onChange={(e) => handleInputChange(e, 'numeroExterior')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="numeroInterior">Número Interior</label>
              <InputText id="numeroInterior" value={formValues.numeroInterior} onChange={(e) => handleInputChange(e, 'numeroInterior')} />
            </div>
          </div>

          {/* Preferencias de Participación */}
          <Divider />
          <h3>Preferencias de Participación</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="estadoParticipacion">Estado en el que desea participar</label>
              <InputText id="estadoParticipacion" value={formValues.estadoParticipacion} onChange={(e) => handleInputChange(e, 'estadoParticipacion')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="cicloEscolar">Ciclo Escolar a participar</label>
              <InputText id="cicloEscolar" value={formValues.cicloEscolar} onChange={(e) => handleInputChange(e, 'cicloEscolar')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="medioInformacion">Medio por el cual se enteró</label>
              <InputText id="medioInformacion" value={formValues.medioInformacion} onChange={(e) => handleInputChange(e, 'medioInformacion')} required />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="municipioServicio">Municipio en el que desea brindar el servicio educativo</label>
              <InputText id="municipioServicio" value={formValues.municipioServicio} onChange={(e) => handleInputChange(e, 'municipioServicio')} required />
            </div>
          </div>

          {/* Documentos Adjuntos */}
          <Divider />
          <h3>Documentos Adjuntos</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="certificadoEstudios">Certificado o constancia de último grado de estudios</label>
              <FileUpload mode="basic" name="certificadoEstudios" accept="application/pdf" customUpload onUpload={(e) => handleFileUpload(e, 'certificadoEstudios')} />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="identificacionOficial">Identificación oficial</label>
              <FileUpload mode="basic" name="identificacionOficial" accept="application/pdf" customUpload onUpload={(e) => handleFileUpload(e, 'identificacionOficial')} />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="estadoCuentaBancario">Estado de cuenta bancario (que incluya nombre y domicilio del aspirante)</label>
              <FileUpload mode="basic" name="estadoCuentaBancario" accept="application/pdf" customUpload onUpload={(e) => handleFileUpload(e, 'estadoCuentaBancario')} />
            </div>
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
