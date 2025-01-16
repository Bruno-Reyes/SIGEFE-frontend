import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const apiUrl = import.meta.env.VITE_API_URL
const token = JSON.parse(localStorage.getItem('access-token'))

function MapView({ estado }) {
    const [data, setData] = useState(null);
    const [position, setPosition] = useState([]);
    const [error, setError] = useState(null);

    const getCentro = async () => {
        try {
            const response = await fetch(`${apiUrl}/logistica/obtener-centros/${estado}/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            const datos = await response.json()

            setPosition([datos.centro_distribucion.latitud, datos.centro_distribucion.longitud]);
            setData(datos)
        } catch (error) {
            setError(error);
        }
    }

    useEffect(() => {
        getCentro()
    }, []);

    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>Cargando...</p>;

    // console.log(data);
    {/* 21.885998 -102.305116 */ }

    return (
        <div>

            {data && }
        </div>
    );
}

export default MapView;