import {useState} from "react";

// Importamos componentes hijos
import Menu from "../components/main/menubar";
import Sidebar from "../components/main/sidebar"
import DefaultContent from "../components/main/loader";

// Componentes por tipo usuario
// - Lider para la Educacion Comunitaria
// - Coordinador Nacional de Recursos Humanos
import Convocatorias from "../components/main/convocatorias";
import {ValidarAspirantes} from "../components/captacion/ValidarAspirantes";
// - Coordinador Academico
import AsignarLEC from "../components/Asignación/AsignarLEC";
import Candidatos from "../components/Candidatos/Candidatos";
import RegistrarEquipoDisponible from "../components/Logistica/RegistrarEquipoDisponible";
import HistorialAsignacionesLEC from "../components/Asignación/HistorialAsignacionesLEC";
import '@fontsource/roboto'; // Fuente Roboto con pesos predeterminados
import AsignarEquipoCentro from "../components/Logistica/AsignarEquipoCentro";
// - Auxiliar de operacion
// - Coordinador Nacional de Apoyo y Logistica
// - Coordinador Operativo
import '@fontsource/roboto'; // Fuente Roboto con pesos predeterminados

const styles = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 400,
};

const HomePage = () => {

  const [visible, setVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState("default");
  
  const toggleSidebar = () => {
    setVisible(!visible);
  };

  const renderContent = () => {
    switch (activeComponent) {
    // Componentes por tipo de usuario

<<<<<<< HEAD
    // - Coordinador Nacional de Recursos Humanos
    case "convocatorias":
      return <Convocatorias />;
    case "validar_aspirantes":
      return <ValidarAspirantes />;
    case "asignar_LEC":
      return <AsignarLEC/>;
    case "candidatos":
      return <Candidatos/>
    case "equipo_disponible":
      return <RegistrarEquipoDisponible/>
    case "asignar_equipo_centro":
      return <AsignarEquipoCentro/>
    default:
      return <h1>Main</h1>;
    }
=======
      // - Coordinador Nacional de Recursos Humanos
      case "convocatorias":
        return <Convocatorias />;
      case "validar_aspirantes":
        return <ValidarAspirantes />;
      case "asignar_LEC":
        return <AsignarLEC/>;
      case "candidatos":
        return <Candidatos/>
      case "equipo_disponible":
        return <RegistrarEquipoDisponible/>
      case "asignar_equipo_centro":
        return <AsignarEquipoCentro/>
      case "historial_asignacionesLEC":
        return <HistorialAsignacionesLEC />;
        default:
          return <DefaultContent />;
      }
    };
  
    return(
      <div>
        <Menu toggleSidebar={toggleSidebar}/>
        <Sidebar visible={visible} onHide={() => setVisible(false)} setActiveComponent={setActiveComponent}/>
        <div>{renderContent()}</div>
      </div>
    )
>>>>>>> 2362d67e4e0b9bb309d97ba44a4ed7afa77ab9f9
  };
  
  export default HomePage;