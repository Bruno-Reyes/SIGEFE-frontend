//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Prime React Settings
import { PrimeReactProvider } from "primereact/api";

createRoot(document.getElementById("root")).render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>,
);
