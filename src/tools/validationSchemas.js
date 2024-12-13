import * as Yup from "yup";

// Definir expresiones regulares
//let curpRegex = '^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]{1}\d{1}$'
let curpRegex = '^[A-Z]{4}\d{6}[HM]{1}[A-Z]{5}[A-Z\d]{1}\d{1}$'
let nombresRegex = '^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+( [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$'
let apellidosRegex = '^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+( [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$'

// Definir los esquemas de validación
export const Schemas = {
    //CURP :  Yup.string().matches(curpRegex, "El CURP no es válido").required("El CURP es obligatorio"),
    CURP :  Yup.string().required("El CURP es obligatorio"),
    nombres : Yup.string().matches(nombresRegex ,"El campo nombre(s) es inválido").required("El nombre es obligatorio").trim(),
    apellidos : Yup.string().matches(apellidosRegex ,"El campo apellido (paterno ó materno) es inválido").required("El apellido es obligatorio").trim(),
    peso : Yup.number().min(0, "El peso no puede ser negativo").required("El peso es obligatorio"),
    estatura : Yup.number().min(0, "La estatura no puede ser negativa").required("La estatura es obligatoria"),  
    clabe: Yup.string().matches(/^[0-9]{18}$/, "La CLABE debe contener 18 dígitos").required("La CLABE es obligatoria"),    
    correo: Yup.string().email("El correo no es válido").required("El correo es obligatorio"),
    codigoPostal: Yup.string().matches(/^[0-9]{5}$/, "El código postal debe contener 5 dígitos").required("El código postal es obligatorio"),
    colonia: Yup.string().matches(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/, "El nombre de la colonia es inválido").required("La colonia es obligatorio"),    
    password: Yup.string().required("La contraseña es obligatoria").min(8, "La contraseña debe tener al menos 8 caracteres"),   
}
