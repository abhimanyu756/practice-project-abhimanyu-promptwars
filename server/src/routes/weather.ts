import { Router, Request, Response } from 'express';
import { getCurrentWeather } from '../services/weather';
import { validateCoords } from '../middleware/validateInput';

const router = Router();

router.get('/', validateCoords, async (req: Request, res: Response): Promise<any> => {
  const startTime = Date.now();
  console.log('[WEATHER] GET /api/weather — Request received');

  try {
    const lat = (req as any).lat as number;
    const lng = (req as any).lng as number;

    console.log(`[WEATHER] Fetching for coords (${lat}, ${lng})`);

    const weather = await getCurrentWeather(lat, lng);

    console.log(`[WEATHER] Result: ${weather.temp}°C, ${weather.description} — ${Date.now() - startTime}ms`);
    return res.status(200).json({ success: true, data: weather });
  } catch (error) {
    console.error(`[WEATHER] Fetch FAILED after ${Date.now() - startTime}ms:`, error);
    return res.status(502).json({ error: 'Failed to fetch weather data.' });
  }
});

export default router;
