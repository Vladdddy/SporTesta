import React from "react";
import NoleggioAccordion from "../components/NoleggioAccordion";
import "../styles/home.css";

const Home = () => {
    //Ritorna l'header e il contenuto dell'accordion
    const accordionItems = [
        {
            title: "0001 Mauro Rossi",
            body: "Dettagli noleggio",
        },
    ];

    //Ritorna tutt i noleggi attivi
    const displayNoleggi = () => {
        return Array.from({ length: 10 }, (_, i) => (
            <NoleggioAccordion id={i} items={accordionItems} />
        ));
    };

    //Ritorna tutt i noleggi che scadono oggi
    const displayNoleggiScadenza = () => {
        return Array.from({ length: 2 }, (_, i) => (
            <NoleggioAccordion id={i + 10} items={accordionItems} />
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

                {displayNoleggiScadenza()}
            </div>
        </section>
    );
};

export default Home;
