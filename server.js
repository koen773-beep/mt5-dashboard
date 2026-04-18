const express = require("express");
const app = express();
const path = require("path");

// JSON parsing
app.use(express.json());
app.use(express.static(__dirname));

// 🔥 laat static files (zoals index.html) werken
app.use(express.static(__dirname));

// opslag van signals
let signals = {};

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

// 🔥 homepage = jouw dashboard
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});