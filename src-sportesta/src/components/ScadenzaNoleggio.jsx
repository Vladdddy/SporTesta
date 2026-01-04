import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const AccordionItem = ({ id, item }) => {
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(
        localStorage.getItem("hideArchivePopup") === "true"
    );

    const handleArchiviaClick = () => {
        if (dontShowAgain) {
            handleArchiviazione();
        } else {
            setShowPopup(true);
        }
    };

    const handleConfermaArchiviazione = () => {
        if (dontShowAgain) {
            localStorage.setItem("hideArchivePopup", "true");
        }
        setShowPopup(false);
        handleArchiviazione();
    };

    const handleArchiviazione = async () => {
        setLoading(true);

        const { data, error: fetchError } = await supabase
            .from("noleggio")
            .select("*")
            .eq("codice", item.codice)
            .single();

        if (fetchError) {
            console.error("Errore nel recupero del noleggio:", fetchError);
            setLoading(false);
            return;
        }

        console.log(data);

        const { error: insertError } = await supabase
            .from("noleggioarchiviato")
            .insert(data);

        if (insertError) {
            console.error(
                "Errore nell'inserimento in archiviati:",
                insertError.message,
                insertError.details
            );
            setLoading(false);
            return;
        }

        const { error: deleteError } = await supabase
            .from("noleggio")
            .delete()
            .eq("codice", item.codice);

        if (deleteError) {
            console.error(
                "Errore nell'eliminazione del noleggio:",
                deleteError
            );
        } else {
            console.log("Noleggio archiviato con successo!");
        }

        setLoading(false);
        window.location.reload();
    };

    return (
        <div className="accordion-item border border-danger rounded p-2 mb-2">
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed text-danger"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}`}
                    aria-expanded="false"
                    aria-controls={id}
                    style={{ borderColor: "#dc3545" }}
                >
                    {item.codice}{" "}
                    <span className="ms-3">{item.nomecognome}</span>
                </button>
            </h2>

            <div
                id={id}
                className="accordion-collapse collapse"
                data-bs-parent={`#${item.codice}`}
            >
                <div className="accordion-body p-3">
                    {item.attrezzoid === 1 ? (
                        <p className="mb-1">
                            <strong>Attrezzo:</strong> Sci
                        </p>
                    ) : item.attrezzoid === 2 ? (
                        <p className="mb-1">
                            <strong>Attrezzo:</strong> Snowboard
                        </p>
                    ) : item.attrezzoid === 3 ? (
                        <p className="mb-1">
                            <strong>Attrezzo:</strong> Ciaspole
                        </p>
                    ) : item.attrezzoid === 4 ? (
                        <p className="mb-1">
                            <strong>Attrezzo:</strong> Abbigliamento
                        </p>
                    ) : null}

                    <p className="mb-1">
                        <strong>Da:</strong>{" "}
                        {new Date(item.datainizio).toLocaleDateString("it-IT")}
                    </p>
                    {item.datafine === false || item.datafine == null ? (
                        <p className="mb-1">
                            <strong>A:</strong> (In prestito)
                        </p>
                    ) : (
                        <p className="mb-1">
                            <strong>A:</strong>{" "}
                            {new Date(item.datafine).toLocaleDateString(
                                "it-IT"
                            )}
                        </p>
                    )}

                    <p className="mb-1">
                        <strong>Telefono:</strong> {item.telefono}
                    </p>
                    <p className="mb-1">
                        <strong>Email:</strong>{" "}
                        {item.email == null ? "(Non fornita)" : item.email}
                    </p>

                    <div className="mb-2">
                        <p className="mb-1">
                            <strong>Tipo cliente:</strong> {item.tipocliente}
                        </p>
                        <p className="mb-1">
                            <strong>Tipo noleggio:</strong> {item.tiponoleggio}
                        </p>
                        <p className="mb-1">
                            <strong>Livello:</strong>{" "}
                            {item.livello || "Non specificato"}
                        </p>
                        {item.modalitanoleggio && (
                            <p className="mb-1">
                                <strong>Modalità:</strong>{" "}
                                {item.modalitanoleggio === "riscatto"
                                    ? "Noleggio a riscatto"
                                    : "Noleggio normale"}
                            </p>
                        )}
                        {item.attrezzaturariscatto && (
                            <p className="mb-1">
                                <strong>Attrezzatura da riscattare:</strong>{" "}
                                {item.attrezzaturariscatto}
                            </p>
                        )}
                    </div>
                    <p className="mb-1">
                        <strong>Codice famiglia:</strong>{" "}
                        {item.codicefamiglia == null || item.codicefamiglia == 0
                            ? "Nessuno"
                            : item.codicefamiglia}
                    </p>

                    <p className="mb-1">
                        <strong>Prezzo:</strong>
                        {item.modalitanoleggio === "riscatto" &&
                            item.accontoiniziale && (
                                <span>
                                    {" "}
                                    (Acconto: €{item.accontoiniziale}
                                    {item.saldofinale
                                        ? `, Saldo: €${item.saldofinale}`
                                        : ""}
                                    ) Totale:
                                </span>
                            )}{" "}
                        <strong className="text-primary">
                            €{item.prezzototale}
                        </strong>
                    </p>

                    {item.pagato === false || item.pagato == null ? (
                        <p className="mb-1">
                            <strong>Acconto Pagato:</strong> No
                        </p>
                    ) : (
                        <p className="mb-1">
                            <strong>Acconto Pagato:</strong> Si
                        </p>
                    )}

                    {item.saldo_pagato === false ||
                    item.saldo_pagato == null ? (
                        <p className="mb-1">
                            <strong>Saldo Pagato:</strong> No
                        </p>
                    ) : (
                        <p className="mb-1">
                            <strong>Saldo Pagato:</strong> Si
                        </p>
                    )}

                    <button
                        className="btn btn-outline-secondary btn-sm d-flex align-items-center archivia"
                        disabled={loading}
                        onClick={handleArchiviaClick}
                        style={{
                            backgroundColor: "#1a2c74",
                            color: "#fff",
                            borderColor: "#1a2c74",
                            gap: "10px",
                            marginTop: "10px",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            color="#fff"
                            fill="none"
                        >
                            <path
                                d="M21 7H3V13C3 16.7712 3 18.6569 4.17157 19.8284C5.34315 21 7.22876 21 11 21H13C16.7712 21 18.6569 21 19.8284 19.8284C21 18.6569 21 16.7712 21 13V7Z"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M21 7H3L4.2 5.4C5.08328 4.22229 5.52492 3.63344 6.15836 3.31672C6.7918 3 7.52786 3 9 3H15C16.4721 3 17.2082 3 17.8416 3.31672C18.4751 3.63344 18.9167 4.22229 19.8 5.4L21 7Z"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M12 11L12 17.5M9 13.5C9.58984 12.8932 11.1597 10.5 12 10.5C12.8403 10.5 14.4102 12.8932 15 13.5"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                        {loading ? "Archivio in corso..." : "Archivia"}
                    </button>

                    {showPopup && (
                        <div
                            className="modal modal-sheet position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
                            tabIndex="-1"
                            role="dialog"
                            style={{ zIndex: 10 }}
                        >
                            <div className="modal-dialog">
                                <div className="modal-content rounded-3 shadow">
                                    <div className="modal-body p-4 text-center">
                                        <h5 className="mb-0 bold">
                                            Conferma archiviazione
                                        </h5>
                                        <p className="mb-3 mt-3">
                                            Sei sicuro di voler archiviare
                                            questo noleggio?
                                        </p>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="dontShowCheckbox"
                                                checked={dontShowAgain}
                                                onChange={(e) =>
                                                    setDontShowAgain(
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="dontShowCheckbox"
                                            >
                                                Non mostrare più questo
                                                messaggio
                                            </label>
                                        </div>
                                    </div>
                                    <div className="modal-footer flex-nowrap p-0">
                                        <button
                                            type="button"
                                            className="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end"
                                            onClick={() => setShowPopup(false)}
                                        >
                                            <strong>Annulla</strong>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0"
                                            onClick={
                                                handleConfermaArchiviazione
                                            }
                                        >
                                            Conferma
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const NoleggioAccordionOggi = ({ id, items }) => {
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="accordion accordion-flush" id={id}>
            {items.map((item, index) => {
                const dataFine = item.datafine?.split("T")[0];
                const isOverdue = dataFine && dataFine < today;

                // Show all rentals that are past their end date (both paid and unpaid)
                if (isOverdue) {
                    return (
                        <AccordionItem
                            key={index}
                            id={`${id}-item-${index}`}
                            item={item}
                        />
                    );
                }
            })}
        </div>
    );
};

export default NoleggioAccordionOggi;
