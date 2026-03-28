import request from 'supertest';
import app from '../src/app';

jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: { main: { temp: 0, humidity: 0 }, weather: [{ description: '' }] } }),
  post: jest.fn().mockResolvedValue({
    data: {
      places: [
        {
          displayName: { text: 'City Hospital' },
          rating: 4.5,
          formattedAddress: '123 Main St',
          id: 'place_123',
          location: { latitude: 12.9, longitude: 77.6 },
          userRatingCount: 200,
          reviews: [{ text: { text: 'Great doctors and staff' } }],
        },
        {
          displayName: { text: 'Skin Care Clinic' },
          rating: 4.2,
          formattedAddress: '456 Oak Ave',
          id: 'place_456',
          location: { latitude: 12.91, longitude: 77.61 },
          userRatingCount: 85,
          reviews: [],
        },
      ],
    },
  }),
}));

beforeAll(() => {
  process.env.GOOGLE_PLACES_API_KEY = 'test-key';
});

describe('GET /api/doctors/nearby', () => {
  it('returns 400 without lat/lng', async () => {
    const res = await request(app).get('/api/doctors/nearby');
    expect(res.status).toBe(400);
  });

  it('returns 400 with invalid lat', async () => {
    const res = await request(app).get('/api/doctors/nearby?lat=999&lng=77.6');
    expect(res.status).toBe(400);
  });

  it('returns array of doctors with valid params', async () => {
    const res = await request(app).get('/api/doctors/nearby?lat=12.9&lng=77.6');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('each doctor has required fields', async () => {
    const res = await request(app).get('/api/doctors/nearby?lat=12.9&lng=77.6&specialty=Dermatologist');
    const doctor = res.body.data[0];
    expect(doctor).toHaveProperty('name');
    expect(doctor).toHaveProperty('rating');
    expect(doctor).toHaveProperty('address');
    expect(doctor).toHaveProperty('placeId');
    expect(doctor).toHaveProperty('location');
    expect(doctor).toHaveProperty('totalRatings');
  });
});
