import { Client, Account, Databases, Storage } from 'appwrite';

// HYBRID CONFIG: Try environment variables first, fallback to hardcoded values
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
// IMPORTANT: The Project ID must NOT include the "fra-" region prefix.
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69dd1f32003b7e825311';

console.log("[Appwrite] Initializing with Project:", projectId);

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Constant IDs for the portfolio - these match the Appwrite Console verified values
export const APPWRITE_CONFIG = {
    projectId,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69e4ddd7003189c843fa',
    galleriesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID || 'galleries',
    imagesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_IMAGES_COLLECTION_ID || 'images',
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '69e4ded8000b9ee50c85'
};

export { ID, Query } from 'appwrite';
