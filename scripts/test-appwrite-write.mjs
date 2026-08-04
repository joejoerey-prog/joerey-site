import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function testWrite() {
  try {
    const res = await databases.listDocuments(databaseId, 'galleries');
    console.log("Galleries doc count:", res.documents.length);
    console.log("First doc:", res.documents[0]);
  } catch (err) {
    console.error("Write test failed:", err);
  }
}

testWrite();
