import * as Yup from "yup";

// Definir expresiones regulares
let curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/;
let nombresRegex = '^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+( [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$'
let apellidosRegex = '^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+( [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$'

// Definir los esquemas de validación
export const Schemas = {
  contrasena: Yup.string().required("La contraseña es obligatoria").min(8, "La contraseña debe tener al menos 8 caracteres").trim(),
  confirmar: Yup.string().oneOf([Yup.ref('contrasena'), null], 'Las contraseñas deben coincidir').required('La confirmación de la contraseña es obligatoria').trim(),
  CURP: Yup.string().matches(curpRegex, "El formato del CURP no es válido").required("El CURP es obligatorio").trim(),
  nombres: Yup.string().matches(nombresRegex, "El campo nombre(s) es inválido").required("El nombre es obligatorio").trim(),
  apellidos: Yup.string().matches(apellidosRegex, "El campo apellido (paterno ó materno) es inválido").required("El apellido es obligatorio").trim(),
  peso: Yup.number().min(0, "El peso no puede ser negativo").required("El peso es obligatorio"),
  estatura: Yup.number().min(0, "La estatura no puede ser negativa").required("La estatura es obligatoria"),
  clabe: Yup.string().matches(/^[0-9]{18}$/, "La CLABE debe contener 18 dígitos").required("La CLABE es obligatoria").trim(),
  correo: Yup.string().email("El correo no es válido").required("El correo es obligatorio").trim(),
  codigoPostal: Yup.string().matches(/^[0-9]{5}$/, "El código postal debe contener 5 dígitos").required("El código postal es obligatorio").trim(),
  colonia: Yup.string().matches(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/, "El nombre de la colonia es inválido").required("La colonia es obligatorio").trim(),
  fecha_nacimiento: Yup.date().required("La fecha de nacimiento es obligatoria")
    .test("mayor-de-edad", "Debes ser mayor de 18 años", function(value) {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
            
      // Verifica si la persona tiene al menos 18 años
      if (age > 18 || (age === 18 && month >= 0)) {
        return true;
      }
      return false;
    }),
  genero: Yup.string().required("El género es obligatorio").trim(),
  talla_playera: Yup.string().required("La talla de playera es obligatoria").trim(),
  talla_pantalon: Yup.string().required("La talla de pantalón es obligatoria").trim(),
  talla_calzado: Yup.string().required("La talla de calzado es obligatoria").trim(),
  afecciones: Yup.string().required("Las afecciones son obligatorias").trim(),
  banco: Yup.string().required("El banco es obligatorio").trim(),
  nivel_estudios: Yup.string().required("Tu nivel máximo de estudios es obligatoria").trim(),
  nivel_estudios_deseado: Yup.string().required("El nivel de estudios deseado es obligatorio").trim(),
  experiencia_ciencia: Yup.string().required("La experiencia en ciencia es obligatoria").trim(),
  experiencia_arte: Yup.string().required("La experiencia en arte es obligatoria").trim(),
  interes_comunitario: Yup.boolean().required("El interés comunitario es obligatorio"),
  razones_interes: Yup.string().required("La razón para ser LEC es obligatoria").trim(),
  profesion_interes: Yup.string().required("La profesión de interés es obligatoria").trim(),
  interes_incorporacion: Yup.string().required("Los intereses de incorporación son obligatorios").trim(),
  estado: Yup.string().required("El estado es obligatorio").trim(),
  municipio: Yup.string().required("El municipio es obligatorio").trim(),
  localidad: Yup.string().required("La localidad es obligatoria").trim(),
  calle: Yup.string().required("La calle es obligatoria").trim(),
  numero_exterior: Yup.string().required("El número exterior es obligatorio").trim(),
  numero_interior: Yup.string().trim(),
  convocatoria: Yup.string().required("La convocatoria es obligatoria").trim(),
};