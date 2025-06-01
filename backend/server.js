// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json()); // This middleware is vital!

// === CORS Configuration ===
const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new Error(`❌ CORS policy blocked this origin: ${origin}`)
      );
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

// === Route Definitions ===
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/task"));
app.use("/api/password", require("./routes/password"));

// === Health Check ===
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled Error:", err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// === Connect DB & Start Server ===
db.on("open", () => {
  app.listen(PORT, () => {
    console.log(
      `🚀 Server running at http://localhost:${PORT} [${
        process.env.NODE_ENV || "development"
      } mode]`
    );
  });
});
