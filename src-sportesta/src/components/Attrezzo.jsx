import React, { useState } from "react";
import "../styles/noleggio.css";

const AttrezziForm = () => {
    const [selectedAttrezzo, setSelectedAttrezzo] = useState("");
    const [formData, setFormData] = useState({
        tipoCliente: "",
        nome: "",
        attrezzo: "",
        prezzo: "",
        dettagliExtra: {},
    });

    const handleChange = (e) => {
        e.preventDefault();
        const { id, value, name } = e.target;

        if (name === "attrezzo") {
            setSelectedAttrezzo(value);
            setFormData({ ...formData, attrezzo: value });
        } else if (name === "tipoCliente") {
            setFormData({ ...formData, tipoCliente: value });
        } else if (["prezzo", "nome"].includes(id)) {
            setFormData({ ...formData, [id]: value });
        } else {
            setFormData({
                ...formData,
                dettagliExtra: {
                    ...formData.dettagliExtra,
                    [id]: value,
                },
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/noleggi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log("Noleggio salvato:", data);

            // Genera una ricevuta testuale (puoi usare PDF o HTML a seconda del tuo obiettivo)
            const blob = new Blob([JSON.stringify(formData, null, 2)], {
                type: "text/plain",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "ricevuta.txt";
            link.click();
        } catch (error) {
            console.error("Errore durante il salvataggio:", error);
        }
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
