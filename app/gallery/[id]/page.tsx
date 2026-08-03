import { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import GalleryClient from "./GalleryClient";

type GalleryImage = { image: string; caption: string };
type GalleryItem = { id: string; title: string; description: string; images: GalleryImage[] };
type GalleriesData = { galleries: GalleryItem[] };

export const revalidate = 0;

function loadGalleriesData(): GalleriesData {
  try {
    const jsonPath = path.join(process.cwd(), "data", "galleries.json");
    const content = fs.readFileSync(jsonPath, "utf-8");
    return JSON.parse(content) as GalleriesData;
  } catch {
    return { galleries: [] };
  }
}

export async function generateStaticParams() {
  const galleriesData = loadGalleriesData();
  return galleriesData.galleries.map((gallery) => ({
    id: gallery.id,
  }));
}

function getGalleryData(id: string) {
  const galleriesData = loadGalleriesData();
  const gallery = galleriesData.galleries.find(
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
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const gallery = getGalleryData(id);

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
  const gallery = getGalleryData(id);

  if (!gallery) {
    notFound();
  }

  return <GalleryClient gallery={gallery} />;
}
