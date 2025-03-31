import React, { useState, useRef, useMemo } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import SectorData from "./SectorData";
import POI from "./POI";

// const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
//     "marker"
// );
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log(API_BASE_URL);

export default function Map() {
    const [selectedSectorData, setSelectedSectorData] = useState(null);
    const selectedSectorRef = useRef(null);
    const [selectedSectorID, setSelectedSectodID] = useState(null);
    const [currPOIs, setCurrPOIs] = useState(null);

    const center = { lng: -47.054908, lat: -22.9036219989999 };
    const mapStyles = [
        {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
        },
    ];

    const handleOnLoad = (map) => {
        fetch(`${API_BASE_URL}/proxy-json`)
            .then((response) => response.json())
            .then((data) => {
                // Add the GeoJSON data to the map
                map.data.addGeoJson(data);
            })
            .catch((err) => {
                console.error("Error loading GeoJSON", err);
            });

        map.data.setStyle({
            fillColor: "DarkSlateGray",
            strokeWeight: 2,
            strokeColor: "DarkSlateGray",
        });

        map.data.addListener("click", (e) => {
            setSelectedSectorData((prev) => {
                if (prev === e.feature.Fg) return prev; // No change, avoid re-render
                return e.feature.Fg;
            });

            let sectorID = e.feature.Fg.CD_SETO;
            plotPOIs(sectorID, map);

            if (selectedSectorRef.current) {
                map.data.overrideStyle(selectedSectorRef.current, {
                    fillColor: "DarkSlateGray", // Reset to default
                    strokeWeight: 2,
                    strokeColor: "DarkSlateGray",
                });
            }

            selectedSectorRef.current = e.feature;

            map.data.overrideStyle(selectedSectorRef.current, {
                fillColor: "Yellow", // Reset to default
                strokeWeight: 2,
                strokeColor: "DarkSlateGray",
            });
        });
    };

    function plotPOIs(sectorID, map) {
        // console.log(sectorID);
        console.log(`the new sectorID is ${sectorID}`);
        fetch(`${API_BASE_URL}/poi/${sectorID}`)
            .then((res) => res.json())
            .then((data) => {
                // console.log(Object.keys(data.name).length);
                let latKeys = Object.keys(data.latitude);

                for (let i = 0; i < Object.keys(data.name).length; i++) {
                    // TODO: move all this logic of creating each pin to the python code
                    // the API should provide a nice json object so that each
                    // pin can be rapidly created
                    let key = latKeys[i];
                    const marker = new window.google.maps.Marker({
                        map,
                        position: {
                            lat: data.latitude[key],
                            lng: data.longitude[key],
                        },
                    });
                }
                // setCurrPOIs(data);
            });
    }

    const handleOnClick = (map) => {
        setSelectedSectorData(null);
    };

    const mapComponent = useMemo(
        () => (
            <GoogleMap
                zoom={11}
                center={center}
                mapContainerStyle={{ height: "100%", width: "100%" }}
                options={{
                    styles: mapStyles,
                    gestureHandling: "greedy",
                    disableDefaultUI: false,
                    zoomControl: true,
                    draggable: true,
                }}
                onLoad={handleOnLoad}
                onClick={handleOnClick}
            />
        ),
        []
    );

    return (
        <div>
            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
                libraries={["marker"]}
            >
                <div style={{ height: "100vh" }}>{mapComponent}</div>
            </LoadScript>
            <SectorData data={selectedSectorData} />
            <POI id={selectedSectorID} />
        </div>
    );
}
