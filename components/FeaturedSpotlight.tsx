'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Sparkles, ArrowRight, Eye } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import { Gallery } from '@/lib/galleries';

export interface SpotlightItem {
  image: string;
  caption?: string;
  galleryTitle: string;
  galleryId: string;
}

interface FeaturedSpotlightProps {
  galleries: Gallery[];
}

export default function FeaturedSpotlight({ galleries }: FeaturedSpotlightProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Extract a curated highlight list across galleries (e.g. 6 distinct high-impact photos)
  const spotlightItems: SpotlightItem[] = [];
  
  galleries.forEach((gallery) => {
    if (gallery.images && gallery.images.length > 0) {
      // Pick 1-2 key images per gallery
      const selectedImages = gallery.images.slice(0, 2);
      selectedImages.forEach((img) => {
        if (img.image) {
          spotlightItems.push({
            image: img.image,
            caption: img.caption || gallery.title,
            galleryTitle: gallery.title,
            galleryId: gallery.id,
          });
        }
      });
    }
  });

  const featuredList = spotlightItems.slice(0, 6);

  if (featuredList.length === 0) return null;

  const lightboxSlides = featuredList.map((item) => ({
    src: item.image,
    alt: item.caption,
  }));

  return (
    <section className="w-full py-28 px-4 sm:px-6 lg:px-8 bg-background-alt relative z-10 border-t border-b border-border/40">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="eyebrow-label mb-3 flex items-center gap-2">
              <Sparkles size={13} />
              <span>Artist Highlights</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight">
              Curated Masterpieces
            </h2>
          </div>
          <p className="text-foreground-muted text-base sm:text-lg max-w-md font-light leading-relaxed">
            Standout signature captures highlighting atmosphere, composition, and fine macro detail.
          </p>
        </div>

        {/* Gallery Grid Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredList.map((item, idx) => (
            <motion.div
              key={`${item.galleryId}-${idx}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden glass-card cursor-pointer"
              onClick={() => {
                setPhotoIndex(idx);
                setLightboxOpen(true);
              }}
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.caption || item.galleryTitle}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Top Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full glass-pill text-[11px] font-mono uppercase tracking-wider text-accent border border-accent/30">
                  {item.galleryTitle}
                </span>
              </div>

              {/* Quick View Floating Action */}
              <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full glass-pill flex items-center justify-center text-foreground/80 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Eye size={16} />
              </div>

              {/* Bottom Caption & Link */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-foreground text-sm font-light line-clamp-2 leading-relaxed opacity-90">
                  {item.caption}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-accent font-medium pt-1">
                  <span>View Full-Size Artwork</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox for Quick View */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={photoIndex}
        slides={lightboxSlides}
      />
    </section>
  );
}
