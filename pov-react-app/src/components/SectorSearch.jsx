import { useSearch } from "./SearchProvider";
import { useState } from "react";

function SectorSearch() {
    const { setSectorQuery } = useSearch();
    const [inputValue, setInputValue] = useState("");

    return (
        <div>
            <input
                type="text"
                className="sector-search-input"
                placeholder="Search by sector ID"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button
                className="button sector-search-button"
                onClick={() => setSectorQuery(inputValue)}
            >
                Search
            </button>
        </div>
    );
}

export default SectorSearch;
