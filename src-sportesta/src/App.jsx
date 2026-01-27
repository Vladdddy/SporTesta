import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Archivio from "./pages/Archivio";
import Noleggio from "./pages/Noleggio";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
    const [type, setType] = useState(
        new URLSearchParams(window.location.search).get("type"),
    );

    useEffect(() => {
        const onPopState = () => {
            const params = new URLSearchParams(window.location.search);
            setType(params.get("type"));
        };

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    const renderPage = () => {
        switch (type) {
            case "archivio":
                return <Archivio />;
            case "noleggio":
                return <Noleggio />;
            default:
                return <Home />;
        }
    };

    return (
        <>
            <Navbar />
            {renderPage()}
            <Footer />
        </>
    );
}

export default App;
