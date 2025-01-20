import { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import MarkerRenderer from './LocalidadesMarcadores';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { ListBox } from 'primereact/listbox';

const apiUrl = import.meta.env.VITE_API_URL;
const apiMaps = import.meta.env.VITE_MAPS_API_KEY;
const idMap = import.meta.env.VITE_ID_MAP;
const token = JSON.parse(localStorage.getItem('access-token'));

const GenerarRutas = () => {
    const [estados, setEstados] = useState([]);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
    const [centroCoordenadas, setCentroCoordenadas] = useState(null);
    const [localidades, setLocalidades] = useState([]);
    const [ruta, setRuta] = useState([]);
    const [localidadesHM, setLocalidadesHM] = useState(null);

    useEffect(() => {
        getEstados();
    }, []);

    const getEstados = async () => {
        const response = await fetch(`${apiUrl}/logistica/consultar-estados/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setEstados(data.estados);
    };

    const obtenerRuta = async (estado) => {
        try {
            const response = await fetch(`${apiUrl}/logistica/generar-ruta/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "estado": estado }),
            });
            let data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const handleGenerarRuta = async () => {
        let ruta_data = await obtenerRuta(estadoSeleccionado);
        let { centro_distribucion } = ruta_data;
        console.log(ruta_data);
        centro_distribucion = centro_distribucion[0];
        setCentroCoordenadas({ lat: parseFloat(centro_distribucion.latitud), lng: parseFloat(centro_distribucion.longitud) });
        let { localidades } = ruta_data;
        let localidadesData = [];
        let localidadesObject = {}
        localidades.forEach(item => {
            localidadesData.push({ CCT: item.clave_centro_trabajo, coordenadas: { lat: parseFloat(item.latitud), lng: parseFloat(item.longitud) } });
            localidadesObject[item.id] = { CCT: item.clave_centro_trabajo, CODIGO: item.codigo_postal, DOMICILIO: item.domicilio, ESTADO: item.estado, LATITUD: item.latitud, LONGITUD: item.longitud, MUNICIPIO: item.municipio, NIVEL: item.nivel_educativo, NOMBRE: item.nombre_localidad }
        });
        setLocalidades(localidadesData);
        setLocalidadesHM(localidadesObject)
        let { ruta_distribucion } = ruta_data;
        setRuta(ruta_distribucion)
    };

    const crearMapa = (coordenadas) => {
        return (
            <Map
                mapId={idMap}
                defaultCenter={coordenadas}
                defaultZoom={13}
                style={{ width: '100%', height: '400px' }}
            >
                <AdvancedMarker
                    key={`Centro: ${estadoSeleccionado}`}
                    position={coordenadas}
                />
                <MarkerRenderer localidades={localidades} />
            </Map>
        );
    };

    const crearInstrucciones = () => {
        return (
            <Card title="Instrucciones de Ruta" style={{ marginTop: '20px' }}>
                <Panel header="Detalles de la ruta">
                    {ruta.length > 0 && ruta.map((element, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            {element === -1 ? (
                                <ListBox options={[`Paso ${index + 1}: Centro de distribución`]} />
                            ) : (
                                <ListBox options={[`Paso ${index + 1}: Dirigirse hacia la localidad ${localidadesHM[element].CCT} con nombre: ${localidadesHM[element].NOMBRE}, ubicado en ${localidadesHM[element].DOMICILIO}, ${localidadesHM[element].CODIGO}, ${localidadesHM[element].MUNICIPIO}, ${localidadesHM[element].ESTADO}, con coordenadas ${localidadesHM[element].LATITUD}, ${localidadesHM[element].LONGITUD}`]} />
                            )}
                        </div>
                    ))}
                </Panel>
            </Card>
        );
    };

    return (
        <APIProvider apiKey={apiMaps} onLoad={() => console.log('Maps API has loaded.')}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <div style={{ width: '100%', backgroundColor: '#f0f0f0', textAlign: 'center', padding: '10px' }}>
                    <h1>Generar Rutas</h1>
                    <div>
                        <h3>Seleccione el estado en el que desea generar la ruta de distribución</h3>
                        <Dropdown value={estadoSeleccionado} options={estados} onChange={(e) => setEstadoSeleccionado(e.value)} placeholder="Selecciona un estado" />
                        <Button label='Generar ruta' onClick={() => handleGenerarRuta()} />
                    </div>
                </div>

                <div style={{ width: '100%', padding: '20px', textAlign: 'center' }}>
                    {centroCoordenadas ? crearMapa(centroCoordenadas) : <h1> Seleccione un estado para ver el mapa de sus localidades </h1>}
                    {localidadesHM ? crearInstrucciones() : <h1> Seleccione un estado para ver la descripcion de su ruta sugerida </h1>}
                </div>
            </div>
        </APIProvider>
    );
};

export default GenerarRutas;
