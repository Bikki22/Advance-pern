import express from "express";
import "dotenv/config";
import cors from "cors";

import { clerkMiddleware } from "@clerk/express";
import { clerkWebhookHandler } from "./webhooks/clerk";
import { getEnv } from "./lib/env";
import keepAliveCron from "./lib/cron";

import meRouter from "./routes/meRouter";

import fs from "node:fs";
import path from "node:path";

const env = getEnv();
const app = express();

const rawjson = express.raw({
  type: "application/json",
  limit: "1mb",
});

app.post("/webhooks/clerk", rawjson, (req, res) => {
  void clerkWebhookHandler(req, res);
});

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/me", meRouter);

const publicDir = path.join(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
      next();
      return;
    }

    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

app.listen(env.PORT, () => {
  console.log(`server is running in port ${env.PORT}`);
  if (env.NODE_ENV === "poroduction") {
    keepAliveCron.start();
  }
});
