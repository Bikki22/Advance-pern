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
const cron_1 = __importDefault(require("./lib/cron"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const env = (0, env_1.getEnv)();
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3001;
const rawjson = express_1.default.raw({
    type: "application/json",
    limit: "1mb",
});
app.post("/webhooks/clerk", rawjson, (req, res) => {
    void (0, clerk_1.clerkWebhookHandler)(req, res);
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, express_2.clerkMiddleware)());
app.get("/health", (_req, res) => {
    res.json({ ok: true });
});
app.get("/health", (_req, res) => {
    res.json({ ok: true });
});
const publicDir = node_path_1.default.join(process.cwd(), "public");
if (node_fs_1.default.existsSync(publicDir)) {
    app.use(express_1.default.static(publicDir));
    app.get("/{*any}", (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") {
            next();
            return;
        }
        if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
            next();
            return;
        }
        res.sendFile(node_path_1.default.join(publicDir, "index.html"), (err) => next(err));
    });
}
app.listen(PORT, () => {
    console.log(`server is running in port ${env.PORT}`);
    if (env.NODE_ENV === "poroduction") {
        cron_1.default.start();
    }
});
