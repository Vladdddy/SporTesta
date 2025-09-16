import React, { useState } from "react";
import "../styles/noleggio.css";
import { supabase } from "../supabaseClient";

const AttrezziForm = () => {
    const [selectedAttrezzo, setSelectedAttrezzo] = useState("");
    const [isManualFamilyCode, setIsManualFamilyCode] = useState(false);
    const [familyMembersCount, setFamilyMembersCount] = useState(2);
    const [currentFamilyMember, setCurrentFamilyMember] = useState(0);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [showFamilyConfig, setShowFamilyConfig] = useState(false);
    const [formData, setFormData] = useState({
        attrezzo: "",
        nome: "",
        tipoCliente: "",
        prezzo: "",
        dataInizio: "",
        dataFine: "",
        tipoNoleggio: "",
        duratanoleggio: "giornaliero", // giornaliero or stagionale
        livello: "",
        codiceFamiglia: "",
        modalitaNoleggio: "normale", // normale or riscatto
        attrezzaturaRiscatto: "solo sci",
        accontoIniziale: "",
        saldoFinale: "",
        dettagli: {},
    });

    // Function to generate automatic family code
    const generateFamilyCode = async () => {
        try {
            const { data, error } = await supabase
                .from("noleggio")
                .select("codicefamiglia")
                .not("codicefamiglia", "is", null)
                .order("codicefamiglia", { ascending: false })
                .limit(1);

            if (error) {
                console.error("Error fetching family codes:", error);
                return "F0001";
            }

            if (data && data.length > 0) {
                const lastCode = data[0].codicefamiglia;
                const numericPart = parseInt(lastCode.substring(1)) + 1;
                return `F${numericPart.toString().padStart(4, "0")}`;
            }

            return "F0001";
        } catch (error) {
            console.error("Error generating family code:", error);
            return "F0001";
        }
    };

    // Function to initialize family members with default values
    const initializeFamilyMembers = (count) => {
        const members = [];
        for (let i = 0; i < count; i++) {
            members.push({
                nome: i === 0 ? formData.nome : `${formData.nome} (${i + 1})`,
                attrezzo: "",
                modalitaNoleggio: "normale",
                attrezzaturaRiscatto: "solo sci",
                accontoIniziale: "",
                saldoFinale: "",
                prezzo: "",
                livello: "",
                dettagli: {},
            });
        }
        setFamilyMembers(members);
        setCurrentFamilyMember(0);
    };

    // Function to update specific family member
    const updateFamilyMember = (index, field, value) => {
        setFamilyMembers((prev) => {
            const updated = [...prev];
            if (field === "dettagli") {
                updated[index] = {
                    ...updated[index],
                    dettagli: {
                        ...updated[index].dettagli,
                        ...value,
                    },
                };
            } else {
                updated[index] = {
                    ...updated[index],
                    [field]: value,
                };
            }
            return updated;
        });
    };

    // Function to handle family member equipment selection
    const handleFamilyMemberChange = (e) => {
        const { id, value, name } = e.target;

        if (name === "attrezzo") {
            updateFamilyMember(currentFamilyMember, "attrezzo", value);
            // Reset attrezzaturaRiscatto when equipment type changes
            updateFamilyMember(
                currentFamilyMember,
                "attrezzaturaRiscatto",
                "solo sci"
            );
        } else if (name === "modalitaNoleggio") {
            updateFamilyMember(currentFamilyMember, "modalitaNoleggio", value);
        } else if (name === "attrezzaturaRiscatto") {
            updateFamilyMember(
                currentFamilyMember,
                "attrezzaturaRiscatto",
                value
            );
        } else if (name === "livello") {
            updateFamilyMember(currentFamilyMember, "livello", value);
        } else if (
            ["prezzo", "accontoIniziale", "saldoFinale", "nome"].includes(id)
        ) {
            updateFamilyMember(currentFamilyMember, id, value);
        } else {
            // Handle equipment details
            updateFamilyMember(currentFamilyMember, "dettagli", {
                [id]: value,
            });
        }
    };

    const handleChange = async (e) => {
        const { id, value, name } = e.target;

        if (name === "attrezzo") {
            setSelectedAttrezzo(value);
            setFormData((prev) => ({
                ...prev,
                attrezzo: value,
                // Reset attrezzaturaRiscatto when equipment type changes
                attrezzaturaRiscatto: "solo sci",
            }));
        } else if (name === "tipoCliente") {
            setFormData((prev) => ({ ...prev, tipoCliente: value }));
        } else if (name === "livello") {
            setFormData((prev) => ({ ...prev, livello: value }));
        } else if (name === "modalitaNoleggio") {
            setFormData((prev) => ({ ...prev, modalitaNoleggio: value }));
        } else if (name === "attrezzaturaRiscatto") {
            setFormData((prev) => ({ ...prev, attrezzaturaRiscatto: value }));
        } else if (name === "duratanoleggio") {
            if (value === "stagionale") {
                // Set today's date for start and 30/04 for end, with correct year logic
                const today = new Date();
                const year = today.getFullYear();
                const april30 = new Date(year, 3, 30); // Months are 0-indexed
                let endYear;
                if (today > april30) {
                    endYear = year + 1;
                } else {
                    endYear = year;
                }
                const todayStr = today.toISOString().split("T")[0];
                const endDate = `${endYear}-04-30`;
                setFormData((prev) => ({
                    ...prev,
                    duratanoleggio: value,
                    dataInizio: todayStr,
                    dataFine: endDate,
                }));
            } else {
                // For "giornaliero", just update the duration type
                setFormData((prev) => ({ ...prev, duratanoleggio: value }));
            }
        } else if (name === "tipoNoleggio") {
            if (value === "famiglia" && !isManualFamilyCode) {
                // Generate automatic family code when famiglia is selected
                const autoCode = await generateFamilyCode();
                setFormData((prev) => ({
                    ...prev,
                    tipoNoleggio: value,
                    codiceFamiglia: autoCode,
                }));
                // Initialize family members array
                initializeFamilyMembers(familyMembersCount);
            } else if (value === "singolo") {
                // Clear family code when singolo is selected
                setFormData((prev) => ({
                    ...prev,
                    tipoNoleggio: value,
                    codiceFamiglia: "",
                }));
                setIsManualFamilyCode(false);
                setFamilyMembers([]);
            } else {
                setFormData((prev) => ({ ...prev, tipoNoleggio: value }));
            }
        } else if (
            [
                "nome",
                "telefono",
                "email",
                "prezzo",
                "accontoIniziale",
                "saldoFinale",
                "dataInizio",
                "dataFine",
                "codiceFamiglia",
            ].includes(id)
        ) {
            // Handle manual family code input
            if (id === "codiceFamiglia") {
                setIsManualFamilyCode(true);
            }
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

        // Determine how many entries to create
        const entriesToCreate =
            formData.tipoNoleggio === "famiglia"
                ? typeof familyMembersCount === "number"
                    ? familyMembersCount
                    : 2
                : 1;
        const entries = [];

        for (let i = 0; i < entriesToCreate; i++) {
            let memberData;

            if (
                formData.tipoNoleggio === "famiglia" &&
                familyMembers.length > 0
            ) {
                // Use individual family member data
                memberData = familyMembers[i];
                const memberAttrezzoId = memberData.attrezzo
                    ? attrezzoMap[memberData.attrezzo]
                    : attrezzoMap[formData.attrezzo];

                const dataToSend = {
                    attrezzoid: memberAttrezzoId,
                    nomecognome: memberData.nome,
                    telefono: formData.telefono,
                    email: formData.email,
                    tipocliente: formData.tipoCliente,
                    prezzototale:
                        memberData.modalitaNoleggio === "riscatto"
                            ? parseFloat(memberData.accontoIniziale || 0) +
                              parseFloat(memberData.saldoFinale || 0)
                            : parseFloat(memberData.prezzo || formData.prezzo),
                    pagato: false,
                    datainizio: formData.dataInizio,
                    datafine: formData.dataFine,
                    codicefamiglia: formData.codiceFamiglia || null,
                    tiponoleggio: formData.tipoNoleggio,
                    livello: memberData.livello || formData.livello,
                    modalitanoleggio: memberData.modalitaNoleggio,
                    attrezzaturariscatto:
                        memberData.modalitaNoleggio === "riscatto"
                            ? memberData.attrezzaturaRiscatto
                            : null,
                    accontoiniziale:
                        memberData.modalitaNoleggio === "riscatto"
                            ? parseFloat(memberData.accontoIniziale || 0)
                            : null,
                    saldofinale:
                        memberData.modalitaNoleggio === "riscatto"
                            ? parseFloat(memberData.saldoFinale || 0)
                            : null,
                    // Equipment details are not stored in the noleggio table
                };
                entries.push(dataToSend);
            } else {
                // Use main form data (for single or familia without individual config)
                const dataToSend = {
                    attrezzoid: attrezzoMap[formData.attrezzo],
                    nomecognome:
                        entriesToCreate === 1
                            ? formData.nome
                            : `${formData.nome}${i > 0 ? ` (${i + 1})` : ""}`,
                    telefono: formData.telefono,
                    email: formData.email,
                    tipocliente: formData.tipoCliente,
                    prezzototale:
                        formData.modalitaNoleggio === "riscatto"
                            ? parseFloat(formData.accontoIniziale) +
                              parseFloat(formData.saldoFinale || 0)
                            : parseFloat(formData.prezzo),
                    pagato: false,
                    datainizio: formData.dataInizio,
                    datafine: formData.dataFine,
                    codicefamiglia: formData.codiceFamiglia || null,
                    tiponoleggio: formData.tipoNoleggio,
                    livello: formData.livello,
                    modalitanoleggio: formData.modalitaNoleggio,
                    attrezzaturariscatto:
                        formData.modalitaNoleggio === "riscatto"
                            ? formData.attrezzaturaRiscatto
                            : null,
                    accontoiniziale:
                        formData.modalitaNoleggio === "riscatto"
                            ? parseFloat(formData.accontoIniziale)
                            : null,
                    saldofinale:
                        formData.modalitaNoleggio === "riscatto"
                            ? parseFloat(formData.saldoFinale || 0)
                            : null,
                };
                entries.push(dataToSend);
            }
        }

        try {
            const { error } = await supabase.from("noleggio").insert(entries);

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

            console.log(`${entriesToCreate} noleggi salvati con successo!`);

            const ricevutaHtml = `
<!DOCTYPE html>
<html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${formData.nome} - SPORTESTA</title>
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
                    <div>Cell: 348 925 1148</div>
                </div>
            </div>
            
            <div class="receipt-title">
                Ricevuta di Noleggio${
                    formData.tipoNoleggio === "famiglia"
                        ? ` - Famiglia (${
                              typeof familyMembersCount === "number"
                                  ? familyMembersCount
                                  : 2
                          } membri)`
                        : ""
                }
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
                ${
                    formData.tipoNoleggio !== "famiglia"
                        ? `
                <div class="info-card">
                    <div class="info-label">Livello</div>
                    <div class="info-value">${formData.livello}</div>
                </div>`
                        : ""
                }
                <div class="info-card">
                    <div class="info-label">Email</div>
                    <div class="info-value">${
                        formData.email || "Non fornita"
                    }</div>
                </div>
                ${
                    formData.tipoNoleggio === "famiglia"
                        ? `
                <div class="info-card">
                    <div class="info-label">Codice Famiglia</div>
                    <div class="info-value">${formData.codiceFamiglia}</div>
                </div>`
                        : ""
                }
            </div>
            
            <div class="date-section">
                <div class="info-card">
                    <div class="info-label">Data Inizio Noleggio</div>
                    <div class="info-value">${new Date(
                        formData.dataInizio
                    ).toLocaleDateString("it-IT")}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">${(() => {
                        // Check if any family member or main rental is riscatto for sci or snowboard
                        const isRiscatto =
                            formData.modalitaNoleggio === "riscatto" ||
                            (formData.tipoNoleggio === "famiglia" &&
                                familyMembers.some(
                                    (member) =>
                                        member.modalitaNoleggio ===
                                            "riscatto" &&
                                        (member.attrezzo === "sci" ||
                                            member.attrezzo === "snowboard")
                                ));

                        const isSkiOrSnowboard =
                            formData.attrezzo === "sci" ||
                            formData.attrezzo === "snowboard" ||
                            (formData.tipoNoleggio === "famiglia" &&
                                familyMembers.some(
                                    (member) =>
                                        member.attrezzo === "sci" ||
                                        member.attrezzo === "snowboard"
                                ));

                        return isRiscatto && isSkiOrSnowboard
                            ? "Data fine noleggio a riscatto ed eventuale saldo finale"
                            : "Data Fine Noleggio";
                    })()}</div>
                    <div class="info-value">${(() => {
                        // Check if any family member or main rental is riscatto for sci or snowboard
                        const isRiscatto =
                            formData.modalitaNoleggio === "riscatto" ||
                            (formData.tipoNoleggio === "famiglia" &&
                                familyMembers.some(
                                    (member) =>
                                        member.modalitaNoleggio ===
                                            "riscatto" &&
                                        (member.attrezzo === "sci" ||
                                            member.attrezzo === "snowboard")
                                ));

                        const isSkiOrSnowboard =
                            formData.attrezzo === "sci" ||
                            formData.attrezzo === "snowboard" ||
                            (formData.tipoNoleggio === "famiglia" &&
                                familyMembers.some(
                                    (member) =>
                                        member.attrezzo === "sci" ||
                                        member.attrezzo === "snowboard"
                                ));

                        if (isRiscatto && isSkiOrSnowboard) {
                            // For riscatto, check if it's stagionale to show year
                            if (formData.duratanoleggio === "stagionale") {
                                return (
                                    '<span style="color: red; font-weight: bold;">' +
                                    new Date(
                                        formData.dataFine
                                    ).toLocaleDateString("it-IT") +
                                    "</span>"
                                );
                            } else {
                                return '<span style="color: black; font-weight: bold;">30/04</span>';
                            }
                        } else {
                            return new Date(
                                formData.dataFine
                            ).toLocaleDateString("it-IT");
                        }
                    })()}</div>
                </div>
            </div>
            
            ${(() => {
                const dettagliFields = [
                    "dettagliSci",
                    "altezzaSci",
                    "dettagliSnowboard",
                    "altezzaSnowboard",
                    "nomeAttrezzatura",
                    "altezzaPersona",
                    "pesoPersona",
                    "scarponi",
                    "bastoncini",
                    "casco",
                    "giacca",
                    "pantalone",
                    "taglia",
                    "passo",
                    "numeroDiPiede*",
                ];

                // Check if it's a family rental and has family members configured
                if (
                    formData.tipoNoleggio === "famiglia" &&
                    familyMembers.length > 0
                ) {
                    let familyEquipmentDetails = "";

                    familyMembers.forEach((member) => {
                        if (member.attrezzo) {
                            const memberDettagliPresenti =
                                dettagliFields.filter(
                                    (field) =>
                                        member.dettagli &&
                                        member.dettagli[field] &&
                                        member.dettagli[field]
                                            .toString()
                                            .trim() !== ""
                                );

                            const attrezzoDisplayName =
                                {
                                    sci: "Sci",
                                    snowboard: "Snowboard",
                                    ciaspole: "Ciaspole",
                                    abbigliamento: "Abbigliamento",
                                }[member.attrezzo] || member.attrezzo;

                            // Calculate individual member cost
                            const memberCost =
                                member.modalitaNoleggio === "riscatto"
                                    ? parseFloat(member.accontoIniziale || 0) +
                                      parseFloat(member.saldoFinale || 0)
                                    : parseFloat(
                                          member.prezzo || formData.prezzo || 0
                                      );

                            familyEquipmentDetails += `
                            <div class="equipment-details" style="margin-bottom: 20px;">
                                <div class="equipment-title">${
                                    member.nome
                                } - ${attrezzoDisplayName} (€${memberCost.toFixed(
                                2
                            )})${
                                member.livello ? ` - ${member.livello}` : ""
                            }</div>
                                ${
                                    memberDettagliPresenti.length > 0
                                        ? memberDettagliPresenti
                                              .map((field) => {
                                                  // Convert camelCase to readable format
                                                  const fieldName = field
                                                      .replace(
                                                          /([A-Z])/g,
                                                          " $1"
                                                      )
                                                      .replace(/^./, (str) =>
                                                          str.toUpperCase()
                                                      )
                                                      .replace(/sci/i, "Sci")
                                                      .replace(
                                                          /snowboard/i,
                                                          "Snowboard"
                                                      )
                                                      .replace(
                                                          /persona/i,
                                                          "Persona"
                                                      )
                                                      .replace(
                                                          /Di Piede\*/i,
                                                          "Di Piede"
                                                      )
                                                      .replace(
                                                          /^Scarponi$/i,
                                                          "Modello e numero scarponi"
                                                      )
                                                      .replace(
                                                          /^Bastoncini$/i,
                                                          member.attrezzo ===
                                                              "sci"
                                                              ? "Modello e misura bastoncini"
                                                              : "Modello e numero bastoncini"
                                                      );
                                                  return `<div class="equipment-item">
                                            <span class="equipment-label">${fieldName}:</span>
                                            <span class="equipment-value">${member.dettagli[field]}</span>
                                        </div>`;
                                              })
                                              .join("")
                                        : '<div class="equipment-item"><span class="equipment-label">Nessun dettaglio aggiuntivo</span></div>'
                                }
                            </div>`;
                        }
                    });

                    return familyEquipmentDetails;
                } else {
                    // Regular single rental details
                    const dettagliPresenti = dettagliFields.filter(
                        (field) =>
                            formData.dettagli[field] &&
                            formData.dettagli[field].toString().trim() !== ""
                    );

                    if (dettagliPresenti.length === 0) return "";

                    const attrezzoDisplayName =
                        {
                            sci: "Sci",
                            snowboard: "Snowboard",
                            ciaspole: "Ciaspole",
                            abbigliamento: "Abbigliamento",
                        }[formData.attrezzo] || formData.attrezzo;

                    return `
                    <div class="equipment-details">
                        <div class="equipment-title">${attrezzoDisplayName} - Dettagli Attrezzatura</div>
                        ${dettagliPresenti
                            .map((field) => {
                                // Convert camelCase to readable format
                                const fieldName = field
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())
                                    .replace(/sci/i, "Sci")
                                    .replace(/snowboard/i, "Snowboard")
                                    .replace(/persona/i, "Persona")
                                    .replace(/Di Piede\*/i, "Di Piede")
                                    .replace(
                                        /^Scarponi$/i,
                                        "Modello e numero scarponi"
                                    )
                                    .replace(
                                        /^Bastoncini$/i,
                                        formData.attrezzo === "sci"
                                            ? "Modello e misura bastoncini"
                                            : "Modello e numero bastoncini"
                                    );
                                return `<div class="equipment-item">
                                    <span class="equipment-label">${fieldName}:</span>
                                    <span class="equipment-value">${formData.dettagli[field]}</span>
                                </div>`;
                            })
                            .join("")}
                    </div>`;
                }
            })()}
            
            <div class="total-amount">
                <h2>${(() => {
                    if (formData.modalitaNoleggio === "riscatto") {
                        if (
                            formData.tipoNoleggio === "famiglia" &&
                            familyMembers.length > 0
                        ) {
                            // Calculate total for family riscatto
                            const totalAcconto = familyMembers.reduce(
                                (sum, member) => {
                                    return (
                                        sum +
                                        parseFloat(member.accontoIniziale || 0)
                                    );
                                },
                                0
                            );
                            const totalSaldo = familyMembers.reduce(
                                (sum, member) => {
                                    return (
                                        sum +
                                        parseFloat(member.saldoFinale || 0)
                                    );
                                },
                                0
                            );
                            const grandTotal = totalAcconto + totalSaldo;
                            return `Acconto Totale: €${totalAcconto.toFixed(
                                2
                            )}${
                                totalSaldo > 0
                                    ? ` - Saldo Totale: €${totalSaldo.toFixed(
                                          2
                                      )}`
                                    : ""
                            }<br><span style="color: grey; font-weight: bold;">Totale: €${grandTotal.toFixed(
                                2
                            )}</span>`;
                        } else {
                            const acconto = parseFloat(
                                formData.accontoIniziale || 0
                            );
                            const saldo = parseFloat(formData.saldoFinale || 0);
                            const totale = acconto + saldo;
                            return `Acconto Iniziale: €${
                                formData.accontoIniziale
                            }${
                                formData.saldoFinale
                                    ? ` <br>Saldo Finale: €${formData.saldoFinale}`
                                    : ""
                            }<br><span style="color: grey; font-weight: bold;">Totale: €${totale.toFixed(
                                2
                            )}</span>`;
                        }
                    } else {
                        if (
                            formData.tipoNoleggio === "famiglia" &&
                            familyMembers.length > 0
                        ) {
                            // Calculate total from individual family member prices
                            const totalAmount = familyMembers.reduce(
                                (sum, member) => {
                                    // For riscatto members, use acconto + saldo
                                    if (
                                        member.modalitaNoleggio === "riscatto"
                                    ) {
                                        return (
                                            sum +
                                            parseFloat(
                                                member.accontoIniziale || 0
                                            ) +
                                            parseFloat(member.saldoFinale || 0)
                                        );
                                    } else {
                                        // For normal rentals, use member price
                                        return (
                                            sum +
                                            parseFloat(
                                                member.prezzo ||
                                                    formData.prezzo ||
                                                    0
                                            )
                                        );
                                    }
                                },
                                0
                            );
                            return `Importo Totale Versato: €${totalAmount.toFixed(
                                2
                            )}`;
                        } else {
                            return `Importo Versato: €${formData.prezzo}${
                                formData.tipoNoleggio === "famiglia"
                                    ? ` x${
                                          typeof familyMembersCount === "number"
                                              ? familyMembersCount
                                              : 2
                                      }`
                                    : ""
                            }`;
                        }
                    }
                })()}</h2>
                ${
                    formData.modalitaNoleggio === "riscatto" &&
                    formData.attrezzaturaRiscatto
                        ? `<p style="margin-top: 10px; font-size: 16px;">Attrezzatura da riscattare: ${formData.attrezzaturaRiscatto}</p>`
                        : ""
                }
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

    const renderFamilyMemberConfiguration = () => {
        const member = familyMembers[currentFamilyMember];
        if (!member) return null;

        return (
            <div className="family-config-container">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="text-primary mb-0">
                        Configura Membro {currentFamilyMember + 1} di{" "}
                        {typeof familyMembersCount === "number"
                            ? familyMembersCount
                            : 2}
                    </h5>
                    <span className="badge bg-secondary">
                        {member.nome || `Membro ${currentFamilyMember + 1}`}
                    </span>
                </div>

                {/* Member Name */}
                <div className="mb-4">
                    <label htmlFor="nome" className="form-label">
                        Nome e Cognome*
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="nome"
                        onChange={handleFamilyMemberChange}
                        value={member.nome}
                        required
                    />
                </div>

                {/* Equipment Selection */}
                <div className="mb-4">
                    <label className="form-label">Attrezzo*</label>
                    <div className="d-flex gap-3 flex-wrap">
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
                                    id={`${attrezzo.id}_${currentFamilyMember}`}
                                    value={attrezzo.id}
                                    onChange={handleFamilyMemberChange}
                                    checked={member.attrezzo === attrezzo.id}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={`${attrezzo.id}_${currentFamilyMember}`}
                                >
                                    {attrezzo.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Level Selection - only for sci and snowboard */}
                {(member.attrezzo === "sci" ||
                    member.attrezzo === "snowboard") && (
                    <div className="mb-4">
                        <label
                            htmlFor={`livello_${currentFamilyMember}`}
                            className="form-label"
                        >
                            Livello noleggio*
                        </label>
                        <select
                            className="form-select"
                            id={`livello_${currentFamilyMember}`}
                            name="livello"
                            onChange={handleFamilyMemberChange}
                            value={member.livello}
                            required
                        >
                            <option value="">Seleziona livello</option>
                            <option value="Performance">Performance</option>
                            <option value="Premium">Premium</option>
                            <option value="Delux">Delux</option>
                        </select>
                    </div>
                )}

                {/* Equipment Details */}
                {member.attrezzo &&
                    renderEquipmentInputsForMember(member.attrezzo)}

                {/* Price Section */}
                {member.modalitaNoleggio === "riscatto" ? (
                    <>
                        <div className="mb-4">
                            <label
                                htmlFor="accontoIniziale"
                                className="form-label"
                            >
                                Acconto iniziale*
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="accontoIniziale"
                                placeholder="€"
                                value={member.accontoIniziale}
                                onChange={handleFamilyMemberChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="saldoFinale" className="form-label">
                                Saldo finale
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="saldoFinale"
                                placeholder="€"
                                value={member.saldoFinale}
                                onChange={handleFamilyMemberChange}
                            />
                        </div>
                    </>
                ) : (
                    <div className="mb-4">
                        <label htmlFor="prezzo" className="form-label">
                            Prezzo*
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="prezzo"
                            placeholder="€"
                            value={member.prezzo}
                            onChange={handleFamilyMemberChange}
                            required
                        />
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-4">
                    <div>
                        {currentFamilyMember > 0 && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setCurrentFamilyMember(
                                        currentFamilyMember - 1
                                    )
                                }
                            >
                                ← Precedente
                            </button>
                        )}
                    </div>
                    <div>
                        {typeof familyMembersCount === "number" &&
                        currentFamilyMember < familyMembersCount - 1 ? (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() =>
                                    setCurrentFamilyMember(
                                        currentFamilyMember + 1
                                    )
                                }
                                disabled={
                                    !member.attrezzo ||
                                    !member.nome ||
                                    // Only require livello for sci and snowboard
                                    ((member.attrezzo === "sci" ||
                                        member.attrezzo === "snowboard") &&
                                        !member.livello)
                                }
                            >
                                Successivo →
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => setShowFamilyConfig(false)}
                                disabled={
                                    !member.attrezzo ||
                                    !member.nome ||
                                    // Only require livello for sci and snowboard
                                    ((member.attrezzo === "sci" ||
                                        member.attrezzo === "snowboard") &&
                                        !member.livello)
                                }
                            >
                                Completa Configurazione
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="progress mt-3" style={{ height: "4px" }}>
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${
                                ((currentFamilyMember + 1) /
                                    (typeof familyMembersCount === "number"
                                        ? familyMembersCount
                                        : 2)) *
                                100
                            }%`,
                        }}
                    ></div>
                </div>
            </div>
        );
    };

    const renderEquipmentInputsForMember = (selectedEquipment) => {
        const commonFields = (fields) =>
            fields.map((field, index) => {
                // Convert display name to camelCase for id
                const fieldId = field
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .replace(/\*/g, "*")
                    .replace(/^nomesci$/, "dettagliSci")
                    .replace(/^altezzasci$/, "altezzaSci")
                    .replace(/^nomesnowboard$/, "dettagliSnowboard")
                    .replace(/^altezzasnowboard$/, "altezzaSnowboard")
                    .replace(/^altezzapersona$/, "altezzaPersona")
                    .replace(/^pesopersona$/, "pesoPersona")
                    .replace(/^numerodipiede\*$/, "numeroDiPiede*")
                    .replace(/^nome$/, "nomeAttrezzatura")
                    .replace(/^modelloenumeroscarponi$/, "scarponi")
                    .replace(/^scarponi$/, "scarponi")
                    .replace(/^modelloenumerobastoncini$/, "bastoncini")
                    .replace(/^modelloemisurabastoncini$/, "bastoncini")
                    .replace(/^bastoncini$/, "bastoncini")
                    .replace(/^casco$/, "casco")
                    .replace(/^giacca$/, "giacca")
                    .replace(/^pantalone$/, "pantalone")
                    .replace(/^taglia$/, "taglia");

                const currentData = familyMembers[currentFamilyMember];

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
                            onChange={handleFamilyMemberChange}
                            value={
                                fieldId === "passo"
                                    ? (() => {
                                          const piede = parseFloat(
                                              currentData.dettagli?.[
                                                  "altezzaPersona"
                                              ]
                                          );
                                          return isNaN(piede)
                                              ? ""
                                              : (piede / Math.PI).toFixed(2);
                                      })()
                                    : currentData.dettagli?.[fieldId] || ""
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

        const renderModalitaNoleggio = () => {
            const currentData = familyMembers[currentFamilyMember];

            return (
                <div className="mb-4">
                    <div className="d-flex gap-4 mobile">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="modalitaNoleggio"
                                id={`normale_${currentFamilyMember}`}
                                value="normale"
                                onChange={handleFamilyMemberChange}
                                checked={
                                    currentData.modalitaNoleggio === "normale"
                                }
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`normale_${currentFamilyMember}`}
                            >
                                Noleggio normale
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="modalitaNoleggio"
                                id={`riscatto_${currentFamilyMember}`}
                                value="riscatto"
                                onChange={handleFamilyMemberChange}
                                checked={
                                    currentData.modalitaNoleggio === "riscatto"
                                }
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`riscatto_${currentFamilyMember}`}
                            >
                                Noleggio a riscatto
                            </label>
                        </div>
                    </div>
                </div>
            );
        };

        const renderAttrezzaturaRiscatto = () => {
            const currentData = familyMembers[currentFamilyMember];

            return (
                <div className="mb-4">
                    <label
                        htmlFor={`attrezzaturaRiscatto_${currentFamilyMember}`}
                        className="form-label"
                    >
                        Attrezzatura da riscattare
                    </label>
                    <select
                        className="form-select"
                        id={`attrezzaturaRiscatto_${currentFamilyMember}`}
                        name="attrezzaturaRiscatto"
                        onChange={handleFamilyMemberChange}
                        value={currentData.attrezzaturaRiscatto}
                    >
                        {selectedEquipment === "sci" ? (
                            <>
                                <option value="solo sci">Solo sci</option>
                                <option value="solo scarponi">
                                    Solo scarponi
                                </option>
                                <option value="sci e scarponi">
                                    Sci e scarponi
                                </option>
                            </>
                        ) : (
                            <>
                                <option value="solo sci">Solo snowboard</option>
                                <option value="solo scarponi">
                                    Solo scarponi
                                </option>
                                <option value="sci e scarponi">
                                    Snowboard e scarponi
                                </option>
                            </>
                        )}
                    </select>
                </div>
            );
        };

        switch (selectedEquipment) {
            case "sci":
                return (
                    <>
                        {renderModalitaNoleggio()}
                        {familyMembers[currentFamilyMember]
                            ?.modalitaNoleggio === "riscatto" &&
                            renderAttrezzaturaRiscatto()}
                        {(() => {
                            // Base fields for sci
                            let fields = [
                                "Nome Sci",
                                "Altezza Sci",
                                "Altezza Persona",
                                "Peso Persona",
                                "Numero Di Piede*",
                                "Modello e numero scarponi",
                                "Modello e misura bastoncini",
                                "Casco",
                            ];

                            // Filter fields based on riscatto selection
                            const currentMember =
                                familyMembers[currentFamilyMember];
                            if (
                                currentMember?.modalitaNoleggio === "riscatto"
                            ) {
                                if (
                                    currentMember.attrezzaturaRiscatto ===
                                    "solo sci"
                                ) {
                                    // Remove boot-related fields
                                    fields = fields.filter(
                                        (field) =>
                                            field !==
                                                "Modello e numero scarponi" &&
                                            field !== "Numero Di Piede*"
                                    );
                                } else if (
                                    currentMember.attrezzaturaRiscatto ===
                                    "solo scarponi"
                                ) {
                                    // Remove ski-related fields
                                    fields = fields.filter(
                                        (field) =>
                                            field !== "Nome Sci" &&
                                            field !== "Altezza Sci" &&
                                            field !== "Altezza Persona" &&
                                            field !== "Peso Persona" &&
                                            field !==
                                                "Modello e misura bastoncini" &&
                                            field !== "Casco"
                                    );
                                }
                                // For "sci e scarponi", show all fields (no filtering)
                            }

                            return commonFields(fields);
                        })()}
                    </>
                );
            case "snowboard":
                return (
                    <>
                        {renderModalitaNoleggio()}
                        {familyMembers[currentFamilyMember]
                            ?.modalitaNoleggio === "riscatto" &&
                            renderAttrezzaturaRiscatto()}
                        {(() => {
                            // Base fields for snowboard (removed Bastoncini since snowboarders don't use poles)
                            let fields = [
                                "Nome Snowboard",
                                "Altezza Snowboard",
                                "Altezza Persona",
                                "Peso Persona",
                                "Numero Di Piede*",
                                "Modello e numero scarponi",
                                "Casco",
                                "Passo",
                            ];

                            // Filter fields based on riscatto selection
                            const currentMember =
                                familyMembers[currentFamilyMember];
                            if (
                                currentMember?.modalitaNoleggio === "riscatto"
                            ) {
                                if (
                                    currentMember.attrezzaturaRiscatto ===
                                    "solo sci"
                                ) {
                                    // Remove boot-related fields (treating snowboard like sci for riscatto logic)
                                    fields = fields.filter(
                                        (field) =>
                                            field !==
                                                "Modello e numero scarponi" &&
                                            field !== "Numero Di Piede*"
                                    );
                                } else if (
                                    currentMember.attrezzaturaRiscatto ===
                                    "solo scarponi"
                                ) {
                                    // Remove snowboard-related fields
                                    fields = fields.filter(
                                        (field) =>
                                            field !== "Nome Snowboard" &&
                                            field !== "Altezza Snowboard" &&
                                            field !== "Altezza Persona" &&
                                            field !== "Peso Persona" &&
                                            field !== "Casco" &&
                                            field !== "Passo"
                                    );
                                }
                                // For "sci e scarponi", show all fields (no filtering)
                            }

                            return commonFields(fields);
                        })()}
                    </>
                );
            case "ciaspole":
                return commonFields(["Nome", "Modello e numero bastoncini"]);
            case "abbigliamento":
                return commonFields(["Giacca", "Pantalone", "Taglia"]);
            default:
                return null;
        }
    };

    const renderInputs = () => {
        // Only render equipment inputs for regular (non-family config) mode
        const commonFields = (fields) =>
            fields.map((field, index) => {
                // Convert display name to camelCase for id
                const fieldId = field
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .replace(/\*/g, "*")
                    .replace(/^nomesci$/, "dettagliSci")
                    .replace(/^altezzasci$/, "altezzaSci")
                    .replace(/^nomesnowboard$/, "dettagliSnowboard")
                    .replace(/^altezzasnowboard$/, "altezzaSnowboard")
                    .replace(/^altezzapersona$/, "altezzaPersona")
                    .replace(/^pesopersona$/, "pesoPersona")
                    .replace(/^numerodipiede\*$/, "numeroDiPiede*")
                    .replace(/^nome$/, "nomeAttrezzatura")
                    .replace(/^modelloenumeroscarponi$/, "scarponi")
                    .replace(/^scarponi$/, "scarponi")
                    .replace(/^modelloenumerobastoncini$/, "bastoncini")
                    .replace(/^modelloemisurabastoncini$/, "bastoncini")
                    .replace(/^bastoncini$/, "bastoncini")
                    .replace(/^casco$/, "casco")
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
                                              formData.dettagli?.[
                                                  "altezzaPersona"
                                              ]
                                          );
                                          return isNaN(piede)
                                              ? ""
                                              : (piede / Math.PI).toFixed(2);
                                      })()
                                    : formData.dettagli?.[fieldId] || ""
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

        const renderModalitaNoleggio = () => (
            <div className="mb-4">
                <div className="d-flex gap-4 mobile">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="modalitaNoleggio"
                            id="normale"
                            value="normale"
                            onChange={handleChange}
                            checked={formData.modalitaNoleggio === "normale"}
                        />
                        <label className="form-check-label" htmlFor="normale">
                            Noleggio normale
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="modalitaNoleggio"
                            id="riscatto"
                            value="riscatto"
                            onChange={handleChange}
                            checked={formData.modalitaNoleggio === "riscatto"}
                        />
                        <label className="form-check-label" htmlFor="riscatto">
                            Noleggio a riscatto
                        </label>
                    </div>
                </div>
            </div>
        );

        const renderAttrezzaturaRiscatto = () => (
            <div className="mb-4">
                <label htmlFor="attrezzaturaRiscatto" className="form-label">
                    Attrezzatura da riscattare
                </label>
                <select
                    className="form-select"
                    id="attrezzaturaRiscatto"
                    name="attrezzaturaRiscatto"
                    onChange={handleChange}
                    value={formData.attrezzaturaRiscatto}
                >
                    {selectedAttrezzo === "sci" ? (
                        <>
                            <option value="solo sci">Solo sci</option>
                            <option value="solo scarponi">Solo scarponi</option>
                            <option value="sci e scarponi">
                                Sci e scarponi
                            </option>
                        </>
                    ) : (
                        <>
                            <option value="solo sci">Solo snowboard</option>
                            <option value="solo scarponi">Solo scarponi</option>
                            <option value="sci e scarponi">
                                Snowboard e scarponi
                            </option>
                        </>
                    )}
                </select>
            </div>
        );

        const renderLivelloNoleggio = () => (
            <div className="mb-4">
                <label htmlFor="livello" className="form-label">
                    Livello noleggio*
                </label>
                <select
                    className="form-select"
                    id="livello"
                    name="livello"
                    onChange={handleChange}
                    value={formData.livello}
                    required
                >
                    <option value="">Seleziona livello</option>
                    <option value="Performance">Performance</option>
                    <option value="Premium">Premium</option>
                    <option value="Delux">Delux</option>
                </select>
            </div>
        );

        switch (selectedAttrezzo) {
            case "sci":
                return (
                    <>
                        {renderLivelloNoleggio()}
                        {renderModalitaNoleggio()}
                        {formData.modalitaNoleggio === "riscatto" &&
                            renderAttrezzaturaRiscatto()}
                        {(() => {
                            // Base fields for sci
                            let fields = [
                                "Nome Sci",
                                "Altezza Sci",
                                "Altezza Persona",
                                "Peso Persona",
                                "Numero Di Piede*",
                                "Modello e numero scarponi",
                                "Modello e misura bastoncini",
                                "Casco",
                            ];

                            // Filter fields based on riscatto selection
                            if (formData.modalitaNoleggio === "riscatto") {
                                if (
                                    formData.attrezzaturaRiscatto === "solo sci"
                                ) {
                                    // Remove boot-related fields
                                    fields = fields.filter(
                                        (field) =>
                                            field !==
                                                "Modello e numero scarponi" &&
                                            field !== "Numero Di Piede*"
                                    );
                                } else if (
                                    formData.attrezzaturaRiscatto ===
                                    "solo scarponi"
                                ) {
                                    // Remove ski-related fields
                                    fields = fields.filter(
                                        (field) =>
                                            field !== "Nome Sci" &&
                                            field !== "Altezza Sci" &&
                                            field !== "Altezza Persona" &&
                                            field !== "Peso Persona" &&
                                            field !==
                                                "Modello e misura bastoncini" &&
                                            field !== "Casco"
                                    );
                                }
                                // For "sci e scarponi", show all fields (no filtering)
                            }

                            return commonFields(fields);
                        })()}
                    </>
                );
            case "snowboard":
                return (
                    <>
                        {renderLivelloNoleggio()}
                        {renderModalitaNoleggio()}
                        {formData.modalitaNoleggio === "riscatto" &&
                            renderAttrezzaturaRiscatto()}
                        {(() => {
                            // Base fields for snowboard (removed Bastoncini since snowboarders don't use poles)
                            let fields = [
                                "Nome Snowboard",
                                "Altezza Snowboard",
                                "Altezza Persona",
                                "Peso Persona",
                                "Numero Di Piede*",
                                "Modello e numero scarponi",
                                "Casco",
                                "Passo",
                            ];

                            // Filter fields based on riscatto selection
                            if (formData.modalitaNoleggio === "riscatto") {
                                if (
                                    formData.attrezzaturaRiscatto === "solo sci"
                                ) {
                                    // Remove boot-related fields (treating snowboard like sci for riscatto logic)
                                    fields = fields.filter(
                                        (field) =>
                                            field !==
                                                "Modello e numero scarponi" &&
                                            field !== "Numero Di Piede*"
                                    );
                                } else if (
                                    formData.attrezzaturaRiscatto ===
                                    "solo scarponi"
                                ) {
                                    // Remove snowboard-related fields
                                    fields = fields.filter(
                                        (field) =>
                                            field !== "Nome Snowboard" &&
                                            field !== "Altezza Snowboard" &&
                                            field !== "Altezza Persona" &&
                                            field !== "Peso Persona" &&
                                            field !== "Casco" &&
                                            field !== "Passo"
                                    );
                                }
                                // For "sci e scarponi", show all fields (no filtering)
                            }

                            return commonFields(fields);
                        })()}
                    </>
                );
            case "ciaspole":
                return commonFields(["Nome", "Modello e numero bastoncini"]);
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                    <>
                        <div className="mb-4">
                            <label
                                htmlFor="familyMembersCount"
                                className="form-label"
                            >
                                Numero di membri della famiglia*
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="familyMembersCount"
                                min="2"
                                max="10"
                                value={familyMembersCount}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow empty value while editing
                                    if (value === "") {
                                        setFamilyMembersCount("");
                                        return;
                                    }

                                    const newCount = parseInt(value);
                                    // Only update if it's a valid number within range
                                    if (
                                        !isNaN(newCount) &&
                                        newCount >= 2 &&
                                        newCount <= 10
                                    ) {
                                        setFamilyMembersCount(newCount);
                                        initializeFamilyMembers(newCount);
                                    }
                                }}
                                onBlur={(e) => {
                                    // Reset to minimum value if field is empty when losing focus
                                    if (
                                        e.target.value === "" ||
                                        parseInt(e.target.value) < 2
                                    ) {
                                        setFamilyMembersCount(2);
                                        initializeFamilyMembers(2);
                                    }
                                }}
                                required
                            />
                            <small className="text-muted">
                                Verranno creati{" "}
                                {typeof familyMembersCount === "number"
                                    ? familyMembersCount
                                    : 2}{" "}
                                noleggi con lo stesso codice famiglia
                            </small>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="codiceFamiglia"
                                className="form-label"
                            >
                                Codice famiglia*
                            </label>
                            <div className="d-flex gap-2 align-items-center">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="codiceFamiglia"
                                    onChange={handleChange}
                                    value={formData.codiceFamiglia}
                                    placeholder="F0001"
                                    disabled={!isManualFamilyCode}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => {
                                        setIsManualFamilyCode(
                                            !isManualFamilyCode
                                        );
                                        if (!isManualFamilyCode) {
                                            // If switching to manual mode, clear the field
                                            setFormData((prev) => ({
                                                ...prev,
                                                codiceFamiglia: "",
                                            }));
                                        } else {
                                            // If switching to auto mode, regenerate code
                                            generateFamilyCode().then(
                                                (code) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        codiceFamiglia: code,
                                                    }));
                                                }
                                            );
                                        }
                                    }}
                                    style={{ minWidth: "100px" }}
                                >
                                    {isManualFamilyCode ? "Auto" : "Manuale"}
                                </button>
                            </div>
                            <small className="text-muted">
                                {isManualFamilyCode
                                    ? "Inserisci manualmente il codice famiglia per aggiungere membri alla stessa famiglia"
                                    : "Codice generato automaticamente - usa 'Manuale' per inserire un codice esistente"}
                            </small>
                        </div>

                        {/* Button to configure family members individually */}
                        <div className="mb-4">
                            <button
                                type="button"
                                className="bottone-conf btn btn-info w-100"
                                onClick={() => {
                                    if (familyMembers.length === 0) {
                                        initializeFamilyMembers(
                                            typeof familyMembersCount ===
                                                "number"
                                                ? familyMembersCount
                                                : 2
                                        );
                                    }
                                    setShowFamilyConfig(true);
                                }}
                                disabled={!formData.codiceFamiglia}
                            >
                                <p>Configura Attrezzatura</p>
                            </button>
                            <small className="text-muted d-block mt-1">
                                Clicca per scegliere attrezzatura diversa per
                                ogni membro della famiglia
                            </small>
                        </div>
                    </>
                )}

                <div className="mb-4">
                    <label htmlFor="duratanoleggio" className="form-label">
                        Durata noleggio*
                    </label>
                    <select
                        className="form-select"
                        id="duratanoleggio"
                        name="duratanoleggio"
                        onChange={handleChange}
                        value={formData.duratanoleggio}
                        required
                    >
                        <option value="giornaliero">Giornaliero</option>
                        <option value="stagionale">Stagionale</option>
                    </select>
                </div>

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

                {/* Show family configuration or regular equipment selection */}
                {showFamilyConfig ? (
                    renderFamilyMemberConfiguration()
                ) : (
                    <div>
                        <div className="mb-4">
                            <div className="d-flex gap-4 mobile">
                                {[
                                    { id: "sci", label: "Sci" },
                                    { id: "snowboard", label: "Snowboard" },
                                    { id: "ciaspole", label: "Ciaspole" },
                                    {
                                        id: "abbigliamento",
                                        label: "Abbigliamento",
                                    },
                                ].map((attrezzo) => (
                                    <div
                                        className="form-check"
                                        key={attrezzo.id}
                                    >
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
                                            disabled={
                                                formData.tipoNoleggio ===
                                                "famiglia"
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
                            {formData.tipoNoleggio === "famiglia" && (
                                <small className="text-muted">
                                    Per noleggi famiglia, configura
                                    l'attrezzatura individualmente per ogni
                                    membro usando il pulsante sopra
                                </small>
                            )}
                        </div>

                        {/* Only render equipment inputs for single rentals, not family */}
                        {formData.tipoNoleggio !== "famiglia" && renderInputs()}
                    </div>
                )}

                <br />
                <br />

                {/* Show pricing section only if not in family config mode */}
                {!showFamilyConfig && (
                    <>
                        {formData.modalitaNoleggio === "riscatto" ? (
                            <>
                                <div className="mb-4">
                                    <label
                                        htmlFor="accontoIniziale"
                                        className="form-label"
                                    >
                                        Acconto iniziale*
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="accontoIniziale"
                                        placeholder="€"
                                        value={formData.accontoIniziale}
                                        onChange={handleChange}
                                        required={
                                            formData.modalitaNoleggio ===
                                            "riscatto"
                                        }
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="saldoFinale"
                                        className="form-label"
                                    >
                                        Saldo finale
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="saldoFinale"
                                        placeholder="€"
                                        value={formData.saldoFinale}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        ) : (
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
                                    required={
                                        formData.modalitaNoleggio !== "riscatto"
                                    }
                                    disabled={
                                        formData.tipoNoleggio === "famiglia"
                                    }
                                />
                                {formData.tipoNoleggio === "famiglia" && (
                                    <small className="text-muted">
                                        Per noleggi famiglia, imposta il prezzo
                                        individualmente per ogni membro
                                    </small>
                                )}
                            </div>
                        )}

                        <br />

                        <button
                            type="submit"
                            className="btn btn-custom"
                            disabled={
                                formData.tipoNoleggio === "famiglia" &&
                                !familyMembers.some((m) => m.attrezzo)
                            }
                        >
                            Salva e scarica ricevuta
                        </button>

                        {formData.tipoNoleggio === "famiglia" &&
                            !familyMembers.some((m) => m.attrezzo) && (
                                <small className="text-danger d-block mt-2">
                                    Configura almeno un membro della famiglia
                                    prima di salvare
                                </small>
                            )}
                    </>
                )}

                {/* Back button for family configuration */}
                {showFamilyConfig && (
                    <div className="mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowFamilyConfig(false)}
                        >
                            ← Torna al Form Principale
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AttrezziForm;
