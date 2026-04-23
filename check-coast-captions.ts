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

async function checkCaptions() {
  try {
    const response = await databases.listDocuments(dbId, collectionId, [
      Query.equal("gallery_id", "coast-edge"),
      Query.limit(100)
    ])
    
    response.documents.forEach(doc => {
      console.log(`ID: ${doc.$id}\nCaption: ${doc.caption}\nURL: ${doc.image_url}\n---\n`)
    })
  } catch (error) {
    console.error(error)
  }
}

checkCaptions()
