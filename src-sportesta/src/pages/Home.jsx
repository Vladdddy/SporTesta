import React, { useState, useEffect } from "react";
import NoleggioAccordion from "../components/NoleggioAccordion";
import NoleggioAccordionOggi from "../components/ScadenzaNoleggio";
import "../styles/home.css";
import { supabase } from "../supabaseClient";

const Home = () => {
    const [noleggi, setnoleggi] = useState([]);
    let scadenzeNum = 0;

    useEffect(() => {
        const fetchData = async () => {
            let { data, error } = await supabase.from("noleggio").select("*");
            if (error) console.error("Errore:", error);
            else setnoleggi(data);
        };

        fetchData();
    }, []);

    const displayNoleggi = () => {
        return Array.from({ length: 1 }, (_, i) => (
            <NoleggioAccordion key={i} id={i} items={noleggi} />
        ));
    };

    const displayNoleggiOggi = () => {
        const oggi = new Date().toISOString().split("T")[0];
        const noleggiScadonoOggi = noleggi.filter(
            (item) => item.datafine?.split("T")[0] === oggi
        );

        scadenzeNum = noleggiScadonoOggi.length;

        return Array.from({ length: 1 }, (_, i) => (
            <NoleggioAccordionOggi key={i} id={i} items={noleggi} />
        ));
    };

    return (
        <section className="hero">
            <div className="container mt-4">
                <h2
                    style={{
                        textAlign: "center",
                        marginTop: "4rem",
                        marginBottom: "4rem",
                    }}
                >
                    Noleggi attivi
                </h2>
                <form
                    style={{
                        marginBottom: "2rem",
                    }}
                    className="d-flex"
                    role="search"
                >
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Cerca"
                        aria-label="Search"
                    />
                    <button className="btn btn-outline-primary" type="submit">
                        Cerca
                    </button>
                </form>

                {displayNoleggi()}
            </div>
            <div className="container mt-4">
                <h2
                    style={{
                        textAlign: "center",
                        marginTop: "4rem",
                        marginBottom: "4rem",
                    }}
                >
                    Scadenze di oggi
                </h2>

                {displayNoleggiOggi()}

                {scadenzeNum < 1 ? (
                    <p style={{ textAlign: "center", color: "gray" }}>
                        Nessuna scadenza oggi!
                    </p>
                ) : null}
            </div>
        </section>
    );
};

export default Home;
