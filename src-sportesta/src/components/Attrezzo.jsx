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
            codicefamiglia: formData.codiceFamiglia,
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

            console.log("Noleggio salvato con successo!");

            const ricevuta = `
    Cliente: ${formData.nome}
    Tipo Cliente: ${formData.tipoCliente}
    Attrezzo: ${formData.attrezzo}
    Data Inizio: ${formData.dataInizio}
    Data Fine: ${formData.dataFine}
    Codice Famiglia: ${formData.codiceFamiglia}
    Prezzo: ${formData.prezzo}€
    
    [Dettagli noleggio]
    ${Object.entries(formData.dettagli)
        .map(([key, val]) => `${key}: ${val}`)
        .join("\n")}
            `.trim();

            const blob = new Blob([ricevuta], { type: "text/plain" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "ricevuta.txt";
            link.click();
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
                        type="text"
                        className="form-control"
                        id={field.toLowerCase()}
                        onChange={handleChange}
                        value={
                            field.toLowerCase() === "passo"
                                ? (() => {
                                      const piede = parseFloat(
                                          formData.dettagli["numero di piede"]
                                      );
                                      return isNaN(piede)
                                          ? ""
                                          : (piede / Math.PI).toFixed(2);
                                  })()
                                : formData.dettagli[field.toLowerCase()] || ""
                        }
                        placeholder={
                            field.toLowerCase() === "peso"
                                ? "kg"
                                : field.toLowerCase() === "altezza"
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
                    "Altezza",
                    "Peso",
                    "Numero di piede",
                    "Scarponi",
                    "Bastoncini",
                    "Casco",
                ]);
            case "snowboard":
                return commonFields([
                    "Dettagli",
                    "Altezza",
                    "Peso",
                    "Numero di piede",
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
                        Nome e Cognome
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

                <div className="mb-4">
                    <label htmlFor="codiceFamiglia" className="form-label">
                        Codice famiglia (se necessario)
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="codiceFamiglia"
                        onChange={handleChange}
                        value={formData.codiceFamiglia}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="dataInizio" className="form-label">
                        Data inizio
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
                        Prezzo
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

                <button type="submit" className="btn btn-primary">
                    Salva e scarica ricevuta
                </button>
            </form>
        </div>
    );
};

export default AttrezziForm;
