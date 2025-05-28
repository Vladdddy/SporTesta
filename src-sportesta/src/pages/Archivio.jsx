import React, { useState, useEffect } from "react";
import NoleggioAccordion from "../components/NoleggioAccordion";
import { supabase } from "../supabaseClient";
import "../styles/home.css";

const Archivio = () => {
    const [noleggi, setnoleggi] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredNoleggi, setFilteredNoleggi] = useState([]);
    const [showNoResultsPopup, setShowNoResultsPopup] = useState(false);

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

        // Show popup if no results found and search term is not empty
        if (results.length === 0 && searchTerm.trim() !== "") {
            setShowNoResultsPopup(true);
        }
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

            {/* Popup for no search results */}
            {showNoResultsPopup && (
                <div
                    className="modal modal-sheet position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
                    tabIndex="-1"
                    role="dialog"
                    style={{ zIndex: 1050 }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content rounded-3 shadow">
                            <div className="modal-body p-4 text-center">
                                <h5 className="mb-3">Noleggio non esistente</h5>
                                <p className="text-secondary">
                                    Non è stato trovato nessun noleggio con i
                                    criteri di ricerca inseriti.
                                </p>
                            </div>
                            <div className="modal-footer flex-nowrap p-0">
                                <button
                                    type="button"
                                    className="btn btn-lg btn-link fs-6 text-decoration-none col-12 py-3 m-0 rounded-0"
                                    onClick={() => setShowNoResultsPopup(false)}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Archivio;
