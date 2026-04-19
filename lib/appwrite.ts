import { Client, Account, Databases, Storage } from 'appwrite';

// HYBRID CONFIG: Try environment variables first, fallback to hardcoded values
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'fra-69dd1f32003b7e825311';

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Constant IDs for the portfolio
export const APPWRITE_CONFIG = {
    projectId: projectId,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69e4ddd7003189c843fa',
    galleriesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID || 'galleries',
    imagesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_IMAGES_COLLECTION_ID || 'images',
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '69e4ded8000b9ee50c85'
};

export { ID, Query } from 'appwrite';
