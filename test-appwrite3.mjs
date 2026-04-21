import { Client, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69dd1f32003b7e825311');

const databases = new Databases(client);

databases.listDocuments('69e4ddd7003189c843fa', 'images')
    .then(response => {
        if (response.documents.length > 0) {
            console.log("Images keys:", Object.keys(response.documents[0]));
        }
    })
    .catch(error => {
        console.error("Error images:", error);
    });
