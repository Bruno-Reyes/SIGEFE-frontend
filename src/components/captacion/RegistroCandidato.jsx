import React, { useState, useRef, useEffect } from 'react';
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
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import * as Yup from "yup";
import { Schemas } from '../../tools/validationSchemas';
import axios from 'axios';


const RegistroCandidato = () => {
  const toast = useRef(null);
  const formik = useFormik({
    initialValues: {
      curp: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      fecha_nacimiento: '',
      genero: '',
      talla_playera: '',
      talla_pantalon: '',
      talla_calzado: '',
      peso: '',
      estatura: '',
      banco: '',
      clabe: '',
      nivel_estudios: '',
      nivel_estudios_deseado: '',
      experiencia_ciencia: '',
      experiencia_arte: '',
      interes_comunitario: null,
      razones_interes: '',
      profesion_interes: '',
      interes_incorporacion: '',
      codigo_postal: '',
      estado: '',
      colonia: '',
      municipio: '',
      localidad: '',
      calle: '',
      numero_exterior: '',
      numero_interior: '',
      convocatoria: '',
      certificado_estudios: '',
      identificacion_oficial: '',
      estado_cuenta_bancario: '',
      correo: '',
      contrasena: '',

    },
    validationSchema: Yup.object({
      curp: Schemas.CURP,
      nombres: Schemas.nombres,
      apellido_paterno: Schemas.apellidos,
      apellido_materno: Schemas.apellidos,
      fecha_nacimiento: Yup.date().required("La fecha de nacimiento es obligatoria"),
      genero: Yup.string().required("El género es obligatorio"),
      talla_playera: Yup.string().required("La talla de playera es obligatoria"),
      talla_pantalon: Yup.string().required("La talla de pantalón es obligatoria"),
      talla_calzado: Yup.string().required("La talla de calzado es obligatoria"),
      peso: Schemas.peso,
      estatura: Schemas.estatura,
      banco: Yup.string().required("El banco es obligatorio"),
      clabe: Schemas.clabe,
      nivel_estudios: Yup.string().required("Tu nivel máximo de estudios es obligatoria"),
      nivel_estudios_deseado: Yup.string().required("El nivel de estudios deseado es obligatorio"),
      experiencia_ciencia: Yup.string().required("La experiencia en ciencia es obligatoria"),
      experiencia_arte: Yup.string().required("La experiencia en arte es obligatoria"),
      interes_comunitario: Yup.boolean().required("El interés comunitario es obligatorio"),
      razones_interes: Yup.string().required("La razón para ser LEC es obligatoria"),
      profesion_interes: Yup.string().required("La profesión de interés es obligatoria"),
      interes_incorporacion: Yup.string().required("Los intereses de incorporación son obligatorios"),
      codigo_postal: Schemas.codigoPostal,
      estado: Yup.string().required("El estado es obligatorio"),
      colonia: Schemas.colonia,
      municipio: Yup.string().required("El municipio es obligatorio"),
      localidad: Yup.string(),
      calle: Yup.string().required("La calle es obligatoria"),
      numero_exterior: Yup.string().required("El número exterior es obligatorio"),
      numero_interior: Yup.string(),


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

  const tallas_playera = [
    { label: 'Chica', value: 'CH' },
    { label: 'Mediana', value: 'M' },
    { label: 'Grande', value: 'G' },
    { label: 'Extra Grande', value: 'EG' },
  ]

  const tallas_pantalon = [
    { label: 'Chica', value: 'CH' },
    { label: 'Mediana', value: 'M' },
    { label: 'Grande', value: 'G' },
    { label: 'Extra Grande', value: 'EG' },
  ]

  const tallas_calzado = [
    { label: '22', value: '22' },
    { label: '22.5', value: '22.5' },
    { label: '23', value: '23' },
    { label: '23.5', value: '23.5' },
    { label: '24', value: '24' },
    { label: '24.5', value: '24.5' },
    { label: '25', value: '25' },
    { label: '25.5', value: '25.5' },
    { label: '26', value: '26' },
    { label: '26.5', value: '26.5' },
    { label: '27', value: '27' },
    { label: '27.5', value: '27.5' },
    { label: '28', value: '28' },
    { label: '28.5', value: '28.5' },
    { label: '29', value: '29' },
    { label: '29.5', value: '29.5' },
    { label: '30', value: '30' },
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
    { label: 'Primaria', value: 'Primaria' },
    { label: 'Secundaria', value: 'Secundaria' },
    { label: 'Preparatoria', value: 'Preparatoria' },
    { label: 'Licenciatura', value: 'Licenciatura' },
    { label: 'Maestría', value: 'Maestría' },
    { label: 'Doctorado', value: 'Doctorado' },
  ];

  const nivelesEducativosDeseados = [
    { label: 'Preescolar', value: 'Preescolar' },
    { label: 'Primaria', value: 'Primaria' },
    { label: 'Secundaria', value: 'Secundaria' },
    { label: 'Preparatoria', value: 'Preparatoria' },
  ];

  const camposCiencia = [
    { label: 'Biología', value: 'Biología' },
    { label: 'Física', value: 'Física' },
    { label: 'Química', value: 'Química' },
    { label: 'Otro', value: 'Otro' },
    { label: 'Ninguna', value: 'Ninguna' }
  ];

  const camposArte = [
    { label: 'Música', value: 'Música' },
    { label: 'Teatro', value: 'Teatro' },
    { label: 'Artes Plásticas', value: 'Artes Plásticas' },
    { label: 'Literatura', value: 'Literatura' },
    { label: 'Ninguna', value: 'Ninguna' }
  ];

  const razonesLEC = [
    { label: 'Recibir apoyo económico para continuar estudios', value: 'Recibir apoyo económico' },
    { label: 'Tener experiencia como líder en educación comunitaria y compartir conocimientos', value: 'Experiencia como líder' },
    { label: 'No perder el año y realizar alguna actividad', value: 'No perder el año' },
    { label: 'Conocer personas y trabajar con niños', value: 'Conocer personas' },
    { label: 'Apoyar y participar en programas sociales', value: 'Apoyar en programas sociales' },
    { label: 'Otro', value: 'Otro' },
  ];

  const profesiones = [
    { label: 'Ingeniería', value: 'Ingeniería' },
    { label: 'Ciencias de la Salud', value: 'Ciencias de la Salud' },
    { label: 'Ciencias Sociales', value: 'Ciencias Sociales' },
    { label: 'Ciencias Exactas', value: 'Ciencias Exactas' },
    { label: 'Ciencias Naturales', value: 'Ciencias Naturales' },
    { label: 'Artes', value: 'Artes' },
    { label: 'Humanidades', value: 'Humanidades' },
    { label: 'Otro', value: 'Otro' },
  ];

  const interesesOptions = [
    { label: 'Prácticas profesionales', value: 'Prácticas profesionales' },
    { label: 'Servicio social', value: 'Servicio social' },
    { label: 'Residencia profesional', value: 'Residencia profesional' },
    { label: 'Movilidad académica', value: 'Movilidad académica' },
    { label: 'Participación voluntaria', value: 'Participación voluntaria' },
    { label: 'Otro', value: 'Otro' },
  ];

  const lugares = [
    { label: "Aguascalientes", value: "Aguascalientes" },
    { label: "Baja California", value: "Baja California" },
    { label: "Baja California Sur", value: "Baja California Sur" },
    { label: "Campeche", value: "Campeche" },
    { label: "CDMX", value: "CDMX" },
    { label: "Chiapas", value: "Chiapas" },
    { label: "Chihuahua", value: "Chihuahua" },
    { label: "Coahuila", value: "Coahuila" },
    { label: "Colima", value: "Colima" },
    { label: "Durango", value: "Durango" },
    { label: "Guanajuato", value: "Guanajuato" },
    { label: "Guerrero", value: "Guerrero" },
    { label: "Hidalgo", value: "Hidalgo" },
    { label: "Jalisco", value: "Jalisco" },
    { label: "México (Estado de México)", value: "México (Estado de México)" },
    { label: "Michoacán", value: "Michoacán" },
    { label: "Morelos", value: "Morelos" },
    { label: "Nayarit", value: "Nayarit" },
    { label: "Nuevo León", value: "Nuevo León" },
    { label: "Oaxaca", value: "Oaxaca" },
    { label: "Puebla", value: "Puebla" },
    { label: "Querétaro", value: "Querétaro" },
    { label: "Quintana Roo", value: "Quintana Roo" },
    { label: "San Luis Potosí", value: "San Luis Potosí" },
    { label: "Sinaloa", value: "Sinaloa" },
    { label: "Sonora", value: "Sonora" },
    { label: "Tabasco", value: "Tabasco" },
    { label: "Tamaulipas", value: "Tamaulipas" },
    { label: "Tlaxcala", value: "Tlaxcala" },
    { label: "Veracruz", value: "Veracruz" },
    { label: "Yucatán", value: "Yucatán" },
    { label: "Zacatecas", value: "Zacatecas" },
  ];

  const apiUrl = import.meta.env.VITE_API_URL;

  let [convocatorias, setConvocatorias] = useState([])

  const obtenerConvocatorias = async () => {
    try {
      const response = await axios.get(`${apiUrl}/captacion/obtener-activas/`);
      
      setConvocatorias(response.data);
      console.log(convocatorias);
    }
    catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.detail || 'Hubo un problema al cargar las convocatorias activas';
      toast.current.show({
        severity: 'error',
        summary: 'Error al cargar convocatorias',
        detail: errorMessage,
        life: 3000,
      });
    }
  }

  useEffect(() => {
    obtenerConvocatorias();
  }, []);


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
                id="genero"
                value={formik.values.genero}
                className={`p-inputtext-lg ${formik.touched.genero && formik.errors.genero ? "p-invalid" : ""}`}
                options={[{ label: 'Masculino', value: 'M' }, { label: 'Femenino', value: 'F' }, { label: 'Otro', value: 'O' }]}
                onChange={formik.handleChange}
                placeholder="Selecciona el género" />
              {formik.touched.genero && formik.errors.genero ? (
                <small className="p-error">{formik.errors.genero}</small>
              ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="talla_playera">Talla de Playera</label>
              <Dropdown
                id="talla_playera"
                value={formik.values.talla_playera}
                className={`p-inputtext-lg ${formik.touched.talla_playera && formik.errors.talla_playera ? "p-invalid" : ""}`}
                options={tallas_playera}
                onChange={formik.handleChange}
                placeholder="Selecciona tu talla de playera" />
              {formik.touched.talla_playera && formik.errors.talla_playera ? (
                <small className="p-error">{formik.errors.talla_playera}</small>
              ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="talla_pantalon">Talla de Pantalón</label>
              <Dropdown
                id="talla_pantalon"
                value={formik.values.talla_pantalon}
                className={`p-inputtext-lg ${formik.touched.talla_pantalon && formik.errors.talla_pantalon ? "p-invalid" : ""}`}
                options={tallas_pantalon}
                onChange={formik.handleChange}
                placeholder="Selecciona tu talla de pantalón" />
              {formik.touched.talla_pantalon && formik.errors.talla_pantalon ? (
                <small className="p-error">{formik.errors.talla_pantalon}</small>
              ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="talla_calzado">Talla de Calzado</label>
              <Dropdown
                id="talla_calzado"
                value={formik.values.talla_calzado}
                className={`p-inputtext-lg ${formik.touched.talla_calzado && formik.errors.talla_calzado ? "p-invalid" : ""}`}
                options={tallas_calzado}
                onChange={formik.handleChange}
                placeholder="Selecciona tu talla de calzado" />
              {formik.touched.talla_calzado && formik.errors.talla_calzado ? (
                <small className="p-error">{formik.errors.talla_calzado}</small>
              ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="peso">Peso</label>
              <div className="p-inputgroup flex-1">
                <div className="flex-auto">
                  <InputNumber
                    inputId="peso"
                    id="peso"
                    className={`p-inputtext-lg ${formik.touched.peso && formik.errors.peso ? "p-invalid" : ""}`}
                    value={formik.values.peso}
                    onValueChange={formik.handleChange}
                    minFractionDigits={2}
                    maxFractionDigits={2} />

                </div>
                <span className="p-inputgroup-addon">kg</span>
              </div>
              {formik.touched.peso && formik.errors.peso ? (
                <small className="p-error">{formik.errors.peso}</small>
              ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="estatura">Estatura</label>
              <div className="p-inputgroup flex-1">
                <div className="flex-auto">
                  <InputNumber
                    inputId="estatura"
                    id="estatura"
                    className={`p-inputtext-lg ${formik.touched.estatura && formik.errors.estatura ? "p-invalid" : ""}`}
                    value={formik.values.estatura}
                    onValueChange={formik.handleChange}
                    min={3}
                    max={220} />

                </div>
                <span className="p-inputgroup-addon">cm</span>
              </div>
              {formik.touched.estatura && formik.errors.estatura ? (
                <small className="p-error">{formik.errors.estatura}</small>
              ) : null}
            </div>

          </div>

          {/* Datos Bancarios */}
          <Divider />
          <h3>Datos Bancarios</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="banco">Banco</label>
              <Dropdown
                id="banco"
                value={formik.values.banco}
                className={`p-inputtext-lg ${formik.touched.banco && formik.errors.banco ? "p-invalid" : ""}`}
                options={bancos}
                onChange={formik.handleChange}
                placeholder="Selecciona tu banco" />
              {formik.touched.banco && formik.errors.banco ? (
                <small className="p-error">{formik.errors.banco}</small>
              ) : null}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="clabe">Cuenta CLABE</label>
              <InputText
                id="clabe"
                className={`p-inputtext-lg ${formik.touched.clabe && formik.errors.clabe ? "p-invalid" : ""}`}
                value={formik.values.clabe}
                onChange={formik.handleChange}
              />
              {formik.touched.clabe && formik.errors.clabe ? (
                <small className="p-error">{formik.errors.clabe}</small>
              ) : null}
            </div>
          </div>
          <Divider />

          {/* Educación y Preferencias */}
          <Divider />
          <h3>Educación y Preferencias</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nivel_estudios">¿Cual es tu máximo grado de estudios?</label>
              <Dropdown
                id="nivel_estudios"
                value={formik.values.nivel_estudios}
                className={`p-inputtext-lg ${formik.touched.nivel_estudios && formik.errors.nivel_estudios ? "p-invalid" : ""}`}
                options={nivelesEducativos}
                onChange={formik.handleChange}
                placeholder="Selecciona tu nivel de estudios" />
              {formik.touched.nivelesEducativos && formik.errors.nivelesEducativos ? (
                <small className="p-error">{formik.errors.nivelesEducativos}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="nivel_estudios_deseado">¿Cuál es el nivel máximo al que te gustaría enseñar?</label>
              <Dropdown
                id="nivel_estudios_deseado"
                value={formik.values.nivel_estudios_deseado}
                className={`p-inputtext-lg ${formik.touched.nivel_estudios_deseado && formik.errors.nivel_estudios_deseado ? "p-invalid" : ""}`}
                options={nivelesEducativosDeseados}
                onChange={formik.handleChange}
                placeholder="Selecciona tu nivel de estudios" />
              {formik.touched.nivel_estudios_deseado && formik.errors.nivel_estudios_deseado ? (
                <small className="p-error">{formik.errors.nivel_estudios_deseado}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="experiencia_ciencia">Experiencia en Ciencia</label>
              <Dropdown
                id="experiencia_ciencia"
                value={formik.values.experiencia_ciencia}
                className={`p-inputtext-lg ${formik.touched.experiencia_ciencia && formik.errors.experiencia_ciencia ? "p-invalid" : ""}`}
                options={camposCiencia}
                onChange={formik.handleChange}
                placeholder="Selecciona tu experiencia en ciencia" />
              {formik.touched.experiencia_ciencia && formik.errors.experiencia_ciencia ? (
                <small className="p-error">{formik.errors.experiencia_ciencia}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="experiencia_arte">Experiencia en Arte</label>
              <Dropdown
                id="experiencia_arte"
                value={formik.values.experiencia_arte}
                className={`p-inputtext-lg ${formik.touched.experiencia_arte && formik.errors.experiencia_arte ? "p-invalid" : ""}`}
                options={camposArte}
                onChange={formik.handleChange}
                placeholder="Selecciona tu experiencia en arte" />
              {formik.touched.experiencia_arte && formik.errors.experiencia_arte ? (
                <small className="p-error">{formik.errors.experiencia_arte}</small>
              ) : null}
            </div>
            <div className="p-field-checkbox p-col-12">
              <TriStateCheckbox id="interes_comunitario" value={formik.values.interes_comunitario} onChange={formik.handleChange} />
              <label htmlFor="interesComunitario" className="p-ml-2">Interés en el desarrollo comunitario</label>
              {formik.touched.interes_comunitario && formik.errors.interes_comunitario ? (
                <small className="p-error">{formik.errors.interes_comunitario}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="razones_interes">Razón para ser LEC</label>
              <Dropdown
                id="razones_interes"
                value={formik.values.razones_interes}
                className={`p-inputtext-lg ${formik.touched.razones_interes && formik.errors.razones_interes ? "p-invalid" : ""}`}
                options={razonesLEC}
                onChange={formik.handleChange}
                placeholder="Selecciona tus razones de interes" />
              {formik.touched.razones_interes && formik.errors.razones_interes ? (
                <small className="p-error">{formik.errors.razones_interes}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="profesion_interes">Profesión de Interés</label>
              <Dropdown
                id="profesion_interes"
                value={formik.values.profesion_interes}
                className={`p-inputtext-lg ${formik.touched.profesion_interes && formik.errors.profesion_interes ? "p-invalid" : ""}`}
                options={profesiones}
                onChange={formik.handleChange}
                placeholder="Selecciona tu profesion de interes" />
              {formik.touched.profesion_interes && formik.errors.profesion_interes ? (
                <small className="p-error">{formik.errors.profesion_interes}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="interes_incorporacion">Intereses de Incorporación</label>
              <Dropdown
                id="interes_incorporacion"
                value={formik.values.interes_incorporacion}
                className={`p-inputtext-lg ${formik.touched.interes_incorporacion && formik.errors.interes_incorporacion ? "p-invalid" : ""}`}
                options={interesesOptions}
                onChange={formik.handleChange}
                placeholder="Selecciona tu interes de incorporación" />
              {formik.touched.interes_incorporacion && formik.errors.interes_incorporacion ? (
                <small className="p-error">{formik.errors.interes_incorporacion}</small>
              ) : null}
            </div>
          </div>

          {/* Dirección */}
          <Divider />
          <h3>Dirección</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="codigo_postal">Código Postal</label>
              <InputText
                id="codigo_postal"
                className={`p-inputtext-lg ${formik.touched.codigo_postal && formik.errors.codigo_postal ? "p-invalid" : ""}`}
                value={formik.values.codigo_postal}
                onChange={formik.handleChange} />
              {formik.touched.codigo_postal && formik.errors.codigo_postal ? (
                <small className="p-error">{formik.errors.codigo_postal}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="estado">Estado</label>
              <Dropdown
                id="estado"
                value={formik.values.estado}
                className={`p-inputtext-lg ${formik.touched.estado && formik.errors.estado ? "p-invalid" : ""}`}
                options={lugares}
                onChange={formik.handleChange}
                placeholder="Selecciona tu interes de incorporación" />
              {formik.touched.estado && formik.errors.estado ? (
                <small className="p-error">{formik.errors.estado}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="colonia">Colonia</label>
              <InputText
                id="colonia"
                className={`p-inputtext-lg ${formik.touched.colonia && formik.errors.colonia ? "p-invalid" : ""}`}
                value={formik.values.colonia}
                onChange={formik.handleChange} />
              {formik.touched.colonia && formik.errors.colonia ? (
                <small className="p-error">{formik.errors.colonia}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="municipio">Municipio o Alcaldía</label>
              <InputText
                id="municipio"
                className={`p-inputtext-lg ${formik.touched.municipio && formik.errors.municipio ? "p-invalid" : ""}`}
                value={formik.values.municipio}
                onChange={formik.handleChange} />
              {formik.touched.municipio && formik.errors.municipio ? (
                <small className="p-error">{formik.errors.municipio}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="localidad">Localidad</label>
              <InputText
                id="localidad"
                className={`p-inputtext-lg ${formik.touched.localidad && formik.errors.localidad ? "p-invalid" : ""}`}
                value={formik.values.localidad}
                onChange={formik.handleChange} />
              {formik.touched.localidad && formik.errors.localidad ? (
                <small className="p-error">{formik.errors.localidad}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="calle">Calle</label>
              <InputText
                id="calle"
                className={`p-inputtext-lg ${formik.touched.calle && formik.errors.calle ? "p-invalid" : ""}`}
                value={formik.values.calle}
                onChange={formik.handleChange} />
              {formik.touched.calle && formik.errors.calle ? (
                <small className="p-error">{formik.errors.calle}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="numero_exterior">Número Exterior</label>
              <InputText
                id="numero_exterior"
                className={`p-inputtext-lg ${formik.touched.numero_exterior && formik.errors.numero_exterior ? "p-invalid" : ""}`}
                value={formik.values.numero_exterior}
                onChange={formik.handleChange} />
              {formik.touched.numero_exterior && formik.errors.numero_exterior ? (
                <small className="p-error">{formik.errors.numero_exterior}</small>
              ) : null}
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="numero_interior">Número Interior</label>
              <InputText
                id="numero_interior"
                className={`p-inputtext-lg ${formik.touched.numero_interior && formik.errors.numero_interior ? "p-invalid" : ""}`}
                value={formik.values.numero_interior}
                onChange={formik.handleChange} />
              {formik.touched.numero_interior && formik.errors.numero_interior ? (
                <small className="p-error">{formik.errors.numero_interior}</small>
              ) : null}
            </div>
          </div>

          {/* Preferencias de Participación */}
          <Divider />
          <h3>Preferencias de Participación</h3>
          <div className="p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="estadoParticipacion">¿En que convocatoria quieres participar?</label>
              <InputText id="estadoParticipacion" value={formValues.estadoParticipacion} onChange={(e) => handleInputChange(e, 'estadoParticipacion')} />
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