import React, { useState, useEffect } from "react";
import NoleggioAccordion from "../components/NoleggioAccordion";
import { supabase } from "../supabaseClient";
import "../styles/home.css";

const Archivio = () => {
    const [noleggi, setnoleggi] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredNoleggi, setFilteredNoleggi] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let { data, error } = await supabase
                .from("noleggioarchiviato")
                .select("*");
            if (error) console.error("Errore:", error);
            else setnoleggi(data);
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        // -Filtraggio dei noleggi
        const results = noleggi.filter((n) => {
            const fullName = n.nomecognome.toLowerCase();
            const codiceStr = n.codice.toString();
            const codiceFam =
                n.codicefamiglia != null ? n.codicefamiglia.toString() : "";
            return (
                fullName.includes(searchTerm.toLowerCase()) ||
                codiceStr.includes(searchTerm) ||
                codiceFam.includes(searchTerm)
            );
        });

        setFilteredNoleggi(results);
    };

    const displayNoleggi = () => {
        const dataToShow =
            filteredNoleggi.length > 0 ? filteredNoleggi : noleggi;

        return Array.from({ length: 1 }, (_, i) => (
            <NoleggioAccordion
                key={i}
                id={i}
                items={dataToShow}
                archiviato={true}
            />
        ));
    };

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
            <section className="hero archiviati">
                <div className="container mt-4">
                    <h2
                        style={{
                            textAlign: "center",
                            marginTop: "4rem",
                            marginBottom: "4rem",
                        }}
                    >
                        Noleggi archiviati
                    </h2>
                    <form
                        className="d-flex mb-4"
                        role="search"
                        onSubmit={handleSearch}
                    >
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Cerca per nome o codice"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="btn btn-outline-custom"
                            type="submit"
                        >
                            Cerca
                        </button>
                    </form>

                    {displayNoleggi()}
                </div>
            </section>
        </>
    );
};

export default Archivio;
