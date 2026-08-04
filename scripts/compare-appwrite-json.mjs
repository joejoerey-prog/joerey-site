import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';
import fs from 'fs';

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

async function main() {
  const fileData = JSON.parse(fs.readFileSync('data/galleries.json', 'utf-8'));
  console.log("Local JSON galleries count:", fileData.galleries.length);
  fileData.galleries.forEach(g => {
    console.log(`- ${g.id} (${g.title}): ${g.images.length} images`);
  });

  // Fetch all images from Appwrite DB
  let allAppwriteDocs = [];
  let lastId = null;
  while (true) {
    const queries = [Query.limit(100), Query.orderAsc("$id")];
    if (lastId) queries.push(Query.cursorAfter(lastId));
    
    const res = await databases.listDocuments(databaseId, 'images', queries);
    allAppwriteDocs.push(...res.documents);
    if (res.documents.length < 100) break;
    lastId = res.documents[res.documents.length - 1].$id;
  }
  console.log("\nAppwrite DB total images count:", allAppwriteDocs.length);
}

main();
