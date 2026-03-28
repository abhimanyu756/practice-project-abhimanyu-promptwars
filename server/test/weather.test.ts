import request from 'supertest';
import app from '../src/app';

jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({
    data: {
      temperature: { degrees: 28.5, unit: 'CELSIUS' },
      relativeHumidity: 65,
      weatherCondition: { description: { text: 'Partly cloudy' } },
    },
  }),
}));

describe('GET /api/weather', () => {
  it('returns 400 without coordinates', async () => {
    const res = await request(app).get('/api/weather');
    expect(res.status).toBe(400);
  });

  it('returns 400 with invalid lng', async () => {
    const res = await request(app).get('/api/weather?lat=12.9&lng=999');
    expect(res.status).toBe(400);
  });

  it('returns weather data with valid coords', async () => {
    const res = await request(app).get('/api/weather?lat=12.9&lng=77.6');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('temp');
    expect(res.body.data).toHaveProperty('humidity');
    expect(res.body.data).toHaveProperty('description');
  });
});
