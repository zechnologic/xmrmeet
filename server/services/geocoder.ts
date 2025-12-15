import { LOCATIONS } from "../data/locations.js";

interface GeocodingResult {
  lat: number;
  lon: number;
  city: string | null;
  state: string | null;
}

interface CacheEntry {
  coordinates: GeocodingResult;
  timestamp: number;
}

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const RATE_LIMIT_MS = 1000; // 1 request per second
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds

class Geocoder {
  private cache = new Map<string, CacheEntry>();
  private lastRequestTime = 0;

  private getCacheKey(country: string, postalCode: string): string {
    return `${country}|${postalCode}`.toLowerCase();
  }

  private getFromCache(key: string): GeocodingResult | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.coordinates;
  }

  private saveToCache(key: string, coordinates: GeocodingResult): void {
    this.cache.set(key, { coordinates, timestamp: Date.now() });
  }

  private async rateLimitedDelay(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < RATE_LIMIT_MS) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();
  }

  async geocodePostalCode(
    countryCode: string,
    postalCode: string
  ): Promise<GeocodingResult | null> {
    if (!countryCode || !postalCode) return null;

    const cacheKey = this.getCacheKey(countryCode, postalCode);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log(`Geocoding cache hit: ${cacheKey}`);
      return cached;
    }

    console.log(`Geocoding postal code: ${postalCode}, ${countryCode}`);

    try {
      await this.rateLimitedDelay();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("postalcode", postalCode);
      url.searchParams.set("country", countryCode); // Use country code instead of name
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", "1");
      url.searchParams.set("addressdetails", "1");

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
        console.warn(`No geocoding results for: ${postalCode}, ${countryCode}`);
        return null;
      }

      const address = data[0].address || {};

      // Extract city from various possible fields
      const city = address.city || address.town || address.village || address.hamlet || null;

      // Extract state from various possible fields
      const state = address.state || address.state_district || address.province || address.region || null;

      const result: GeocodingResult = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        city,
        state,
      };

      this.saveToCache(cacheKey, result);
      console.log(`Geocoded ${postalCode}, ${countryCode}: ${result.lat}, ${result.lon}, ${city}, ${state}`);

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`Geocoding timeout for ${postalCode}, ${countryCode}`);
      } else {
        console.error(`Geocoding error for ${postalCode}, ${countryCode}:`, error);
      }
      return null;
    }
  }
}

export const geocoder = new Geocoder();
