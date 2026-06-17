"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
exports.getEnv = getEnv;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "poroduction", "test"])
        .default("development"),
    PORT: zod_1.z.coerce.number().default(3001),
    DATABASE_URL: zod_1.z.string().min(1),
    CLERK_PUBLISHABLE_KEY: zod_1.z.string().min(1),
    CLERK_SECRET_KEY: zod_1.z.string().min(1),
    CLERK_WEBHOOK_SECRET: zod_1.z.string().optional(),
    FRONTEND_URL: zod_1.z.string().url(),
    POLAR_ACCESS_TOKEN: zod_1.z.string().optional(),
    POLAR_WEBHOOK_SECRET: zod_1.z.string().optional(),
    POLAR_API_BASE: zod_1.z.string().url().default("https://api.polar.sh"),
    POLAR_CHECKOUT_PRODUCT_ID: zod_1.z.string(),
    STREAM_API_KEY: zod_1.z.string().min(1),
    STREAM_API_SECRET: zod_1.z.string().min(1),
    IMAGEKIT_URL_ENDPOINT: zod_1.z.string().url(),
});
function loadEnv() {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error(parsed.error.flatten().fieldErrors);
        throw new Error("Invalid Environment variables");
    }
    return parsed.data;
}
let cachedEnv = null;
function getEnv() {
    if (!cachedEnv) {
        cachedEnv = loadEnv();
    }
    return cachedEnv;
}
