import React, { useState, useEffect } from "react";
import NoleggioAccordion from "../components/NoleggioAccordion";
import NoleggioAccordionOggi from "../components/ScadenzaNoleggio";
import "../styles/home.css";
import { supabase } from "../supabaseClient";

const Home = () => {
    const [calcDisplay, setCalcDisplay] = useState("");

    const appendToCalc = (val) => {
        setCalcDisplay(calcDisplay + val);
    };

    const clearCalc = () => {
        setCalcDisplay("");
    };

    const calculateResult = () => {
        try {
            setCalcDisplay(eval(calcDisplay).toString());
        } catch {
            setCalcDisplay("Errore");
        }
    };

    const handleKeyDown = (event) => {
        const validKeys = "0123456789/*-+.()";
        if (validKeys.includes(event.key)) {
            appendToCalc(event.key);
        } else if (event.key === "Enter") {
            calculateResult();
        } else if (event.key === "Backspace") {
            setCalcDisplay(calcDisplay.slice(0, -1));
        }
    };

    const toggleCalcPopup = () => {
        const calcPopup = document.getElementById("calc-popup");
        calcPopup.style.display =
            calcPopup.style.display === "none" ? "block" : "none";
    };

    const [noleggi, setnoleggi] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredNoleggi, setFilteredNoleggi] = useState([]);
    const [showNoResultsPopup, setShowNoResultsPopup] = useState(false);

    let scadenzeNum = 0;

    useEffect(() => {
        const fetchData = async () => {
            let { data, error } = await supabase.from("noleggio").select("*");
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

            const nameMatch = fullName.includes(searchTerm.toLowerCase());

            const isNumericSearch = /^\d+$/.test(searchTerm);
            if (isNumericSearch) {
                const exactCodeMatch = codiceStr === searchTerm;
                const exactFamMatch = codiceFam === searchTerm;
                return nameMatch || exactCodeMatch || exactFamMatch;
            } else {
                return (
                    nameMatch ||
                    codiceStr.includes(searchTerm) ||
                    codiceFam.includes(searchTerm)
                );
            }
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
            <NoleggioAccordion key={i} id={i} items={dataToShow} />
        ));
    };

    const displayNoleggiOggi = () => {
        const oggi = new Date().toISOString().split("T")[0];
        const noleggiScadonoOggi = noleggi.filter(
            (item) => item.datafine?.split("T")[0] === oggi
        );

        scadenzeNum = noleggiScadonoOggi.length;

        return Array.from({ length: 1 }, (_, i) => (
            <NoleggioAccordionOggi key={i + 100} id={i + 100} items={noleggi} />
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
                    <button className="btn btn-outline-custom" type="submit">
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

            <button id="calc-btn" onClick={toggleCalcPopup}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    color="#fff"
                    fill="none"
                >
                    <path
                        d="M21.5 12.95V11.05C21.5 7.01949 21.5 5.00424 20.1088 3.75212C18.7175 2.5 16.4783 2.5 12 2.5C7.52166 2.5 5.28249 2.5 3.89124 3.75212C2.5 5.00424 2.5 7.01949 2.5 11.05V12.95C2.5 16.9805 2.5 18.9958 3.89124 20.2479C5.28249 21.5 7.52166 21.5 12 21.5C16.4783 21.5 18.7175 21.5 20.1088 20.2479C21.5 18.9958 21.5 16.9805 21.5 12.95Z"
                        stroke="#fff"
                        stroke-width="1.5"
                    />
                    <path
                        d="M18 8H14M16 6L16 10"
                        stroke="#fff"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M18 17.5H14"
                        stroke="#fff"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M18 14.5H14"
                        stroke="#fff"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M10 17.5L8.25 15.75M8.25 15.75L6.5 14M8.25 15.75L10 14M8.25 15.75L6.5 17.5"
                        stroke="#fff"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M10 8H6"
                        stroke="#fff"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>

            <div id="calc-popup" style={{ display: "none" }}>
                <input
                    type="text"
                    id="calc-display"
                    value={calcDisplay}
                    readOnly
                    onKeyDown={handleKeyDown}
                    autoFocus
                />

                <div className="calc-row">
                    <button onClick={() => appendToCalc("7")}>7</button>
                    <button onClick={() => appendToCalc("8")}>8</button>
                    <button onClick={() => appendToCalc("9")}>9</button>
                    <button onClick={() => appendToCalc("/")}>÷</button>
                </div>
                <div className="calc-row">
                    <button onClick={() => appendToCalc("4")}>4</button>
                    <button onClick={() => appendToCalc("5")}>5</button>
                    <button onClick={() => appendToCalc("6")}>6</button>
                    <button onClick={() => appendToCalc("*")}>×</button>
                </div>
                <div className="calc-row">
                    <button onClick={() => appendToCalc("1")}>1</button>
                    <button onClick={() => appendToCalc("2")}>2</button>
                    <button onClick={() => appendToCalc("3")}>3</button>
                    <button onClick={() => appendToCalc("-")}>-</button>
                </div>
                <div className="calc-row">
                    <button onClick={() => appendToCalc("0")}>0</button>
                    <button onClick={() => appendToCalc(".")}>.</button>
                    <button onClick={calculateResult}>=</button>
                    <button onClick={() => appendToCalc("+")}>+</button>
                </div>
                <div className="calc-row">
                    <button style={{ width: "100%" }} onClick={clearCalc}>
                        C
                    </button>
                </div>
            </div>

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
        </section>
    );
};

export default Home;
