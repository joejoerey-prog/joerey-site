import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;

console.log({ projectId, databaseId, endpoint, hasApiKey: !!apiKey });

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function main() {
  try {
    const collections = await databases.listCollections(databaseId);
    console.log("Collections:", collections.collections.map(c => ({ id: c.$id, name: c.name })));

    for (const col of collections.collections) {
      const docs = await databases.listDocuments(databaseId, col.$id);
      console.log(`Collection ${col.name} (${col.$id}) has ${docs.total} documents.`);
      if (docs.documents.length > 0) {
        console.log("Sample doc:", docs.documents[0]);
      }
    }
  } catch (err) {
    console.error("Appwrite DB Error:", err);
  }
}

main();
