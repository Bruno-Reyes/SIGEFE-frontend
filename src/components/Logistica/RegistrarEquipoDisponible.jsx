import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Función para refrescar el token
const refreshToken = async () => {
    try {
        const refreshToken = JSON.parse(localStorage.getItem("refresh-token"));
        const response = await axios.post(`${apiUrl}/auth/token/refresh/`, {
            refresh: refreshToken,
        });
        const newAccessToken = response.data.access;
        localStorage.setItem("access-token", JSON.stringify(newAccessToken));
        return newAccessToken;
    } catch (error) {
        console.error("Error al refrescar el token:", error);
        throw new Error("No se pudo renovar el token de acceso.");
    }
};

const stripHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
};

const RegistrarEquipoDisponible = () => {
    
    const [formData, setFormData] = useState({
        nombre: '',
        cantidad: null,
        descripcion: '',
        categoria: null,
    });
    const toast = React.useRef(null);

    const categorias = [
        { label: 'Papelería', value: 'Papelería' },
        { label: 'Utilería', value: 'Utilería' },
        { label: 'Tecnología', value: 'Tecnología' },
        { label: 'Mobiliario', value: 'Mobiliario' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.nombre && formData.cantidad && formData.descripcion && formData.categoria) {
            try {
                let token = JSON.parse(localStorage.getItem("access-token"));
                if (!token) {
                    token = await refreshToken();
                }
                const descripcionSinHtml = stripHtmlTags(formData.descripcion);
                const response = await axios.post(`${apiUrl}/logistica/crear/`, {
                    nombre_equipo: formData.nombre,
                    cantidad_disponible: formData.cantidad,
                    descripcion: descripcionSinHtml,
                    categoria: formData.categoria, 
                    
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                console.log('Datos enviados:', response.data);
                toast.current.show({
                    severity: 'success',
                    summary: 'Equipo Subido',
                    detail: 'El equipo se ha subido correctamente.',
                    life: 3000,
                });
                setFormData({
                    nombre: '',
                    cantidad: null,
                    descripcion: '',
                    categoria: null,
                });
            } catch (error) {
                console.error('Error al enviar los datos:', error);
                if (error.response) {
                    console.error('Detalles del error:', error.response.data);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Hubo un problema al subir el equipo: ${JSON.stringify(error.response.data)}`,
                        life: 3000,
                    });
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Hubo un problema al subir el equipo.',
                        life: 3000,
                    });
                }
            }
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, complete todos los campos.',
                life: 3000,
            });
        }
    };

    return (
        <div style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
            <Toast ref={toast} />
            <h2>Subir Equipo</h2>
            <form onSubmit={handleSubmit}>
                <div className="p-field" style={{ marginBottom: '16px' }}>
                    <label htmlFor="nombre">Nombre del Equipo</label>
                    <InputText
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ingrese el nombre del equipo"
                        style={{ width: '100%' }}
                    />
                </div>
                <div className="p-field" style={{ marginBottom: '16px' }}>
                    <label htmlFor="cantidad">Cantidad Disponible</label>
                    <InputNumber
                        id="cantidad"
                        value={formData.cantidad}
                        onValueChange={(e) => setFormData({ ...formData, cantidad: e.value })}
                        placeholder="Ingrese la cantidad disponible"
                        style={{ width: '100%' }}
                        min={1}
                    />
                </div>
                <div className="p-field" style={{ marginBottom: '16px' }}>
                    <label htmlFor="descripcion">Descripción</label>
                    <Editor
                        id="descripcion"
                        value={formData.descripcion}
                        onTextChange={(e) => setFormData({ ...formData, descripcion: e.htmlValue })}
                        style={{ height: '150px' }}
                        placeholder="Describa el equipo"
                    />
                </div>
                <div className="p-field" style={{ marginBottom: '16px' }}>
                    <label htmlFor="categoria">Categoría</label>
                    <Dropdown
                        id="categoria"
                        value={formData.categoria}
                        options={categorias}
                        onChange={(e) => setFormData({ ...formData, categoria: e.value })}
                        placeholder="Seleccione una categoría"
                        style={{ width: '100%' }}
                    />
                </div>
                <Button type="submit" label="Subir Equipo" icon="pi pi-upload" className="p-button-success" />
            </form>
        </div>
    );
};

export default RegistrarEquipoDisponible