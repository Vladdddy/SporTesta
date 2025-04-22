import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Archivio from "./pages/Archivio";
import Noleggio from "./pages/Noleggio";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [type, setType] = useState(
        new URLSearchParams(window.location.search).get("type")
    );

    const checkForm = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return false;

        try {
            const response = await fetch("http://localhost:3000/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                return true;
            } else {
                localStorage.removeItem("authToken");
                return false;
            }
        } catch (err) {
            console.error("Errore di autorizzazione:", err);
            return false;
        }
    };

    useEffect(() => {
        const onPopState = () => {
            const params = new URLSearchParams(window.location.search);
            setType(params.get("type"));
        };

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    useEffect(() => {
        const checkUserLogin = async () => {
            const loginStatus = await checkForm();
            setIsLoggedIn(loginStatus);
        };

        checkUserLogin();
    }, []);

    const renderPage = () => {
        if (isLoggedIn) {
            switch (type) {
                case "archivio":
                    return <Archivio />;
                case "noleggio":
                    return <Noleggio />;
                default:
                    return <Home />;
            }
        } else {
            return <Login />;
        }
    };

    return (
        <>
            {isLoggedIn ? <Navbar /> : null}
            {renderPage()}
        </>
    );
}

export default App;
