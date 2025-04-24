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
                    <button className="btn btn-outline-primary" type="submit">
                        Cerca
                    </button>
                </form>

                {displayNoleggi()}
            </div>
        </section>
    );
};

export default Archivio;
