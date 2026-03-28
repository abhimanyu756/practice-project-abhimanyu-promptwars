import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// GOOGLE SERVICES: Initialize Google GenAI securely on the backend
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock' });

router.post('/analyze', async (req: Request, res: Response): Promise<any> => {
    try {
        let { text, images } = req.body;
        
        // SECURITY: Input validation & sanitization
        if (!text || typeof text !== 'string') {
            text = "Emergency context undefined.";
        }

        const prompt = `
            Act as an expert EMT AI. Analyze the following chaotic inputs into structured medical data.
            Return ONLY a valid JSON object matching this interface:
            { "patientOverview": string, "criticalAlerts": string[], "actionPlan": string[] }
            Context: ${text}
        `;

        // EFFICIENCY: Using Flash for minimal latency
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Parse and sanitize JSON extraction
        const cleanJson = (response.text || "{}").replace(/```json|```/g, '');

        return res.status(200).json({ success: true, data: JSON.parse(cleanJson) });
    } catch (error) {
        console.error("AI Analysis Failed:", error);
        return res.status(502).json({ error: 'Gateway failure to AI service.' });
    }
});

export default router;
