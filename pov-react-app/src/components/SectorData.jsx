const SectorData = ({ data }) => {
    if (data) {
        let gcsImgUrl = `https://storage.cloud.google.com/campinas-data/images_2022/images_2022/satellite_image_${data.CD_SETO}_1.png`;

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
                    src={gcsImgUrl}
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
