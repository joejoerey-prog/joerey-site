import { MetadataRoute } from 'next';
import { Client, Databases, Query } from 'appwrite';

// Centralized Appwrite config duplicated here or imported? 
// Since sitemap is a server-side route, it's better to use the lib but keep it simple.
import { APPWRITE_CONFIG } from '@/lib/appwrite';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.joereyphotography.com';

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  }));

  // 2. Dynamic Gallery Pages from Appwrite
  let galleryPages: MetadataRoute.Sitemap = [];
  
  try {
    const client = new Client()
      .setEndpoint(APPWRITE_CONFIG.endpoint)
      .setProject(APPWRITE_CONFIG.projectId);
    
    const databases = new Databases(client);
    const galleriesRes = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.galleriesCollectionId,
      [Query.orderAsc('order')]
    );

    galleryPages = galleriesRes.documents.map((gallery) => ({
      url: `${baseUrl}/gallery/${gallery.id}`,
      lastModified: new Date(gallery.$updatedAt || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Failed to generate dynamic sitemap:', error);
    // Fallback to empty gallery pages if Appwrite is unavailable during build
  }

  return [...staticPages, ...galleryPages];
}