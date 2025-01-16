

function MapComponent({ centrosComunitarios, centroDistribucion }) {

    const position = [centroDistribucion.latitud, centroDistribucion.longitud]

    return (
        <>
            
        </>
    );
}

export default MapComponent;

{/* <MapContainer
center={[centroDistribucion.latitud, centroDistribucion.longitud]}
zoom={7}
style={{ height: "500px", width: "100%" }}
>
<TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="&copy; OpenStreetMap contributors"
/>
<Marker
    position={[centroDistribucion.latitud, centroDistribucion.longitud]}
>
    <Popup>
        Centro de Distribución
    </Popup>
</Marker>
{/* {centrosComunitarios.map((centro, index) => (
    <Marker
        key={index}
        position={[centro.latitud, centro.longitud]}
    >
        <Popup>
            <strong>{centro.nombre}</strong>
            <br />
            Equipamiento: {centro.equipamiento_asignado}
        </Popup>
    </Marker>
))} 
</MapContainer> */}