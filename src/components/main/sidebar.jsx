import { Sidebar } from 'primereact/sidebar'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Ripple } from 'primereact/ripple'
import { StyleClass } from 'primereact/styleclass'

export default function UISidebar({ visible, onHide, setActiveComponent }) {

  const userInfo = (
    <div className="p-3">
      <p>
        <strong>Usuario:</strong> {localStorage.getItem('email')}
      </p>
    </div>
  )

  let items
  let usuario = localStorage.getItem('usuario')
    
  if (usuario === '"coord_nac_rrhh"') {
    items = (
      <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Convocatorias" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }}  onClick={() => setActiveComponent('convocatorias')} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Validar Candidatos" icon="pi pi-users" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('validar_aspirantes')}/>
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Aceptar Candidatos" icon="pi pi-users" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('candidatos')} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
            <Button label="Gestión de Pagos" icon="pi pi-wallet" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent("pagos")} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
            <Button label="Asignar Becas" icon="pi pi-wallet" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent("becas")} />
        </li>
      </ul>
    )
  } else if (usuario === '"lider_lec"') { 
    items = (
      <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>

        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="lider_lec" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }} />
        </li>

        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Registrar Estudiante" icon="pi pi-user-plus" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('registrar_estudiante')} />
        </li>

        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Registrar Calificaciones" icon="pi pi-pencil" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('registrar_calificaciones')} />
        </li>

        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Reinscribir Estudiante" icon="pi pi-refresh" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('reinscribir_estudiante')} />
        </li>

        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Historial Académico del Estudiante" icon="pi pi-book" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('historial_academico_estudiante')} />
        </li>

        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Gestión Historial Migratorio del estudiante" icon="pi pi-globe" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('gestion_historial_migratorio')} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
            <Button label="Pagos Pendientes" icon="pi pi-wallet" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent("pagos")} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
            <Button label="Consultar Progreso de Capacitación" icon="pi pi-chart-line" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent("consultar_progreso_capacitacion")} />
        </li>

      </ul>
    )
  } else if (usuario === '"coord_academico"') { 
    items = (
      <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Asignación de LECs" icon="pi pi-users" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('asignar_LEC')} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Historial Asignaciones LECs" icon="pi pi-calendar" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('historial_asignacionesLEC')} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Registrar Plan de Capacitación" icon="pi pi-file-edit" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('registrar_plan_capacitacion')} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Registrar Asistencia a Capacitaciones" icon="pi pi-check-square" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('registrar_asistencia_capacitaciones')} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Evaluar desempeño en Capacitaciones" icon="pi pi-star" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('evaluar_desempeño_capacitaciones')} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Generar Reportes de Capacitación" icon="pi pi-file-pdf" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('generar_reportes_capacitaciones')} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Dashboard Nacional de Desempeño en Capacitación Continua" icon="pi pi-chart-line" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('dashboard_capacitaciones')} />
        </li>
      </ul>
    )
  } else if (usuario === '"aux_operacion"') { 
    items = (
      <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="aux_operacion" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }} />
        </li>
      </ul>
    )
    
  } else if (usuario === '"aux_operacion"') { 
    items = (
      <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="aux_operacion" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }} />
        </li>
      </ul>
    )
  }
  else if (usuario === '"coord_nac_logistica"') { 
    items = (
      <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Registrar Equipo" icon="pi pi-wrench" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('equipo_disponible')} />
        </li>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="Asignar equipo a Centros Comunitarios" icon="pi pi-users" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent('asignar_equipo_centro')}/>
        </li>
      </ul>
    )
  } else if (usuario === '"coord_operativo"') { 
    items = (
      <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
        <li style={{ margin: '10px 0', width: '100%' }}>
          <Button label="coord_operativo" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }} />
        </li>
                
      </ul>
    )
  }


  return (
    <Sidebar visible={visible} onHide={onHide}>
      <div className="p-text-center p-mb-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src="/teacher_.svg"
          alt="User Avatar"
          className="p-mb-2"
          style={{ borderRadius: '50%', width: '20vw', maxWidth: '100px', height: 'auto' }} // Ajusta el tamaño aquí
        />
        {userInfo}
      </div>
      {items}
    </Sidebar>
  )
}