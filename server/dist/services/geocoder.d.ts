interface GeocodingResult {
    lat: number;
    lon: number;
    city: string | null;
    state: string | null;
}
declare class Geocoder {
    private cache;
    private lastRequestTime;
    private getCacheKey;
    private getFromCache;
    private saveToCache;
    private rateLimitedDelay;
    geocodePostalCode(countryCode: string, postalCode: string): Promise<GeocodingResult | null>;
}
export declare const geocoder: Geocoder;
export {};
//# sourceMappingURL=geocoder.d.ts.map