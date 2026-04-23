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

async function clearCaptions() {
  console.log("🧹 Starting to clear captions...")
  
  try {
    const response = await databases.listDocuments(dbId, collectionId, [Query.limit(100)])
    console.log(`Found ${response.documents.length} images.`)

    for (const doc of response.documents) {
      process.stdout.write(`Clearing ${doc.$id}... `)
      await databases.updateDocument(dbId, collectionId, doc.$id, { caption: "" })
      console.log("✅")
    }
    
    console.log("✨ All captions cleared!")
  } catch (error) {
    console.error("❌ Error clearing captions:", error)
  }
}

clearCaptions()
