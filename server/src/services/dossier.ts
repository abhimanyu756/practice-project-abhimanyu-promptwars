import { v4 as uuidv4 } from 'uuid';
import { DossierRecord } from '../types/fhir';
import { upsertRecord, fetchById } from './pinecone';

export async function storeDossier(
  dossier: Omit<DossierRecord, 'id' | 'createdAt'>
): Promise<string> {
  const id = uuidv4();
  console.log(`[DOSSIER-SVC] Generating dossier id=${id}`);

  const record: DossierRecord = {
    ...dossier,
    id,
    createdAt: new Date().toISOString(),
  };

  const dummyVector = new Array(1024).fill(0).map(() => Math.random() * 0.01);

  console.log(`[DOSSIER-SVC] Upserting to Pinecone — id=${id}, vector_dim=${dummyVector.length}`);
  await upsertRecord(id, dummyVector, {
    dossier: JSON.stringify(record),
  });
  console.log(`[DOSSIER-SVC] Upsert complete — id=${id}`);

  return id;
}

export async function retrieveDossier(id: string): Promise<DossierRecord | null> {
  console.log(`[DOSSIER-SVC] Fetching from Pinecone — id=${id}`);
  const result = await fetchById(id);

  if (!result || !result.metadata?.dossier) {
    console.log(`[DOSSIER-SVC] No record found for id=${id}`);
    return null;
  }

  console.log(`[DOSSIER-SVC] Record found for id=${id}`);
  return JSON.parse(result.metadata.dossier as string);
}
