import { Metadata } from "next";
import { databases, Query } from "@/lib/appwrite";
import GalleryClient from "./GalleryClient";

async function getGalleryData(id: string) {
  try {
    const galleryRes = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID!,
      [Query.equal('id', id), Query.limit(1)]
    );

    if (galleryRes.documents.length === 0) return null;

    const gallery = galleryRes.documents[0];

    const imagesRes = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_IMAGES_COLLECTION_ID!,
      [Query.equal('gallery_id', id), Query.orderDesc('created_at')]
    );

    return {
      id: gallery.id,
      title: gallery.title,
      description: gallery.description,
      images: imagesRes.documents.map(doc => ({
        id: doc.$id,
        image: doc.image_url,
        caption: doc.caption
      }))
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
