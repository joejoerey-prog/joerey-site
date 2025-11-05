import { Metadata } from "next";
import galleriesData from "@/data/galleries.json";
import GalleryClient from "./GalleryClient";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
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

export default function GalleryPage({ params }: { params: { id: string } }) {
  const gallery = galleriesData.galleries.find((g) => g.id === params.id);
  return <GalleryClient gallery={gallery} />;
}