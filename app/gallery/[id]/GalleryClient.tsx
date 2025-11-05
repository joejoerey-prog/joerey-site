'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function GalleryClient({ gallery }: { gallery: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!gallery) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[#3b2f2f] text-[#f5efe7]">
        <p>Gallery not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#3b2f2f] text-[#f5efe7]">
      {/* Top section */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <Link
          href="/"
          className="text-sm text-[#f5efe7b3] hover:text-[#f5efe7] transition"
        >
          ← Back to Galleries
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">{gallery.title}</h1>
        <p className="text-[#f5efe7b3] max-w-2xl">{gallery.description}</p>
      </section>

      {/* Images */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.images.map((img: any, i: number) => (
            <figure
              key={i}
              className="rounded-2xl overflow-hidden border border-[#6b5550] bg-[#4b3b39] flex flex-col"
            >
              <div
                className="relative w-full aspect-[4/3] flex items-center justify-center bg-[#3b2f2f] cursor-pointer"
                onClick={() => setOpenIndex(i)}
              >
                <Image
                  src={img.image}
                  alt={img.caption || gallery.title}
                  fill
                  className="object-contain transition-transform duration-200 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              </div>

              {img.caption && (
                <figcaption className="p-3 text-sm text-center text-[#f5efe7b3] bg-[#3b2f2f]/70">
                  {img.caption}
                </figcaption>
              )}

              <div className="p-4 flex justify-center bg-[#3b2f2f]/70">
                <Link
                  href="https://payhip.com/JRPhotoStore"
                  target="_blank"
                  className="inline-block bg-[#6b5550] text-[#f5efe7] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#856c67] transition"
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
          slides={gallery.images.map((img: any) => ({
            src: img.image,
            description: img.caption || "",
          }))}
          plugins={[Thumbnails]}
        />
      )}

      <footer className="py-10 text-center text-[#f5efe7b3] text-sm border-t border-[#6b5550]">
        © {new Date().getFullYear()} Joe Rey Photography
      </footer>
    </main>
  );
}