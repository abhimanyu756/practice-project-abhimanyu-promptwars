import request from 'supertest';
import app from '../src/app';

jest.mock('../src/services/pinecone', () => {
  const store = new Map<string, any>();
  return {
    initPinecone: jest.fn(),
    getVectorIndex: jest.fn(),
    upsertRecord: jest.fn().mockImplementation(async (id: string, _vector: number[], metadata: any) => {
      store.set(id, { id, values: [], metadata });
    }),
    fetchById: jest.fn().mockImplementation(async (id: string) => {
      return store.get(id) || null;
    }),
  };
});

const validDossier = {
  soap: {
    subjective: 'Patient reports headache',
    objective: 'Blood pressure 140/90',
    assessment: 'Hypertension',
    plan: ['Monitor BP', 'Reduce sodium'],
  },
  emergency: { isEmergency: false, severity: 'standard', keywords: [] },
  specialty: 'General Practice',
  firstAidSteps: ['Rest', 'Hydrate'],
  fhir: {
    resourceType: 'DiagnosticReport',
    status: 'final',
    code: { text: 'Test' },
    conclusion: 'Hypertension',
    issued: new Date().toISOString(),
    presentedForm: [],
  },
};

describe('POST /api/dossier', () => {
  it('returns 400 without required fields', async () => {
    const res = await request(app)
      .post('/api/dossier')
      .send({});
    expect(res.status).toBe(400);
  });

  it('stores dossier and returns UUID', async () => {
    const res = await request(app)
      .post('/api/dossier')
      .send(validDossier);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });
});

describe('GET /api/dossier/:id', () => {
  it('returns 400 for invalid UUID format', async () => {
    const res = await request(app).get('/api/dossier/not-a-uuid');
    expect(res.status).toBe(400);
  });

  it('returns 404 for non-existent dossier', async () => {
    const res = await request(app).get('/api/dossier/00000000-0000-4000-8000-000000000000');
    expect(res.status).toBe(404);
  });

  it('retrieves a stored dossier', async () => {
    const storeRes = await request(app)
      .post('/api/dossier')
      .send(validDossier);
    const id = storeRes.body.id;

    const res = await request(app).get(`/api/dossier/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.soap.assessment).toBe('Hypertension');
  });
});
