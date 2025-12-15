import { Pool } from "pg";
declare const pool: Pool;
export interface User {
    id: string;
    username: string;
    password_hash: string;
    country: string | null;
    state: string | null;
    city: string | null;
    postal_code: string | null;
    latitude: number | null;
    longitude: number | null;
    available_sell_xmr: number;
    available_buy_xmr: number;
    contact_info: string | null;
    is_admin: number;
    created_at: number;
    updated_at: number;
}
export interface PublicUser {
    id: string;
    username: string;
    country: string | null;
    state: string | null;
    city: string | null;
    postal_code: string | null;
    latitude: number | null;
    longitude: number | null;
    available_sell_xmr: number;
    available_buy_xmr: number;
    contact_info: string | null;
    created_at: number;
}
export interface Review {
    id: string;
    reviewer_id: string;
    reviewee_username: string;
    rating: number;
    comment: string;
    approved: number;
    created_at: number;
}
export interface ReviewWithReviewer extends Review {
    reviewer_username: string;
}
export declare function getUserByUsername(username: string): Promise<User | undefined>;
export declare function getUserById(id: string): Promise<User | undefined>;
export declare function createUser(id: string, username: string, passwordHash: string): Promise<User>;
export declare function updateUserSettings(userId: string, country: string | null, postalCode: string | null, latitude: number | null, longitude: number | null, availableSellXmr: boolean, availableBuyXmr: boolean, contactInfo: string | null): Promise<User | undefined>;
export declare function getAvailableUsers(country?: string, state?: string, city?: string): Promise<PublicUser[]>;
export declare function createReview(id: string, reviewerId: string, revieweeUsername: string, rating: number, comment: string): Promise<Review>;
export declare function getApprovedReviewsForUser(username: string): Promise<ReviewWithReviewer[]>;
export declare function getAverageRating(username: string): Promise<number | null>;
export declare function getPendingReviews(): Promise<ReviewWithReviewer[]>;
export declare function approveReview(reviewId: string): Promise<boolean>;
export declare function deleteReview(reviewId: string): Promise<boolean>;
export declare function hasUserReviewedUser(reviewerId: string, revieweeUsername: string): Promise<boolean>;
export { pool };
export default pool;
//# sourceMappingURL=db.d.ts.map