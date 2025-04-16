import React from "react";
import Cookies from "js-cookie";

const Login = () => {
    const handleLogin = async (event) => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem("authToken", data.token);
                console.log("Token stored in localStorage:", data.token);

                // After storing the token, redirect to the homepage
                window.location.href = "/home"; // or your desired route
            } else {
                alert("Login failed!");
            }
        } catch (err) {
            console.error("Login error:", err);
        }

        /*if (
            !localStorage.getItem("username") &&
            !localStorage.getItem("password")
        ) {
            if (username.value === "vladyslav" && password.value === "12345") {
                localStorage.setItem("username", username.value);
                localStorage.setItem("password", password.value);

                window.location.href = "/";
            }
        }*/
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
                        <form className="">
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    id="username"
                                    placeholder="name@example.com"
                                    required
                                ></input>
                                <label htmlFor="floatingInput">Username</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control rounded-3"
                                    id="password"
                                    placeholder="Password"
                                    required
                                ></input>
                                <label htmlFor="floatingPassword">
                                    Password
                                </label>
                            </div>
                            <button
                                className="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
                                type="submit"
                                onClick={() => handleLogin(event)}
                            >
                                Accedi
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
