import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/noleggio.css";

const AccordionItem = ({ id, item, archiviato }) => {
    // eslint-disable-next-line no-unused-vars
    const [pagato, setPagato] = useState(item.pagato ? "si" : "no");
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

    const handleUpdatePagato = async (codice, nuovoValore) => {
        setLoading(true);

        const { error } = await supabase
            .from("noleggio")
            .update({ pagato: nuovoValore === "si" })
            .eq("codice", codice);

        if (error) {
            console.error("Errore aggiornamento pagato:", error);
        } else {
            console.log("Stato pagamento aggiornato!");
        }

        setLoading(false);
        window.location.reload();
    };

    return (
        <div className="accordion-item border rounded p-2 mb-2">
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}`}
                    aria-expanded="false"
                    aria-controls={id}
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
                    <p className="mb-1">
                        <strong>Attrezzo:</strong>{" "}
                        {
                            {
                                1: "Sci",
                                2: "Snowboard",
                                3: "Ciaspole",
                                4: "Abbigliamento",
                            }[item.attrezzoid]
                        }
                    </p>

                    <p className="mb-1">
                        <strong>Da:</strong>{" "}
                        {new Date(item.datainizio).toLocaleDateString("it-IT")}
                    </p>
                    <p className="mb-1">
                        <strong>A:</strong>{" "}
                        {item.datafine === false || item.datafine == null
                            ? "(In prestito)"
                            : new Date(item.datafine).toLocaleDateString(
                                  "it-IT"
                              )}
                    </p>

                    <p className="mb-1">
                        <strong>Tipo cliente:</strong> {item.tipocliente}
                    </p>
                    <p className="mb-1">
                        <strong>Tipo noleggio:</strong> {item.tiponoleggio}
                    </p>
                    <p className="mb-1">
                        <strong>Codice famiglia:</strong>{" "}
                        {item.codicefamiglia == null
                            ? "NaN"
                            : item.codicefamiglia}
                    </p>

                    <p className="mb-1">
                        <strong>Prezzo:</strong> {item.prezzototale} €
                    </p>

                    {!archiviato ? (
                        <>
                            <div className="d-flex align-items-center gap-3 mt-3">
                                <label>
                                    <strong>Pagato:</strong>
                                </label>
                                <select
                                    value={item.pagato ? "si" : "no"}
                                    onChange={(e) => {
                                        setPagato(e.target.value);
                                        handleUpdatePagato(
                                            item.codice,
                                            e.target.value
                                        );
                                    }}
                                    className="form-select"
                                    style={{
                                        width: "100px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <option value="si">Si</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                            <br />
                        </>
                    ) : (
                        <>
                            <div className="d-flex align-items-center gap-3 mt-3">
                                <p className="mb-1">
                                    <strong>Pagato:</strong>{" "}
                                    {item.pagato ? "si" : "no"}
                                </p>
                            </div>
                        </>
                    )}

                    {!archiviato && (
                        <button
                            className="btn btn-outline-secondary btn-sm d-flex align-items-center archivia"
                            disabled={loading}
                            onClick={handleArchiviaClick}
                            style={{
                                backgroundColor: "#ffcd37",
                                color: "#fff",
                                borderColor: "#ffcd37",
                                gap: "10px",
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
                    )}

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
                                            Sei sicuro di voler archiviare il
                                            noleggio?
                                        </h5>
                                        <br />
                                        <p className="mb-3 text-secondary">
                                            Una volta archiviato, devi creare un
                                            altro noleggio per questa persona.
                                        </p>
                                        <br />
                                        <div className="form-check text-start mb-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="noShowAgain"
                                                checked={dontShowAgain}
                                                onChange={(e) =>
                                                    setDontShowAgain(
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="noShowAgain"
                                                style={{ fontSize: "14px" }}
                                            >
                                                Ho capito, non mostrare più il
                                                messaggio
                                            </label>
                                        </div>
                                    </div>
                                    <div className="modal-footer flex-nowrap p-0">
                                        <button
                                            type="button"
                                            className="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end"
                                            onClick={
                                                handleConfermaArchiviazione
                                            }
                                        >
                                            Si
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0"
                                            onClick={() => setShowPopup(false)}
                                        >
                                            No
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

const NoleggioAccordion = ({ id, items, archiviato }) => {
    return (
        <div className="accordion accordion-flush" id={id}>
            {items.map((item, index) => {
                return (
                    <AccordionItem
                        key={index}
                        id={`${id}-item-${index}`}
                        item={item}
                        archiviato={archiviato}
                    />
                );
            })}
        </div>
    );
};

export default NoleggioAccordion;
