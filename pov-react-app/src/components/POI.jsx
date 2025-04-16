import { useEffect, useRef } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function POI({ data, map, selectedType }) {
    const markersRef = useRef([]); // Store markers

    useEffect(() => {
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        if (!data) return;

        let sectorId = data.CD_SETO;

        fetch(`${API_BASE_URL}/poi/${sectorId}`)
            .then((res) => res.json())
            .then((data) => {
                const pois = Object.values(data);

                for (let i = 0; i < pois.length; i++) {
                    let poi = pois[i];

                    const poiMarker = document.createElement("div");
                    poiMarker.className = "poi-marker";
                    poiMarker.id = poi.type;

                    const marker =
                        new window.google.maps.marker.AdvancedMarkerElement({
                            map,
                            position: {
                                lat: poi.lat,
                                lng: poi.long,
                            },
                            content: poiMarker,
                        });

                    markersRef.current.push(marker);
                }
            });
    }, [data]);

    useEffect(() => {
        markersRef.current.forEach((marker) => {
            marker.content.className = "poi-marker";
        });

        if (selectedType) {
            markersRef.current.forEach((marker) => {
                console.log(marker.content.id);
                if (marker.content.id === selectedType) {
                    console.log("changing class name");
                    marker.content.className = "poi-marker selected";
                }
            });
        }
    }, [selectedType]);
}
