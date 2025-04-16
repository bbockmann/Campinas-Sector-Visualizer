import { useState, useRef, useEffect } from "react";
import POI from "./POI";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SectorData = ({ data, map }) => {
    const [expanded, setExpanded] = useState(false);
    const [pois, setPOIs] = useState(null);
    const [selectedPOIType, setSelectedPOIType] = useState(null);

    const handleOnMouseEnter = (e) => {
        console.log(e.currentTarget.dataset.name);
        setSelectedPOIType(e.currentTarget.dataset.name);
    };

    const handleOnMouseLeave = (e) => {
        setSelectedPOIType(null);
    };

    useEffect(() => {
        if (!data) return;

        fetch(`${API_BASE_URL}/poisummary/${data.CD_SETO}`)
            .then((res) => res.json())
            .then((data) => {
                setPOIs(data);
            })
            .catch((e) => {
                console.error("error fetching POI summary", e);
            });
    }, [data?.CD_SETO]); // re-run only when the sector changes

    return (
        <div>
            <POI data={data} map={map} type={selectedPOIType} />

            {data ? (
                <>
                    {expanded && <div className="background"></div>}

                    <div
                        className={`sector-data-wrap ${
                            expanded ? "expanded" : ""
                        }`}
                    >
                        <div className="sector-data-left">
                            <span>
                                <strong>Sector ID</strong> {data.CD_SETO}
                            </span>

                            <img
                                className="sector-img"
                                src={`https://storage.googleapis.com/campinas-data/images_2022/images_2022/satellite_image_${data.CD_SETO}_1.png`}
                                alt="no sector photo available"
                            />

                            <button
                                className="button"
                                onClick={() => setExpanded(!expanded)}
                            >
                                {expanded ? "Close" : "See More"}
                            </button>
                        </div>
                        <div className="sector-data-right">
                            {expanded && (
                                <ul className="poi-summary">
                                    {Object.entries(pois ?? {})
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([key, value]) => (
                                            <li
                                                key={key}
                                                onMouseEnter={
                                                    handleOnMouseEnter
                                                }
                                                onMouseLeave={
                                                    handleOnMouseLeave
                                                }
                                                data-name={key}
                                            >
                                                <strong>
                                                    {key.replaceAll("_", " ")}
                                                </strong>{" "}
                                                {value}
                                            </li>
                                        ))}
                                </ul>
                            )}
                            {expanded && (
                                <ul className="poi-summary">
                                    {Object.entries(data ?? {}).map(
                                        ([key, value]) => (
                                            <li key={key}>
                                                <strong>{key}</strong> {value}
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="sector-data-wrap">
                    Select a sector to view its metadata
                </div>
            )}
        </div>
    );
};

export default SectorData;
