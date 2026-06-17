"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@clerk/express");
const clerk_1 = require("./webhooks/clerk");
const env_1 = require("./lib/env");
const env = (0, env_1.getEnv)();
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3001;
const rawjson = express_1.default.raw({
    type: "application/json",
    limit: "1mb",
});
//
app.post("/webhooks/clerk", rawjson, (req, res) => {
    void (0, clerk_1.clerkWebhookHandler)(req, res);
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, express_2.clerkMiddleware)());
app.listen(PORT, () => {
    console.log(`server is running in port ${env.PORT}`);
});
