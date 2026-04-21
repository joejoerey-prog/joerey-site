import { Client, Databases, Storage, Query } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69dd1f32003b7e825311');

const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = '69e4ddd7003189c843fa';
const IMAGES_COL_ID = 'images';
const BUCKET_ID = '69e4ded8000b9ee50c85';

async function cleanup() {
    let allDocs = [];
    let lastId = null;
    
    while (true) {
        const queries = [Query.limit(100), Query.orderAsc('$createdAt')];
        if (lastId) queries.push(Query.cursorAfter(lastId));
        
        const res = await databases.listDocuments(DB_ID, IMAGES_COL_ID, queries);
        allDocs.push(...res.documents);
        
        if (res.documents.length < 100) break;
        lastId = res.documents[res.documents.length - 1].$id;
    }
    
    console.log("Total images found in DB:", allDocs.length);
    if (allDocs.length > 259) {
        const toDelete = allDocs.slice(259);
        console.log(`Will delete ${toDelete.length} documents and their linked storage files.`);
        
        for (let i = 0; i < toDelete.length; i++) {
            const doc = toDelete[i];
            
            // Delete the storage file if file_id exists
            if (doc.file_id) {
                try {
                    await storage.deleteFile(BUCKET_ID, doc.file_id);
                    console.log(`Deleted storage file: ${doc.file_id}`);
                } catch (e) {
                    console.log(`Failed to delete storage file ${doc.file_id}: ${e.message}`);
                }
            }
            
            // Delete the DB document
            await databases.deleteDocument(DB_ID, IMAGES_COL_ID, doc.$id);
            console.log(`Deleted DB document: ${doc.$id} (${i + 1}/${toDelete.length})`);
        }
    } else {
        console.log("No duplicates found.");
    }
}
cleanup();
