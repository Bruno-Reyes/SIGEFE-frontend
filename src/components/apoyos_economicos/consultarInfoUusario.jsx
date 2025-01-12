import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './UserDetailView.css';

const UserDetailView = () => {
  //const id = localStorage.getItem('id_to_check');
  const id = 19

  const [userDetails, setUserDetails] = useState(null);
  const [scholarship, setScholarship] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('access-token'));
        const userResponse = await axios.get(`${apiUrl}/captacion/lec/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const scholarshipResponse = await axios.get(`${apiUrl}/pagos/beca-lec/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserDetails(userResponse.data);
        // Verifica que el array no esté vacío antes de acceder al objeto
        if (scholarshipResponse.data.length > 0) {
            setScholarship(scholarshipResponse.data[0].tipo_beca);
        } else {
            setScholarship(null);
        }
      } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (!userDetails) {
    return <p>Cargando detalles del usuario...</p>;
  }

  return (
    <div className="container mt-4 gov-mx-style">
      <header className="text-center mb-4">
        <h1>Detalles del Líder Educativo</h1>
      </header>

      <main>
        <div className="user-details">
          <h2>{`${userDetails.nombres} ${userDetails.apellido_paterno} ${userDetails.apellido_materno}`}</h2>
          <p><strong>CURP:</strong> {userDetails.curp}</p>
          <p><strong>Fecha de Nacimiento:</strong> {userDetails.fecha_nacimiento}</p>
          <p><strong>Género:</strong> {userDetails.genero === 'M' ? 'Masculino' : 'Femenino'}</p>
          <p><strong>Talla de Playera:</strong> {userDetails.talla_playera}</p>
          <p><strong>Talla de Pantalón:</strong> {userDetails.talla_pantalon}</p>
          <p><strong>Talla de Calzado:</strong> {userDetails.talla_calzado}</p>
          <p><strong>Peso:</strong> {userDetails.peso} kg</p>
          <p><strong>Estatura:</strong> {userDetails.estatura} cm</p>
          <p><strong>Afecciones:</strong> {userDetails.afecciones}</p>
          <p><strong>Banco:</strong> {userDetails.banco}</p>
          <p><strong>CLABE:</strong> {userDetails.clabe}</p>
          <p><strong>Nivel de Estudios:</strong> {userDetails.nivel_estudios}</p>
          <p><strong>Nivel de Estudios Deseado:</strong> {userDetails.nivel_estudios_deseado}</p>
          <p><strong>Experiencia en Ciencias:</strong> {userDetails.experiencia_ciencia}</p>
          <p><strong>Experiencia en Arte:</strong> {userDetails.experiencia_arte}</p>
          <p><strong>Interés en Desarrollo Comunitario:</strong> {userDetails.interes_desarrollo_comunitario ? 'Sí' : 'No'}</p>
          <p><strong>Razones de Interés:</strong> {userDetails.razones_interes}</p>
          <p><strong>Profesión de Interés:</strong> {userDetails.profesion_interes}</p>
          <p><strong>Interés en Incorporación:</strong> {userDetails.interes_incorporacion}</p>
          <p><strong>Código Postal:</strong> {userDetails.codigo_postal}</p>
          <p><strong>Estado:</strong> {userDetails.estado}</p>
          <p><strong>Municipio:</strong> {userDetails.municipio}</p>
          <p><strong>Localidad:</strong> {userDetails.localidad}</p>
          <p><strong>Calle:</strong> {userDetails.calle}</p>
          <p><strong>Número Exterior:</strong> {userDetails.numero_exterior}</p>
          <p><strong>Número Interior:</strong> {userDetails.numero_interior || 'N/A'}</p>
          <p><strong>Estado de Aceptación:</strong> {userDetails.estado_aceptacion}</p>
          <p><strong>Tipo de Beca Asignada:</strong> {scholarship?.tipo || 'Sin asignar'}</p>
          <p><strong>Monto de la Beca:</strong> ${scholarship?.monto || 'N/A'}</p>

          <h3>Documentos</h3>
          <ul>
            <li>
              <a href={userDetails.certificado} target="_blank" rel="noopener noreferrer">
                Certificado
              </a>
            </li>
            <li>
              <a href={userDetails.identificacion} target="_blank" rel="noopener noreferrer">
                Identificación
              </a>
            </li>
            <li>
              <a href={userDetails.estado_cuenta} target="_blank" rel="noopener noreferrer">
                Estado de Cuenta
              </a>
            </li>
          </ul>
        </div>
      </main>

      <footer className="text-center mt-4">
        <p>&copy; 2024 Administración Pública. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default UserDetailView;
