const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());

app.use(
    cors({
        origin: [
            "https://sportesta.vercel.app",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// --Login check
app.get("/", (req, res) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) return res.status(401).json({ message: "Missing token" });

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        res.json({
            message: "You have access to this protected route!",
            username: user.username,
            tokenValid: true,
        });
    });
});

// --Login authentification of credentials
app.post("/api/login", (req, res) => {
    const requestStart = Date.now();
    const requestTime = new Date().toISOString();
    console.log(`\n⏱️  [${requestTime}] Login attempt received`);
    console.log("📍 Client IP:", req.ip || req.connection.remoteAddress);

    const { username, password } = req.body;

    // Quick validation
    if (!username || !password) {
        const elapsed = Date.now() - requestStart;
        console.log(`❌ Missing credentials - Response in ${elapsed}ms`);
        return res.status(400).json({ error: "Username e password richiesti" });
    }

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "20h" });
        const elapsed = Date.now() - requestStart;
        console.log(
            `✅ Login successful for: ${username} - Response in ${elapsed}ms`
        );
        return res.json({ token });
    } else {
        const elapsed = Date.now() - requestStart;
        console.log(
            `❌ Invalid credentials for: ${username} - Response in ${elapsed}ms`
        );
        return res.status(401).json({ error: "Credenziali non valide" });
    }
});

// --Sending data to DB
app.post("/api/noleggi", async (req, res) => {
    const dati = req.body;
    res.status(201).json({ messaggio: "Noleggio salvato!", dati });
});
