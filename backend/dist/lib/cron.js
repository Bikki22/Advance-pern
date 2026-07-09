"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const node_http_1 = __importDefault(require("node:http"));
const node_https_1 = __importDefault(require("node:https"));
// every 14 minutes send a GET request to the health endpoint
const job = new cron_1.CronJob("*/14 * * * *", function () {
    const base = process.env.FRONTEND_URL;
    if (!base)
        return;
    const url = new URL("/health", base).href;
    const client = url.startsWith("https") ? node_https_1.default : node_http_1.default;
    client
        .get(url, (res) => {
        if (res.statusCode === 200)
            console.log("GET request sent successfully");
        else
            console.log("GET request failed", res.statusCode);
    })
        .on("error", (e) => console.error("Error while sending request", e));
});
exports.default = job;
