// API configuration for different environments
const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "";

export const API_CONFIG = {
    // Rileva automaticamente l'ambiente
    BASE_URL: isLocalhost
        ? "http://localhost:3000" // Development locale
        : "https://sportesta.onrender.com", // Production su Vercel
};

// Log per debug
console.log("🌐 Ambiente rilevato:", isLocalhost ? "LOCALHOST" : "PRODUCTION");
console.log("🔗 API URL:", API_CONFIG.BASE_URL);
