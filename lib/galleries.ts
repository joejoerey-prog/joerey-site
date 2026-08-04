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

export async function getGalleriesData(): Promise<GalleriesData> {
  const token = process.env.GITHUB_TOKEN;
  const owner = 'joejoerey-prog';
  const repo = 'joerey-site';
  const pathInRepo = 'data/galleries.json';

  if (token) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}?ref=main`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'Next.js App',
          Accept: 'application/vnd.github.v3+json',
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.content) {
          const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
          const parsed = JSON.parse(decoded);
          if (parsed && Array.isArray(parsed.galleries)) {
            return parsed;
          }
        }
      }
    } catch (err: any) {
      console.warn('Failed to fetch galleries.json live from GitHub API, using local fallback:', err.message);
    }
  }

  return localGalleriesData as GalleriesData;
}
