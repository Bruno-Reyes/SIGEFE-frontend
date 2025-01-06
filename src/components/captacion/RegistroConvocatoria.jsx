import React, { useRef } from 'react'
import axios from 'axios'
import { Toast } from 'primereact/toast'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const apiUrl = import.meta.env.VITE_API_URL

const RegistroConvocatoria = ({ onRegistroExitoso }) => {
  const toast = useRef(null)

  const lugares = [
    { label: 'Aguascalientes', value: 'Aguascalientes' },
    { label: 'Baja California', value: 'Baja California' },
    { label: 'Baja California Sur', value: 'Baja California Sur' },
    { label: 'Campeche', value: 'Campeche' },
    { label: 'CDMX', value: 'CDMX' },
    { label: 'Chiapas', value: 'Chiapas' },
    { label: 'Chihuahua', value: 'Chihuahua' },
    { label: 'Coahuila', value: 'Coahuila' },
    { label: 'Colima', value: 'Colima' },
    { label: 'Durango', value: 'Durango' },
    { label: 'Guanajuato', value: 'Guanajuato' },
    { label: 'Guerrero', value: 'Guerrero' },
    { label: 'Hidalgo', value: 'Hidalgo' },
    { label: 'Jalisco', value: 'Jalisco' },
    { label: 'México (Estado de México)', value: 'México (Estado de México)' },
    { label: 'Michoacán', value: 'Michoacán' },
    { label: 'Morelos', value: 'Morelos' },
    { label: 'Nayarit', value: 'Nayarit' },
    { label: 'Nuevo León', value: 'Nuevo León' },
    { label: 'Oaxaca', value: 'Oaxaca' },
    { label: 'Puebla', value: 'Puebla' },
    { label: 'Querétaro', value: 'Querétaro' },
    { label: 'Quintana Roo', value: 'Quintana Roo' },
    { label: 'San Luis Potosí', value: 'San Luis Potosí' },
    { label: 'Sinaloa', value: 'Sinaloa' },
    { label: 'Sonora', value: 'Sonora' },
    { label: 'Tabasco', value: 'Tabasco' },
    { label: 'Tamaulipas', value: 'Tamaulipas' },
    { label: 'Tlaxcala', value: 'Tlaxcala' },
    { label: 'Veracruz', value: 'Veracruz' },
    { label: 'Yucatán', value: 'Yucatán' },
    { label: 'Zacatecas', value: 'Zacatecas' },
  ]

  const refreshToken = async () => {
    try {
      const refreshToken = JSON.parse(localStorage.getItem('refresh-token'))
      const response = await axios.post(`${apiUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      })
      const newAccessToken = response.data.access
      localStorage.setItem('access-token', JSON.stringify(newAccessToken))
      return newAccessToken
    } catch (error) {
      console.error('Error al refrescar el token:', error)
      throw new Error('No se pudo renovar el token de acceso.')
    }
  }

  const formik = useFormik({
    initialValues: {
      lugarConvocatoria: '',
      fechaRegistro: null,
      fechaEntregaResultados: null,
      maxParticipantes: null,
    },
    validationSchema: Yup.object({
      lugarConvocatoria: Yup.string().required('El lugar es obligatorio'),
      fechaRegistro: Yup.date()
        .required('La fecha límite de registro es obligatoria')
        .nullable(),
      fechaEntregaResultados: Yup.date()
        .required('La fecha de entrega de resultados es obligatoria')
        .nullable(),
      maxParticipantes: Yup.number()
        .min(1, 'Debe haber al menos 1 participante')
        .required('El número máximo de participantes es obligatorio'),
    }),

    onSubmit: async (values) => {
      try {
        let token = JSON.parse(localStorage.getItem('access-token'))
        if (!token) {
          token = await refreshToken()
        }

        const fechaRegistroFormateada = new Date(values.fechaRegistro).toISOString().split('T')[0]
        const fechaEntregaFormateada = new Date(values.fechaEntregaResultados).toISOString().split('T')[0]

        const requestData = {
          lugar_convocatoria: values.lugarConvocatoria,
          fecha_limite_registro: fechaRegistroFormateada,
          fecha_entrega_resultados: fechaEntregaFormateada,
          max_participantes: parseInt(values.maxParticipantes, 10),
        }

        await axios.post(`${apiUrl}/captacion/convocatorias/`, requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        toast.current.show({
          severity: 'success',
          summary: 'Convocatoria registrada',
          detail: 'La convocatoria se registró exitosamente',
          life: 3000,
        })

        // Llamamos a la función de actualización
        if (onRegistroExitoso) {
          onRegistroExitoso()
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.detail || 'Hubo un problema al registrar la convocatoria'
        toast.current.show({
          severity: 'error',
          summary: 'Error al registrar',
          detail: errorMessage,
          life: 3000,
        })
    
        console.error('Error al registrar convocatoria:', error.response?.data || error)
      }
    },    
  })

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col">
        <div className="text-center p-3">
          <Card
            title="Registro de Convocatoria"
            className="shadow-8 border-round-lg"
            style={{ width: '40rem' }}
          >
            <form onSubmit={formik.handleSubmit} className="p-fluid">
              <div className="p-field mb-3">
                <label htmlFor="lugarConvocatoria">Lugar de la Convocatoria</label>
                <Dropdown
                  id="lugarConvocatoria"
                  name="lugarConvocatoria"
                  value={formik.values.lugarConvocatoria}
                  onChange={(e) =>
                    formik.setFieldValue('lugarConvocatoria', e.value)
                  }
                  options={lugares}
                  placeholder="Seleccione un lugar"
                  className={`p-inputtext-lg ${
                    formik.touched.lugarConvocatoria && formik.errors.lugarConvocatoria
                      ? 'p-invalid'
                      : ''
                  }`}
                />
                {formik.touched.lugarConvocatoria &&
                formik.errors.lugarConvocatoria ? (
                    <small className="p-error">{formik.errors.lugarConvocatoria}</small>
                  ) : null}
              </div>
              <div className="p-field mb-3">
                <label htmlFor="fechaRegistro">Fecha Límite de Registro</label>
                <Calendar
                  id="fechaRegistro"
                  name="fechaRegistro"
                  value={formik.values.fechaRegistro}
                  onChange={(e) =>
                    formik.setFieldValue('fechaRegistro', e.value)
                  }
                  placeholder="Seleccione una fecha"
                  dateFormat="dd/mm/yy"
                  showIcon
                  className={`p-inputtext-lg ${
                    formik.touched.fechaRegistro && formik.errors.fechaRegistro
                      ? 'p-invalid'
                      : ''
                  }`}
                />
                {formik.touched.fechaRegistro && formik.errors.fechaRegistro ? (
                  <small className="p-error">{formik.errors.fechaRegistro}</small>
                ) : null}
              </div>
              <div className="p-field mb-3">
                <label htmlFor="fechaEntregaResultados">
                  Fecha de Entrega de Resultados
                </label>
                <Calendar
                  id="fechaEntregaResultados"
                  name="fechaEntregaResultados"
                  value={formik.values.fechaEntregaResultados}
                  onChange={(e) =>
                    formik.setFieldValue('fechaEntregaResultados', e.value)
                  }
                  placeholder="Seleccione una fecha"
                  dateFormat="dd/mm/yy"
                  showIcon
                  className={`p-inputtext-lg ${
                    formik.touched.fechaEntregaResultados &&
                    formik.errors.fechaEntregaResultados
                      ? 'p-invalid'
                      : ''
                  }`}
                />
                {formik.touched.fechaEntregaResultados &&
                formik.errors.fechaEntregaResultados ? (
                    <small className="p-error">
                      {formik.errors.fechaEntregaResultados}
                    </small>
                  ) : null}
              </div>
              <div className="p-field mb-3">
                <label htmlFor="maxParticipantes">
                  Máximo Número de Participantes
                </label>
                <InputNumber
                  id="maxParticipantes"
                  name="maxParticipantes"
                  value={formik.values.maxParticipantes}
                  onValueChange={(e) =>
                    formik.setFieldValue('maxParticipantes', e.value)
                  }
                  placeholder="Ingrese la cantidad máxima"
                  min={1}
                  className={`p-inputtext-lg ${
                    formik.touched.maxParticipantes &&
                    formik.errors.maxParticipantes
                      ? 'p-invalid'
                      : ''
                  }`}
                />
                {formik.touched.maxParticipantes &&
                formik.errors.maxParticipantes ? (
                    <small className="p-error">{formik.errors.maxParticipantes}</small>
                  ) : null}
              </div>
              <Button
                label="Registrar Convocatoria"
                icon="pi pi-check"
                type="submit"
                className="p-button-primary p-button-block"
              />
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RegistroConvocatoria