import { Database as DatabaseType } from "better-sqlite3";
declare const db: DatabaseType;
export interface User {
    id: string;
    username: string;
    password_hash: string;
    country: string | null;
    state: string | null;
    city: string | null;
    available_sell_xmr: number;
    available_buy_xmr: number;
    contact_info: string | null;
    created_at: number;
    updated_at: number;
}
export interface PublicUser {
    id: string;
    username: string;
    country: string | null;
    state: string | null;
    city: string | null;
    available_sell_xmr: number;
    available_buy_xmr: number;
    contact_info: string | null;
    created_at: number;
}
export declare function getUserByUsername(username: string): User | undefined;
export declare function getUserById(id: string): User | undefined;
export declare function createUser(id: string, username: string, passwordHash: string): User;
export declare function updateUserSettings(userId: string, country: string | null, state: string | null, city: string | null, availableSellXmr: boolean, availableBuyXmr: boolean, contactInfo: string | null): User | undefined;
export declare function getAvailableUsers(country?: string, state?: string, city?: string): PublicUser[];
export default db;
//# sourceMappingURL=db.d.ts.map