import { Pinecone } from '@pinecone-database/pinecone';

let pineconeInstance: Pinecone | null = null;
let indexReady = false;

export const initPinecone = () => {
  if (!pineconeInstance) {
    console.log('[PINECONE] Initializing Pinecone client...');
    pineconeInstance = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || 'mock-key-for-test',
    });
    console.log('[PINECONE] Client initialized');
  }
  return pineconeInstance;
};

const INDEX_NAME = () => process.env.PINECONE_INDEX_NAME || 'medbridge-dossiers';
const VECTOR_DIM = 1024;

async function ensureIndex(): Promise<void> {
  if (indexReady) return;

  const pc = initPinecone();
  const name = INDEX_NAME();
  console.log(`[PINECONE] Checking if index "${name}" exists...`);

  try {
    await pc.describeIndex(name);
    indexReady = true;
    console.log(`[PINECONE] Index "${name}" exists and is ready`);
  } catch (err: any) {
    if (err?.name === 'PineconeNotFoundError' || err?.status === 404) {
      console.log(`[PINECONE] Index "${name}" not found — creating (dim=${VECTOR_DIM}, metric=cosine, serverless=aws/us-east-1)...`);
      await pc.createIndex({
        name,
        dimension: VECTOR_DIM,
        metric: 'cosine',
        spec: { serverless: { cloud: 'aws', region: 'us-east-1' } },
        waitUntilReady: true,
      });
      indexReady = true;
      console.log(`[PINECONE] Index "${name}" created successfully`);
    } else {
      console.error(`[PINECONE] Unexpected error checking index "${name}":`, err);
      throw err;
    }
  }
}

export const getVectorIndex = (indexName: string) => {
  const pc = initPinecone();
  return pc.index(indexName);
};

export async function upsertRecord(
  id: string,
  vector: number[],
  metadata: Record<string, any>
): Promise<void> {
  await ensureIndex();
  const name = INDEX_NAME();
  console.log(`[PINECONE] Upserting record id=${id} to index "${name}"`);
  const index = getVectorIndex(name);
  await index.upsert({ records: [{ id, values: vector, metadata }] });
  console.log(`[PINECONE] Upsert successful — id=${id}`);
}

export async function fetchById(id: string): Promise<any | null> {
  await ensureIndex();
  const name = INDEX_NAME();
  console.log(`[PINECONE] Fetching record id=${id} from index "${name}"`);
  const index = getVectorIndex(name);
  const result = await index.fetch({ ids: [id] });
  const record = result.records?.[id];
  console.log(`[PINECONE] Fetch result — id=${id}, found=${!!record}`);
  return record ?? null;
}
