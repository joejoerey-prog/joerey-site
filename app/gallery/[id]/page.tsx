import { Metadata } from "next";
import galleriesData from "@/data/galleries.json";
import GalleryClient from "./GalleryClient";

// Explicitly define the props as async-compatible
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const gallery = galleriesData.galleries.find((g) => g.id === id);

  if (!gallery) {
    return {
      title: "Gallery Not Found | Joe Rey Photography",
      description: "This gallery could not be found.",
    };
  }

  return {
    title: `${gallery.title} | Joe Rey Photography`,
    description: gallery.description,
    openGraph: {
      title: `${gallery.title} | Joe Rey Photography`,
      description: gallery.description,
      images: ["/photos/logo.png"],
    },
    twitter: {
      title: `${gallery.title} | Joe Rey Photography`,
      description: gallery.description,
      images: ["/photos/logo.png"],
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gallery = galleriesData.galleries.find((g) => g.id === id);
  return <GalleryClient gallery={gallery} />;
}