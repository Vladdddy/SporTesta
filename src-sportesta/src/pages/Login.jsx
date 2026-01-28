/*import React, { useState } from "react";
import { API_CONFIG } from "../config";*/

const Login = () => {
    /*const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Tracking tempi per debug
        const startTime = performance.now();
        console.log("⏱️ Inizio login alle:", new Date().toISOString());
        console.log("🔗 Connessione a:", API_CONFIG.BASE_URL);

        try {
            const fetchStart = performance.now();
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const fetchEnd = performance.now();
            const fetchTime = (fetchEnd - fetchStart) / 1000;
            console.log(
                `✅ Risposta ricevuta in ${fetchTime.toFixed(3)} secondi`
            );

            if (!response.ok) {
                console.error(
                    "❌ Risposta HTTP:",
                    response.status,
                    response.statusText
                );
                throw new Error("Credenziali non valide");
            }

            const data = await response.json();
            const totalTime = (performance.now() - startTime) / 1000;
            console.log(
                `✅ Login completato in ${totalTime.toFixed(3)} secondi totali`
            );

            localStorage.setItem("authToken", data.token);
            window.location.href = "/home";
        } catch (err) {
            const errorTime = (performance.now() - startTime) / 1000;
            console.error(
                `❌ Errore dopo ${errorTime.toFixed(3)} secondi:`,
                err
            );

            if (err.message === "Credenziali non valide") {
                alert("❌ Username o password errati");
            } else {
                alert(
                    `❌ Errore di connessione\n\n🔗 URL: ${API_CONFIG.BASE_URL}\n\n${err.message}\n\nControlla la console per dettagli (F12)`
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                marginTop: "16vh",
            }}
            className="modal modal-sheet position-static d-block p-4 py-md-5"
            tabIndex="-1"
            role="dialog"
            id="modalSignin"
        >
            <div className="modal-dialog">
                <div className="modal-content rounded-4 shadow">
                    <div className="modal-header p-5 pb-4 border-bottom-0">
                        <h1 className="fw-bold mb-0 fs-2">Login</h1>
                    </div>

                    <div className="modal-body p-5 pt-0">
                        <form onSubmit={handleLogin}>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    id="username"
                                    placeholder="name@example.com"
                                    required
                                    style={{
                                        minHeight: "48px",
                                        fontSize: "16px",
                                    }}
                                />
                                <label htmlFor="username">Username</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control rounded-3"
                                    id="password"
                                    placeholder="Password"
                                    required
                                    style={{
                                        minHeight: "48px",
                                        fontSize: "16px",
                                    }}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            <button
                                className="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    minHeight: "48px",
                                    touchAction: "manipulation",
                                }}
                            >
                                {isLoading ? "Accesso in corso..." : "Accedi"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );*/
};

export default Login;
