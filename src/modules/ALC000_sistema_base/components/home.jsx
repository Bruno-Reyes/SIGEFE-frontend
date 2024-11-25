import React from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { Card } from "primereact/card";

const Dashboard = ({ username, userType }) => {
  const items = [
    { label: "Inicio", icon: "pi pi-home" },
    { label: "Administración", icon: "pi pi-cog" },
    { label: "Usuarios", icon: "pi pi-users" },
    { label: "Libros", icon: "pi pi-book" },
    { label: "Salir", icon: "pi pi-sign-out", command: () => (window.location.href = "/") },
  ];

  const userInfo = (
    <div className="p-3">
      <p>
        <strong>Usuario:</strong> {username}
      </p>
      <p>
        <strong>Tipo:</strong> {userType}
      </p>
    </div>
  );

  return (
    <div className="grid">
      <div className="col-3">
        <Sidebar visible={true} showCloseIcon={false}>
          <div className="p-text-center p-mb-3">
            <img
              src="https://via.placeholder.com/100"
              alt="User Avatar"
              className="p-mb-2"
              style={{ borderRadius: "50%" }}
            />
            {userInfo}
          </div>
          <Menubar model={items} />
        </Sidebar>
      </div>
      <div className="col-9">
        <div className="p-3">
          <Card title="Bienvenido al Dashboard">
            <p>
              Este es un ejemplo de cómo puede lucir tu pantalla principal después de un inicio de sesión exitoso.
            </p>
            <p>Agrega los módulos que necesites para expandir esta funcionalidad.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
