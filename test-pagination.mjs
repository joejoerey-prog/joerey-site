import { Client, Databases, Query } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69dd1f32003b7e825311');

const databases = new Databases(client);

async function check() {
    let offset = 0;
    let total = 0;
    while(true) {
        const res = await databases.listDocuments('69e4ddd7003189c843fa', 'images', [
            Query.limit(100),
            Query.offset(offset)
        ]);
        total += res.documents.length;
        if (res.documents.length < 100) break;
        offset += 100;
    }
    console.log("Offset pagination total:", total);
}
check();
