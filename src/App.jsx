import React from "react";
import "primereact/resources/themes/bootstrap4-light-purple/theme.css";
import "primereact/resources/primereact.min.css"; //core css
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // flex

import Login from "./modules/ALC000_sistema_base/components/Login";
import { RegistroConvocatoria } from "./modules/ALC100_captacion/components/RegistroConvocatoria.jsx";
import { RegistroCandidato } from "./modules/ALC100_captacion/components/RegistroCandidato.jsx";  



function App() {
  return (
    <Router>
      <div className="App">
        <Routes
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Route path="/" element={<Login />} />
          <Route path="/registro-convocatoria" element={<RegistroConvocatoria />} />
          <Route path="/registro-candidato" element={<RegistroCandidato />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
