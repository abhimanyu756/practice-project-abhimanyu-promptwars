import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

router.post('/transcribe', async (req: Request, res: Response): Promise<any> => {
  console.log('[SPEECH] POST /api/speech/transcribe — Request received');
  try {
    const { audio } = req.body;
    if (!audio || typeof audio !== 'string') {
      return res.status(400).json({ error: 'audio (base64) is required.' });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn('[SPEECH] No API key, returning empty');
      return res.status(200).json({ success: true, transcript: '' });
    }

    console.log(`[SPEECH] Calling Google Cloud Speech-to-Text API...`);
    const { data } = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'en-US',
          model: 'latest_long',
          enableAutomaticPunctuation: true,
        },
        audio: { content: audio },
      },
      { timeout: 10000 }
    );

    const transcript = data.results?.map((r: any) => r.alternatives?.[0]?.transcript).join(' ') || '';
    console.log(`[SPEECH] Transcribed: "${transcript.slice(0, 100)}..."`);

    return res.status(200).json({ success: true, transcript });
  } catch (err: any) {
    console.error('[SPEECH] Transcription failed:', err.response?.data?.error?.message || err.message);
    return res.status(200).json({ success: true, transcript: '' });
  }
});

export default router;
