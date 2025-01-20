import { AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps'
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useRef, useState, useEffect } from 'react';

const LocalidadesMarcadores = ({ localidades }) => {
    const map = useMap()
    const [markers, setMarkers] = useState([])
    const clusterer = useRef()

    // Initialize MarkerClusterer, if the map has changed
    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    // Update markers, if the markers array has changed
    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker, key) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;
        setMarkers(prev => {
            if (marker) {
                return { ...prev, [key]: marker };
            } else {
                const newMarkers = { ...prev };
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };

    return (
        <>
            {localidades.map((localidad) => (
                <AdvancedMarker
                    key={localidad.CCT}
                    position={localidad.coordenadas}
                    ref={marker => setMarkerRef(marker, localidad.CCT)}
                    >
                    <Pin background={'#0e32e8'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}
        </>
    );
};

export default LocalidadesMarcadores;