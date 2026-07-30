import { MetadataRoute } from 'next';
import galleriesData from '@/data/galleries.json';

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

  // 2. Dynamic Gallery Pages from static JSON
  const galleryPages: MetadataRoute.Sitemap = galleriesData.galleries.map(
    (gallery) => ({
      url: `${baseUrl}/gallery/${gallery.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...galleryPages];
}