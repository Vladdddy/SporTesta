import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Archivio from "./pages/Archivio";
import Noleggio from "./pages/Noleggio";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { API_CONFIG } from "./config";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [type, setType] = useState(
        new URLSearchParams(window.location.search).get("type")
    );

    const checkForm = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return false;

        try {
            // Add timeout to prevent infinite loading
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(`${API_CONFIG.BASE_URL}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                return true;
            } else {
                localStorage.removeItem("authToken");
                return false;
            }
        } catch (err) {
            console.error("Errore di autorizzazione:", err);
            // Remove token on any error (timeout, network error, etc.)
            localStorage.removeItem("authToken");
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
            setIsLoading(false);
        };

        checkUserLogin();
    }, []);

    const renderPage = () => {
        if (isLoading) {
            return (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        fontSize: "1.5rem",
                    }}
                >
                    Caricamento...
                </div>
            );
        }

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
            <Footer />
        </>
    );
}

export default App;
