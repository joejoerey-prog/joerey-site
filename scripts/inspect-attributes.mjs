import { Client, Databases } from 'node-appwrite';
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

async function main() {
  const galleriesCol = await databases.getCollection(databaseId, 'galleries');
  console.log("Galleries attributes:", galleriesCol.attributes);

  const imagesCol = await databases.getCollection(databaseId, 'images');
  console.log("Images attributes:", imagesCol.attributes);
}

main();
