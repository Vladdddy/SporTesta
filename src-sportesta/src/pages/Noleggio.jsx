import React from "react";
import "../styles/noleggio.css";
import Attrezzo from "../components/Attrezzo";

const Noleggio = () => {
    return (
        <>
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
