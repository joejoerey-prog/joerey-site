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

async function main() {
  const galleriesRes = await databases.listDocuments(databaseId, 'galleries');
  console.log("=== GALLERIES IN APPWRITE ===");
  galleriesRes.documents.forEach(g => console.log(`ID: ${g.$id}, IdField: ${g.Id || g.id}, Title: ${g.title}`));

  const imagesRes = await databases.listDocuments(databaseId, 'images', [Query.limit(5)]);
  console.log("\n=== SAMPLE IMAGES IN APPWRITE ===");
  imagesRes.documents.forEach(img => {
    console.log({
      id: img.$id,
      gallery_id: img.gallery_id,
      image_url: img.image_url,
      file_id: img.file_id,
      caption: img.caption?.substring(0, 40)
    });
  });
}

main();
