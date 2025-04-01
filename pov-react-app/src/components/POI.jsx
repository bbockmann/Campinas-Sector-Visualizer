// import React from "react";
import { useEffect, useRef } from "react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function POI({ data, map }) {
    const markersRef = useRef([]); // Store markers
    console.log("this runs");

    useEffect(() => {
        if (!data) return;
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        let sectorId = data.CD_SETO;

        fetch(`${API_BASE_URL}/poi/${sectorId}`)
            .then((res) => res.json())
            .then((data) => {
                // console.log(Object.keys(data.name).length);
                let latKeys = Object.keys(data.latitude);

                for (let i = 0; i < Object.keys(data.name).length; i++) {
                    // TODO: move all this logic of creating each pin to the python code
                    // the API should provide a nice json object so that each
                    // pin can be rapidly created
                    let key = latKeys[i];

                    const poiMarker = document.createElement("div");
                    poiMarker.className = "poi-marker";

                    const marker =
                        new window.google.maps.marker.AdvancedMarkerElement({
                            map,
                            position: {
                                lat: data.latitude[key],
                                lng: data.longitude[key],
                            },
                            content: poiMarker,
                        });

                    markersRef.current.push(marker);
                }
            });
    });
}
