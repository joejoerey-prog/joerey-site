import { Client, Databases, Storage, Query, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Load environment variables
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const galleriesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID || "galleries";
const imagesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_IMAGES_COLLECTION_ID || "images";
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const githubToken = process.env.GITHUB_TOKEN;

const IMAGES_DIR = "/Users/joerey/photos-website-backup";

if (!projectId || !apiKey || !githubToken) {
  console.error("Missing required environment variables. Please check .env.local");
  process.exit(1);
}

// Initialize clients
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

// Try alternative project ID if standard one fails (based on previous observations)
const databases = new Databases(client);
const storage = new Storage(client);
const openai = new OpenAI({ baseURL: "https://models.inference.ai.azure.com", apiKey: githubToken });

async function calculateFileHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function getGalleries() {
  try {
    const response = await databases.listDocuments(databaseId, galleriesCollectionId);
    return response.documents.map(doc => ({
      id: doc.id || doc.Id || doc.$id,
      title: doc.title,
      description: doc.description
    }));
  } catch (error) {
    // If it fails, try with fra- prefix
    console.log("Retrying gallery fetch with fra- prefix...");
    client.setProject("fra-" + projectId);
    const response = await databases.listDocuments(databaseId, galleriesCollectionId);
    return response.documents.map(doc => ({
      id: doc.id || doc.Id || doc.$id,
      title: doc.title,
      description: doc.description
    }));
  }
}

async function analyzeImage(filePath, galleries) {
  const buffer = fs.readFileSync(filePath);
  const base64Image = buffer.toString("base64");
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  const galleryList = galleries.map(g => `${g.id}: ${g.title}`).join("\n");

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an expert photography curator. Analyze the image and provide:
1. A captivating, artistic description (max 150 words).
2. The ID of the most suitable gallery from the following list:
${galleryList}

Return your response in JSON format:
{
  "description": "...",
  "gallery_id": "..."
}`
      },
      {
        role: "user",
        content: [{ type: "image_url", image_url: { url: dataUrl } }]
      }
    ],
    model: "gpt-4o-mini",
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}

const MAX_IMAGES = null; // Set to null for all images

async function processImages() {
  console.log("🚀 Starting Bulk Import...");
  
  const galleries = await getGalleries();
  console.log(`📂 Found ${galleries.length} galleries.`);

  let files = fs.readdirSync(IMAGES_DIR).filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  if (MAX_IMAGES) {
    files = files.slice(0, MAX_IMAGES);
  }

  console.log(`📸 Processing ${files.length} images...`);

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(IMAGES_DIR, fileName);
    
    console.log(`\n[${i + 1}/${files.length}] Processing: ${fileName}`);

    try {
      // 1. Calculate Hash
      const hash = await calculateFileHash(filePath);
      
      // 2. Check for Duplicates
      const existing = await databases.listDocuments(
        databaseId,
        imagesCollectionId,
        [Query.equal("file_hash", hash)]
      );

      if (existing.total > 0) {
        console.log(`⏭️ Skipping duplicate: ${fileName}`);
        continue;
      }

      // 3. AI Analysis
      console.log("🤖 Analyzing with AI...");
      const { description, gallery_id } = await analyzeImage(filePath, galleries);
      console.log(`✨ Suggested Gallery: ${gallery_id}`);
      console.log(`📝 Caption: ${description.substring(0, 50)}...`);

      // 4. Upload to Storage
      console.log("📤 Uploading to Appwrite Storage...");
      const uploadedFile = await storage.createFile(
        bucketId,
        ID.unique(),
        InputFile.fromPath(filePath, fileName)
      );

      // 5. Create Database Record
      const imageUrl = `${endpoint}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${client.config.project}`;
      
      await databases.createDocument(
        databaseId,
        imagesCollectionId,
        ID.unique(),
        {
          gallery_id: gallery_id,
          file_id: uploadedFile.$id,
          image_url: imageUrl,
          caption: description,
          file_hash: hash,
          created_at: new Date().toISOString()
        }
      );

      console.log("✅ Successfully imported!");

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`❌ Error processing ${fileName}:`, error.message);
    }
  }

  console.log("\n🏁 Bulk Import Complete!");
}

processImages();
