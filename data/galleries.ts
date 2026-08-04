import galleriesDataJson from './galleries.json';

export interface GalleryImage {
  image: string;
  caption: string;
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

export const galleriesData: GalleriesData = galleriesDataJson as GalleriesData;
export default galleriesData;
