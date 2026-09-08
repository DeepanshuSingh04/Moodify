const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/**
 * API Routes
 */
const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

/**
 * Static Frontend Files Serve karna
 */
// 1. Static folder link karein (agar dist folder backend ke root par hai)
app.use(express.static(path.join(__dirname, "../dist"))); // ya "public" jo bhi aapka folder ho

// 2. Kisi bhi baaki route par Frontend ki index.html return karein (React Router support ke liye)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

module.exports = app;