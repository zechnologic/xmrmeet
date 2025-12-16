import { LOCATIONS } from "../data/locations.js";

interface GeocodingResult {
  lat: number;
  lon: number;
  city: string | null;
  state: string | null;
}

// Helper function to normalize state names to state codes
function normalizeStateToCode(countryCode: string, stateName: string | null): string | null {
  if (!stateName) return null;

  const country = LOCATIONS.find(c => c.code === countryCode);
  if (!country) return stateName;

  // Try exact match first (case insensitive)
  const stateNameLower = stateName.toLowerCase();
  const exactMatch = country.states.find(s => s.name.toLowerCase() === stateNameLower);
  if (exactMatch) return exactMatch.code;

  // Try partial match (for cases like "State of XYZ" or "XYZ Province")
  const partialMatch = country.states.find(s =>
    stateNameLower.includes(s.name.toLowerCase()) ||
    s.name.toLowerCase().includes(stateNameLower)
  );
  if (partialMatch) return partialMatch.code;

  // If no match found, return original
  return stateName;
}

interface CacheEntry {
  coordinates: GeocodingResult;
  timestamp: number;
}

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const RATE_LIMIT_MS = 1000; // 1 request per second
const REQUEST_TIMEOUT_MS = 30000; // 30 seconds
const MAX_RETRIES = 2; // Retry up to 2 times on timeout/failure

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

  private async fetchWithGeoapify(
    countryCode: string,
    postalCode: string,
    timeoutMs: number
  ): Promise<GeocodingResult | null> {
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      // No API key configured, skip Geoapify
      return null;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Geoapify free tier: 3000 requests/day with API key
      const url = new URL("https://api.geoapify.com/v1/geocode/search");
      url.searchParams.set("postcode", postalCode);
      url.searchParams.set("filter", `countrycode:${countryCode.toLowerCase()}`);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", "1");
      url.searchParams.set("apiKey", apiKey);

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent": "XMRMeet/1.0",
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.error(`Geoapify API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data: any = await response.json();

      if (!data.results || data.results.length === 0) {
        console.warn(`No Geoapify results for: ${postalCode}, ${countryCode}`);
        return null;
      }

      const result = data.results[0];

      // Extract city and state
      const city = result.city || result.county || result.municipality || null;
      const stateName = result.state || result.state_district || result.province || null;
      const state = normalizeStateToCode(countryCode, stateName);

      return {
        lat: result.lat,
        lon: result.lon,
        city,
        state,
      };
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  }

  private async fetchWithNominatim(
    countryCode: string,
    postalCode: string,
    timeoutMs: number
  ): Promise<GeocodingResult | null> {
    await this.rateLimitedDelay();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("postalcode", postalCode);
      url.searchParams.set("country", countryCode);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", "1");
      url.searchParams.set("addressdetails", "1");

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent": "XMRMeet/1.0",
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.error(`Nominatim API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        console.warn(`No Nominatim results for: ${postalCode}, ${countryCode}`);
        return null;
      }

      const address = data[0].address || {};

      // Extract city from various possible fields
      const city = address.city || address.town || address.village || address.hamlet || null;

      // Extract state from various possible fields
      const stateName = address.state || address.state_district || address.province || address.region || null;

      // Normalize state name to state code
      const state = normalizeStateToCode(countryCode, stateName);

      const result: GeocodingResult = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        city,
        state,
      };

      return result;
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  }

  private async fetchGeocodingData(
    countryCode: string,
    postalCode: string,
    timeoutMs: number
  ): Promise<GeocodingResult | null> {
    // Try Geoapify first if API key is configured (more reliable, 3000 req/day free)
    const hasGeoapifyKey = !!process.env.GEOAPIFY_API_KEY;

    if (hasGeoapifyKey) {
      try {
        const result = await this.fetchWithGeoapify(countryCode, postalCode, timeoutMs);
        if (result) {
          console.log(`Geocoded with Geoapify: ${postalCode}, ${countryCode}`);
          return result;
        }
      } catch (error) {
        console.warn(`Geoapify failed, trying Nominatim fallback:`, error);
      }
    }

    // Use Nominatim (either as primary or fallback)
    try {
      const result = await this.fetchWithNominatim(countryCode, postalCode, timeoutMs);
      if (result) {
        const source = hasGeoapifyKey ? 'Nominatim (fallback)' : 'Nominatim';
        console.log(`Geocoded with ${source}: ${postalCode}, ${countryCode}`);
        return result;
      }
    } catch (error) {
      throw error;
    }

    return null;
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

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const timeoutMs = REQUEST_TIMEOUT_MS * (attempt + 1); // Increase timeout with each retry

        if (attempt > 0) {
          console.log(`Retry attempt ${attempt} for ${postalCode}, ${countryCode} (timeout: ${timeoutMs}ms)`);
        }

        const result = await this.fetchGeocodingData(countryCode, postalCode, timeoutMs);

        if (result) {
          this.saveToCache(cacheKey, result);
          console.log(`Geocoded ${postalCode}, ${countryCode}: ${result.lat}, ${result.lon}, ${result.city}, ${result.state}`);
          return result;
        }

        // If no results found (but no error), don't retry
        return null;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (lastError.name === 'AbortError') {
          console.error(`Geocoding timeout (attempt ${attempt + 1}/${MAX_RETRIES + 1}) for ${postalCode}, ${countryCode}`);
        } else {
          console.error(`Geocoding error (attempt ${attempt + 1}/${MAX_RETRIES + 1}) for ${postalCode}, ${countryCode}:`, lastError);
        }

        // If this is the last attempt, break and return null
        if (attempt === MAX_RETRIES) {
          break;
        }

        // Wait before retrying (exponential backoff: 2s, 4s)
        const backoffMs = 2000 * (attempt + 1);
        console.log(`Waiting ${backoffMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }

    console.error(`Failed to geocode postal code after ${MAX_RETRIES + 1} attempts for user: ${countryCode}, ${postalCode}`);
    return null;
  }
}

export const geocoder = new Geocoder();
