import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const refreshToken = async () => {
    try {
        const refreshToken = JSON.parse(localStorage.getItem('refresh-token'));
        const response = await axios.post(`${apiUrl}/auth/token/refresh/`, {
            refresh: refreshToken,
        });
        const newAccessToken = response.data.access;
        localStorage.setItem('access-token', JSON.stringify(newAccessToken));
        return newAccessToken;
    } catch (error) {
        console.error('Error al refrescar el token:', error);
        throw new Error('No se pudo renovar el token de acceso.');
    }
};

const stripHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
};

const RegistrarEquipoDisponible = () => {
    const toast = React.useRef(null);

    const categorias = [
        { label: 'Papelería', value: 'Papelería' },
        { label: 'Utilería', value: 'Utilería' },
        { label: 'Ropa y Calzado', value: 'Ropa y Calzado' },
        { label: 'Mobiliario', value: 'Mobiliario' },
    ];

    const formik = useFormik({
      initialValues: {
        nombre: '',
        cantidad: '',
        descripcion: '',
        categoria: '',
      },
      validationSchema: Yup.object({
        nombre: Yup.string()
          .required('El nombre del equipo es obligatorio'),
        cantidad: Yup.number()
          .required('La cantidad disponible es obligatoria')
          .min(1, 'La cantidad debe ser al menos 1'),
        descripcion: Yup.string()
          .required('La descripción es obligatoria')
          .test('stripHtmlTags', 'La descripción no debe estar vacía', (value) => !!stripHtmlTags(value)),
        categoria: Yup.string()
          .required('Debe seleccionar una categoría')
      }),
      onSubmit: async (values, { resetForm }) => {
        try {
          let token = JSON.parse(localStorage.getItem('access-token'));
          if (!token) {
            token = await refreshToken();
          }

          const descripcionSinHtml = stripHtmlTags(values.descripcion);

          await axios.post(`${apiUrl}/logistica/crear/`, {
            nombre_equipo: values.nombre,
            cantidad_disponible: values.cantidad,
            descripcion: descripcionSinHtml,
            categoria: values.categoria,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          toast.current.show({
            severity: 'success',
            summary: 'Equipo Subido',
            detail: 'El equipo se ha subido correctamente.',
            life: 3000,
          });

          resetForm();
        } catch (error) {
          console.error('Error al enviar los datos:', error);
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un problema al subir el equipo.',
            life: 3000,
          });
        }
      },
    });

    return (
        <div style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
            <Toast ref={toast} />
            <h2>Subir Equipo</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="p-field" style={{ marginBottom: '16px' }}>
                    <label htmlFor="nombre">Nombre del Equipo</label>
                    <InputText
                        id="nombre"
                        value={formik.values.nombre}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Ingrese el nombre del equipo"
                        style={{ width: '100%' }}
                    />
                    {formik.touched.nombre && formik.errors.nombre && (
                        <small className="p-error">{formik.errors.nombre}</small>
                    )}
                </div>
                <div className="p-field" style={{ marginBottom: '16px' }}>
                    <label htmlFor="cantidad">Cantidad Disponible</label>
                    <InputNumber
                        id="cantidad"
                        value={formik.values.cantidad}
                        onValueChange={(e) => formik.setFieldValue('cantidad', e.value)}
                        onBlur={formik.handleBlur}
                        placeholder="Ingrese la cantidad disponible"
                        style={{ width: '100%' }}
                        min={1}
                    />
                    {formik.touched.cantidad && formik.errors.cantidad && (
                        <small className="p-error">{formik.errors.cantidad}</small>
                    )}
                </div>
                <div className="p-field" style={{ marginBottom: '16px' }}>
                    <label htmlFor="descripcion">Descripción</label>
                    <Editor
                        id="descripcion"
                        value={formik.values.descripcion}
                        onTextChange={(e) => formik.setFieldValue('descripcion', e.htmlValue)}
                        onBlur={formik.handleBlur}
                        style={{ height: '150px' }}
                        placeholder="Describa el equipo"
                    />
                    {formik.touched.descripcion && formik.errors.descripcion && (
                        <small className="p-error">{formik.errors.descripcion}</small>
                    )}
                </div>
                <div className="p-field" style={{ marginBottom: '16px' }}>
                    <label htmlFor="categoria">Categoría</label>
                    <Dropdown
                        id="categoria"
                        value={formik.values.categoria}
                        options={categorias}
                        onChange={(e) => formik.setFieldValue('categoria', e.value)}
                        onBlur={formik.handleBlur}
                        placeholder="Seleccione una categoría"
                        style={{ width: '100%' }}
                    />
                    {formik.touched.categoria && formik.errors.categoria && (
                        <small className="p-error">{formik.errors.categoria}</small>
                    )}
                </div>
                <Button type="submit" label="Subir Equipo" icon="pi pi-upload" className="p-button-success" />
            </form>
        </div>
    );
};

export default RegistrarEquipoDisponible;
