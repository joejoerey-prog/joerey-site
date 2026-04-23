import { Client, Databases, Storage, Query } from "node-appwrite";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "69dd1f32003b7e825311";
const dbId = process.env.NEXT_PUBLIC_DATABASE_ID || "69e4ddd7003189c843fa";
const collectionId = process.env.NEXT_PUBLIC_IMAGES_COLLECTION_ID || "images";
const bucketId = process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID || "69e4ded8000b9ee50c85";
const appwriteKey = process.env.APPWRITE_API_KEY || "";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(projectId)
  .setKey(appwriteKey);

const databases = new Databases(client);
const storage = new Storage(client);

/**
 * Calculates SHA-256 hash of a buffer (Node.js version)
 */
function calculateBufferHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function runBackfill() {
  console.log("🚀 Starting Image Fingerprinting (Hashing) process...");
  
  try {
    // 1. Fetch all documents that DON'T have a hash yet
    const response = await databases.listDocuments(dbId, collectionId, [
      Query.limit(100),
      Query.isNull("file_hash")
    ]);

    const documents = response.documents;
    console.log(`Found ${documents.length} images needing fingerprints.`);

    for (const doc of documents) {
      console.log(`\nProcessing image: ${doc.$id} (${doc.gallery_id})`);
      
      try {
        // 2. Download the file from Appwrite Storage
        const fileBuffer = await storage.getFileDownload(bucketId, doc.file_id);
        
        // 3. Generate hash
        const hash = calculateBufferHash(Buffer.from(fileBuffer));
        console.log(`✅ Generated hash: ${hash}`);

        // 4. Update the document with the hash
        await databases.updateDocument(dbId, collectionId, doc.$id, {
          file_hash: hash
        });
        
        console.log(`✨ Successfully indexed ${doc.$id}`);
      } catch (error) {
        console.error(`❌ Error processing ${doc.$id}:`, error.message);
      }
    }

    if (documents.length > 0) {
      console.log("\n--- Batch Complete ---");
      console.log("Run the script again if you have more than 100 images.");
    } else {
      console.log("All images are already indexed!");
    }

  } catch (error) {
    console.error("Fatal Error:", error);
  }
}

runBackfill();
