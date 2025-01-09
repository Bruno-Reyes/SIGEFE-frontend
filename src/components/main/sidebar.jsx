import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Ripple } from 'primereact/ripple';
import { StyleClass } from 'primereact/styleclass';

export default function UISidebar({ visible, onHide, setActiveComponent }) {

    const userInfo = (
    <div className="p-3">
        <p>
        <strong>Usuario:</strong> {localStorage.getItem("email")}
        </p>
    </div>
    );

    let items;
    let usuario = localStorage.getItem("usuario")
    
    if (usuario === "\"aspirante_lec\"") {
        items = (
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
                <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="Aspirante LEC" icon="pi pi-calendar" className="p-button-text" style={{ width: '100%' }} />
                </li>
            </ul>
        );
    } else if (usuario === "\"coord_nac_rrhh\"") {
        items = (
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
                <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="Convocatorias" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }}  onClick={() => setActiveComponent("convocatorias")} />
                </li>
                <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="Alumnos" icon="pi pi-users" className="p-button-text" style={{ width: '100%' }}/>
                </li>
                <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="Gestión de Pagos" icon="pi pi-wallet" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent("pagos")} />
                </li>
                <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="Asignar Becas" icon="pi pi-wallet" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent("becas")} />
                </li>
            </ul>
        );
    } else if (usuario === "\"dep_finanzas\"") { 
        items = (
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
                <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="dep_finanzas" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }} />
                </li>
                    <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="Pagos" icon="pi pi-wallet" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent("pagos")} />
                </li>
            </ul>
        );
    }else if (usuario === "\"lider_lec\"") { 
        items = (
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
                <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="lider_lec" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }} />
                </li>
                    <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="Pagos Pendientes" icon="pi pi-wallet" className="p-button-text" style={{ width: '100%' }} onClick={() => setActiveComponent("pagos")} />
                </li>
            </ul>
        );
    } else if (usuario === "\"coord_academico\"") { 
        items = (
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
                <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="coord_academico" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }} />
                </li>
            </ul>
        );
    } else if (usuario === "\"aux_operacion\"") { 
        items = (
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
                <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="aux_operacion" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }} />
                </li>
            </ul>
        );
    }
    else if (usuario === "\"coord_nac_logistica\"") { 
        items = (
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
                <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="coord_nac_logistica" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }} />
                </li>
            </ul>
        );
    } else if (usuario === "\"coord_operativo\"") { 
        items = (
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
                <li style={{ margin: '10px 0', width: '100%' }}>
                    <Button label="coord_operativo" icon="pi pi-user" className="p-button-text" style={{ width: '100%' }} />
                </li>
            </ul>
        );
    }


    return (
        <Sidebar visible={visible} onHide={onHide}>
            <div className="p-text-center p-mb-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src="/teacher_.svg"
              alt="User Avatar"
              className="p-mb-2"
              style={{ borderRadius: "50%", width: "20vw", maxWidth: "100px", height: "auto" }} // Ajusta el tamaño aquí
            />
            {userInfo}
          </div>
          {items}
        </Sidebar>
    );
}