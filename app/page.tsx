'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import galleriesData from '@/data/galleries.json';

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground flex flex-col items-center justify-start">
      {/* ===== HERO SECTION ===== */}
      <section className="text-center py-12">
        <h1
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: 'var(--font-pacifico)' }}
        >
          Welcome to Joe Rey Photography
        </h1>
        <p className="mt-3 text-foreground-muted text-lg">
          A curated selection of landscapes, weather, stillness, and memory.
        </p>
      </section>

      {/* ===== CAROUSEL ===== */}
      <section className="w-full flex justify-center mb-16 relative">
        <div className="w-full max-w-4xl px-4">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            spaceBetween={40}
            centeredSlides
            slidesPerView={1}
            loop
            speed={1200}
            className="custom-swiper"
          >
            {galleriesData.galleries.map((gallery, index) => {
              const preview = gallery.images[0]?.image;
              return (
                <SwiperSlide key={gallery.id}>
                  <Link
                    href={`/gallery/${gallery.id}`}
                    className="block rounded-2xl overflow-hidden ring-1 ring-secondary bg-background-alt hover:ring-accent transition relative"
                  >
                    <div className="relative aspect-[3/2] w-full flex items-center justify-center bg-background">
                      {preview && (
                        <Image
                          src={preview}
                          alt={gallery.title}
                          fill
                          className="object-contain"
                          unoptimized={false}
                          priority={index === 0}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 opacity-0 hover:opacity-100 transition">
                      <h2 className="text-2xl font-semibold text-foreground">
                        {gallery.title}
                      </h2>
                      <p className="mt-2 text-foreground-muted max-w-md text-sm px-4">
                        {gallery.description}
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>

      {/* ===== GALLERY GRID BELOW CAROUSEL ===== */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleriesData.galleries.map((gallery) => {
          const preview = gallery.images[0]?.image;
          return (
            <Link
              key={gallery.id}
              href={`/gallery/${gallery.id}`}
              className="block group rounded-2xl overflow-hidden border border-border bg-background-alt hover:ring-2 hover:ring-accent transition"
            >
              <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-background">
                {preview && (
                  <Image
                    src={preview}
                    alt={gallery.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={false}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {gallery.title}
                </h3>
                <p className="text-foreground-muted text-sm mt-1">
                  {gallery.description}
                </p>
              </div>
            </Link>
          );
        })}
      </section>

      {/* ===== SWIPER ARROW STYLES ===== */}
      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          color: var(--foreground) !important;
          transition: color 0.3s ease;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          color: var(--foreground-muted) !important;
        }
      `}</style>
    </main>
  );
}
