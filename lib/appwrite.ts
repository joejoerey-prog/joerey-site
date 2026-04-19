import { Client, Account, Databases, Storage } from 'appwrite';

// Hardcoding for direct connection stability
const endpoint = 'https://cloud.appwrite.io/v1';
const projectId = 'fra-69dd1f32003b7e825311';

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Constant IDs for the portfolio
export const APPWRITE_CONFIG = {
    projectId: projectId,
    databaseId: '69e4ddd7003189c843fa',
    galleriesCollectionId: 'galleries',
    imagesCollectionId: 'images',
    bucketId: '69e4ded8000b9ee50c85'
};

export { ID, Query } from 'appwrite';
