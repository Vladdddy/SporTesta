import React from "react";

const AccordionItem = ({ id, item }) => (
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
                {item.codice} <span className="ms-3">{item.nomecognome}</span>
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
                        {new Date(item.datafine).toLocaleDateString("it-IT")}
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
                    <strong>Prezzo:</strong> {item.prezzototale} €
                    {item.modalitanoleggio === "riscatto" &&
                        item.accontoiniziale && (
                            <span>
                                {" "}
                                (Acconto: €{item.accontoiniziale}
                                {item.saldofinale
                                    ? `, Saldo: €${item.saldofinale}`
                                    : ""}
                                )
                            </span>
                        )}
                </p>

                {item.pagato === false || item.pagato == null ? (
                    <p className="mb-1">
                        <strong>Pagato:</strong> No
                    </p>
                ) : (
                    <p className="mb-1">
                        <strong>Pagato:</strong> Si
                    </p>
                )}
            </div>
        </div>
    </div>
);

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
