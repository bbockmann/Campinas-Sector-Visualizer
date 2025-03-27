import { useState, useEffect } from "react";

function TestApi() {
    const [testMessage, setTestMessage] = useState("");

    useEffect(() => {
        fetch("/test")
            .then((res) => res.json())
            .then((data) => {
                setTestMessage(data.message);
            });
    }, []);

    return <p>{testMessage}</p>;
}

export default TestApi;
