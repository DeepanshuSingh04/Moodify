const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS Configuration (Local + Production)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL // Render environment variables me apne deployed frontend ka URL daal dein
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Health Check / Root Route (Fixes 'Cannot GET /')
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Moodify Backend API is running successfully!",
  });
});

/**
 * Routes
 */
const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes); // Main songs route

module.exports = app;