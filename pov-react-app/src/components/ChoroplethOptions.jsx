import { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function ChoroplethOptions({
    data,
    setSelectedMetadata,
    colorGradient,
    metadataMinMax,
}) {
    const [topFivePOIs, setTopFivePOIs] = useState(null);
    const [sectorMetadata, setSectorMetadata] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/sectorfields`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                const filtered = data.filter((field) => field !== "CD_SETO");
                setSectorMetadata(filtered);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    }, []);

    useEffect(() => {
        if (data) {
            fetch(`${API_BASE_URL}/poisummary/${data.CD_SETO}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("getting POIs");
                    setTopFivePOIs(
                        Object.entries(data)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                    );
                });
        }
    }, [data]);

    function handleSelectionChange(e) {
        setSelectedMetadata(e.target.value);
    }

    return (
        <div className="legend-wrap">
            <div>
                <span>Metric:</span>
                <select
                    name="metadata-options"
                    id="metadata-options"
                    onChange={handleSelectionChange}
                >
                    <option value="none">none</option>
                    {sectorMetadata.map((item) => {
                        return (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className="legend">
                {colorGradient.map((value) => {
                    return (
                        <div
                            style={{ backgroundColor: "#" + value }}
                            key={value}
                        ></div>
                    );
                })}
            </div>
            {metadataMinMax.length == 2 && (
                <div className="min-max-wrap">
                    <span>{metadataMinMax[0].toFixed(3)}</span>
                    <span>{metadataMinMax[1].toFixed(3)}</span>
                </div>
            )}
        </div>
    );
}
