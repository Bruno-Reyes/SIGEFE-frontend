// GlOBAL CONFIGURATIONS (DON'T TOUCH) °°°°°°°°°°°°°°°°°
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { PrimeReactProvider } from "primereact/api";
import 'primereact/resources/themes/saga-blue/theme.css';  
import 'primereact/resources/primereact.min.css';          
import 'primeicons/primeicons.css';    
import 'primeflex/primeflex.css';    

// GlOBAL CONFIGURATIONS (DON'T TOUCH) °°°°°°°°°°°°°°°°°
import { PrivateRoutes } from "./routes/PrivateRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <PrimeReactProvider>
  <BrowserRouter>
    <Routes>
      {
        localStorage.length > 0
        ? <Route path="/*" element={<PrivateRoutes />} />
        : <Route path="/*" element={<PublicRoutes />} />
      }
        <Route path="*" element={<Navigate to="/login" replace/>} />
    </Routes>
  </BrowserRouter>
  </PrimeReactProvider>
);
