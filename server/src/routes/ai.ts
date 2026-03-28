import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { getCurrentWeather } from '../services/weather';
import { reverseGeocode } from '../services/geocode';
import { validateAnalyzeInput } from '../middleware/validateInput';
import { AnalysisResult, FHIRDiagnosticReport } from '../types/fhir';

const router = Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock' });

function buildFHIR(result: AnalysisResult): FHIRDiagnosticReport {
  return {
    resourceType: 'DiagnosticReport',
    status: 'final',
    code: { text: 'MedBridge AI Clinical Assessment' },
    conclusion: result.soap.assessment,
    issued: new Date().toISOString(),
    presentedForm: [
      {
        contentType: 'application/json',
        data: Buffer.from(JSON.stringify(result.soap)).toString('base64'),
      },
    ],
  };
}

router.post('/analyze', validateAnalyzeInput, async (req: Request, res: Response): Promise<any> => {
  const startTime = Date.now();
  console.log('[AI] POST /api/ai/analyze — Request received');

  try {
    let { text, images, lat, lng } = req.body;

    console.log(`[AI] Input: text=${text?.length || 0} chars, images=${images?.length || 0}, location=${lat != null ? `${lat},${lng}` : 'none'}`);

    if (!text || typeof text !== 'string') {
      text = 'Emergency context undefined.';
      console.log('[AI] No text provided, using fallback');
    }

    let weatherContext;
    let locationName = '';
    if (typeof lat === 'number' && typeof lng === 'number') {
      try {
        console.log(`[AI] Fetching weather for coords (${lat}, ${lng})...`);
        const [weather, geoName] = await Promise.all([
          getCurrentWeather(lat, lng),
          reverseGeocode(lat, lng),
        ]);
        weatherContext = weather;
        locationName = geoName;
        console.log(`[AI] Weather fetched: ${weatherContext.description}, ${weatherContext.temp}°C`);
        console.log(`[AI] Location resolved: ${locationName}`);
      } catch (err) {
        console.error('[AI] Weather/geocode fetch failed, skipping:', err);
        weatherContext = undefined;
      }
    }

    const weatherInfo = weatherContext
      ? `Current weather: ${weatherContext.description}, ${weatherContext.temp}°C, humidity ${weatherContext.humidity}%.`
      : '';
    const locationInfo = locationName ? `Patient location: ${locationName}.` : '';

    const prompt = `Act as an expert EMT AI and clinical analyst. Analyze the following chaotic patient inputs into structured medical data.

${locationInfo}
${weatherInfo}

Patient context: ${text}

IMPORTANT WEATHER-HEALTH CORRELATION:
If weather data is provided, you MUST analyze how environmental conditions may contribute to or worsen the patient's condition. Consider:
- High temperature (>35°C): heat exhaustion, dehydration, heat stroke, worsened cardiovascular strain
- High humidity (>80%): fungal infections worsen, respiratory distress, impaired thermoregulation
- Cold temperature (<10°C): hypothermia risk, Raynaud's flares, asthma triggers, frostbite
- Hot + humid: skin rashes (miliaria), fungal growth, electrolyte imbalance risk
- Air quality/pollution: respiratory exacerbation, allergic reactions
Include weather-related risk factors in the "objective" field and any weather-aggravated conditions in the "assessment" field.

Return ONLY a valid JSON object matching this exact interface:
{
  "soap": {
    "subjective": "Patient's reported symptoms and feelings",
    "objective": "Observable data from photos, vitals, AND weather-health correlation analysis",
    "assessment": "Clinical assessment including weather-aggravated conditions and potential diagnoses",
    "plan": ["Step 1", "Step 2"]
  },
  "emergency": {
    "isEmergency": true/false,
    "severity": "critical" | "urgent" | "standard",
    "keywords": ["detected emergency keywords"]
  },
  "specialty": "Recommended medical specialty (e.g. Dermatologist, Cardiologist, General Practice)",
  "firstAidSteps": ["Immediate step 1", "Immediate step 2"],
  "weatherImpact": "Brief explanation of how current weather conditions may affect the patient's condition (or 'No significant weather impact' if not applicable)"
}

CRITICAL: If you detect keywords like chest pain, difficulty breathing, severe bleeding, stroke symptoms, loss of consciousness, or anaphylaxis, set isEmergency to true and severity to critical.`;

    const parts: any[] = [{ text: prompt }];

    if (Array.isArray(images) && images.length > 0) {
      console.log(`[AI] Attaching ${images.length} image(s) for multimodal analysis`);
      for (const img of images) {
        parts.push({
          inlineData: { mimeType: 'image/jpeg', data: img },
        });
      }
    }

    console.log('[AI] Calling Gemini 2.5 Flash...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }],
    });
    console.log(`[AI] Gemini responded in ${Date.now() - startTime}ms`);

    const rawText = response.text || '{}';
    const cleanJson = rawText.replace(/```json\s?|```/g, '').trim();

    let parsed: AnalysisResult;
    try {
      parsed = JSON.parse(cleanJson);
      console.log(`[AI] Parsed successfully — emergency=${parsed.emergency?.isEmergency}, severity=${parsed.emergency?.severity}, specialty=${parsed.specialty}`);
    } catch {
      console.warn('[AI] JSON parse failed, attempting regex extraction...');
      const match = cleanJson.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {
        soap: { subjective: text, objective: 'Unable to parse', assessment: 'Retry recommended', plan: [] },
        emergency: { isEmergency: false, severity: 'standard' as const, keywords: [] },
        specialty: 'General Practice',
        firstAidSteps: [],
      };
      console.log('[AI] Fallback parse result used');
    }

    const fhir = buildFHIR(parsed);
    console.log(`[AI] FHIR DiagnosticReport built, total time: ${Date.now() - startTime}ms`);

    return res.status(200).json({
      success: true,
      data: { ...parsed, weatherContext, locationName: locationName || undefined, fhir },
    });
  } catch (error) {
    console.error(`[AI] Analysis FAILED after ${Date.now() - startTime}ms:`, error);
    return res.status(502).json({ error: 'Gateway failure to AI service.' });
  }
});

export default router;
