import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';

const SidebarMenu = () => {
    const items = [
        { label: 'Inicio', icon: 'pi pi-home' },
        { label: 'Administración', icon: 'pi pi-cog', items: [
            { label: 'Usuarios' },
            { label: 'Configuración' }
        ]},
        // Más elementos
    ];

    return <Menu model={items} />;
};
