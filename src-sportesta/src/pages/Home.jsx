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

    const toggleEmailPopup = () => {
        const emailPopup = document.getElementById("email-popup");
        emailPopup.style.display =
            emailPopup.style.display === "none" ? "block" : "none";
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
        const noleggiScaduti = noleggi.filter((item) => {
            const dataFine = item.datafine?.split("T")[0];
            const isOverdue = dataFine && dataFine < oggi;

            // Show all rentals (both paid and unpaid) that are past their end date
            return isOverdue;
        });

        scadenzeNum = noleggiScaduti.length;

        return Array.from({ length: 1 }, (_, i) => (
            <NoleggioAccordionOggi
                key={i + 100}
                id={i + 100}
                items={noleggiScaduti}
            />
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
                    Noleggi scaduti
                </h2>

                {displayNoleggiOggi()}

                {scadenzeNum < 1 ? (
                    <p style={{ textAlign: "center", color: "gray" }}>
                        Nessun noleggio scaduto!
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

            <button id="email-btn" onClick={toggleEmailPopup}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    color="#fff"
                    fill="none"
                >
                    <path
                        d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6"
                        stroke="#fff"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.755 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.755 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
                        stroke="#fff"
                        stroke-width="1.5"
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

            <div id="email-popup" style={{ display: "none" }}>
                <div className="email-popup-content">
                    <h4>Invia Scheda</h4>
                    <p>
                        Sei sicuro di voler inviare la scheda più recente al
                        cliente?
                    </p>
                    <div className="email-buttons">
                        <a
                            href="https://hook.eu2.make.com/ckd0nhvpbh66c9owg5gs6to2yvd6bb2j"
                            className="email-link email-yes"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={toggleEmailPopup}
                        >
                            Si
                        </a>
                        <button
                            className="email-link email-no"
                            onClick={toggleEmailPopup}
                        >
                            No
                        </button>
                    </div>
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
