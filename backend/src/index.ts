import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhookHandler } from "./webhooks/clerk";
import { getEnv } from "./lib/env";

const env = getEnv();
const app = express();

const PORT = process.env.PORT ?? 3001;

const rawjson = express.raw({
  type: "application/json",
  limit: "1mb",
});

//

app.post("/webhooks/clerk", rawjson, (req, res) => {
  void clerkWebhookHandler(req, res);
});

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.listen(PORT, () => {
  console.log(`server is running in port ${env.PORT}`);
});
