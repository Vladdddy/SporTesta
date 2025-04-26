import React, { useState } from "react";
import "../styles/noleggio.css";
import { supabase } from "../supabaseClient";

const AttrezziForm = () => {
    const [selectedAttrezzo, setSelectedAttrezzo] = useState("");
    const [formData, setFormData] = useState({
        attrezzo: "",
        nome: "",
        tipoCliente: "",
        prezzo: "",
        dataInizio: "",
        dataFine: "",
        tipoNoleggio: "",
        codiceFamiglia: "",
        dettagli: {},
    });

    const handleChange = (e) => {
        const { id, value, name } = e.target;

        if (name === "attrezzo") {
            setSelectedAttrezzo(value);
            setFormData((prev) => ({ ...prev, attrezzo: value }));
        } else if (name === "tipoCliente") {
            setFormData((prev) => ({ ...prev, tipoCliente: value }));
        } else if (
            [
                "nome",
                "prezzo",
                "dataInizio",
                "dataFine",
                "codiceFamiglia",
            ].includes(id)
        ) {
            setFormData((prev) => ({ ...prev, [id]: value }));
        } else {
            setFormData((prev) => ({
                ...prev,
                dettagli: {
                    ...prev.dettagli,
                    [id]: value,
                },
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const attrezzoMap = {
            sci: 1,
            snowboard: 2,
            ciaspole: 3,
            abbigliamento: 4,
        };

        const dataToSend = {
            attrezzoid: attrezzoMap[formData.attrezzo],
            nomecognome: formData.nome,
            tipocliente: formData.tipoCliente,
            prezzototale: parseFloat(formData.prezzo),
            pagato: false,
            datainizio: formData.dataInizio,
            datafine: formData.dataFine,
            codicefamiglia: formData.codiceFamiglia
                ? parseInt(formData.codiceFamiglia)
                : 0,
            tiponoleggio: formData.tipoNoleggio,
        };

        try {
            const { error } = await supabase
                .from("noleggio")
                .insert([dataToSend]);

            if (error) {
                console.error(
                    "Errore durante il salvataggio su Supabase:",
                    error
                );
                return;
            }

            const { data, errorCodice } = await supabase
                .from("noleggio")
                .select("*")
                .order("codice", { ascending: false })
                .limit(1)
                .single();

            if (errorCodice) {
                console.error("Errore durante l'inserimento:", error);
                return;
            }

            const codiceGenerato = data.codice;

            console.log("Noleggio salvato con successo!");

            const ricevutaHtml = `
    <html>
        <head>
            <title>Ricevuta</title>
            <style>
                .info-aziendali {
                    text-align: center;
                    line-height: 1.2;
                }
            </style>
        </head>
        <body>
        <div style="display: flex; flex-direction: row; justify-content: space-evenly; align-items: center">
            <img style="width: 150px" src="/sportesta-logo.png" alt="logo">
            <h4>21013 Gallarate, Via Pegoraro, 18 Cell: 340 141 7605   Cell: 348 925 1148</h4>
        </div>

            <br />
            <div style="display: flex; flex-direction: row; justify-content: space-evenly; align-items: center">
                <h2 style="font-weight: 400">Cliente: ${formData.nome}</h2>    
                <h2 style="font-weight: 400">Codice: ${codiceGenerato}</h2>
            </div>
            <br />

            <div style="display: flex; flex-direction: row; justify-content: space-evenly; align-items: center; font-weight: 300">
<h2 style="font-weight: 400">Data Inizio: ${new Date(
                formData.dataInizio
            ).toLocaleDateString("it-IT")}</h2>
            <h2 style="font-weight: 400">Data Fine: ${new Date(
                formData.dataFine
            ).toLocaleDateString("it-IT")}</h2>
            </div>
            
            <p style="text-align: center; font-size: 30px">Prezzo: €${
                formData.prezzo
            }</p>
            <br />
            <div class="info-aziendali">
                <h4>SPORTESTA di Banfi Alessandro</h4>
                <p>Via Pegoraro, 18 - 21013 GALLARATE (VA)</p>
                <p>Cod. Fisc.: BNFLSN76D24I819W - P.IVA 03732390129</p>
                <p>Pec: testasport@sicurezzapostale.it</p>
            </div>
            <br />
            <h6>
                I danni causati da un uso improprio dell'attrezzo avuto in noleggio saranno considerati a costo di mercato. 
                Chi noleggia è responsabile dell'oggetto avuto in uso. Alla scadenza del periodo prenotato, la consegna del materiale 
                avuto in noleggio, deve avvenire alla data convenuta (salvo comunicazioni) altrimenti saranno addebitati i giorni di 
                ritardo a prezzo di listino.
            </h6>
            <script>
                window.onload = function() {
                    window.print();
                    window.close();
                };
            </script>
        </body>
    </html>
`;

            const printWindow = window.open("", "_blank");
            printWindow.document.write(ricevutaHtml);
            printWindow.document.close();
        } catch (error) {
            console.error("Errore durante il salvataggio:", error);
        }

        window.location.reload();
    };

    const renderInputs = () => {
        const commonFields = (fields) =>
            fields.map((field, index) => (
                <div className="mb-4 mobile" key={index}>
                    <label htmlFor={field.toLowerCase()} className="form-label">
                        {field}
                    </label>
                    <input
                        type={
                            field.toLowerCase() === "altezza*"
                                ? "number"
                                : field.toLowerCase() === "peso*"
                                ? "number"
                                : field.toLowerCase() === "numero di piede*"
                                ? "number"
                                : field.toLowerCase() === "passo"
                                ? "number"
                                : "text"
                        }
                        className="form-control"
                        id={field.toLowerCase()}
                        onChange={handleChange}
                        value={
                            field.toLowerCase() === "passo"
                                ? (() => {
                                      const piede = parseFloat(
                                          formData.dettagli["altezza*"]
                                      );
                                      return isNaN(piede)
                                          ? ""
                                          : (piede / Math.PI).toFixed(2);
                                  })()
                                : formData.dettagli[field.toLowerCase()] || ""
                        }
                        placeholder={
                            field.toLowerCase() === "peso*"
                                ? "kg"
                                : field.toLowerCase() === "altezza*"
                                ? "cm"
                                : ""
                        }
                        required
                    />
                </div>
            ));

        switch (selectedAttrezzo) {
            case "sci":
                return commonFields([
                    "Dettagli",
                    "Altezza*",
                    "Peso*",
                    "Numero di piede*",
                    "Scarponi",
                    "Bastoncini",
                    "Casco",
                ]);
            case "snowboard":
                return commonFields([
                    "Dettagli",
                    "Altezza*",
                    "Peso*",
                    "Numero di piede*",
                    "Scarponi",
                    "Bastoncini",
                    "Casco",
                    "Passo",
                ]);
            case "ciaspole":
                return commonFields(["Dettagli", "Bastoncini"]);
            case "abbigliamento":
                return commonFields(["Giacca", "Pantalone"]);
            default:
                return null;
        }
    };

    return (
        <div className="d-flex justify-content-center mt-4 mobile-margin">
            <form
                onSubmit={handleSubmit}
                style={{ width: "100%", maxWidth: "400px" }}
            >
                <div className="d-flex align-items-center my-4">
                    <hr className="flex-grow-1" />
                    <span className="mx-3 text-muted">Cliente</span>
                    <hr className="flex-grow-1" />
                </div>

                <div className="mb-4">
                    <div className="d-flex gap-4 mobile">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="tipoCliente"
                                id="adulto"
                                onChange={handleChange}
                                value="Adulto"
                                checked={formData.tipoCliente === "Adulto"}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="adulto"
                            >
                                Adulto
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="tipoCliente"
                                id="bambino"
                                onChange={handleChange}
                                value="Bambino"
                                checked={formData.tipoCliente === "Bambino"}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="bambino"
                            >
                                Bambino
                            </label>
                        </div>
                    </div>
                </div>

                <br />

                <div className="d-flex align-items-center my-4">
                    <hr className="flex-grow-1" />
                    <span className="mx-3 text-muted">Tipo Noleggio</span>
                    <hr className="flex-grow-1" />
                </div>

                <div className="mb-4">
                    <div className="d-flex gap-4 mobile">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="tipoNoleggio"
                                id="singolo"
                                value="singolo"
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        tipoNoleggio: e.target.value,
                                    }))
                                }
                                checked={formData.tipoNoleggio === "singolo"}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="singolo"
                            >
                                Singolo
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="tipoNoleggio"
                                id="famiglia"
                                value="famiglia"
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        tipoNoleggio: e.target.value,
                                    }))
                                }
                                checked={formData.tipoNoleggio === "famiglia"}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="famiglia"
                            >
                                Famiglia
                            </label>
                        </div>
                    </div>
                </div>

                <br />

                <div className="d-flex align-items-center my-4">
                    <hr className="flex-grow-1" />
                    <span className="mx-3 text-muted">Dati</span>
                    <hr className="flex-grow-1" />
                </div>

                <div className="mb-4">
                    <label htmlFor="nome" className="form-label">
                        Nome e Cognome*
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="nome"
                        onChange={handleChange}
                        value={formData.nome}
                        required
                    />
                </div>

                {formData.tipoNoleggio === "famiglia" && (
                    <div className="mb-4">
                        <label htmlFor="codiceFamiglia" className="form-label">
                            Codice famiglia*
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="codiceFamiglia"
                            onChange={handleChange}
                            value={formData.codiceFamiglia}
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="dataInizio" className="form-label">
                        Data inizio*
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="dataInizio"
                        onChange={handleChange}
                        value={formData.dataInizio}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="dataFine" className="form-label">
                        Data fine
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="dataFine"
                        onChange={handleChange}
                        value={formData.dataFine}
                        required
                    />
                </div>

                <br />

                <div className="d-flex align-items-center my-4">
                    <hr className="flex-grow-1" />
                    <span className="mx-3 text-muted">Attrezzo</span>
                    <hr className="flex-grow-1" />
                </div>

                <div>
                    <div className="mb-4">
                        <div className="d-flex gap-4 mobile">
                            {[
                                { id: "sci", label: "Sci" },
                                { id: "snowboard", label: "Snowboard" },
                                { id: "ciaspole", label: "Ciaspole" },
                                { id: "abbigliamento", label: "Abbigliamento" },
                            ].map((attrezzo) => (
                                <div className="form-check" key={attrezzo.id}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="attrezzo"
                                        id={attrezzo.id}
                                        value={attrezzo.id}
                                        onChange={handleChange}
                                        checked={
                                            selectedAttrezzo === attrezzo.id
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={attrezzo.id}
                                    >
                                        {attrezzo.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {renderInputs()}
                </div>

                <br />
                <br />

                <div className="mb-4">
                    <label htmlFor="prezzo" className="form-label">
                        Prezzo*
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="prezzo"
                        placeholder="€"
                        value={formData.prezzo}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <button type="submit" className="btn btn-custom">
                    Salva e scarica ricevuta
                </button>
            </form>
        </div>
    );
};

export default AttrezziForm;
