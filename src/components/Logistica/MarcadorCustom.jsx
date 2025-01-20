import React, { useCallback, useState } from "react";
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef, Pin } from "@vis.gl/react-google-maps";

const CustomMarker = React.forwardRef(({ position, datos }, ref) => {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);

    const handleMarkerClick = useCallback(
        () => setInfoWindowShown((isShown) => !isShown),
        []
    );

    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    return (
        <>
            <AdvancedMarker>
                ref={(node) => {
                    markerRef(node);
                    if (typeof ref === "function") ref(node);
                    else if (ref) ref.current = node;
                }}
                position={position}
                onClick={handleMarkerClick}
                </AdvancedMarker>
            {infoWindowShown && (
                <InfoWindow anchor={marker} onClose={handleClose}>
                    <h2>{datos.clave_centro_trabajo}</h2>
                </InfoWindow>
            )}
        </>
    );
});

export default CustomMarker;