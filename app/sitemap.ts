import { MetadataRoute } from 'next';
import { Client, Databases, Query } from 'appwrite';

// Centralized Appwrite config duplicated here or imported? 
// Since sitemap is a server-side route, it's better to use the lib but keep it simple.
import { APPWRITE_CONFIG } from '@/lib/appwrite';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://joereyphotography.com';

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

    const uniquePagesMap = new Map<string, MetadataRoute.Sitemap[number]>();

    galleriesRes.documents.forEach((gallery) => {
      const rawSlug = gallery.id || gallery.Id || gallery.slug || gallery.$id;
      if (!rawSlug || String(rawSlug).toLowerCase() === 'undefined') {
        return;
      }

      const slug = String(rawSlug).toLowerCase();
      const url = `${baseUrl}/gallery/${slug}`;

      if (!uniquePagesMap.has(url)) {
        uniquePagesMap.set(url, {
          url,
          lastModified: new Date(gallery.$updatedAt || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        });
      }
    });

    galleryPages = Array.from(uniquePagesMap.values());
  } catch (error) {
    console.error('Failed to generate dynamic sitemap:', error);
    // Fallback to empty gallery pages if Appwrite is unavailable during build
  }

  return [...staticPages, ...galleryPages];
}