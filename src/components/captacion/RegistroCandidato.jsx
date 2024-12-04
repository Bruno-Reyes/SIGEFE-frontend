import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Checkbox } from 'primereact/checkbox';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import * as Yup from "yup";
import { Schemas } from '../../tools/validationSchemas';


const RegistroCandidato = () => {
  const toast = useRef(null);
  const formik = useFormik({
    initialValues: {
      curp : '',
      nombres : '',
      apellido_paterno : '',
      apellido_materno : '',
      fecha_nacimiento : '',
      genero : '',
      talla_playera : '',
      talla_pantalon : '',
      talla_calzado : '',
      peso : '',
      estatura : '',
      banco : '',
      clabe : '',
      nivel_estudios : '',
      nivel_estudios_deseado : '',
      experiencia_ciencia : '',
      experiencia_arte : '',
      interes_comunitario : '',
      razones_interes : '',
      profesion_interes : '',
      interes_incorporacion : '',
      codigo_postal : '',
      estado : '',
      colonia : '',
      municipio : '',
      localidad : '',
      calle : '',
      numero_exterior : '',
      numero_interior : '',
      estado_deseado : '',
      municipio_deseado : '',
      certificado_estudios : '',
      identificacion_oficial : '',
      estado_cuenta_bancario : '',
    },
    validationSchema: Yup.object({
      curp : Schemas.CURP,
      nombres : Schemas.nombres,
      apellido_paterno : Schemas.apellidos,
      apellido_materno : Schemas.apellidos,
      fecha_nacimiento : Yup.date().required("La fecha de nacimiento es obligatoria"),
      genero : Yup.string().required("El género es obligatorio"),
      talla_playera : Yup.string().required("La talla de playera es obligatoria"),
      talla_pantalon : Yup.string().required("La talla de pantalón es obligatoria"),  
      talla_calzado : Yup.string().required("La talla de calzado es obligatoria"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      // Eliminar espacios al inicio y final de las cadenas
    },
  });

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

  const tallas = [
    { label: 'Chica', value: 'CH' },
    { label: 'Mediana', value: 'M' },
    { label: 'Grande', value: 'G' },
    { label: 'Extra Grande', value: 'EG' },
  ]

  const tallas_calzado = [
    {label: '22', value: '22'},
    {label: '22.5', value: '22.5'},
    {label: '23', value: '23'},
    {label: '23.5', value: '23.5'},
    {label: '24', value: '24'},
    {label: '24.5', value: '24.5'},
    {label: '25', value: '25'},
    {label: '25.5', value: '25.5'},
    {label: '26', value: '26'},
    {label: '26.5', value: '26.5'},
    {label: '27', value: '27'},
    {label: '27.5', value: '27.5'},
    {label: '28', value: '28'},
    {label: '28.5', value: '28.5'},
    {label: '29', value: '29'},
    {label: '29.5', value: '29.5'},
    {label: '30', value: '30'},
  ]
  


  const bancos = [
    { label: 'BBVA', value: 'BBVA' },
    { label: 'Banamex', value: 'Banamex' },
    { label: 'Santander', value: 'Santander' },
    { label: 'HSBC', value: 'HSBC' },
    { label: 'Banorte', value: 'Banorte' },
    { label: 'Scotiabank', value: 'Scotiabank' },
    { label: 'Inbursa', value: 'Inbursa' },
    { label: 'Banco Azteca', value: 'Banco Azteca' },
    { label: 'BanCoppel', value: 'BanCoppel' },
    { label: 'Banco del Bajío', value: 'Banco del Bajío' },
    { label: 'Otro', value: 'Otro' },
  ];

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

  return (
    <div className="p-d-flex p-flex-column p-ai-center p-mt-4">
      <Toast ref={toast} /> {/* Componente para notificaciones */}
      <div className="p-card p-p-4 p-shadow-3 p-mb-4" style={{ width: '90%' }}>
        <h2>Registro de Candidato</h2>
        <Divider />

        <form onSubmit={formik.handleSubmit} className="p-fluid" autoComplete='off'>

          {/* Información Personal */}
          <h3>Información Personal</h3>
          <div className="p-grid">

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="curp">CURP</label>
              <InputText 
              id="curp" 
              className={`p-inputtext-lg ${formik.touched.curp && formik.errors.curp ? "p-invalid" : ""}`}
              value={formik.values.curp} 
              onChange={formik.handleChange} 
              />
              {formik.touched.curp && formik.errors.curp ? (
                  <small className="p-error">{formik.errors.curp}</small>
                ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nombres">Nombre(s)</label>
              <InputText 
              id="nombres" 
              className={`p-inputtext-lg ${formik.touched.nombres && formik.errors.nombres ? "p-invalid" : ""}`}
              value={formik.values.nombres} 
              onChange={formik.handleChange} 
              />
              {formik.touched.nombres && formik.errors.nombres ? (
                  <small className="p-error">{formik.errors.nombres}</small>
                ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="apellido_paterno">Apellido Paterno</label>
              <InputText
              id="apellido_paterno"
              className={`p-inputtext-lg ${formik.touched.apellido_paterno && formik.errors.apellido_paterno ? "p-invalid" : ""}`} 
              value={formik.values.apellido_paterno} 
              onChange={formik.handleChange}
              />
              {formik.touched.apellido_paterno && formik.errors.apellido_paterno ? (
                <small className="p-error">{formik.errors.apellido_paterno}</small>
              ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="apellido_materno">Apellido Materno</label>
              <InputText
              id="apellido_materno"
              className={`p-inputtext-lg ${formik.touched.apellido_materno && formik.errors.apellido_materno ? "p-invalid" : ""}`} 
              value={formik.values.apellido_materno} 
              onChange={formik.handleChange}
              />
              {formik.touched.apellido_materno && formik.errors.apellido_materno ? (
                <small className="p-error">{formik.errors.apellido_materno}</small>
              ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
              <Calendar 
              id="fecha_nacimiento" 
              className={`p-inputtext-lg ${formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento ? "p-invalid" : ""}`} 
              value={formik.values.fecha_nacimiento} 
              onChange={formik.handleChange} 
              showIcon  
              />
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="genero">Género</label>
              <Dropdown 
              id="genero" value={formik.values.genero} 
              className={`p-inputtext-lg ${formik.touched.genero && formik.errors.genero ? "p-invalid" : ""}`} 
              options={[{label: 'Masculino', value: 'M'}, {label: 'Femenino', value: 'F'}, {label: 'Otro', value: 'O'}]} 
              onChange={formik.handleChange} 
              placeholder="Selecciona el género"  />
              {formik.touched.genero && formik.errors.genero ? (
                <small className="p-error">{formik.errors.genero}</small>
              ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="talla_playera">Talla de Playera</label>
              <Dropdown
              id="talla_playera"
              className={`p-inputtext-lg ${formik.touched.talla_playera && formik.errors.talla_playera ? "p-invalid" : ""}`} 
              options={tallas}
              value={formik.values.talla_playera} 
              onChange={formik.handleChange}  />
              {formik.touched.talla_playera && formik.errors.talla_playera ? (
                <small className="p-error">{formik.errors.talla_playera}</small>
              ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="talla_pantalon">Talla de Pantalón</label>
              <Dropdown
              id="talla_pantalon"
              className={`p-inputtext-lg ${formik.touched.talla_pantalon && formik.errors.talla_pantalon ? "p-invalid" : ""}`} 
              options={tallas}
              value={formik.values.talla_pantalon} 
              onChange={formik.handleChange}  />
              {formik.touched.talla_pantalon && formik.errors.talla_pantalon ? (
                <small className="p-error">{formik.errors.talla_pantalon}</small>
              ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="tallaPantalon">Talla de Pantalón</label>
              <InputText id="tallaPantalon" value={formValues.tallaPantalon} onChange={(e) => handleInputChange(e, 'tallaPantalon')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="tallaCalzado">Talla de Calzado</label>
              <InputText id="tallaCalzado" value={formValues.tallaCalzado} onChange={(e) => handleInputChange(e, 'tallaCalzado')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="peso">Peso (kg)</label>
              <InputNumber id="peso" value={formValues.peso} onChange={(e) => handleInputChange(e, 'peso')}  mode="decimal" minFractionDigits={2} />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="estatura">Estatura (cm)</label>
              <InputNumber id="estatura" value={formValues.estatura} onChange={(e) => handleInputChange(e, 'estatura')}  mode="decimal" minFractionDigits={2} />
            </div>
          </div>

          {/* Datos Bancarios */}
          <Divider />
          <h3>Datos Bancarios</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="banco">Banco</label>
              <Dropdown id="banco" value={formValues.banco} options={bancos} onChange={(e) => handleInputChange(e, 'banco')} placeholder="Selecciona el banco"  />
            </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="cuentaBancaria">Cuenta Bancaria</label>
                <InputNumber id="cuentaBancaria" value={formValues.cuentaBancaria} onValueChange={(e) => handleInputChange(e, 'cuentaBancaria')} useGrouping={false} />
              </div>
          </div>
          <Divider />

          {/* Información de Contacto */}
          
          <h3>Información de Contacto</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="correo">Correo Electrónico</label>
              <InputText id="correo" value={formValues.correo} onChange={(e) => handleInputChange(e, 'correo')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="telefonoFijo">Teléfono Fijo</label>
              <InputText id="telefonoFijo" value={formValues.telefonoFijo} onChange={(e) => handleInputChange(e, 'telefonoFijo')} />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="telefonoMovil">Teléfono Móvil</label>
              <InputText id="telefonoMovil" value={formValues.telefonoMovil} onChange={(e) => handleInputChange(e, 'telefonoMovil')}  />
            </div>
          </div>

          {/* Educación y Preferencias */}
          <Divider />
          <h3>Educación y Preferencias</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nivelEducativoLEC">Nivel Educativo del LEC</label>
              <InputText id="nivelEducativoLEC" value={formValues.nivelEducativoLEC} onChange={(e) => handleInputChange(e, 'nivelEducativoLEC')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nivelEducativoServicio">Nivel Educativo de Servicio Social</label>
              <Dropdown id="nivelEducativoServicio" value={formValues.nivelEducativoServicio} options={nivelesEducativos} onChange={(e) => handleInputChange(e, 'nivelEducativoServicio')} placeholder="Seleccione el nivel"  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="gustoCiencia">Experiencia en Ciencia</label>
              <Dropdown id="gustoCiencia" value={formValues.gustoCiencia} options={camposCiencia} onChange={(e) => handleInputChange(e, 'gustoCiencia')} placeholder="Seleccione la ciencia"  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="experienciaArte">Experiencia en Arte</label>
              <Dropdown id="experienciaArte" value={formValues.experienciaArte} options={camposArte} onChange={(e) => handleInputChange(e, 'experienciaArte')} placeholder="Seleccione el arte"  />
            </div>
            <div className="p-field-checkbox p-col-12">
              <Checkbox inputId="interesComunitario" checked={formValues.interesComunitario} onChange={(e) => handleCheckboxChange(e, 'interesComunitario')} />
              <label htmlFor="interesComunitario" className="p-ml-2">Interés en el desarrollo comunitario</label>
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="razonLEC">Razón para ser LEC</label>
              <Dropdown id="razonLEC" value={formValues.razonLEC} options={razonesLEC} onChange={(e) => handleInputChange(e, 'razonLEC')} placeholder="Seleccione la razón"  />
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
              <Dropdown id="interesesIncorporacion" value={formValues.interesesIncorporacion} options={interesesOptions} onChange={(e) => handleInputChange(e, 'interesesIncorporacion')} placeholder="Seleccione una opción"  />
            </div>
          </div>

          {/* Dirección */}
          <Divider />
          <h3>Dirección</h3>
          <div className="p-grid">
          <div className="p-field p-col-12 p-md-6">
              <label htmlFor="codigoPostal">Código Postal</label>
              <InputText id="codigoPostal" value={formValues.codigoPostal} onChange={(e) => handleInputChange(e, 'codigoPostal')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="estado">Estado</label>
              <InputText id="estado" value={formValues.estado} onChange={(e) => handleInputChange(e, 'estado')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="colonia">Colonia</label>
              <InputText id="colonia" value={formValues.colonia} onChange={(e) => handleInputChange(e, 'colonia')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="municipio">Municipio o Alcaldía</label>
              <InputText id="municipio" value={formValues.municipio} onChange={(e) => handleInputChange(e, 'municipio')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="localidad">Localidad</label>
              <InputText id="localidad" value={formValues.localidad} onChange={(e) => handleInputChange(e, 'localidad')} />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="calle">Calle</label>
              <InputText id="calle" value={formValues.calle} onChange={(e) => handleInputChange(e, 'calle')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="numeroExterior">Número Exterior</label>
              <InputText id="numeroExterior" value={formValues.numeroExterior} onChange={(e) => handleInputChange(e, 'numeroExterior')}  />
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
              <InputText id="estadoParticipacion" value={formValues.estadoParticipacion} onChange={(e) => handleInputChange(e, 'estadoParticipacion')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="cicloEscolar">Ciclo Escolar a participar</label>
              <InputText id="cicloEscolar" value={formValues.cicloEscolar} onChange={(e) => handleInputChange(e, 'cicloEscolar')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="medioInformacion">Medio por el cual se enteró</label>
              <InputText id="medioInformacion" value={formValues.medioInformacion} onChange={(e) => handleInputChange(e, 'medioInformacion')}  />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="municipioServicio">Municipio en el que desea brindar el servicio educativo</label>
              <InputText id="municipioServicio" value={formValues.municipioServicio} onChange={(e) => handleInputChange(e, 'municipioServicio')}  />
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

export default RegistroCandidato;