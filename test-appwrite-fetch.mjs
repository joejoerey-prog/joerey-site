import { Client, Databases, Query } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69dd1f32003b7e825311');

const databases = new Databases(client);

async function testFetch(id) {
    const galleryRes = await databases.listDocuments(
      '69e4ddd7003189c843fa',
      'galleries',
      [
        Query.or([
            Query.equal('Id', id),
            Query.equal('Id', id.toLowerCase()),
            Query.equal('$id', id)
        ]),
        Query.limit(1)
      ]
    );

    const gallery = galleryRes.documents[0];
    console.log("Gallery resolved ID:", gallery.Id, gallery.$id);
    const actualId = String(gallery.Id || gallery.$id).toLowerCase();
    
    console.log("Actual ID used for images:", actualId);

    const imagesRes = await databases.listDocuments(
      '69e4ddd7003189c843fa',
      'images',
      [Query.equal('gallery_id', actualId), Query.orderDesc('created_at')]
    );
    console.log("Images fetched:", imagesRes.documents.length);
}

testFetch('land-light');
