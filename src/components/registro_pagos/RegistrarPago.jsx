import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";
import * as Yup from "yup";

const apiUrl = import.meta.env.VITE_API_URL;

const RegistrarPago = () => {
    const toast = React.useRef(null);
    const [usuariosLec, setUsuariosLec] = useState([]);
    const [loading, setLoading] = useState(false);

    // Opciones para el dropdown de conceptos
    const conceptos = [
        { label: "Beca", value: "Beca" },
        { label: "Seguimiento", value: "Seguimiento" },
        { label: "Continuacion", value: "Continuacion" },
    ];

    // Obtener usuarios LIDER_LEC desde el backend
    const obtenerUsuariosLec = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("access-token"));
            const response = await axios.get(`${apiUrl}/usuarios/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Filtrar usuarios con tipo_usuario === "LIDER_LEC"
            const usuariosFiltrados = response.data.filter(
                (user) => user.tipo_usuario === "LIDER_LEC"
            );
            setUsuariosLec(
                usuariosFiltrados.map((usuario) => ({
                    label: usuario.email,
                    value: usuario.id,
                }))
            );
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudieron cargar los usuarios.",
                life: 3000,
            });
        }
    };

    useEffect(() => {
        obtenerUsuariosLec();
    }, []);

    // Formik para manejo del formulario
    const formik = useFormik({
        initialValues: {
            usuario: "", // ID del usuario LIDER_LEC
            concepto: "", // Concepto seleccionado
            monto: null, // Monto ingresado
        },
        validationSchema: Yup.object({
            usuario: Yup.string().required("El usuario es obligatorio."),
            concepto: Yup.string().required("El concepto es obligatorio."),
            monto: Yup.number()
                .positive("Debe ser un número positivo.")
                .required("El monto es obligatorio."),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const token = JSON.parse(localStorage.getItem("access-token"));

                // Enviar datos al backend
                await axios.post(`${apiUrl}/pagos/registrar/`, values, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Mostrar éxito
                toast.current.show({
                    severity: "success",
                    summary: "Pago Registrado",
                    detail: "Pago registrado con éxito",
                    life: 3000,
                });
                formik.resetForm();
            } catch (error) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "No se pudo registrar el pago",
                    life: 3000,
                });
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div>
            <Toast ref={toast} />
            <h2>Registrar Pago</h2>
            <form onSubmit={formik.handleSubmit}>
                {/* Dropdown para usuarios */}
                <div className="p-field">
                    <label htmlFor="usuario">Usuario</label>
                    <Dropdown
                        id="usuario"
                        value={formik.values.usuario}
                        options={usuariosLec}
                        onChange={(e) => formik.setFieldValue("usuario", e.value)}
                        placeholder="Seleccione un usuario"
                        className={formik.errors.usuario ? "p-invalid" : ""}
                    />
                    {formik.touched.usuario && formik.errors.usuario ? (
                        <small className="p-error">{formik.errors.usuario}</small>
                    ) : null}
                </div>

                {/* Dropdown para conceptos */}
                <div className="p-field">
                    <label htmlFor="concepto">Concepto</label>
                    <Dropdown
                        id="concepto"
                        value={formik.values.concepto}
                        options={conceptos}
                        onChange={(e) => formik.setFieldValue("concepto", e.value)}
                        placeholder="Seleccione un concepto"
                        className={formik.errors.concepto ? "p-invalid" : ""}
                    />
                    {formik.touched.concepto && formik.errors.concepto ? (
                        <small className="p-error">{formik.errors.concepto}</small>
                    ) : null}
                </div>

                {/* Input para monto */}
                <div className="p-field">
                    <label htmlFor="monto">Monto</label>
                    <InputNumber
                        id="monto"
                        value={formik.values.monto}
                        onValueChange={(e) => formik.setFieldValue("monto", e.value)}
                        mode="currency"
                        currency="MXN"
                        locale="es-MX"
                        className={formik.errors.monto ? "p-invalid" : ""}
                    />
                    {formik.touched.monto && formik.errors.monto ? (
                        <small className="p-error">{formik.errors.monto}</small>
                    ) : null}
                </div>

                {/* Botón para enviar */}
                <Button
                    label={loading ? "Registrando..." : "Registrar Pago"}
                    type="submit"
                    disabled={loading}
                    className="p-mt-3"
                />
            </form>
        </div>
    );
};

export default RegistrarPago;
