import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

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

const RegistrarEstudiante = () => {


  const [estado, setEstado] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    edad: null,
    grado: '',
    grupo: '',
    promedio: null,
    centroEducativo: '',
    procedencia: estado,
    contacto: ''
  });
  const toast = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nombre && formData.edad && formData.grado && formData.grupo && formData.promedio && formData.centroEducativo && formData.procedencia && formData.contacto) {
      try {
        let token = JSON.parse(localStorage.getItem('access-token'));
        if (!token) {
          token = await refreshToken();
        }
        const response = await axios.post(`${apiUrl}/estudiantes/crear/`, {
          nombre: formData.nombre,
          edad: formData.edad,
          grado: formData.grado,
          grupo: formData.grupo,
          promedio: formData.promedio,
          centroEducativo: formData.centroEducativo,
          procedencia: formData.procedencia,
          contacto: formData.contacto,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Datos enviados:', response.data);
        toast.current.show({
          severity: 'success',
          summary: 'Estudiante Registrado',
          detail: 'El estudiante se ha registrado correctamente.',
          life: 3000,
        });
        setFormData({
          nombre: '',
          edad: null,
          grado: '',
          grupo: '',
          promedio: null,
          centroEducativo: '',
          procedencia: '',
          contacto: ''
        });
      } catch (error) {
        console.error('Error al enviar los datos:', error);
        if (error.response) {
          console.error('Detalles del error:', error.response.data);
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: `Hubo un problema al registrar el estudiante: ${JSON.stringify(error.response.data)}`,
            life: 3000,
          });
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un problema al registrar el estudiante.',
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
    <div>
      <Toast ref={toast} />
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5%', marginTop: '2%' }}>
            <h1>Registrar Estudiante</h1>
            </div>

    <div  style={{maxWidth: '33%', margin:'auto'}}>
      <form onSubmit={handleSubmit}>
        <div className="p-field" style={{ marginBottom: '16px' }}>
          <label htmlFor="nombre">Nombre</label>
          <InputText
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ingrese el nombre del estudiante"
            style={{ width: '100%' }}
          />
        </div>
        <div className="p-field" style={{ marginBottom: '16px' }}>
          <label htmlFor="edad">Edad</label>
          <InputNumber
            id="edad"
            value={formData.edad}
            onValueChange={(e) => setFormData({ ...formData, edad: e.value })}
            placeholder="Ingrese la edad del estudiante"
            style={{ width: '100%' }}
            min={1}
          />
        </div>
        <div className="p-field" style={{ marginBottom: '16px' }}>
          <label htmlFor="grado">Grado</label>
          <InputText
            id="grado"
            value={formData.grado}
            onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
            placeholder="Ingrese el grado del estudiante"
            style={{ width: '100%' }}
          />
        </div>
        <div className="p-field" style={{ marginBottom: '16px' }}>
          <label htmlFor="grupo">Grupo</label>
          <InputText
            id="grupo"
            value={formData.grupo}
            onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
            placeholder="Ingrese el grupo del estudiante"
            style={{ width: '100%' }}
          />
        </div>
        <div className="p-field" style={{ marginBottom: '16px' }}>
          <label htmlFor="promedio">Promedio Global</label>
          <InputNumber
            id="promedio"
            value={formData.promedio}
            onValueChange={(e) => setFormData({ ...formData, promedio: e.value })}
            placeholder="Ingrese el promedio global del estudiante"
            style={{ width: '100%' }}
            min={0}
            max={10}
            step={0.01}
          />
        </div>
        <div className="p-field" style={{ marginBottom: '16px' }}>
          <label htmlFor="procedencia">Procedencia</label>
          <InputText
            id="procedencia"
            value={formData.procedencia}
            onChange={(e) => setFormData({ ...formData, procedencia: e.target.value })}
            placeholder="Ingrese la procedencia del estudiante"
            style={{ width: '100%' }}
          />
        </div>
        <div className="p-field" style={{ marginBottom: '16px' }}>
          <label htmlFor="contacto">Datos de Contacto</label>
          <InputText
            id="contacto"
            value={formData.contacto}
            onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
            placeholder="Ingrese los datos de contacto del estudiante"
            style={{ width: '100%' }}
          />
        </div>
        <Button type="submit" label="Registrar Estudiante" icon="pi pi-save" className="p-button-success" />
      </form>
      </div>
    </div>
  );
};

export default RegistrarEstudiante;