import pg from "pg";
import "dotenv/config";
import * as schema from "./schema";
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: pg.Pool;
};
