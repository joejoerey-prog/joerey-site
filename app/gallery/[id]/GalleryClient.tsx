'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { event as gaEvent } from "@/lib/gtag";

type GalleryImage = {
  id?: string;
  image: string;
  caption?: string;
};

type Gallery = {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
};

interface GalleryClientProps {
  gallery?: Gallery;
}

export default function GalleryClient({ gallery }: GalleryClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!gallery) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-background text-foreground">
        <p>Gallery not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* Top section */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <Link
          href="/"
          className="text-sm text-foreground-muted hover:text-foreground transition"
        >
          ← Back to Galleries
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">{gallery.title}</h1>
        <p className="text-foreground-muted max-w-2xl">{gallery.description}</p>
      </section>

      {/* Images */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.images.map((img: GalleryImage, i: number) => (
            <figure
              key={img.id || i}
              className="rounded-2xl overflow-hidden border border-border bg-background-alt flex flex-col relative group"
            >
              <div
                className="relative w-full aspect-[4/3] flex items-center justify-center bg-background cursor-pointer"
                onClick={() => setOpenIndex(i)}
              >
                <Image
                  src={img.image}
                  alt={img.caption || gallery.title}
                  fill
                  className="object-cover transition-transform duration-200 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < 3}     // preload first few images
                  quality={80}          // slightly higher quality for photography
                  loading={i < 3 ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                />
              </div>

              {img.caption && (
                <figcaption className="p-3 text-sm text-center text-foreground-muted bg-background/70">
                  {img.caption}
                </figcaption>
              )}

              <div className="p-4 flex justify-center bg-background/70 mt-auto">
                <Link
                  href="https://payhip.com/JRPhotoStore"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => gaEvent("payhip_click", { location: "gallery_image" })}
                  className="inline-block bg-secondary text-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary transition"
                >
                  Download
                </Link>
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {openIndex !== null && (
        <Lightbox
          open={true}
          close={() => setOpenIndex(null)}
          index={openIndex}
          slides={gallery.images.map((img: GalleryImage) => ({
            src: img.image,
            description: img.caption || "",
          }))}
          plugins={[Thumbnails]}
        />
      )}
    </main>
  );
}
