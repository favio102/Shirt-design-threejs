import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import dalleRoutes from "./routes/dalle.routes.js";

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

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from DALLE" });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server has started on port ${port}`));
