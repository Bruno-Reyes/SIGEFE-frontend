import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import axios from 'axios';
import materias from '../../tools/materias_nivel_educativo.json';
import { Toast } from 'primereact/toast';

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

const HistorialAcademicoEstudiante = () => {

  const [nombreAlumno, setNombreAlumno] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [data, setData] = useState([]);
  const [calificaciones, setCalificaciones] = useState({});
  const [dataPorNivel, setDataPorNivel] = useState({});
  const toast = React.useRef(null);

  const handleSearch = async () => {
    try {
      let token = JSON.parse(localStorage.getItem('access-token'));
      if (!token) {
        token = await refreshToken();
      }
      const response = await axios.get(`${apiUrl}/control_escolar/estudiantes/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          nombre: nombreAlumno,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
        },
      });

      const estudiante = response.data;
      const id_estudiante = estudiante.map(est => est.id).join(',');

      if (estudiante.length > 0) {

        let estudiante_data = [];
        estudiante_data.push(estudiante[0]);

        const reinscripciones = await axios.get(`${apiUrl}/control_escolar/reinscribir_estudiante/${id_estudiante}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        estudiante_data = [...estudiante_data, ...reinscripciones.data.reinscripciones];

        const datosPorNivel = estudiante_data.reduce((acc, estudiante) => {
          const nivel = estudiante.nivel_educativo;
          if (!acc[nivel]) {
            acc[nivel] = [];
          }
          acc[nivel].push(estudiante);
          return acc;
        }, {});

        setDataPorNivel(datosPorNivel);
        
        setData(estudiante_data);

        const calificacionesPromises = estudiante_data.map(async (est) => {

          const response = await axios.get(`${apiUrl}/control_escolar/calificaciones/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            params: {
              id_estudiante__in: id_estudiante,
              grado: est.grado,
              grupo: est.grupo,
            },
          }); {

          }

          return response.data;

        });

        const calificacionesResponse = await Promise.all(calificacionesPromises);

        const calificacionesData = calificacionesResponse.flat().reduce((acc, calificacion) => {
          const { grado, grupo, bimestre, materia, calificacion: value } = calificacion;
          const key = `${grado}_${grupo}_bimestre${bimestre}_${materia}`;

          if (!acc[grado]) {
            acc[grado] = {}; // Si no existe, inicializamos un objeto vacío para ese grado
          }

          // Asignamos la calificación al objeto correspondiente al grado, grupo, bimestre y materia
          acc[grado][key] = value;

          return acc;
        }, {});

        setCalificaciones(calificacionesData);


      } else {
        setData([]);
        console.warn('No se encontraron estudiantes con los criterios de búsqueda proporcionados.');
      }
    } catch (error) {
      console.error('Error al buscar estudiantes:', error);
    }
  };

  const nombreCompletoTemplate = (rowData) => {
    return `${rowData.apellido_paterno} ${rowData.apellido_materno} ${rowData.nombre}`;
  };

  // Modificar headerGroup para recibir nivel
  const headerGroup = (nivel) => {
    const materiasNivel = materias[nivel]?.Materias || [];

    return (
      <ColumnGroup>
        <Row>
          <Column header="Nombre del Alumno" rowSpan={2} style={{ width: '26%', border: '1px solid black' }} />
          <Column header="Grado" rowSpan={2} style={{ width: '1%', border: '1px solid black' }} />
          <Column header="Grupo" rowSpan={2} style={{ width: '1%', border: '1px solid black' }} />
          <Column header="Nivel Educativo" rowSpan={2} style={{ width: '1%', border: '1px solid black' }} />
          <Column header="Bimestre 1" colSpan={materiasNivel.length} style={{ border: '1px solid black', textAlign: 'center', justifyContent: 'center' }} />
          <Column header="Bimestre 2" colSpan={materiasNivel.length} style={{ border: '1px solid black', textAlign: 'center', justifyContent: 'center' }} />
          <Column header="Bimestre 3" colSpan={materiasNivel.length} style={{ border: '1px solid black', textAlign: 'center', justifyContent: 'center' }} />
          <Column header="Promedio" rowSpan={2} style={{ width: '1%', border: '1px solid black' }} />
        </Row>
        <Row>
          {[1, 2, 3].map(bimestre => (
            materiasNivel.map((materia, index) => (
              <Column
                key={`header_${bimestre}_${index}`}
                header={
                  <div className="rotated-header">
                    {materia}
                  </div>
                }
                style={{ border: '1px solid black' }}
              />
            ))
          ))}
        </Row>
      </ColumnGroup>
    );
  };

  const calculatePromedio = (calificaciones) => {
    const values = Object.values(calificaciones).filter(value => value !== undefined && value !== null);
    const sum = values.reduce((acc, value) => acc + parseFloat(value), 0);
    return values.length > 0 ? (sum / values.length).toFixed(2) : null;
  };

  // Modificar generateColumns para recibir nivel
  const generateColumns = (nivel) => {
    const materiasNivel = materias[nivel]?.Materias || [];
    const columns = [];

    // Columnas base
    columns.push(
      <Column key="nombreCompleto" field="nombreCompleto" body={nombreCompletoTemplate} style={{ width: "26%" }} />,
      <Column key="grado" field="grado" style={{ width: "1%" }} bodyStyle={{ textAlign: 'center', border: '1px solid black' }} />,
      <Column key="grupo" field="grupo" style={{ width: "1%" }} bodyStyle={{ textAlign: 'center', border: '1px solid black' }} />,
      <Column key="nivel" field="nivel_educativo" style={{ width: "1%" }} bodyStyle={{ textAlign: 'center', border: '1px solid black' }} />
    );

    // Columnas de calificaciones
    [1, 2, 3].forEach((bimestre) => {
      materiasNivel.forEach((materia) => {
        columns.push(
          <Column
            key={`${bimestre}_${materia}`}
            header={`${materia} B${bimestre}`}
            body={(rowData) => {
              const key = `${rowData.grado}_${rowData.grupo}_bimestre${bimestre}_${materia}`;
              const gradoCalificaciones = calificaciones[rowData.grado] || {};
              return <span>{gradoCalificaciones[key] ?? 'N/A'}</span>;
            }}
            bodyStyle={{ border: '1px solid black', textAlign: 'center' }}
          />
        );
      });
    });

    // Columna de promedio
    columns.push(
      <Column
        key="promedio"
        header="Promedio"
        body={(rowData) => {
          const gradoCalificaciones = calificaciones[rowData.grado] || {};
          const promedio = calculatePromedio(gradoCalificaciones);
          return <span>{promedio ?? 'N/A'}</span>;
        }}
        bodyStyle={{ border: '1px solid black', textAlign: 'center' }}
      />
    );

    return columns;
  };

  // Modificar exportPdf para manejar múltiples niveles
  const exportPdf = () => {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default('l', 'mm', 'a4');
        
        let startY = 20;
        Object.entries(dataPorNivel).forEach(([nivel, datosNivel]) => {
          const materiasNivel = materias[nivel]?.Materias || [];
          
          // Título del nivel
          doc.text(`Nivel: ${nivel}`, 14, startY - 10);
          
          // Crear headers para la tabla
          const headers = [
            'Nombre del Alumno',
            'Grado',
            'Grupo',
            'Nivel Educativo',
            ...materiasNivel.map(materia => `${materia} B1`),
            ...materiasNivel.map(materia => `${materia} B2`),
            ...materiasNivel.map(materia => `${materia} B3`),
            'Promedio'
          ];

          // Formatear datos
          const pdfData = datosNivel.map(rowData => {
            const row = [
              nombreCompletoTemplate(rowData),
              rowData.grado,
              rowData.grupo,
              rowData.nivel_educativo
            ];

            // Agregar calificaciones
            [1, 2, 3].forEach(bimestre => {
              materiasNivel.forEach(materia => {
                const key = `${rowData.grado}_${rowData.grupo}_bimestre${bimestre}_${materia}`;
                const gradoCalificaciones = calificaciones[rowData.grado] || {};
                row.push(gradoCalificaciones[key] ?? 'N/A');
              });
            });

            // Agregar promedio
            const gradoCalificaciones = calificaciones[rowData.grado] || {};
            const promedio = calculatePromedio(gradoCalificaciones);
            row.push(promedio ?? 'N/A');

            return row;
          });

          // Crear la tabla para este nivel
          doc.autoTable({
            head: [headers],
            body: pdfData,
            startY: startY,
            styles: { fontSize: 8, cellPadding: 1 },
            headStyles: { fillColor: [40, 100, 60] }
          });
          
          startY = doc.lastAutoTable.finalY + 20;
        });

        doc.save('historial_academico.pdf');
      });
    });
  };

  const renderTableForNivel = (nivel, datosNivel) => {
    return (
      <div key={nivel} style={{ marginBottom: '2rem' }}>
        <h2>Nivel: {nivel}</h2>
        <DataTable
          value={datosNivel}
          style={{ width: '100%' }}
          autoLayout
          headerColumnGroup={headerGroup(nivel)}
        >
          {generateColumns(nivel)}
        </DataTable>
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5%', marginTop: '2%' }}>
        <h1>Historial Académico del Estudiante</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2%', marginLeft: '5%' }}>
        <InputText
          value={nombreAlumno}
          onChange={(e) => setNombreAlumno(e.target.value)}
          placeholder="Nombre"
          style={{ width: '20%', marginRight: '1%' }}
        />
        <InputText
          value={apellidoPaterno}
          onChange={(e) => setApellidoPaterno(e.target.value)}
          placeholder="Apellido Paterno"
          style={{ width: '20%', marginRight: '1%' }}
        />
        <InputText
          value={apellidoMaterno}
          onChange={(e) => setApellidoMaterno(e.target.value)}
          placeholder="Apellido Materno"
          style={{ width: '20%', marginRight: '1%' }}
        />
        <Button
          label="Buscar"
          icon="pi pi-search"
          className="p-button-success"
          onClick={handleSearch}
        />

        {data.length > 0 && (
          <Button
            style={{ marginLeft: '1%' }}
            label="Exportar PDF"
            icon="pi pi-file-pdf"
            className="p-button-warning"
            onClick={exportPdf}
          />
        )} 
      </div>

      <div style={{ margin: '2% 5%' }}>
        {Object.entries(dataPorNivel).map(([nivel, datosNivel]) => 
          renderTableForNivel(nivel, datosNivel)
        )}
      </div>

      <style jsx>{`
        .rotated-header {
          transform: rotate(-90deg);
          display: flex;
          width: 20px;
          height: 80px;
          font-size: 12px;
          align-items: center;
          justify-content: center;
          white-space: normal;
        }
        .p-datatable .p-datatable-tbody > tr > td {
          border: 1px solid black;
        }
        .p-datatable .p-datatable-thead > tr > th {
          border: 1px solid black;
          white-space: normal;
        }
      `}</style>
    </div>
  );
};

export default HistorialAcademicoEstudiante;