import { Request, Response, NextFunction } from 'express';

const MAX_TEXT_LENGTH = 5000;
const MAX_IMAGES = 3;
const BASE64_PATTERN = /^[A-Za-z0-9+/=]+$/;

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

export function validateAnalyzeInput(req: Request, res: Response, next: NextFunction): void {
  const { text, images, lat, lng } = req.body;

  if (text !== undefined && typeof text === 'string') {
    const original = text.length;
    req.body.text = stripHtml(text).slice(0, MAX_TEXT_LENGTH);
    if (req.body.text.length !== original) {
      console.log(`[VALIDATE] Text sanitized: ${original} -> ${req.body.text.length} chars`);
    }
  }

  if (images !== undefined) {
    if (!Array.isArray(images)) {
      console.warn('[VALIDATE] Rejected: images is not an array');
      res.status(400).json({ error: 'images must be an array of base64 strings.' });
      return;
    }
    if (images.length > MAX_IMAGES) {
      console.warn(`[VALIDATE] Rejected: ${images.length} images exceeds max ${MAX_IMAGES}`);
      res.status(400).json({ error: `Maximum ${MAX_IMAGES} images allowed.` });
      return;
    }
    for (let i = 0; i < images.length; i++) {
      if (typeof images[i] !== 'string' || !BASE64_PATTERN.test(images[i])) {
        console.warn(`[VALIDATE] Rejected: image[${i}] has invalid base64 format`);
        res.status(400).json({ error: 'Invalid base64 image format.' });
        return;
      }
    }
  }

  if (lat !== undefined && (typeof lat !== 'number' || lat < -90 || lat > 90)) {
    console.warn(`[VALIDATE] Rejected: invalid lat=${lat}`);
    res.status(400).json({ error: 'lat must be a number between -90 and 90.' });
    return;
  }
  if (lng !== undefined && (typeof lng !== 'number' || lng < -180 || lng > 180)) {
    console.warn(`[VALIDATE] Rejected: invalid lng=${lng}`);
    res.status(400).json({ error: 'lng must be a number between -180 and 180.' });
    return;
  }

  console.log(`[VALIDATE] Analyze input passed — text=${text?.length || 0} chars, images=${images?.length || 0}, coords=${lat != null ? 'yes' : 'no'}`);
  next();
}

export function validateCoords(req: Request, res: Response, next: NextFunction): void {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    console.warn(`[VALIDATE] Rejected coords: invalid lat=${req.query.lat}`);
    res.status(400).json({ error: 'lat is required and must be between -90 and 90.' });
    return;
  }
  if (isNaN(lng) || lng < -180 || lng > 180) {
    console.warn(`[VALIDATE] Rejected coords: invalid lng=${req.query.lng}`);
    res.status(400).json({ error: 'lng is required and must be between -180 and 180.' });
    return;
  }

  console.log(`[VALIDATE] Coords passed — (${lat}, ${lng})`);
  (req as any).lat = lat;
  (req as any).lng = lng;
  next();
}
