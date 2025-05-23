import React from "react";
import "../styles/noleggio.css";
import Attrezzo from "../components/Attrezzo";

const Noleggio = () => {
    return (
        <>
            <div className="indietro-wrapper">
                <a href="/" class="indietro-button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        color=""
                        fill="none"
                    >
                        <path
                            d="M11 6H15.5C17.9853 6 20 8.01472 20 10.5C20 12.9853 17.9853 15 15.5 15H4"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M6.99998 12C6.99998 12 4.00001 14.2095 4 15C3.99999 15.7906 7 18 7 18"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </a>
            </div>

            <h2
                style={{
                    textAlign: "center",
                    marginTop: "4rem",
                    marginBottom: "4rem",
                }}
            >
                Compila noleggio
            </h2>

            <Attrezzo />
        </>
    );
};

export default Noleggio;
