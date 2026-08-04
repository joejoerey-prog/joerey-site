import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGalleriesData } from "@/lib/galleriesStore";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getGalleryData(id: string) {
  const data = await getGalleriesData();
  const gallery = data.galleries.find(
    (g) => g.id.toLowerCase() === id.toLowerCase()
  );

  if (!gallery) {
    return null;
  }

  return {
    ...gallery,
    images: gallery.images.map((img, idx) => ({
      id: `${gallery.id}-${idx}`,
      image: img.image,
      caption: img.caption,
      title: img.title,
      alt: img.alt,
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const gallery = await getGalleryData(id);

  if (!gallery) {
    notFound();
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
    notFound();
  }

  return <GalleryClient gallery={gallery} />;
}
