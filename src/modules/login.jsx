import { useRef } from 'react'
import axios from 'axios'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { useFormik } from 'formik'

import * as Yup from 'yup'

const apiUrl = import.meta.env.VITE_API_URL


function Login() {

  const toast = useRef(null)

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('El nombre del usuario es obligatorio'),
      password: Yup.string()
        .min(6, 'La contraseña debe tener 6 caracteres')
        .required('La contraseña es obligatoria'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(apiUrl+'/auth/token/', {
          email: values.username,
          password: values.password,
        })

        toast.current.show({
          severity: 'success',
          summary: 'Inicio exitoso',
          detail: `Bienvenido ${username}`,
          life: 3000,
        })

        // Establecer los datos en el localStorage
        localStorage.setItem('access-token', JSON.stringify(response.data.access))
        localStorage.setItem('refresh-token', JSON.stringify(response.data.refresh))
        localStorage.setItem('email', response.data.payload.email)
        localStorage.setItem('usuario', JSON.stringify(response.data.payload.tipo_usuario))
        localStorage.setItem('sidebar', true)
  
        // Redirigir a la página de inicio
        window.location.reload()
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'Error de autenticación',
          detail: error.response.data.non_field_errors[0],
          life: 3000,
        })
      }
    },
  })

  const header = <img alt="Card" src="/CU001.png" />

  return (
    <div className="grid">
      <Toast ref={toast} /> {/* Componente para notificaciones */}
      <div className="col">
        <div className="p-3"></div>
      </div>
      <div className="col">
        <div className="text-center p-3">
          <Card
            title="Inicio de Sesión"
            className="shadow-8 border-round-lg"
            style={{ width: '25rem' }}
            header={header}
          >
            <form onSubmit={formik.handleSubmit} className="p-fluid">
              <div className="p-field mb-3">
                <label htmlFor="username" className="p-d-block">
                  Correo electrónico
                </label>
                <InputText
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ingrese su correo electrónico"
                  className={`p-inputtext-lg ${formik.touched.username && formik.errors.username ? 'p-invalid' : ''}`}
                />
                {formik.touched.username && formik.errors.username ? (
                  <small className="p-error">{formik.errors.username}</small>
                ) : null}
              </div>
              <div className="p-field mb-3">
                <label htmlFor="password" className="p-d-block">
                  Contraseña
                </label>
                <Password
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  feedback={false}
                  placeholder="Ingrese su contraseña"
                  className={`p-inputtext-lg ${formik.touched.password && formik.errors.password ? 'p-invalid' : ''}`}
                  toggleMask
                />
                {formik.touched.password && formik.errors.password ? (
                  <small className="p-error">{formik.errors.password}</small>
                ) : null}
              </div>
              <Button
                label="Iniciar Sesión"
                icon="pi pi-sign-in"
                type="submit"
                className="p-button-primary p-button-block"
              />
            </form>
          </Card>
        </div>
      </div>
      <div className="col">
        <div className="p-3"></div>
      </div>
    </div>
  )
}

export default Login
