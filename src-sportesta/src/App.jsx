import "./App.css";
/*import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Archivio from "./pages/Archivio";*/
import Noleggio from "./pages/Noleggio";

function App() {
    /*const [type, setType] = useState(
        new URLSearchParams(window.location.search).get("type"),
    );

    useEffect(() => {
        const onPopState = () => {
            const params = new URLSearchParams(window.location.search);
            setType(params.get("type"));
        };

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);*/

    /*const renderPage = () => {
        return ;
    };*/

    return (
        <>
            <Noleggio />
        </>
    );
}

export default App;
