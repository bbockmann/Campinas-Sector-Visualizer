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
                const response = await fetch(`${API_BASE_URL}/`);
            } catch (e) {
                console.log("Error starting backend server", e);
            } finally {
                setLoading(false);
            }
        };
        startFlaskServer();
    }, []);
    return loading ? <LoadingScreen /> : <Map />;

    // const test = async () => {
    //     try {
    //         console.log("in try, before fetch");
    //         const response = await fetch(`${API_BASE_URL}/`);
    //         console.log("in try, after fetch");
    //     } catch (e) {
    //         console.log("Error starting backend server", e);
    //     } finally {
    //         console.log("in finally");
    //     }
    // };
    // console.log("before calling test");
    // test();
    // console.log("after calling test");

    return <Map />;
}

export default App;
