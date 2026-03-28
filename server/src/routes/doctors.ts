import { Router, Request, Response } from 'express';
import { searchNearbyDoctors } from '../services/places';
import { validateCoords } from '../middleware/validateInput';

const router = Router();

router.get('/nearby', validateCoords, async (req: Request, res: Response): Promise<any> => {
  const startTime = Date.now();
  console.log('[DOCTORS] GET /api/doctors/nearby — Request received');

  try {
    const lat = (req as any).lat as number;
    const lng = (req as any).lng as number;
    const specialty = (req.query.specialty as string) || undefined;

    console.log(`[DOCTORS] Searching near (${lat}, ${lng}), specialty=${specialty || 'any'}`);

    const doctors = await searchNearbyDoctors(lat, lng, specialty);

    console.log(`[DOCTORS] Found ${doctors.length} doctor(s) in ${Date.now() - startTime}ms`);
    return res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error(`[DOCTORS] Search FAILED after ${Date.now() - startTime}ms:`, error);
    return res.status(502).json({ error: 'Failed to search for nearby doctors.' });
  }
});

export default router;
