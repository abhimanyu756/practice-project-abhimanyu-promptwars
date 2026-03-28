import axios from 'axios';
import { WeatherData } from '../types/fhir';

const cache = new Map<string, { data: WeatherData; expiry: number }>();
const CACHE_TTL = 10 * 60 * 1000;

function cacheKey(lat: number, lng: number): string {
  return `${Math.round(lat * 10) / 10},${Math.round(lng * 10) / 10}`;
}

export async function getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
  const key = cacheKey(lat, lng);
  const cached = cache.get(key);

  if (cached && Date.now() < cached.expiry) {
    console.log(`[WEATHER-SVC] Cache HIT for key=${key}`);
    return cached.data;
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn('[WEATHER-SVC] No GOOGLE_PLACES_API_KEY set, returning fallback');
    return { temp: 0, humidity: 0, description: 'Weather data unavailable' };
  }

  console.log(`[WEATHER-SVC] Cache MISS — calling Google Weather API for (${lat}, ${lng})`);
  const { data } = await axios.get('https://weather.googleapis.com/v1/currentConditions:lookup', {
    params: {
      key: apiKey,
      'location.latitude': lat,
      'location.longitude': lng,
    },
    timeout: 5000,
  });
  console.log(`[WEATHER-SVC] Google Weather API responded — ${data.temperature?.degrees}°C, ${data.weatherCondition?.description?.text}`);

  const weather: WeatherData = {
    temp: data.temperature?.degrees ?? 0,
    humidity: data.relativeHumidity ?? 0,
    description: data.weatherCondition?.description?.text ?? 'Unknown',
  };

  cache.set(key, { data: weather, expiry: Date.now() + CACHE_TTL });
  return weather;
}
