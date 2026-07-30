import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ShopButton from '@/components/ShopButton';
import galleriesData from '@/data/galleries.json';

function getGalleriesWithPreviews() {
  return galleriesData.galleries.map((gallery) => ({
    ...gallery,
    preview: gallery.images[0]?.image || null,
  }));
}

export default async function HomePage() {
  const galleries = getGalleriesWithPreviews();

  return (
    <main className="min-h-dvh bg-background text-foreground flex flex-col items-center justify-start">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        {galleries.length > 0 && galleries[0]?.preview && (
          <Image
            src={galleries[0].preview}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
        )}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg">
            Capturing Nature.
            <br />
            Preserving Moments.
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
            A curated selection of landscapes, weather, stillness, and memory.
          </p>
          <Link
            href="#gallery"
            className="inline-block px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 drop-shadow-lg"
          >
            Explore Gallery
          </Link>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section id="gallery" className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
              Categories
            </h2>
            <p className="text-foreground-muted text-lg">
              Explore my favorite collections
            </p>
          </div>

          {/* Gallery Grid - Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {galleries.map((gallery) => {
              const preview = gallery.preview;
              return (
                <Link
                  key={gallery.id}
                  href={`/gallery/${gallery.id}`}
                  className="group overflow-hidden rounded-xl border border-border hover:border-accent transition-all duration-300 hover:shadow-lg cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-background-alt">
                    {preview ? (
                      <Image
                        src={preview}
                        alt={gallery.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-foreground-muted italic text-sm">
                        No preview available
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 bg-background">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                          {gallery.title}
                        </h3>
                        <p className="text-foreground-muted text-sm line-clamp-2">
                          {gallery.description}
                        </p>
                      </div>
                      <ArrowRight
                        size={20}
                        className="text-accent flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="w-full py-20 px-4 bg-background-alt">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-3xl">📷</span>
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
            Like what you see?
          </h2>
          <p className="text-foreground-muted text-lg mb-10">
            Discover and purchase prints and merchandise from my photography collection.
          </p>
          <ShopButton
            href="https://payhip.com/JRPhotoStore"
            className="inline-block px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Shop Now
          </ShopButton>
        </div>
      </section>
    </main>
  );
}
