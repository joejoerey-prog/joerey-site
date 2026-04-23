import { Client, Databases, Storage, Query } from "node-appwrite"
import OpenAI from "openai"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "fra-69dd1f32003b7e825311"
const dbId = process.env.NEXT_PUBLIC_DATABASE_ID || "69e4ddd7003189c843fa"
const collectionId = process.env.NEXT_PUBLIC_IMAGES_COLLECTION_ID || "images"
const bucketId = process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID || "69e4ded8000b9ee50c85"
const appwriteKey = process.env.APPWRITE_API_KEY || ""
const githubToken = process.env.GITHUB_TOKEN || ""
const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject(projectId).setKey(appwriteKey)
const databases = new Databases(client)
const storage = new Storage(client)
const openai = new OpenAI({ baseURL: "https://models.inference.ai.azure.com", apiKey: githubToken })
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
async function runBackfill() {
console.log("Starting replacement process")
const response = await databases.listDocuments(dbId, collectionId, [Query.limit(100)])
const documents = response.documents
console.log("Found " + documents.length + " images")
for (const doc of documents) {
console.log("Processing document " + doc.$id)
try {
  const fileBuffer = await storage.getFileDownload(bucketId, doc.file_id)
  const base64String = Buffer.from(fileBuffer).toString("base64")
  const dataUrl = "data:image/jpeg;base64," + base64String

  const aiResponse = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a visual assistant. Describe the image in under 200 characters." }, { role: "user", content: [{ type: "image_url", image_url: { url: dataUrl } }] }],
    model: "gpt-4o-mini"
  })

  const description = aiResponse.choices[0].message.content

  await databases.updateDocument(dbId, collectionId, doc.$id, { caption: description })

  console.log("Replaced caption for " + doc.$id + " successfully")
  await sleep(5000)
} catch (error) {
  console.error("Error processing " + doc.$id, error)
  await sleep(5000)
}

}
console.log("Replacement complete")
}
runBackfill()
