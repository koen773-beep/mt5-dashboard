const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// JSON parsing
app.use(express.json());
app.use(cors());

// static files
app.use(express.static(__dirname));

// opslag van signals
let signals = {};

// 🔥 opslag van scan requests
let latestScanRequest = {};

// 📥 MT5 stuurt data hierheen
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

        console.log("📥 Batch received:", data.length);
    }

    res.send("OK");
});

// 📤 Website haalt data hier op
app.get("/api/signal", (req, res) => {
    res.json(signals);
});

// 🔥 NIEUW: frontend stuurt scan request
app.post("/api/scan", (req, res) => {
    const { symbol, tf1, tf2, tf3 } = req.body;

    console.log("📊 Scan request:", symbol, tf1, tf2, tf3);

    latestScanRequest[symbol] = { tf1, tf2, tf3 };

    res.json({ status: "ok" });
});

// 🔥 NIEUW: MT5 haalt scan requests op
app.get("/api/scan", (req, res) => {
    res.json(latestScanRequest);
});

// homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});