import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Header from "./components/Header";
import Map from "./components/Map";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const startFlaskServer = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/`);
                if (!response.ok) throw new Error("Server is not ready");
                console.log("Backend is live!");
                setLoading(false);
            } catch (e) {
                console.log("Error starting backend server", e);
                console.error("Retrying in 10 seconds...");
                setTimeout(startFlaskServer, 10000); // Retry after 5 seconds
            } finally {
                // setLoading(false);
            }
        };
        startFlaskServer();
    }, []);

    return (
        <div className="header-content-wrap">
            <Header />
            {loading ? <LoadingScreen /> : <Map />}
        </div>
    );
}

export default App;
