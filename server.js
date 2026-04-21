const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// opslag
let signals = {};
let latestScanRequest = {};

// ✅ API ROUTES EERST
app.post("/api/signal", (req, res) => {
    const data = req.body;

    if (Array.isArray(data)) {
        data.forEach(p => {
            signals[p.symbol] = {
                TF1: p.TF1,
                TF2: p.TF2,
                TF3: p.TF3,
                time: new Date()
            };
        });
    }

    res.send("OK");
});

app.get("/api/signal", (req, res) => {
    console.log("🔥 API SIGNAL HIT");
    res.json(signals);
});

app.post("/api/scan", (req, res) => {
    const { symbol, tf1, tf2, tf3 } = req.body;

    latestScanRequest[symbol] = { tf1, tf2, tf3 };

    console.log("📥 Scan request:", latestScanRequest);

    res.json({ status: "ok" });
});

app.get("/api/scan", (req, res) => {
    console.log("📤 Sending scan:", latestScanRequest);

    res.json(latestScanRequest);
    latestScanRequest = {};
});

// ❗ PAS HIER STATIC
app.use(express.static(__dirname));

// homepage fallback
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});