import React from "react";
import image from "../assets/sportesta-logo.png";
import "../styles/navbar.css";

const Navbar = () => {
    const setType = (type) => {
        const url = new URL(window.location);
        url.searchParams.set("type", type);
        window.history.pushState({}, "", url);
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    return (
        <div className="container">
            <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
                <a
                    onClick={() => setType("home")}
                    className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
                >
                    <span className="fs-4">
                        <img
                            style={{ width: "100px" }}
                            src={image}
                            alt="logo"
                        />
                    </span>
                </a>

                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <a
                            onClick={() => setType("noleggio")}
                            className="nav-link custom-color"
                        >
                            Compila noleggio
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            onClick={() => setType("archivio")}
                            className="nav-link custom-color"
                        >
                            Archivi
                        </a>
                    </li>
                </ul>
            </header>
        </div>
    );
};

export default Navbar;
