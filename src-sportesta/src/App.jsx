import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Archivio from "./pages/Archivio";
import Noleggio from "./pages/Noleggio";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

function App() {
    const [type, setType] = useState(
        new URLSearchParams(window.location.search).get("type")
    );

    //const [isUserLogged, setIsUserLogged] = useState(true);
    const isUserLogged = true;

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
                return isUserLogged ? <Archivio /> : <Login />;

            case "noleggio":
                return isUserLogged ? <Noleggio /> : <Login />;

            default:
                return isUserLogged ? <Home /> : <Login />;
        }
    };

    return (
        <>
            {isUserLogged ? <Navbar /> : null}
            {renderPage()}
        </>
    );
}

export default App;
