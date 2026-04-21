import { Client, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69dd1f32003b7e825311');

const databases = new Databases(client);

databases.listDocuments('69e4ddd7003189c843fa', 'galleries')
    .then(response => {
        console.log("Documents found:", response.documents.length);
        if (response.documents.length > 0) {
            console.log("First document keys:", Object.keys(response.documents[0]));
            console.log("First 2 document details:", JSON.stringify(response.documents.slice(0, 2), null, 2));
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
