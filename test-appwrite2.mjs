import { Client, Databases, Query } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69dd1f32003b7e825311');

const databases = new Databases(client);

databases.listDocuments('69e4ddd7003189c843fa', 'galleries', [
    Query.or([
        Query.equal('id', 'land-light'),
        Query.equal('Id', 'land-light')
    ])
])
    .then(response => {
        console.log("Documents found:", response.documents.length);
    })
    .catch(error => {
        console.error("Error from Query.or(id, Id):", error.message);
    });
