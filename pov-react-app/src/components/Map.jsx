import React, { useState, useRef, useMemo, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import SectorData from "./SectorData";
import { useSearch } from "./SearchProvider";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const libraries = ["marker"];

const defaultSectorStyles = {
    fillColor: "rgb(200, 201, 205)",
    strokeWeight: 1,
    strokeColor: "rgb(173, 173, 176)",
    fillOpacity: 0.6,
    // fillOpacity: 1,
};

const selectedSectorStyles = {
    fillColor: "rgb(231, 195, 79)",
    strokeWeight: 2,
    strokeColor: "rgb(228, 207, 136)",
};

// const colorGradient = [
//     "005ca1",
//     "0074ac",
//     "008bb1",
//     "3fa0b4",
//     "5aafb6",
//     "93ccbc",
//     "aad8be",
//     "c4e3c0",
//     "deeec6",
//     "f9f8ce",
// ];

const colorGradient = [
    "543005", // deep red
    "8c510a", // crimson
    "bf812d", // red
    "dfc27d", // orange-red
    "f6e8c3", // orange
    "c7eae5", // light orange
    "80cdc1", // gold
    "35978f", // pale yellow
    "01665e", // very light yellow
    "003c30", // near-white yellow
];

function Map() {
    const [map, setMap] = useState(null);
    const [selectedSectorData, setSelectedSectorData] = useState(null);
    const selectedSectorRef = useRef(null);
    const [selectedMetadata, setSelectedMetadata] = useState(null);
    const [metadataMinMax, setMetadataMinMax] = useState([]);
    const mapRef = useRef(null);
    const sectorRef = useRef(null);

    const { sectorQuery } = useSearch();

    useEffect(() => {
        if (!sectorQuery || !mapRef.current) return;
        mapRef.current.data.forEach((feature) => {
            if (feature.getProperty("CD_SETO") === sectorQuery) {
                console.log(feature.getProperty("CD_SETO"));
                styleAndSetSector(feature);

                const bounds = new window.google.maps.LatLngBounds();
                feature
                    .getGeometry()
                    .forEachLatLng((latlng) => bounds.extend(latlng));
                mapRef.current.fitBounds(bounds);
            }
        });
    }, [sectorQuery]);

    useEffect(() => {
        if (selectedMetadata === "none") {
            mapRef.current.data.revertStyle();
            setMetadataMinMax([]);
        } else if (selectedMetadata) {
            fetch(`${API_BASE_URL}/choropleth/${selectedMetadata}`)
                .then((response) => response.json())
                .then((data) => {
                    const min = data[0];
                    const max = data[1];
                    setMetadataMinMax([min, max]);

                    const interval = (max - min) / 10;

                    mapRef.current.data.forEach((sector) => {
                        let val = sector.getProperty(selectedMetadata);
                        let index = Math.floor(val / interval);
                        mapRef.current.data.overrideStyle(sector, {
                            fillColor: `#${colorGradient[index]}`,
                            strokeColor: `#6d6a6a`,
                            strokeWeight: 1,
                            fillOpacity: 1.0,
                        });
                    });
                });
        }
    }, [selectedMetadata]);

    const styleAndSetSector = (feature) => {
        setSelectedSectorData((prev) => {
            if (prev === feature.Fg) return prev; // No change, avoid re-render
            return feature.Fg;
        });

        if (selectedSectorRef.current) {
            mapRef.current.data.overrideStyle(
                selectedSectorRef.current,
                defaultSectorStyles
                // sectorStyleRef.current
            );
        }

        selectedSectorRef.current = feature;

        // sectorStyleRef.current = {
        //     fillColor: selectedSectorRef.current.getProperty("fillColor"),
        //     strokeColor: selectedSectorRef.current.getProperty("strokeColor"),
        //     fillOpacity: selectedSectorRef.current.getProperty("fillOpacity"),
        //     strokeWeight: selectedSectorRef.current.getProperty("strokeWeight"),
        // };

        mapRef.current.data.overrideStyle(
            selectedSectorRef.current,
            selectedSectorStyles
        );
    };

    const handleOnLoad = (map) => {
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
            styleAndSetSector(e.feature);
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

        setSelectedSectorData(null);
    };

    const center = { lng: -47.054908, lat: -22.9036219989999 };
    const mapComponent = useMemo(
        () => (
            <GoogleMap
                zoom={11}
                center={center}
                mapContainerStyle={{ height: "100%", width: "100%" }}
                options={{
                    mapId: "8f55d545b329347",
                    styleId: "3096ca06b76b1951",
                    gestureHandling: "greedy",
                    disableDefaultUI: true,
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
                    <SectorData
                        data={selectedSectorData}
                        map={map}
                        setSelectedMetadata={setSelectedMetadata}
                        colorGradient={colorGradient}
                        metadataMinMax={metadataMinMax}
                    />
                </div>
            </LoadScript>
        </div>
    );
}

export default Map;
