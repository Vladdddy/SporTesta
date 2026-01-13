# 🧪 Come Testare la Velocità del Login

## ✅ Modifiche Applicate

1. **Rilevamento automatico ambiente**: Il frontend usa automaticamente `localhost:3000` in locale e `https://sportesta.onrender.com` in produzione
2. **Logging completo**: Ogni tentativo di login viene tracciato con tempi precisi
3. **Timeout 10 secondi**: Evita attese infinite
4. **Messaggi di errore dettagliati**: Spiega esattamente cosa non va

---

## 📊 Come Verificare i Tempi

### Sul Tuo PC (localhost)

1. **Avvia il backend**:

    ```bash
    cd express-backend
    node server.js
    ```

2. **Apri la console del browser** (F12 → Console)

3. **Fai login** e controlla la console:
    - Vedrai: `🌐 Ambiente rilevato: LOCALHOST`
    - Vedrai: `🔗 API URL: http://localhost:3000`
    - Vedrai: `✅ Risposta ricevuta in 0.015 secondi` (circa)
    - Vedrai: `✅ Login completato in 0.020 secondi totali` (circa)

### Su Altri PC (tramite produzione Vercel)

1. **Gli altri PC vanno su**: `https://sportesta.vercel.app`

2. **Console del browser** (F12 → Console) mostrerà:

    - `🌐 Ambiente rilevato: PRODUCTION`
    - `🔗 API URL: https://sportesta.onrender.com`
    - Il tempo dipenderà dalla connessione internet

3. **Se il backend Render è "dormiente"**:
    - Prima richiesta: 30-60 secondi (Render sta risvegliando il server)
    - Richieste successive: < 1 secondo

---

## 🔍 Log del Server Backend

Nel terminale dove gira `node server.js` vedrai:

```
⏱️  [2026-01-05T10:48:02.422Z] Login attempt received
📍 Client IP: ::1
✅ Login successful for: sportesta.admin - Response in 12ms
```

**Tempi normali**:

-   ✅ **< 50ms** = Velocissimo
-   ⚠️ **50-200ms** = Normale
-   ❌ **> 1000ms** = C'è un problema

---

## 🚨 Se il Login È Ancora Lento

### Caso 1: Su localhost è lento

**Problema**: Il backend non è avviato o ha problemi

```bash
# Verifica che il server sia in esecuzione
ps aux | grep "node.*server.js"

# Riavvia il backend
cd express-backend
pkill -f "node.*server.js"
node server.js
```

### Caso 2: Da altri PC è lento

**Problema**: Backend Render è "addormentato" o non deployato

**Soluzioni**:

1. **Verifica che il backend sia online**:
    ```bash
    curl https://sportesta.onrender.com/api/login \
      -X POST \
      -H "Content-Type: application/json" \
      -d '{"username":"test","password":"test"}'
    ```
2. **Se Render non risponde**:

    - Vai su https://dashboard.render.com
    - Verifica che il servizio `sportesta` sia attivo
    - Se è su piano free: prima richiesta dopo 15 minuti di inattività = lenta (Render risveglia il server)

3. **Upgrade a Render Paid** ($7/mese):
    - Il server resta sempre attivo
    - Niente "cold start"

---

## 📱 Test Rapido da Altri Dispositivi

### Test 1: Con smartphone sulla stessa rete WiFi

1. **Trova IP del tuo PC**:

    ```bash
    ip addr show | grep "inet " | grep -v 127.0.0.1
    ```

    Esempio: `192.168.1.100`

2. **Avvia frontend in modalità rete**:

    ```bash
    cd src-sportesta
    pnpm dev --host
    ```

3. **Sullo smartphone vai su**: `http://192.168.1.100:5173`
    - ⚠️ Non funzionerà perché il frontend usa `localhost:3000`
    - Soluzione: usa la versione production su Vercel

### Test 2: Versione Production (consigliato)

1. **Deploy su Vercel** (se non già fatto):

    ```bash
    cd src-sportesta
    pnpm build
    vercel --prod
    ```

2. **Assicurati che backend Render sia online**

3. **Da qualsiasi dispositivo vai su**: `https://sportesta.vercel.app`

4. **Controlla console (F12)**:
    - Primo login dopo 15 min: può essere lento (Render cold start)
    - Login successivi: < 1 secondo

---

## ⚡ Performance Attese

| Scenario                            | Tempo Atteso | Note                                |
| ----------------------------------- | ------------ | ----------------------------------- |
| **Localhost → Localhost**           | 10-50ms      | Velocissimo ✅                      |
| **Production → Render (attivo)**    | 200-800ms    | Dipende da internet ⚠️              |
| **Production → Render (dormiente)** | 30-60s       | Solo prima richiesta dopo 15 min ⏰ |
| **Timeout**                         | 10 secondi   | Dopo questo mostra errore ❌        |

---

## 🛠️ Debug Checklist

-   [ ] Backend avviato? (`node server.js`)
-   [ ] Console browser aperta? (F12)
-   [ ] Vedo i log? (`🌐 Ambiente rilevato:...`)
-   [ ] URL corretto? (localhost vs Render)
-   [ ] Render dashboard mostra servizio attivo?
-   [ ] Variabili ambiente su Render settate?
-   [ ] CORS configurato correttamente?

---

## 💡 Suggerimenti

1. **Durante sviluppo**: usa sempre localhost (più veloce)
2. **Per test da altri PC**: usa Vercel + Render
3. **Per produzione seria**: considera Render Paid per evitare cold start
4. **Monitora sempre la console**: mostra tempi precisi
