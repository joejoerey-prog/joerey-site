import { Metadata } from "next";
import galleriesData from "@/data/galleries.json";
import GalleryClient from "./GalleryClient";

// Explicitly define the props type
interface GalleryPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for each gallery
export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const gallery = galleriesData.galleries.find((g) => g.id === params.id);

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

// Default export for the gallery page
export default function GalleryPage({ params }: GalleryPageProps) {
  const gallery = galleriesData.galleries.find((g) => g.id === params.id);
  return <GalleryClient gallery={gallery} />;
}