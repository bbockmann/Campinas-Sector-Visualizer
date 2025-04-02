import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Map from "./components/Map";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const startFlaskServer = async () => {
            setLoading(true);
            try {
                console.log("HELLO");
                const response = await fetch(`${API_BASE_URL}/`);
                console.log(response);
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

    return loading ? <LoadingScreen /> : <Map />;
}

export default App;
