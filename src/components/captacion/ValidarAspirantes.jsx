import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button'
import { DatoAspirante } from './DatoAspirante';
import Loader from '../main/loader'

const API_URL = import.meta.env.VITE_API_URL;

export const ValidarAspirantes = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState()
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 18,
    sortField: null,
    sortOrder: null
  });
  const toast = useRef(null);

  const camposPersonales = () => {
    return [
      { campo: 'CURP', valor: candidatoSeleccionado.curp},
      { campo: 'Nombres', valor: candidatoSeleccionado.nombres },
      { campo: 'Apellido Paterno', valor: candidatoSeleccionado.apellido_paterno },
      { campo: 'Apellido Materno', valor: candidatoSeleccionado.apellido_materno },
      { campo: 'Fecha de Nacimiento', valor: candidatoSeleccionado.fecha_nacimiento },
      { campo: 'Género', valor: candidatoSeleccionado.genero }
    ];
  }
  const camposTallas = () => {
    return [
      { campo: 'Talla Playera', valor: candidatoSeleccionado.talla_playera },
      { campo: 'Talla Pantalón', valor: candidatoSeleccionado.talla_pantalon },
      { campo: 'Talla Calzado', valor: candidatoSeleccionado.talla_calzado },
      { campo: 'Peso (kg)', valor: candidatoSeleccionado.peso },
      { campo: 'Estatura (cm)', valor: candidatoSeleccionado.estatura }
    ]
  }
  const camposSalud = () => {
    return [
      { campo: 'Afecciones', valor: candidatoSeleccionado.afecciones }
    ]
  }
  const camposBancarios = () => {
    return [
      { campo: 'Banco', valor: candidatoSeleccionado.banco },
      { campo: 'CLABE', valor: candidatoSeleccionado.clabe }
    ]
  }
  const camposEstudiosYExpe = () => {
    return [
      { campo: 'Nivel de Estudios', valor: candidatoSeleccionado.nivel_estudios },
      { campo: 'Nivel de Estudios Deseado', valor: candidatoSeleccionado.nivel_estudios_deseado },
      { campo: 'Experiencia en Ciencia', valor: candidatoSeleccionado.experiencia_ciencia },
      { campo: 'Experiencia en Arte', valor: candidatoSeleccionado.experiencia_arte }
    ]
  }
  const camposIntereses = () => {
    return [
      { 
        campo: 'Interés en Desarrollo Comunitario', 
        valor: candidatoSeleccionado.interes_desarrollo_comunitario ? 'Sí' : 'No' 
      },
      { campo: 'Razones de Interés', valor: candidatoSeleccionado.razones_interes },
      { campo: 'Profesión de Interés', valor: candidatoSeleccionado.profesion_interes },
      { campo: 'Interés en Incorporación', valor: candidatoSeleccionado.interes_incorporacion }
    ]
  }
  const camposDireccion = () => {
    return [
      { campo: 'Código Postal', valor: candidatoSeleccionado.codigo_postal },
      { campo: 'Estado', valor: candidatoSeleccionado.estado },
      { campo: 'Colonia', valor: candidatoSeleccionado.colonia },
      { campo: 'Municipio', valor: candidatoSeleccionado.municipio },
      { campo: 'Localidad', valor: candidatoSeleccionado.localidad },
      { campo: 'Calle', valor: candidatoSeleccionado.calle },
      { campo: 'Número Exterior', valor: candidatoSeleccionado.numero_exterior },
      { campo: 'Número Interior', valor: candidatoSeleccionado.numero_interior }
    ]
  }
  const camposDocumentacion = () => {
    return [
      { campo: 'Certificado', valor: candidatoSeleccionado.certificado },
      { campo: 'Identificación', valor: candidatoSeleccionado.identificacion },
      { campo: 'Estado de Cuenta', valor: candidatoSeleccionado.estado_cuenta }
    ]
  }
  
  // Función para cargar los candidatos desde el backend
  const obtenerCandidatos = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("access-token"));
      const response = await fetch(`${API_URL}/captacion/candidatos/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const res = await response.json()
      setCandidatos(res); // Guardamos los datos de las convocatorias
      setLoading(false); // Detenemos el indicador de carga
    } catch (error) {
      setLoading(false); // Detenemos el indicador de carga
      const errorMessage = error.response?.data?.detail || 'Error';
      console.log(error);

      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000,
      });
    }
  };

  // Usamos useEffect para obtener las convocatorias al cargar el componente
  useEffect(() => {
    obtenerCandidatos()
  }, []);

  const onLazyLoad = (event) => {
    const { first, rows, sortField, sortOrder } = event;
    setLazyParams(event);
    let filteredData = [...candidatos];

    // Aplicar ordenamiento si se especifica
    if (sortField) {
      filteredData.sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];

        let result = 0;
        if (valueA < valueB) result = -1;
        if (valueA > valueB) result = 1;

        return sortOrder * result; // Multiplica por el orden (1 o -1)
      });
    }

    // Filtrar datos visibles de acuerdo con la paginación
    const paginatedData = filteredData.slice(first, first + rows);
    setData(paginatedData);
  };

  /* Renderizar el loader mientras se hace la peticion */
  if (loading) return <Loader />

  return (
    <>
      <Toast /> {/* Componente para notificaciones (en este caso, opcional si no se usa) */}
      <main style={{ 
        maxWidth: '1080px',
        margin: 'auto',
        display: 'grid',
        gridTemplateColumns: '2fr 3fr',
        columnGap: '40px'
      }}>
        <section>
          <DataTable 
            value={data || candidatos}
            lazy
            paginator
            first={lazyParams.first}
            rows={lazyParams.rows}
            onPage={onLazyLoad}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onSort={onLazyLoad}
            loading={loading}
            totalRecords={candidatos.length} 
            selection={candidatoSeleccionado}
            selectionMode='single'
            onSelectionChange={e => setCandidatoSeleccionado(e.value)}
            scrollable
          >
            <Column field='nombres' header='Nombre' sortable></Column>
            <Column field='apellido_paterno' header='Apellido Paterno' sortable></Column>
            <Column field='estado' header='Procedencia' sortable></Column>
          </DataTable>
        </section>
        {candidatoSeleccionado &&
          <section style={{
            height: '90vh', 
            overflow: 'hidden scroll',
            scrollbarWidth: 'thin',
            scrollbarGutter: 'auto'
          }}>
            <h3 style={{ textAlign: 'center' }}>Detalles del candidato</h3>

            <DatoAspirante 
              titulo='Datos Personales'
              campos={camposPersonales()}
            />

            <DatoAspirante 
              titulo='Información Física'
              campos={camposTallas()}
            />
            <DatoAspirante 
              titulo='Información de Salud'
              campos={camposSalud()}
            />
            <DatoAspirante 
              titulo='Información Bancaria'
              campos={camposBancarios()}
            />
            <DatoAspirante 
              titulo='Nivel de Estudios y Experiencia'
              campos={camposEstudiosYExpe()}
            />
            <DatoAspirante 
              titulo='Intereses'
              campos={camposIntereses()}
            />
            <DatoAspirante 
              titulo='Dirección'
              campos={camposDireccion()}
            />
            <DatoAspirante 
              titulo='Documentación'
              campos={camposDocumentacion()}
              link
            />

            <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '20px 0' }}>
              <Button label="❌ Rechazar" severity="danger" outlined  />
              <Button label="✅ Aceptar" severity="success" />
            </div>
          </section>
        }
      </main>
    </>
  )
}
