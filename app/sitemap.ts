import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://joereyphotography.com';
  return [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${base}/#portfolio`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/#about`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/#contact`, changeFrequency: 'yearly', priority: 0.6 },
  ];
}