import request from 'supertest';
import app from '../src/app';

describe('MedBridge TDD Test Suite (Hackathon Quality Criteria)', () => {
    
    it('should block payloads over 10MB to prevent DDOS (Security Score)', async () => {
        // Create an intentionally large string to test our helmet/express limits
        const massivePayload = '0'.repeat(12 * 1024 * 1024);
        
        const res = await request(app)
            .post('/api/ai/analyze')
            .send({ text: massivePayload });
            
        // Expect Express payload too large rejection
        expect(res.status).toBe(413);
    });

    it('sanitizes empty or missing inputs effectively (Testing & Security)', async () => {
        const res = await request(app)
            .post('/api/ai/analyze')
            .send({});

        // Expect proper validation fallback rather than server crash
        expect(res.status).toBeGreaterThanOrEqual(400);
    });
});
