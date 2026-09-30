/* ==========================================================
   Fake News Detection AI
   Backend Server
========================================================== */

const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const analyzeRoute = require("./routes/analyze");
const extractRoute = require("./routes/extract");

const app = express();
const PORT = process.env.PORT || 3000;

/* ==========================================================
   Middlewares
========================================================== */

app.use(cors());
app.use((req, res, next) => {
   res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
   res.setHeader("Pragma", "no-cache");
   res.setHeader("Expires", "0");
   next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({
   extended: true,
   limit: "10mb"
}));

/* ==========================================================
   Serve Frontend
========================================================== */

app.use(express.static(path.join(__dirname, "../frontend")));

/* ==========================================================
   Home Route
========================================================== */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

/* ==========================================================
   Health Route
========================================================== */

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server Running Successfully"
    });
});

/* ==========================================================
   API Routes
========================================================== */

app.use("/api/analyze", analyzeRoute);

app.use("/api/extract", extractRoute);

/* ==========================================================
   Start Server
========================================================== */

app.listen(PORT, () => {

    console.log("===================================");
    console.log("🚀 Fake News Detection AI Started");
    console.log(`🌐 Server : http://localhost:${PORT}`);
    console.log("===================================");

});