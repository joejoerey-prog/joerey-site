import { Client, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69dd1f32003b7e825311');

const databases = new Databases(client);

databases.listDocuments('69e4ddd7003189c843fa', 'images')
    .then(response => {
        console.log("Images found:", response.documents.length);
        if (response.documents.length > 0) {
            console.log("First 3 images gallery_id values:");
            response.documents.slice(0, 3).forEach(img => {
                console.log(`- ${img.gallery_id} (image_url: ${img.image_url.slice(0, 50)}...)`);
            });
        }
    })
    .catch(error => {
        console.error("Error images:", error);
    });
