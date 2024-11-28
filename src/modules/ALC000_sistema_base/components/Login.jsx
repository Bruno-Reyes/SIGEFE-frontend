import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import { useFormik } from "formik";
import * as Yup from "yup";

function Login() {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("El nombre del usuario es obligatorio"),
      password: Yup.string()
        .min(6, "La contraseña debe tener 6 caracteres")
        .required("La contraseña es obligatoria"),
    }),
    onSubmit: (values) => {
      //Logica para manejar el inicio de sesion
      // Llamamos hooks con axios
      console.log("Usuario: ", values.username);
      console.log("Contraseña: ", values.password);
    },
  });

  const header = <img alt="Card" src="/CU001.png" />;

  return (
    <div className="grid">
      <div className="col">
        <div className="p-3"></div>
      </div>
      <div className="col">
        <div className="text-center p-3">
          <Card
            title="Inicio de Sesión"
            className="shadow-8 border-round-lg"
            style={{ width: "25rem  " }}
            header={header}
          >
            <form onSubmit={formik.handleSubmit} className="p-fluid">
              <div className="p-field mb-3">
                <label htmlFor="username" className="p-d-block">
                  Usuario
                </label>
                <InputText
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ingrese su usuario"
                  className={`p-inputtext-lg ${formik.touched.username && formik.errors.username ? "p-invalid" : ""}`}
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
                  feedback={false} // Desactiva sugerencias de contraseña
                  placeholder="Ingrese su contraseña"
                  className={`p-inputtext-lg ${formik.touched.password && formik.errors.password ? "p-invalid" : ""}`}
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
  );
}

export default Login;