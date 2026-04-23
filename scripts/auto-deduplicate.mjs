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

function calculateBufferHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function runDeduplication() {
  console.log("🚀 Starting Automatic De-duplication Process...");
  
  try {
    // 1. Backfill missing hashes
    let hasMoreNull = true;
    while (hasMoreNull) {
      const nullResponse = await databases.listDocuments(dbId, collectionId, [
        Query.limit(50),
        Query.isNull("file_hash")
      ]);
      
      if (nullResponse.documents.length === 0) {
        hasMoreNull = false;
        break;
      }

      console.log(`Found ${nullResponse.documents.length} images needing fingerprints.`);
      for (const doc of nullResponse.documents) {
        try {
          console.log(`  Fingerprinting ${doc.$id}...`);
          const fileBuffer = await storage.getFileDownload(bucketId, doc.file_id);
          const hash = calculateBufferHash(Buffer.from(fileBuffer));
          await databases.updateDocument(dbId, collectionId, doc.$id, { file_hash: hash });
          console.log(`  ✓ Hash: ${hash}`);
        } catch (error) {
          console.error(`  ❌ Error hashing ${doc.$id}:`, error.message);
        }
      }
    }

    // 2. Find all images to scan for duplicates
    let allDocs = [];
    let lastId = null;
    while (true) {
      const queries = [Query.limit(100), Query.orderAsc("$id")];
      if (lastId) queries.push(Query.cursorAfter(lastId));
      
      const res = await databases.listDocuments(dbId, collectionId, queries);
      allDocs.push(...res.documents);
      if (res.documents.length < 100) break;
      lastId = res.documents[res.documents.length - 1].$id;
    }

    console.log(`Total images in database: ${allDocs.length}`);

    // 3. Group by hash
    const hashMap = new Map();
    allDocs.forEach(doc => {
      const hash = doc.file_hash;
      if (!hash) return; // Should have been backfilled but just in case
      if (!hashMap.has(hash)) {
        hashMap.set(hash, []);
      }
      hashMap.get(hash).push(doc);
    });

    // 4. Identify and delete duplicates
    let deletedCount = 0;
    for (const [hash, docs] of hashMap.entries()) {
      if (docs.length > 1) {
        console.log(`\nDuplicate found for hash: ${hash}`);
        // Keep the oldest one (first by $createdAt or $id if createdAt is same)
        docs.sort((a, b) => new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime());
        
        const [original, ...duplicates] = docs;
        console.log(`  Keeping original: ${original.$id} (${original.gallery_id})`);
        
        for (const dup of duplicates) {
          try {
            console.log(`  Deleting duplicate: ${dup.$id} (${dup.gallery_id})...`);
            
            // Delete storage file if it's different from original (it should be different file_id but same content)
            if (dup.file_id && dup.file_id !== original.file_id) {
              try {
                await storage.deleteFile(bucketId, dup.file_id);
                console.log(`    ✓ Deleted storage file: ${dup.file_id}`);
              } catch (e) {
                console.error(`    ❌ Failed to delete storage file ${dup.file_id}: ${e.message}`);
              }
            } else if (dup.file_id === original.file_id) {
                console.log(`    ℹ Skipping storage deletion as it shares file_id with original.`);
            }
            
            await databases.deleteDocument(dbId, collectionId, dup.$id);
            console.log(`    ✓ Deleted DB document: ${dup.$id}`);
            deletedCount++;
          } catch (error) {
            console.error(`    ❌ Error deleting duplicate ${dup.$id}:`, error.message);
          }
        }
      }
    }

    console.log(`\n✨ De-duplication complete. Deleted ${deletedCount} images.`);

  } catch (error) {
    console.error("Fatal Error:", error);
  }
}

runDeduplication();
