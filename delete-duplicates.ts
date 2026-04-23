import { Client, Databases } from "node-appwrite"
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

const duplicateIds = [
  "69e7bd1b0022b8816ae0",
  "69e7bdea002e421778ee",
  "69e7c0120016b4fabcec",
  "69e7c3e500372dc6c6b7",
  "69e885ee00124736334a"
]

async function deleteDuplicates() {
  console.log("🗑️ Deleting duplicates from coast-edge gallery...")
  for (const id of duplicateIds) {
    try {
      await databases.deleteDocument(dbId, collectionId, id)
      console.log(`✅ Deleted document ${id}`)
    } catch (error: any) {
      console.error(`❌ Failed to delete ${id}:`, error.message)
    }
  }
  console.log("✨ Duplicate cleanup complete.")
}

deleteDuplicates()
