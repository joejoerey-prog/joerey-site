import { Client, Databases, Query } from "node-appwrite"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "69dd1f32003b7e825311"
const dbId = process.env.NEXT_PUBLIC_DATABASE_ID || "69e4ddd7003189c843fa"
const collectionId = process.env.NEXT_PUBLIC_IMAGES_COLLECTION_ID || "images"
const appwriteKey = process.env.APPWRITE_API_KEY || ""

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(projectId)
  .setKey(appwriteKey)

const databases = new Databases(client)

async function listImages() {
  console.log("🔍 Listing images for 'coast-edge' gallery...")
  
  try {
    const response = await databases.listDocuments(dbId, collectionId, [
      Query.equal("gallery_id", "coast-edge"),
      Query.limit(100)
    ])
    
    console.log(`Found ${response.documents.length} images.`)
    
    const urlMap = new Map<string, string[]>()
    
    response.documents.forEach(doc => {
      const ids = urlMap.get(doc.image_url) || []
      ids.push(doc.$id)
      urlMap.set(doc.image_url, ids)
      console.log(`ID: ${doc.$id} | URL: ${doc.image_url} | Caption: ${doc.caption?.substring(0, 30)}...`)
    })

    console.log("\n--- Duplicate Check ---")
    urlMap.forEach((ids, url) => {
      if (ids.length > 1) {
        console.log(`Duplicate found for URL: ${url}`)
        console.log(`IDs: ${ids.join(", ")}`)
      }
    })
    
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

listImages()
