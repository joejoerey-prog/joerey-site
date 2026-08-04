import { Client, Storage, Query } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '69e4ded8000b9ee50c85';

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const storage = new Storage(client);

async function main() {
  try {
    const files = await storage.listFiles(bucketId, [Query.equal('name', 'galleries.json')]);
    console.log("Existing galleries.json files in bucket:", files.files.map(f => ({ id: f.$id, name: f.name })));

    let fileId = files.files[0]?.$id;

    const localBuffer = fs.readFileSync('data/galleries.json');
    const inputFile = InputFile.fromBuffer(localBuffer, 'galleries.json');

    if (fileId) {
      console.log(`Updating existing galleries.json (ID: ${fileId})...`);
      // Re-create or delete old file and create new one with fixed ID
      await storage.deleteFile(bucketId, fileId);
    }

    const created = await storage.createFile(bucketId, 'galleries_master_json', inputFile);
    console.log("Created master galleries.json in Appwrite Storage:", created.$id);

    // Download back to verify
    const downloaded = await storage.getFileDownload(bucketId, 'galleries_master_json');
    console.log("Downloaded type:", typeof downloaded, downloaded.constructor?.name, downloaded);
    const parsed = JSON.parse(jsonString);
    console.log("Successfully retrieved and parsed galleries from Appwrite Storage. Galleries count:", parsed.galleries.length);
  } catch (err) {
    console.error("Appwrite Storage Error:", err);
  }
}

main();
