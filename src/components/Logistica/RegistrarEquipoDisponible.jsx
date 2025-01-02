import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { Toast } from 'primereact/toast';


const RegistrarEquipoDisponible = () => {
    
    const [formData, setFormData] = useState({
        nombre: '',
        cantidad: null,
        descripcion: '',
        categoria: null,
    });
    const toast = React.useRef(null);

    const categorias = [
        { label: 'Papelería', value: 'papeleria' },
        { label: 'Utilería', value: 'utileria' },
        { label: 'Tecnología', value: 'tecnologia' },
        { label: 'Mobiliario', value: 'mobiliario' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.nombre && formData.cantidad && formData.descripcion && formData.categoria) {
            console.log('Datos enviados:', formData);
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