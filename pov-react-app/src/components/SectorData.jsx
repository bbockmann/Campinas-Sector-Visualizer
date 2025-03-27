// import { ReactNode } from "react";

const SectorData = ({ data }) => {
    if (data) {
        let img_url = `/data/images_2022/satellite_image_${data.CD_SETO}_1.png`;
        // console.log(`Retrieving image for ${data.CD_SETO}`);
        // console.log(img_url);

        return (
            <div className="sector-data-wrap">
                <h3>Sector Data</h3>
                <ul>
                    {Object.entries(data).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
                <img
                    className="sector-img"
                    src={img_url}
                    alt="no sector photo available"
                />
            </div>
        );
    }

    return (
        <div className="sector-data-wrap">
            Select a sector to view its metadata
        </div>
    );
};

export default SectorData;
