'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Images, Sparkles } from 'lucide-react';
import { Gallery } from '@/lib/galleries';

interface GalleryWithPreview extends Gallery {
  preview: string | null;
}

interface CategoryGridProps {
  galleries: GalleryWithPreview[];
}

export default function CategoryGrid({ galleries }: CategoryGridProps) {
  if (!galleries || galleries.length === 0) return null;

  return (
    <section id="collections" className="w-full py-28 px-4 sm:px-6 lg:px-8 bg-background relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-border/50 pb-8">
          <div>
            <div className="eyebrow-label mb-3 flex items-center gap-2">
              <Sparkles size={13} />
              <span>Curated Fine Art Collections</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight">
              Explore Galleries
            </h2>
          </div>
          <p className="text-foreground-muted text-base sm:text-lg max-w-md font-light leading-relaxed">
            From vast UK horizon landscapes to aviation heritage and intimate macro perspectives.
          </p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {galleries.map((gallery, index) => {
            const preview = gallery.preview;
            const imageCount = gallery.images?.length || 0;
            const isFeatured = index === 0;

            return (
              <motion.div
                key={gallery.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: index * 0.12 }}
                className={`${
                  isFeatured ? 'lg:col-span-8' : 'lg:col-span-4'
                } group relative flex flex-col h-full overflow-hidden rounded-2xl glass-card transition-all duration-500 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10`}
              >
                <Link href={`/gallery/${gallery.id}`} className="flex flex-col h-full">
                  {/* Image Container */}
                  <div className={`relative w-full overflow-hidden ${
                    isFeatured ? 'aspect-[16/10] lg:aspect-[16/9]' : 'aspect-[4/3]'
                  } bg-background-alt`}>
                    {preview ? (
                      <Image
                        src={preview}
                        alt={gallery.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes={isFeatured ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-foreground-muted italic text-sm">
                        No preview available
                      </div>
                    )}

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full glass-pill text-[11px] font-mono tracking-wider text-foreground/90 uppercase flex items-center gap-1.5">
                        <Images size={12} className="text-accent" />
                        <span>{imageCount} Photographs</span>
                      </span>

                      <div className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-foreground opacity-75 group-hover:opacity-100 group-hover:bg-accent group-hover:text-background transition-all duration-300 transform group-hover:rotate-45">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>

                    {/* Content Overlay at Bottom of Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10 flex flex-col justify-end">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                        {gallery.title}
                      </h3>
                      <p className="text-foreground-muted text-sm sm:text-base line-clamp-2 font-light leading-relaxed max-w-2xl">
                        {gallery.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
