import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const AccordionItem = ({ id, item }) => {
    const [pagato, setPagato] = useState(item.pagato ? "si" : "no");
    const [loading, setLoading] = useState(false);

    const handleUpdatePagato = async () => {
        setLoading(true);
        const nuovoValore = pagato === "si";

        const { error } = await supabase
            .from("noleggio")
            .update({ pagato: nuovoValore })
            .eq("codice", item.codice);

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
                    {/* Attrezzo */}
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
                        <strong>Prezzo:</strong> {item.prezzototale} €
                    </p>

                    <div className="d-flex align-items-center gap-3 mt-3">
                        <label>
                            <strong>Pagato:</strong>
                        </label>
                        <select
                            value={pagato}
                            onChange={(e) => setPagato(e.target.value)}
                            className="form-select"
                            style={{ width: "100px", cursor: "pointer" }}
                        >
                            <option value="si">Si</option>
                            <option value="no">No</option>
                        </select>
                        <button
                            className="btn btn-success btn-sm"
                            onClick={handleUpdatePagato}
                            disabled={loading}
                        >
                            {loading ? "Salvando..." : "Aggiorna"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NoleggioAccordion = ({ id, items }) => {
    return (
        <div className="accordion accordion-flush" id={id}>
            {items.map((item, index) => {
                return (
                    <AccordionItem
                        key={index}
                        id={`${id}-item-${index}`}
                        item={item}
                    />
                );
            })}
        </div>
    );
};

export default NoleggioAccordion;
