"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clerkWebhookHandler = clerkWebhookHandler;
const env_1 = require("../lib/env");
const webhooks_1 = require("@clerk/backend/webhooks");
const roles_1 = require("../lib/roles");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function clerkWebhookHandler(req, res) {
    const env = (0, env_1.getEnv)();
    try {
        // webhook verification needs a shared secret; without it we cannot trust imcoming POSTs
        if (!env.CLERK_WEBHOOK_SECRET) {
            res.status(503).json("Webhook secret is not provided");
            return;
        }
        const playload = req.body instanceof Buffer
            ? req.body.toString("utf-8")
            : String(req.body);
        const request = new Request("http://internal/webhooks/clerk", {
            method: "POST",
            headers: new Headers(req.headers),
            body: playload,
        });
        // throws if signature is wrong or body was tapered with only then we trust evt
        const evt = await (0, webhooks_1.verifyWebhook)(request, {
            signingSecret: env.CLERK_WEBHOOK_SECRET,
        });
        if (evt.type === "user.created" || evt.type === "user.updated") {
            const u = evt.data;
            const email = u.email_addresses?.find((e) => e.id === u.primary_email_address_id)
                ?.email_address ?? u.email_addresses?.[0]?.email_address;
            const displayName = [u.first_name, u.last_name].filter(Boolean).join(" ") ||
                u.username ||
                null;
            const role = (0, roles_1.parseRole)(u.public_metadata?.role);
            await db_1.db
                .insert(schema_1.users)
                .values({
                clerkUserId: u.id,
                email,
                displayName,
                role,
            })
                .onConflictDoUpdate({
                target: schema_1.users.clerkUserId,
                set: { email, displayName, role, updatedAt: new Date() },
            });
        }
        if (evt.type === "user.deleted") {
            const id = evt.data.id;
            if (id) {
                await db_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.clerkUserId, id));
            }
        }
        res.json({ ok: true });
    }
    catch (error) {
        console.error("clerk webhook error", error);
        res.status(400).json({ error: "Invalid Webhook" });
    }
}
