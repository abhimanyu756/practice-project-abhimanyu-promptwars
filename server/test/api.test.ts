import request from 'supertest';
import app from '../src/app';

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: JSON.stringify({
          soap: {
            subjective: 'Patient reports chest pain',
            objective: 'Elevated heart rate observed',
            assessment: 'Possible cardiac event',
            plan: ['Administer aspirin', 'Call cardiologist'],
          },
          emergency: { isEmergency: true, severity: 'critical', keywords: ['chest pain'] },
          specialty: 'Cardiologist',
          firstAidSteps: ['Have patient sit down', 'Loosen tight clothing'],
        }),
      }),
    },
  })),
}));

describe('POST /api/ai/analyze', () => {
  it('blocks payloads over 10MB (Security)', async () => {
    const massivePayload = '0'.repeat(12 * 1024 * 1024);
    const res = await request(app)
      .post('/api/ai/analyze')
      .send({ text: massivePayload });
    expect(res.status).toBe(413);
  });

  it('returns SOAP structure on valid input', async () => {
    const res = await request(app)
      .post('/api/ai/analyze')
      .send({ text: 'Patient has chest pain and difficulty breathing' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.soap).toBeDefined();
    expect(res.body.data.soap.subjective).toBeDefined();
    expect(res.body.data.soap.objective).toBeDefined();
    expect(res.body.data.soap.assessment).toBeDefined();
    expect(res.body.data.soap.plan).toBeInstanceOf(Array);
  });

  it('returns emergency flag', async () => {
    const res = await request(app)
      .post('/api/ai/analyze')
      .send({ text: 'chest pain' });

    expect(res.body.data.emergency).toBeDefined();
    expect(res.body.data.emergency.isEmergency).toBeDefined();
    expect(res.body.data.emergency.severity).toBeDefined();
  });

  it('returns FHIR DiagnosticReport', async () => {
    const res = await request(app)
      .post('/api/ai/analyze')
      .send({ text: 'headache' });

    expect(res.body.data.fhir).toBeDefined();
    expect(res.body.data.fhir.resourceType).toBe('DiagnosticReport');
    expect(res.body.data.fhir.status).toBe('final');
  });

  it('rejects invalid image format (Security)', async () => {
    const res = await request(app)
      .post('/api/ai/analyze')
      .send({ text: 'test', images: ['<script>alert(1)</script>'] });

    expect(res.status).toBe(400);
  });

  it('rejects more than 3 images', async () => {
    const res = await request(app)
      .post('/api/ai/analyze')
      .send({ text: 'test', images: ['dGVzdA==', 'dGVzdA==', 'dGVzdA==', 'dGVzdA=='] });

    expect(res.status).toBe(400);
  });
});
