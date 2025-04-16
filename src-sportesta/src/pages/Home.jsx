import React from "react";
import NoleggioAccordion from "../components/NoleggioAccordion";
import "../styles/home.css";

const Home = () => {
    const accordionItems = [
        {
            title: "0001 Mauro Rossi",
            body: "Dettagli noleggio",
        },
    ];

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
                <NoleggioAccordion id="3" items={accordionItems} />
                <NoleggioAccordion id="4" items={accordionItems} />
                <NoleggioAccordion id="5" items={accordionItems} />
                <NoleggioAccordion id="6" items={accordionItems} />
                <NoleggioAccordion id="7" items={accordionItems} />
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
                <NoleggioAccordion id="1" items={accordionItems} />
                <NoleggioAccordion id="2" items={accordionItems} />
            </div>
        </section>
    );
};

export default Home;
