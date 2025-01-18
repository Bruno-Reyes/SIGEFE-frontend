import {useState} from 'react'

// Importamos componentes hijos
import Menu from '../components/main/menubar'
import Sidebar from '../components/main/sidebar'
import DefaultContent from '../components/main/loader'

// Componentes por tipo usuario
// - Lider para la Educacion Comunitaria
import RegistrarEstudiante from '../components/Control/RegistrarEstudiante'
import RegistrarCalificaciones from '../components/Control/RegistrarCalificaciones'
import ReinscribirEstudiante from '../components/Control/ReinscribirEstudiante'
import HistorialAcademicoEstudiante from '../components/Control/HistorialAcademicoEstudiante'
import GestionHistorialMigratorio from '../components/Control/GestionHistorialMigratorio'
// - Coordinador Nacional de Recursos Humanos
import Convocatorias from '../components/main/convocatorias'
import {ValidarAspirantes} from '../components/captacion/ValidarAspirantes'
// - Coordinador Academico
import AsignarLEC from '../components/Asignación/AsignarLEC'
import { Candidatos } from '../components/Candidatos/Candidatos'
import RegistrarEquipoDisponible from '../components/Logistica/RegistrarEquipoDisponible'
import HistorialAsignacionesLEC from '../components/Asignación/HistorialAsignacionesLEC'
import '@fontsource/roboto' // Fuente Roboto con pesos predeterminados
import AsignarEquipoCentro from '../components/Logistica/AsignarEquipoCentro'
import MostrarPagosPendientes from "../components/registro_pagos/MostrarPagosPendientes";
import RegistrarPago from "../components/registro_pagos/RegistrarPago";
import Becas from "../components/apoyos_economicos/asignarBeca";
import RegistrarPlanCapacitacion from '../components/Capacitación/RegistrarPlanCapacitacion'
import ConsultarProgresoCapacitacion from '../components/Capacitación/ConsultarProgresoCapacitacion';
import RegistrarAsistenciaCapacitaciones from '../components/Capacitación/RegistrarAsistenciaCapacitaciones';
import GenerarReportesCapacitacion from '../components/Capacitación/GenerarReportesCapacitaciones';
// - Auxiliar de operacion
// - Coordinador Nacional de Apoyo y Logistica
// - Coordinador Operativo
import '@fontsource/roboto' // Fuente Roboto con pesos predeterminados

const HomePage = () => {

  const [visible, setVisible] = useState(false)
  const [activeComponent, setActiveComponent] = useState('default')
  
  const toggleSidebar = () => {
    setVisible(!visible)
  }

  const renderContent = () => {
    switch (activeComponent) {
    // Componentes por tipo de usuario

    // - Coordinador Nacional de Recursos Humanos
    case 'convocatorias':
      return <Convocatorias />
    case 'validar_aspirantes':
      return <ValidarAspirantes />
    case 'asignar_LEC':
      return <AsignarLEC/>
    case 'candidatos':
      return <Candidatos/>
    case 'equipo_disponible':
      return <RegistrarEquipoDisponible/>
    case 'asignar_equipo_centro':
      return <AsignarEquipoCentro/>
    case 'historial_asignacionesLEC':
      return <HistorialAsignacionesLEC />
    case 'registrar_estudiante':
      return <RegistrarEstudiante/>
    case 'registrar_calificaciones':
      return <RegistrarCalificaciones/>
    case 'reinscribir_estudiante':
      return <ReinscribirEstudiante/>
    case 'historial_academico_estudiante':
      return <HistorialAcademicoEstudiante/>
    case 'gestion_historial_migratorio':
      return <GestionHistorialMigratorio/>
    case "pagos":
        return <MostrarPagosPendientes />;
    case "registrar-pago":
        return <RegistrarPago />;
    case "becas":
        return <Becas />;
    case 'consultar_progreso_capacitacion':
      return <ConsultarProgresoCapacitacion/>
    case 'registrar_plan_capacitacion':
      return <RegistrarPlanCapacitacion/>
    case 'registrar_asistencia_capacitaciones':
      return <RegistrarAsistenciaCapacitaciones/>
    case 'generar_reportes_capacitaciones':
      return <GenerarReportesCapacitacion/>
    default:
      return <DefaultContent /> 
    }
  }
  
  return(
    <div style={{fontFamily: 'Roboto, sans-serif'}}>
      <Menu toggleSidebar={toggleSidebar}/>
      <Sidebar visible={visible} onHide={() => setVisible(false)} setActiveComponent={setActiveComponent}/>
      <div>{renderContent()}</div>
    </div>
  )
}
  
export default HomePage