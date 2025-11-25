const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { port } = require("./config/env");
const filesRouter = require("./routes/files.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Simple health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Files API
app.use("/files", filesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
