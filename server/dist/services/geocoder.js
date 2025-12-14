import { LOCATIONS } from "../data/locations.js";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const RATE_LIMIT_MS = 1000; // 1 request per second
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds
class Geocoder {
    cache = new Map();
    lastRequestTime = 0;
    getCacheKey(country, postalCode) {
        return `${country}|${postalCode}`.toLowerCase();
    }
    getFromCache(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
            this.cache.delete(key);
            return null;
        }
        return entry.coordinates;
    }
    saveToCache(key, coordinates) {
        this.cache.set(key, { coordinates, timestamp: Date.now() });
    }
    async rateLimitedDelay() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < RATE_LIMIT_MS) {
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastRequest));
        }
        this.lastRequestTime = Date.now();
    }
    async geocodePostalCode(countryCode, postalCode) {
        if (!countryCode || !postalCode)
            return null;
        const cacheKey = this.getCacheKey(countryCode, postalCode);
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log(`Geocoding cache hit: ${cacheKey}`);
            return cached;
        }
        // Get country name from LOCATIONS data
        const country = LOCATIONS.find(loc => loc.code === countryCode);
        const countryName = country?.name || countryCode;
        console.log(`Geocoding postal code: ${postalCode}, ${countryName}`);
        try {
            await this.rateLimitedDelay();
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
            const url = new URL("https://nominatim.openstreetmap.org/search");
            url.searchParams.set("postalcode", postalCode);
            url.searchParams.set("country", countryName);
            url.searchParams.set("format", "json");
            url.searchParams.set("limit", "1");
            const response = await fetch(url.toString(), {
                signal: controller.signal,
                headers: {
                    "User-Agent": "XMRMeet/0.0.1 (GitHub)",
                },
            });
            clearTimeout(timeout);
            if (!response.ok) {
                console.error(`Nominatim API error: ${response.status} ${response.statusText}`);
                return null;
            }
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                console.warn(`No geocoding results for: ${postalCode}, ${countryName}`);
                return null;
            }
            const result = {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
            };
            this.saveToCache(cacheKey, result);
            console.log(`Geocoded ${postalCode}, ${countryName}: ${result.lat}, ${result.lon}`);
            return result;
        }
        catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.error(`Geocoding timeout for ${postalCode}, ${countryName}`);
            }
            else {
                console.error(`Geocoding error for ${postalCode}, ${countryName}:`, error);
            }
            return null;
        }
    }
}
export const geocoder = new Geocoder();
//# sourceMappingURL=geocoder.js.map