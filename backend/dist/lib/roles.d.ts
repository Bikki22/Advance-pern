import type { UserRole } from "../db/schema";
export declare function parseRole(value: unknown): UserRole;
export declare function isAdmin(role: UserRole): role is "admin";
export declare function isStaff(role: UserRole): role is "support" | "admin";
