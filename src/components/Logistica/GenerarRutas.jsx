import { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

//import VerMapa from './VerMapa';

const apiUrl = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('access-token'))

const GenerarRutas = () => {

    const [estados, setEstados] = useState([])
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);

    // Funcion para obtener los estados
    const getEstados = async () => {
        const response = await fetch(`${apiUrl}/logistica/consultar-estados/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        setEstados(data.estados)
    }

    // Obtener estados
    useEffect(() => {
        getEstados()
    }, [])

    // Funcion para generar la ruta
    const handleGenerarRuta = (estado) => async () => {
        const response = await fetch(`${apiUrl}/logistica/generar-ruta/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "estado": estado }),
        })
        const data = await response.json()
        console.log(data)
    }

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '20%', height: '100%', backgroundColor: '#f0f0f0', contentAlign: 'center', textAlign: 'center' }}>
                <h1>Generar Rutas</h1>
                <div>
                    <Dropdown value={estadoSeleccionado} options={estados} onChange={(e) => setEstadoSeleccionado(e.value)} placeholder="Selecciona un estado" />
                </div>
            </div>
            <div style={{ width: '80%', height: '100%', backgroundColor: '#ffffff' }}>
                <div style={{ border: '1px solid black', margin: '20px', padding: '20px', textAlign: 'center', height: '80%' }}>
                    {estadoSeleccionado &&
                        <div>
                            <MapContainer center={[21.885998, - 102.305116]} zoom={13} scrollWheelZoom={false}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </MapContainer>
                        </div>}
                </div>

            </div>
        </div>
    );
};

export default GenerarRutas;

{/* 
    <Marker position={[21.885998, - 102.305116]}>
        <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
    </Marker> */}