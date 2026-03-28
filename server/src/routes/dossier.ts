import { Router, Request, Response } from 'express';
import { storeDossier, retrieveDossier } from '../services/dossier';

const router = Router();

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

router.post('/', async (req: Request, res: Response): Promise<any> => {
  const startTime = Date.now();
  console.log('[DOSSIER] POST /api/dossier — Store request received');

  try {
    const { soap, emergency, specialty, firstAidSteps, weatherContext, fhir } = req.body;

    if (!soap || !emergency || !specialty) {
      console.warn('[DOSSIER] Missing required fields — returning 400');
      return res.status(400).json({ error: 'Missing required dossier fields: soap, emergency, specialty.' });
    }

    console.log(`[DOSSIER] Storing dossier — specialty=${specialty}, emergency=${emergency?.isEmergency}`);

    const id = await storeDossier({
      soap,
      emergency,
      specialty,
      firstAidSteps: firstAidSteps || [],
      weatherContext,
      fhir,
    });

    console.log(`[DOSSIER] Stored successfully — id=${id}, time=${Date.now() - startTime}ms`);
    return res.status(201).json({ success: true, id });
  } catch (error) {
    console.error(`[DOSSIER] Storage FAILED after ${Date.now() - startTime}ms:`, error);
    return res.status(500).json({ error: 'Failed to store clinical dossier.' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  const startTime = Date.now();
  const id = req.params.id as string;
  console.log(`[DOSSIER] GET /api/dossier/${id} — Retrieve request received`);

  try {
    if (!id || !UUID_PATTERN.test(id)) {
      console.warn(`[DOSSIER] Invalid UUID format: ${id}`);
      return res.status(400).json({ error: 'Invalid dossier ID format.' });
    }

    const dossier = await retrieveDossier(id);

    if (!dossier) {
      console.warn(`[DOSSIER] Not found: ${id}`);
      return res.status(404).json({ error: 'Dossier not found.' });
    }

    console.log(`[DOSSIER] Retrieved successfully — id=${id}, time=${Date.now() - startTime}ms`);
    return res.status(200).json({ success: true, data: dossier });
  } catch (error) {
    console.error(`[DOSSIER] Retrieval FAILED for ${id} after ${Date.now() - startTime}ms:`, error);
    return res.status(500).json({ error: 'Failed to retrieve dossier.' });
  }
});

export default router;
