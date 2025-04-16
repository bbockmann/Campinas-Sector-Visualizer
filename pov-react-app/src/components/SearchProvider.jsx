import { useContext, useState, createContext } from "react";

const searchContext = createContext();

export const useSearch = () => useContext(searchContext);

export default function SearchProvider({ children }) {
    const [sectorQuery, setSectorQuery] = useState("");

    return (
        <searchContext.Provider value={{ sectorQuery, setSectorQuery }}>
            {children}
        </searchContext.Provider>
    );
}
