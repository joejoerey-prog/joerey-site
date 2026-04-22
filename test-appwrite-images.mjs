import { Client, Databases } from 'appwrite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69dd1f32003b7e825311');

const databases = new Databases(client);

// Function to fetch image and convert to Base64
async function fetchAndEncodeImage(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return base64;
    } catch (error) {
        console.error(`Error fetching image: ${error.message}`);
        return null;
    }
}

// Function to sleep for specified milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to process images
async function processImages() {
    try {
        const response = await databases.listDocuments('69e4ddd7003189c843fa', 'images');
        console.log("Images found:", response.documents.length);
        
        if (response.documents.length > 0) {
            console.log("\nProcessing images with 5-second rate limit...\n");
            
            for (let i = 0; i < response.documents.length; i++) {
                const img = response.documents[i];
                console.log(`[${i + 1}/${response.documents.length}] Processing: ${img.gallery_id}`);
                
                if (img.image_url) {
                    const base64 = await fetchAndEncodeImage(img.image_url);
                    if (base64) {
                        console.log(`  ✓ Image encoded to Base64 (${base64.length} chars)`);
                        // Optionally save Base64 to file
                        // const filename = `${img.gallery_id}_${img.$id}.base64`;
                        // fs.writeFileSync(path.join(__dirname, filename), base64);
                    } else {
                        console.log(`  ✗ Failed to encode image`);
                    }
                }
                
                // Wait 5 seconds before processing next image (except for the last one)
                if (i < response.documents.length - 1) {
                    console.log("  Waiting 5 seconds...\n");
                    await sleep(5000);
                }
            }
            
            console.log("\nImage processing complete!");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the script
processImages();
