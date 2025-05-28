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
                "telefono",
                "email",
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
            telefono: formData.telefono,
            email: formData.email,
            tipocliente: formData.tipoCliente,
            prezzototale: parseFloat(formData.prezzo),
            pagato: false,
            datainizio: formData.dataInizio,
            datafine: formData.dataFine,
            codicefamiglia: formData.codiceFamiglia || null,
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
<!DOCTYPE html>
<html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ricevuta Noleggio - SPORTESTA</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.4;
                color: #333;
                background: white;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .receipt-container {
                border: 2px solid #2c5aa0;
                border-radius: 10px;
                padding: 30px;
                background: #fafafa;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 20px;
                border-bottom: 3px solid #2c5aa0;
                margin-bottom: 25px;
            }
            
            .logo {
                width: 120px;
                height: auto;
            }
            
            .company-info {
                text-align: right;
                color: #2c5aa0;
                font-weight: 600;
            }
            
            .company-info h3 {
                font-size: 16px;
                margin-bottom: 5px;
            }
            
            .receipt-title {
                text-align: center;
                background: linear-gradient(135deg, #2c5aa0, #4a7bc8);
                color: white;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 25px;
                font-size: 24px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 25px;
            }
            
            .info-card {
                background: white;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #2c5aa0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .info-label {
                font-weight: bold;
                color: #2c5aa0;
                font-size: 14px;
                text-transform: uppercase;
                margin-bottom: 5px;
            }
            
            .info-value {
                font-size: 16px;
                color: #333;
                font-weight: 500;
            }
            
            .date-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 25px 0;
            }
            
            .equipment-details {
                background: #f8f9fa;
                border: 2px solid #e9ecef;
                border-radius: 10px;
                padding: 20px;
                margin: 25px 0;
            }
            
            .equipment-title {
                text-align: center;
                color: #2c5aa0;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
                text-transform: uppercase;
            }
            
            .equipment-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #dee2e6;
            }
            
            .equipment-item:last-child {
                border-bottom: none;
            }
            
            .equipment-label {
                font-weight: 600;
                color: #495057;
            }
            
            .equipment-value {
                color: #212529;
                font-weight: 500;
            }
            
            .total-amount {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 25px 0;
                box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
            }
            
            .total-amount h2 {
                font-size: 28px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .company-details {
                background: white;
                border: 2px solid #2c5aa0;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 25px 0;
            }
            
            .company-details h4 {
                color: #2c5aa0;
                font-size: 18px;
                margin-bottom: 10px;
                font-weight: bold;
            }
            
            .company-details p {
                margin: 5px 0;
                color: #495057;
                font-size: 14px;
            }
            
            .terms {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 6px;
                padding: 15px;
                margin-top: 25px;
                font-size: 12px;
                line-height: 1.5;
                color: #856404;
            }
            
            .terms h5 {
                color: #d63384;
                margin-bottom: 10px;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            @media print {
                body {
                    margin: 0;
                    padding: 10px;
                }
                
                .receipt-container {
                    border: 1px solid #333;
                    box-shadow: none;
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="header">
                <img class="logo" src="/sportesta-logo.png" alt="SPORTESTA Logo">
                <div class="company-info">
                    <h3>SPORTESTA</h3>
                    <div>21013 Gallarate, Via Pegoraro, 18</div>
                    <div>Cell: 340 141 7605 - Cell: 348 925 1148</div>
                </div>
            </div>
            
            <div class="receipt-title">
                Ricevuta di Noleggio
            </div>
            
            <div class="info-grid">
                <div class="info-card">
                    <div class="info-label">Cliente</div>
                    <div class="info-value">${formData.nome}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Codice Noleggio</div>
                    <div class="info-value">#${codiceGenerato}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Telefono</div>
                    <div class="info-value">${formData.telefono}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Email</div>
                    <div class="info-value">${
                        formData.email || "Non fornita"
                    }</div>
                </div>
            </div>
            
            <div class="date-section">
                <div class="info-card">
                    <div class="info-label">Data Inizio Noleggio</div>
                    <div class="info-value">${new Date(
                        formData.dataInizio
                    ).toLocaleDateString("it-IT")}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Data Fine Noleggio</div>
                    <div class="info-value">${new Date(
                        formData.dataFine
                    ).toLocaleDateString("it-IT")}</div>
                </div>
            </div>
            
            ${(() => {
                const dettagliFields = [
                    "dettagliSci",
                    "altezzaSci",
                    "dettagliSnowboard",
                    "altezzaSnowboard",
                    "dettagli",
                    "altezzaPersona",
                    "pesoPersona",
                    "scarponi",
                    "bastoncini",
                    "casco",
                    "giacca",
                    "pantalone",
                    "taglia",
                    "passo",
                ];
                const dettagliPresenti = dettagliFields.filter(
                    (field) =>
                        formData.dettagli[field] &&
                        formData.dettagli[field].trim() !== ""
                );

                if (dettagliPresenti.length === 0) return "";

                return `
                <div class="equipment-details">
                    <div class="equipment-title">Dettagli Attrezzatura</div>
                    ${dettagliPresenti
                        .map((field) => {
                            // Convert camelCase to readable format
                            const fieldName = field
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())
                                .replace(/sci/i, "Sci")
                                .replace(/snowboard/i, "Snowboard")
                                .replace(/persona/i, "Persona");
                            return `<div class="equipment-item">
                            <span class="equipment-label">${fieldName}:</span>
                            <span class="equipment-value">${formData.dettagli[field]}</span>
                        </div>`;
                        })
                        .join("")}
                </div>`;
            })()}
            
            <div class="total-amount">
                <h2>Importo Versato: €${formData.prezzo}</h2>
            </div>
            
            <div class="company-details">
                <h4>SPORTESTA di Banfi Alessandro</h4>
                <p>Via Pegoraro, 18 - 21013 GALLARATE (VA)</p>
                <p>Cod. Fisc.: BNFLSN76D24I819W - P.IVA 03732390129</p>
                <p>PEC: testasport@sicurezzapostale.it</p>
            </div>
            
            <div class="terms">
                <h5>⚠️ Termini e Condizioni</h5>
                I danni causati da un uso improprio dell'attrezzo avuto in noleggio saranno considerati a costo di mercato. 
                Chi noleggia è responsabile dell'oggetto avuto in uso. Alla scadenza del periodo prenotato, la consegna del materiale 
                avuto in noleggio deve avvenire alla data convenuta (salvo comunicazioni), altrimenti saranno addebitati i giorni di 
                ritardo a prezzo di listino.
            </div>
        </div>
        
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
            fields.map((field, index) => {
                // Convert display name to camelCase for id
                const fieldId = field
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .replace(/\*/g, "*")
                    .replace(/^dettaglisci$/, "dettagliSci")
                    .replace(/^altezzasci$/, "altezzaSci")
                    .replace(/^dettaglisnowboard$/, "dettagliSnowboard")
                    .replace(/^altezzasnowboard$/, "altezzaSnowboard")
                    .replace(/^altezzapersona$/, "altezzaPersona")
                    .replace(/^pesopersona$/, "pesoPersona")
                    .replace(/^numerodipiede\*$/, "numeroDiPiede*")
                    .replace(/^scarponi$/, "scarponi")
                    .replace(/^bastoncini$/, "bastoncini")
                    .replace(/^casco$/, "casco")
                    .replace(/^passo$/, "passo")
                    .replace(/^dettagli$/, "dettagli")
                    .replace(/^giacca$/, "giacca")
                    .replace(/^pantalone$/, "pantalone")
                    .replace(/^taglia$/, "taglia");

                return (
                    <div className="mb-4 mobile" key={index}>
                        <label htmlFor={fieldId} className="form-label">
                            {field}
                        </label>
                        <input
                            type={
                                fieldId === "altezzaPersona"
                                    ? "number"
                                    : fieldId === "pesoPersona"
                                    ? "number"
                                    : fieldId === "numeroDiPiede*"
                                    ? "number"
                                    : fieldId === "altezzaSci"
                                    ? "number"
                                    : fieldId === "altezzaSnowboard"
                                    ? "number"
                                    : fieldId === "passo"
                                    ? "number"
                                    : "text"
                            }
                            className="form-control"
                            id={fieldId}
                            onChange={handleChange}
                            value={
                                fieldId === "passo"
                                    ? (() => {
                                          const piede = parseFloat(
                                              formData.dettagli[
                                                  "altezzaPersona"
                                              ]
                                          );
                                          return isNaN(piede)
                                              ? ""
                                              : (piede / Math.PI).toFixed(2);
                                      })()
                                    : formData.dettagli[fieldId] || ""
                            }
                            placeholder={
                                fieldId === "pesoPersona"
                                    ? "kg"
                                    : fieldId === "altezzaPersona"
                                    ? "cm"
                                    : fieldId === "altezzaSci"
                                    ? "cm"
                                    : fieldId === "altezzaSnowboard"
                                    ? "cm"
                                    : ""
                            }
                            required={fieldId === "numeroDiPiede*"}
                        />
                    </div>
                );
            });

        switch (selectedAttrezzo) {
            case "sci":
                return commonFields([
                    "Dettagli Sci",
                    "Altezza Sci",
                    "Altezza Persona",
                    "Peso Persona",
                    "Numero Di Piede*",
                    "Scarponi",
                    "Bastoncini",
                    "Casco",
                ]);
            case "snowboard":
                return commonFields([
                    "Dettagli Snowboard",
                    "Altezza Snowboard",
                    "Altezza Persona",
                    "Peso Persona",
                    "Numero Di Piede*",
                    "Scarponi",
                    "Bastoncini",
                    "Casco",
                    "Passo",
                ]);
            case "ciaspole":
                return commonFields(["Dettagli", "Bastoncini"]);
            case "abbigliamento":
                return commonFields(["Giacca", "Pantalone", "Taglia"]);
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

                <div className="mb-4">
                    <label htmlFor="telefono" className="form-label">
                        Telefono*
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="telefono"
                        onChange={handleChange}
                        value={formData.telefono}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="email"
                        onChange={handleChange}
                        value={formData.email}
                    />
                </div>

                {formData.tipoNoleggio === "famiglia" && (
                    <div className="mb-4">
                        <label htmlFor="codiceFamiglia" className="form-label">
                            Codice famiglia*
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="codiceFamiglia"
                            onChange={handleChange}
                            value={formData.codiceFamiglia}
                            placeholder="F0001"
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
