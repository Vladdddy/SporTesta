import React from "react";

const AccordionItem = ({ id, item }) => (
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
                    <strong>Da:</strong> {item.datainizio}
                </p>
                <p className="mb-1">
                    <strong>A:</strong> {item.datafine}
                </p>

                <div className="mb-2">
                    <p className="mb-1">
                        <strong>Tipo cliente:</strong> {item.tipocliente}
                    </p>
                    <p className="mb-1">
                        <strong>Tipo noleggio:</strong> {item.tiponoleggio}
                    </p>
                </div>

                <p className="mb-1">
                    <strong>Prezzo:</strong> {item.prezzototale} €
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

const NoleggioAccordion = ({ id, items }) => {
    return (
        <div className="accordion accordion-flush" id={id}>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    id={`${id}-item-${index}`}
                    item={item}
                />
            ))}
        </div>
    );
};

export default NoleggioAccordion;
