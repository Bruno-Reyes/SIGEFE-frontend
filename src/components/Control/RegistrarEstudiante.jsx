import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
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

  const email = localStorage.getItem('email');

  const [centro, setCentro] = useState('');
  const [idLEC, setIdLEC] = useState('');

  const nivelEducativoOptions = [
    { label: 'Preescolar', value: 'Preescolar' },
    { label: 'Primaria', value: 'Primaria' },
    { label: 'Secundaria', value: 'Secundaria' },
  ]

  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    edad: null,
    grado: '',
    grupo: '',
    promedio: null,
    procedencia: '',
    contacto: '',
    nivel_educativo: '' 
  });
  const toast = React.useRef(null);

  const [gradoOptions, setGradoOptions] = useState([]);
  const [isGradoDisabled, setIsGradoDisabled] = useState(true);

  const handleNivelEducativoChange = (e) => {
    const nivel = e.value;
    setFormData({ ...formData, nivel_educativo: nivel });

    let options = [];
    if (nivel === 'Preescolar') {
      options = [1, 2, 3];
    } else if (nivel === 'Primaria') {
      options = [1, 2, 3, 4, 5, 6];
    } else if (nivel === 'Secundaria') {
      options = [1, 2, 3];
    }
    setGradoOptions(options.map((grado) => ({ label: grado, value: grado })));
    setIsGradoDisabled(false);
  };

  useEffect(() => {
    const fetchLECDetails = async () => {
      try {
        let token = JSON.parse(localStorage.getItem('access-token'));
        if (!token) {
          token = await refreshToken();
        }
        const response = await axios.get(`${apiUrl}/asignacion/lec/email/${email}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setCentro(response.data.centro_asignado);
        setIdLEC(response.data.id);
        
      } catch (error) {
        console.error('Error al obtener los detalles del LEC:', error);
      }
    };

    fetchLECDetails();
  }, [email]);

  const handleGrupoChange = (e) => {
    setFormData({ ...formData, grupo: e.target.value.toUpperCase() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nombre && formData.apellido_paterno && formData.apellido_materno && formData.edad && formData.grado && formData.grupo && formData.promedio && formData.procedencia && formData.contacto) {
      try {
        let token = JSON.parse(localStorage.getItem('access-token'));
        if (!token) {
          token = await refreshToken();
        }

        const email = localStorage.getItem('email'); // Obtener el email del local storage
        if (!email) {
          throw new Error('No se pudo obtener el email del local storage.');
        }

        const fechaInscripcion = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD

        const response = await axios.post(`${apiUrl}/control_escolar/estudiantes/`, {
          id_lec: idLEC,
          nombre: formData.nombre,
          apellido_paterno: formData.apellido_paterno,
          apellido_materno: formData.apellido_materno,
          edad: formData.edad,
          grado: formData.grado,
          grupo: formData.grupo,
          promedio_global: formData.promedio,
          centro_educativo: centro,
          procedencia: formData.procedencia,
          contacto: formData.contacto,
          nivel_educativo: formData.nivel_educativo,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 201) {
          const estudianteId = response.data.id;
          const historialResponse = await axios.post(`${apiUrl}/control_escolar/historial_migratorio/`, {
            id_estudiante: estudianteId,
            fecha_inscripcion: fechaInscripcion,
            clave_centro_trabajo: centro,
            email // Agregar el email al payload
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });

          // Limpiar los campos del formulario
          setFormData({
            nombre: '',
            apellido_paterno: '',
            apellido_materno: '',
            edad: null,
            grado: '',
            grupo: '',
            promedio: null,
            procedencia: '',
            contacto: '',
            nivel_educativo: ''
          });

          toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: `El estudiante ${formData.nombre} ha sido registrado correctamente.`,
            life: 3000,
          });
        } else {
          throw new Error('Error al registrar el estudiante');
        }
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
    <div style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
      <Toast ref={toast} />
      <h2>Registrar Estudiante</h2>
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
          <label htmlFor="apellido_paterno">Apellido Paterno</label>
          <InputText
            id="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={(e) => setFormData({ ...formData, apellido_paterno: e.target.value })}
            placeholder="Ingrese el apellido paterno del estudiante"
            style={{ width: '100%' }}
          />
        </div>
        <div className="p-field" style={{ marginBottom: '16px' }}>
          <label htmlFor="apellido_materno">Apellido Materno</label>
          <InputText
            id="apellido_materno"
            value={formData.apellido_materno}
            onChange={(e) => setFormData({ ...formData, apellido_materno: e.target.value })}
            placeholder="Ingrese el apellido materno del estudiante"
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
          <label htmlFor="nivelEducativo">Nivel Educativo</label>
          <Dropdown
            id="nivelEducativo"
            value={formData.nivel_educativo}
            options={nivelEducativoOptions}
            onChange={handleNivelEducativoChange}
            placeholder="Seleccione el nivel educativo"
            style={{ width: '100%' }}
          />
        </div>
        <div className="p-field" style={{ marginBottom: '16px' }}>
          <label htmlFor="grado">Grado</label>
          <Dropdown
            id="grado"
            value={formData.grado}
            options={gradoOptions}
            onChange={(e) => setFormData({ ...formData, grado: e.value })}
            placeholder="Seleccione el grado"
            style={{ width: '100%' }}
            disabled={isGradoDisabled}
          />
        </div>
        <div className="p-field" style={{ marginBottom: '16px' }}>
          <label htmlFor="grupo">Grupo</label>
          <InputText
            id="grupo"
            value={formData.grupo}
            onChange={handleGrupoChange}
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
  );
};

export default RegistrarEstudiante;