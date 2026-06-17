"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemsRelations = exports.ordersRelations = exports.productsRelations = exports.usersRelations = exports.orderItems = exports.orders = exports.checkoutSessions = exports.products = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    clerkUserId: (0, pg_core_1.text)("clerk_user_id").notNull().unique(),
    email: (0, pg_core_1.text)("email").notNull().default(""),
    displayName: (0, pg_core_1.text)("dispaly_name"),
    role: (0, pg_core_1.text)("role").$type().notNull().default("customer"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    name: (0, pg_core_1.text)("name").notNull(),
    category: (0, pg_core_1.text)("category").notNull().default("General"),
    description: (0, pg_core_1.text)("description").notNull().default(""),
    priceCents: (0, pg_core_1.integer)("price_cents").notNull(),
    currency: (0, pg_core_1.text)("currency").notNull().default("usd"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    imageKitFieldId: (0, pg_core_1.text)("image_kit_field_id"),
    active: (0, pg_core_1.boolean)("active").notNull().default(true),
    createAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});
exports.checkoutSessions = (0, pg_core_1.pgTable)("checkout_sessions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    polarCheckoutId: (0, pg_core_1.text)("polar_checkout_id").unique(),
    lines: (0, pg_core_1.jsonb)("lines").$type().notNull(),
    totalCents: (0, pg_core_1.integer)("total_cents").notNull(),
    currency: (0, pg_core_1.text)("currency").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).notNull(),
});
exports.orders = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    status: (0, pg_core_1.text)("status").$type().notNull().default("pending"),
    polarCheckoutId: (0, pg_core_1.text)("polar_checkout_id"),
    polarOrderId: (0, pg_core_1.text)("polar_order_id").unique(),
    totalCents: (0, pg_core_1.integer)("total_cents").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});
exports.orderItems = (0, pg_core_1.pgTable)("order_items", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    orderId: (0, pg_core_1.uuid)("order_id")
        .notNull()
        .references(() => exports.orders.id, { onDelete: "cascade" }),
    productId: (0, pg_core_1.uuid)("product_id")
        .notNull()
        .references(() => exports.products.id, { onDelete: "cascade" }),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    unitPriceCents: (0, pg_core_1.integer)("unit_price_cents").notNull(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    orders: many(exports.orders),
}));
exports.productsRelations = (0, drizzle_orm_1.relations)(exports.products, ({ many }) => ({
    orderItems: many(exports.orderItems),
}));
exports.ordersRelations = (0, drizzle_orm_1.relations)(exports.orders, ({ one, many }) => ({
    user: one(exports.users, { fields: [exports.orders.userId], references: [exports.users.id] }),
    items: many(exports.orderItems),
}));
exports.orderItemsRelations = (0, drizzle_orm_1.relations)(exports.orderItems, ({ one }) => ({
    order: one(exports.orders, { fields: [exports.orderItems.orderId], references: [exports.orders.id] }),
    product: one(exports.products, {
        fields: [exports.orderItems.productId],
        references: [exports.products.id],
    }),
}));
