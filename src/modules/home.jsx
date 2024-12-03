import React, {useState} from "react";

// Importamos componentes hijos
import Menu from "../components/main/menubar";
import Sidebar from "../components/main/sidebar";
import DefaultContent from "../components/main/loader";

// Componentes por tipo usuario
// - Lider para la Educacion Comunitaria
// - Aspirante a Lider para la Educacion Comunitaria
// - Coordinador Nacional de Recursos Humanos
import Convocatorias from "../components/main/convocatorias";
// - Coordinador Academico
// - Auxiliar de operacion
// - Coordinador Nacional de Apoyo y Logistica
// - Coordinador Operativo

const HomePage = () => {

  const [visible, setVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState("default");
  
  const toggleSidebar = () => {
    setVisible(!visible);
  };

  const renderContent = () => {
    switch (activeComponent) {
      case "convocatorias":
        return <Convocatorias />;
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
};

export default HomePage;