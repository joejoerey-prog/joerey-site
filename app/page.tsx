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
    <main className="min-h-dvh bg-[#3b2f2f] text-[#f5efe7] flex flex-col items-center justify-start">
      {/* ===== HERO ===== */}
      <section className="text-center py-12">
        <h1
          className="text-3xl font-bold text-[#f5efe7]"
          style={{ fontFamily: 'var(--font-pacifico)' }}
        >
          Welcome to Joe Rey Photography
        </h1>
        <p className="mt-3 text-[#f5efe7b3] text-lg">
          A curated selection of landscapes, weather, stillness, and memory.
        </p>
      </section>

      {/* ===== CAROUSEL ===== */}
      <section className="w-full flex justify-center mb-16">
        <div className="w-full max-w-4xl px-4 relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            spaceBetween={40}
            centeredSlides={true}
            slidesPerView={1}
            loop={true}
            speed={1200}
          >
            {galleriesData.galleries.map((gallery) => {
              const preview = gallery.images[0]?.image;
              return (
                <SwiperSlide key={gallery.id}>
                  <Link
                    href={`/gallery/${gallery.id}`}
                    className="block rounded-2xl overflow-hidden ring-1 ring-[#6b5550] bg-[#4b3b39] hover:ring-[#a58a82] transition"
                  >
                    <div className="relative aspect-[3/2] w-full flex items-center justify-center bg-[#3b2f2f]">
                      {preview && (
                        <Image
                          src={preview}
                          alt={gallery.title}
                          fill
                          className="object-contain"
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 opacity-0 hover:opacity-100 transition">
                      <h2 className="text-2xl font-semibold text-[#f5efe7]">
                        {gallery.title}
                      </h2>
                      <p className="mt-2 text-[#f5efe7b3] max-w-md text-sm">
                        {gallery.description}
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Arrow colour overrides */}
          <style jsx global>{`
            .swiper-button-next,
            .swiper-button-prev {
              color: #f5efe7 !important;
            }
            .swiper-button-next:hover,
            .swiper-button-prev:hover {
              color: #f5efe7b3 !important;
            }
          `}</style>
        </div>
      </section>

      {/* ===== GALLERY GRID ===== */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Explore the Galleries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleriesData.galleries.map((gallery) => {
            const preview = gallery.images[0]?.image;
            return (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.id}`}
                className="group block rounded-2xl overflow-hidden border border-[#6b5550] bg-[#4b3b39] hover:border-[#a58a82] transition"
              >
                <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-[#3b2f2f]">
                  {preview && (
                    <Image
                      src={preview}
                      alt={gallery.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-medium text-[#f5efe7] group-hover:text-[#f5efe7b3] transition">
                    {gallery.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 text-center text-[#f5efe7b3] text-sm border-t border-[#6b5550] w-full">
        © {new Date().getFullYear()} Joe Rey Photography
      </footer>
    </main>
  );
}