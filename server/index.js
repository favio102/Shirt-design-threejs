import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import dalleRoutes from "./routes/dalle.routes.js";
import designsRoutes from "./routes/designs.routes.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();

if (process.env.TRUST_PROXY) {
  const value = process.env.TRUST_PROXY;
  app.set("trust proxy", isNaN(Number(value)) ? value : Number(value));
}

const corsOrigin = process.env.CORS_ORIGIN;
const corsOptions = corsOrigin
  ? { origin: corsOrigin.split(",").map((o) => o.trim()) }
  : {};
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/dalle", dalleRoutes);

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => logger.info("connected to MongoDB"))
    .catch((err) => logger.error({ err }, "MongoDB connection error"));
  app.use("/api/v1/designs", designsRoutes);
} else {
  logger.info("MONGO_URI not set — /api/v1/designs is disabled.");
}

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from DALLE" });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptimeSec: Math.floor(process.uptime()),
    mongo:
      mongoose.connection.readyState === 1
        ? "connected"
        : process.env.MONGO_URI
        ? "disconnected"
        : "disabled",
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => logger.info({ port }, "server started"));
