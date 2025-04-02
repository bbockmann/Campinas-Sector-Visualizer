import React, { useState, useRef, useMemo } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import SectorData from "./SectorData";
import POI from "./POI";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const libraries = ["marker"];

const defaultSectorStyles = {
    fillColor: "rgb(200, 201, 205)",
    strokeWeight: 2,
    strokeColor: "rgb(150, 151, 155)",
};

const selectedSectorStyles = {
    fillColor: "rgb(228, 207, 136)",
    strokeWeight: 2,
    strokeColor: "rgb(228, 207, 136)",
};

export default function Map() {
    const [map, setMap] = useState(null);
    const mapRef = useRef(null);
    const [selectedSectorData, setSelectedSectorData] = useState(null);
    const selectedSectorRef = useRef(null);

    const center = { lng: -47.054908, lat: -22.9036219989999 };
    const mapStyles = [
        {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
        },
    ];

    const handleOnLoad = (map) => {
        console.log("setting mapRef.current");
        mapRef.current = map;
        setMap(map);
        fetch(`${API_BASE_URL}/proxy-json`)
            .then((response) => response.json())
            .then((data) => {
                map.data.addGeoJson(data);
            })
            .catch((err) => {
                console.error("Error loading GeoJSON", err);
            });

        map.data.setStyle(defaultSectorStyles);

        map.data.addListener("click", (e) => {
            setSelectedSectorData((prev) => {
                if (prev === e.feature.Fg) return prev; // No change, avoid re-render
                return e.feature.Fg;
            });

            if (selectedSectorRef.current) {
                map.data.overrideStyle(
                    selectedSectorRef.current,
                    defaultSectorStyles
                );
            }

            selectedSectorRef.current = e.feature;

            map.data.overrideStyle(
                selectedSectorRef.current,
                selectedSectorStyles
            );
        });
    };

    const handleOnClick = () => {
        if (!mapRef.current) {
            console.warn("Map is not loaded yet");
            return;
        }
        mapRef.current.data.overrideStyle(
            selectedSectorRef.current,
            defaultSectorStyles
        );

        console.log("sector should be reset");
        setSelectedSectorData(null);
    };

    const mapComponent = useMemo(
        () => (
            <GoogleMap
                zoom={11}
                center={center}
                mapContainerStyle={{ height: "100%", width: "100%" }}
                options={{
                    mapId: "8f55d545b329347",
                    styleId: "3096ca06b76b1951",
                    // styles: mapStyles,
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
        <div style={{ height: "100%" }}>
            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
                libraries={libraries}
            >
                <div className="map-container">
                    {mapComponent}
                    <SectorData data={selectedSectorData} />
                </div>
            </LoadScript>
            <POI data={selectedSectorData} map={map} />
        </div>
    );
}
