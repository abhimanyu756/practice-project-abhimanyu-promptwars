import axios from 'axios';
import { PlaceResult } from '../types/fhir';

const PLACES_API_BASE = 'https://places.googleapis.com/v1/places:searchNearby';

export async function searchNearbyDoctors(
  lat: number,
  lng: number,
  specialty?: string
): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn('[PLACES-SVC] No GOOGLE_PLACES_API_KEY set, returning empty');
    return [];
  }

  const requestBody = {
    includedTypes: ['doctor', 'hospital'],
    maxResultCount: 5,
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: 5000,
      },
    },
  };

  const fieldMask = [
    'places.displayName',
    'places.rating',
    'places.formattedAddress',
    'places.id',
    'places.location',
    'places.userRatingCount',
    'places.reviews',
  ].join(',');

  console.log(`[PLACES-SVC] Searching Google Places API — center=(${lat}, ${lng}), specialty=${specialty || 'any'}`);

  let data: any;
  try {
    const response = await axios.post(PLACES_API_BASE, requestBody, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
        'Content-Type': 'application/json',
      },
      timeout: 8000,
    });
    data = response.data;
  } catch (err: any) {
    const errMsg = err.response?.data?.error?.message || err.message;
    const errStatus = err.response?.status;
    console.error(`[PLACES-SVC] Google Places API error (${errStatus}): ${errMsg}`);
    if (errStatus === 403) {
      console.error('[PLACES-SVC] 403 Forbidden — check API key restrictions: remove HTTP referrer restrictions for server-side use, or ensure Places API (New) is enabled');
    }
    return [];
  }

  if (!data?.places) {
    console.log('[PLACES-SVC] Google Places returned no results');
    return [];
  }

  const results = data.places.map((place: any) => ({
    name: place.displayName?.text ?? 'Unknown',
    rating: place.rating ?? 0,
    address: place.formattedAddress ?? '',
    placeId: place.id ?? '',
    location: {
      lat: place.location?.latitude ?? 0,
      lng: place.location?.longitude ?? 0,
    },
    totalRatings: place.userRatingCount ?? 0,
    reviewSummary: place.reviews?.[0]?.text?.text ?? undefined,
  }));

  console.log(`[PLACES-SVC] Found ${results.length} place(s): ${results.map((r: PlaceResult) => r.name).join(', ')}`);
  return results;
}
