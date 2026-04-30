import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import pinoHttp from "pino-http";
import { imageRouter } from "./routes/image.routes.js";
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

app.use(pinoHttp({ logger }));

// Small global limit; routes that need more raise it locally.
app.use(express.json({ limit: "1mb" }));

app.use("/api/v1/image", imageRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the image generation API" });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptimeSec: Math.floor(process.uptime()),
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found", path: req.originalUrl });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  req.log?.error({ err }, "unhandled error");
  res.status(500).json({ message: "Internal server error" });
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => logger.info({ port }, "server started"));

const shutdown = (signal) => {
  logger.info({ signal }, "shutting down");
  server.close((err) => {
    if (err) {
      logger.error({ err }, "error during shutdown");
      process.exit(1);
    }
    process.exit(0);
  });
  // Hard exit if connections don't close in 10s.
  setTimeout(() => {
    logger.warn("forced exit after shutdown timeout");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
