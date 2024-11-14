import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Lógica para manejar el inicio de sesión
    console.log("Usuario:", username);
    console.log("Contraseña:", password);
  };

  return (
    <div
      className="p-d-flex p-jc-center p-ai-center"
      style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <Card
        title="Inicio de Sesión"
        className="p-shadow-6"
        style={{ width: "350px" }}
      >
        <div className="p-fluid">
          <div className="p-field p-mb-3">
            <label htmlFor="username" className="p-d-block">
              Usuario
            </label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              className="p-inputtext-lg"
            />
          </div>
          <div className="p-field p-mb-4">
            <label htmlFor="password" className="p-d-block">
              Contraseña
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false} // Desactiva sugerencias de contraseña
              placeholder="Ingrese su contraseña"
              className="p-inputtext-lg"
            />
          </div>
          <Button
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            onClick={handleLogin}
            className="p-button-primary p-button-block"
          />
        </div>
      </Card>
    </div>
  );
}

export default Login;