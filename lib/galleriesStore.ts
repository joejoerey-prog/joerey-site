import { Client, Storage } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import fs from 'fs/promises';
import existsSync from 'fs';
import path from 'path';
import localGalleriesData from '@/data/galleries.json';

export interface GalleryImage {
  image: string;
  caption?: string;
  title?: string;
  alt?: string;
  description?: string;
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
}

export interface GalleriesData {
  galleries: Gallery[];
}

const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '69e4ded8000b9ee50c85';
const FILE_ID = 'galleries_master_json';

function getAppwriteStorage() {
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69dd1f32003b7e825311';
  const apiKey = process.env.APPWRITE_API_KEY || '';
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';

  if (!projectId || !apiKey) {
    return null;
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return new Storage(client);
}

/**
 * Merges local galleries.json (from git commits) with cloud storage data (from admin API).
 * Any new images present in localGalleriesData that are missing in cloud storage are added,
 * ensuring git-pushed images from the uploader app always appear on the website.
 */
export async function getGalleriesData(): Promise<GalleriesData> {
  const localData = localGalleriesData as GalleriesData;
  const storage = getAppwriteStorage();

  if (!storage) {
    return localData;
  }

  try {
    const downloaded = await storage.getFileDownload(BUCKET_ID, FILE_ID);
    if (downloaded) {
      const raw: any = downloaded;
      let cloudData: any = null;
      if (typeof raw === 'string') {
        cloudData = JSON.parse(raw);
      } else if (Buffer.isBuffer(raw)) {
        cloudData = JSON.parse((raw as Buffer).toString('utf-8'));
      } else if (raw && typeof raw === 'object') {
        cloudData = raw;
      }

      if (cloudData && Array.isArray(cloudData.galleries)) {
        let hasNewLocalImages = false;

        // Merge local git data into cloud data to include newly uploaded photos
        const mergedGalleries = cloudData.galleries.map((cloudGal: Gallery) => {
          const localGal = localData.galleries.find(
            (g) => g.id.toLowerCase() === cloudGal.id.toLowerCase()
          );
          if (!localGal) return cloudGal;

          const cloudImagePaths = new Set(cloudGal.images.map((img) => img.image));
          const newLocalImages = localGal.images.filter(
            (img) => !cloudImagePaths.has(img.image)
          );

          if (newLocalImages.length > 0) {
            hasNewLocalImages = true;
            return {
              ...cloudGal,
              images: [...cloudGal.images, ...newLocalImages],
            };
          }
          return cloudGal;
        });

        // Also check for any new local gallery IDs not present in cloud
        localData.galleries.forEach((localGal) => {
          if (!mergedGalleries.some((g: Gallery) => g.id.toLowerCase() === localGal.id.toLowerCase())) {
            mergedGalleries.push(localGal);
            hasNewLocalImages = true;
          }
        });

        const result: GalleriesData = { galleries: mergedGalleries };

        // If new git-pushed images were found, sync merged dataset to Appwrite Cloud Storage
        if (hasNewLocalImages) {
          saveGalleriesData(result).catch((err) =>
            console.error('Failed to sync merged galleries to Appwrite:', err.message)
          );
        }

        return result;
      }
    }
  } catch (err: any) {
    console.warn('Could not load galleries from Appwrite storage, using local fallback:', err.message);
  }

  return localData;
}

/**
 * Saves updated gallery data to Appwrite Storage cloud backup,
 * and writes to local galleries.json file on disk if filesystem is writable.
 */
export async function saveGalleriesData(data: GalleriesData): Promise<boolean> {
  let savedToCloud = false;
  const storage = getAppwriteStorage();
  const jsonString = JSON.stringify(data, null, 2);

  if (storage) {
    try {
      // Delete existing master file if present
      try {
        await storage.deleteFile(BUCKET_ID, FILE_ID);
      } catch (_) {
        // File may not exist yet, ignore
      }

      // Create updated master file
      const buffer = Buffer.from(jsonString, 'utf-8');
      const inputFile = InputFile.fromBuffer(buffer, 'galleries.json');
      await storage.createFile(BUCKET_ID, FILE_ID, inputFile);
      savedToCloud = true;
    } catch (err: any) {
      console.error('Failed to save gallery data to Appwrite storage:', err.message);
    }
  }

  // Also write to local disk if accessible
  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'galleries.json');
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (err: any) {
    // Disk write might fail on read-only environments like Vercel lambda
  }

  return savedToCloud;
}
