import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('69dd1f32003b7e825311');

const databases = new Databases(client);

async function testSitemap() {
  const baseUrl = 'https://joereyphotography.com';
  const staticPages = ['', '/about', '/contact'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1.0,
  }));

  const galleriesRes = await databases.listDocuments(
    '69e4ddd7003189c843fa',
    'galleries',
    [Query.orderAsc('order')]
  );

  const uniquePagesMap = new Map();

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
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  });

  const galleryPages = Array.from(uniquePagesMap.values());
  const sitemap = [...staticPages, ...galleryPages];
  console.log('=== SITEMAP GENERATION VERIFICATION ===');
  console.log('Total entries:', sitemap.length);
  console.log('URLs in sitemap:');
  sitemap.forEach(item => console.log(' -', item.url));
  
  const hasUndefined = sitemap.some(s => s.url.includes('undefined'));
  console.log('\nContains "undefined" URL?:', hasUndefined);

  const expectedSlugs = [
    'land-light',
    'weather-drama',
    'light-time-memory',
    'stillness',
    'coast-edge',
    'human-stories'
  ];

  const missingSlugs = expectedSlugs.filter(
    slug => !sitemap.some(s => s.url === `${baseUrl}/gallery/${slug}`)
  );

  console.log('Missing expected gallery slugs?:', missingSlugs.length > 0 ? missingSlugs : 'None (All present!)');
}

testSitemap().catch(err => console.error(err));
