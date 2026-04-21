import { Metadata } from "next";
import { databases, Query, APPWRITE_CONFIG } from "@/lib/appwrite";
import GalleryClient from "./GalleryClient";

async function getGalleryData(id: string) {
  try {
    // Robust ID matching: try both 'id' and 'Id'
    const galleryRes = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.galleriesCollectionId,
      [
        Query.or([
            Query.equal('Id', id),
            Query.equal('Id', id.toLowerCase()),
            Query.equal('$id', id)
        ]),
        Query.limit(1)
      ]
    );

    if (galleryRes.documents.length === 0) {
      console.warn(`[Gallery] No document found for ID: ${id}`);
      return null;
    }

    const gallery = galleryRes.documents[0];
    // Standardize to lowercase 'id' for the app's internal logic
    const actualId = String(gallery.id || gallery.Id || gallery.$id).toLowerCase();
    
    // Server-side Log
    console.log(`[Gallery Page] Requested URL ID: '${id}' -> Resolved DB gallery_id: '${actualId}'`);

    const imagesRes = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.imagesCollectionId,
      [Query.equal('gallery_id', actualId), Query.orderDesc('created_at'), Query.limit(100)]
    );

    // Deduplicate images by image_url (in case migration was run multiple times)
    const uniqueImagesMap = new Map();
    imagesRes.documents.forEach(doc => {
      if (!uniqueImagesMap.has(doc.image_url)) {
        uniqueImagesMap.set(doc.image_url, {
          id: doc.$id,
          image: doc.image_url,
          caption: doc.caption
        });
      }
    });

    return {
      id: actualId,
      title: gallery.title,
      description: gallery.description,
      images: Array.from(uniqueImagesMap.values())
    };
  } catch (err) {
    console.error('Error fetching gallery data:', err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const gallery = await getGalleryData(id);

  if (!gallery) {
    return {
      title: "Gallery Not Found | Joe Rey Photography",
      description: "This gallery could not be found.",
    };
  }

  const previewImage = gallery.images[0]?.image || "/logo.svg";

  return {
    title: `${gallery.title} | Joe Rey Photography`,
    description: gallery.description,
    openGraph: {
      title: `${gallery.title} | Joe Rey Photography`,
      description: gallery.description,
      siteName: "Joe Rey Photography",
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 800,
          alt: gallery.title,
        },
      ],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${gallery.title} | Joe Rey Photography`,
      description: gallery.description,
      images: [previewImage],
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gallery = await getGalleryData(id);
  
  if (!gallery) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Gallery Not Found</h1>
          <a href="/" className="text-accent hover:underline">Return Home</a>
        </div>
      </main>
    );
  }

  return <GalleryClient gallery={gallery} />;
}
