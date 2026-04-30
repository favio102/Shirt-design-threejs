import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { dalleRouter } from "./routes/dalle.routes.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const app = express();

if (process.env.TRUST_PROXY) {
  const value = process.env.TRUST_PROXY;
  app.set("trust proxy", isNaN(Number(value)) ? value : Number(value));
}

const corsOrigin = process.env.CORS_ORIGIN;
const isProduction = process.env.NODE_ENV === "production";

let corsOptions;
if (corsOrigin) {
  corsOptions = { origin: corsOrigin.split(",").map((o) => o.trim()) };
} else if (isProduction) {
  // Deny by default in production — operator must opt in via CORS_ORIGIN.
  logger.warn("CORS_ORIGIN not set in production; cross-origin requests will be denied.");
  corsOptions = { origin: false };
} else {
  // Local dev convenience: allow the Vite dev server out of the box.
  corsOptions = { origin: ["http://localhost:5173", "http://127.0.0.1:5173"] };
}
app.use(cors(corsOptions));

// Small global limit; routes that need more raise it locally.
app.use(express.json({ limit: "1mb" }));

app.use("/api/v1/dalle", dalleRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from DALLE" });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptimeSec: Math.floor(process.uptime()),
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => logger.info({ port }, "server started"));
