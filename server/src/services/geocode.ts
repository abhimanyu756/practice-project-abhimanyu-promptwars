import axios from 'axios';

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn('[GEOCODE-SVC] No API key set, returning fallback');
    return 'Unknown location';
  }

  try {
    console.log(`[GEOCODE-SVC] Reverse geocoding (${lat}, ${lng})...`);
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { latlng: `${lat},${lng}`, key: apiKey, result_type: 'locality|administrative_area_level_1' },
      timeout: 5000,
    });

    const result = data.results?.[0]?.formatted_address || 'Unknown location';
    console.log(`[GEOCODE-SVC] Resolved: ${result}`);
    return result;
  } catch (err) {
    console.error('[GEOCODE-SVC] Reverse geocode failed:', err);
    return 'Unknown location';
  }
}
