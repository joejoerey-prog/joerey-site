import React from 'react';
import HeroSlider, { HeroSlide } from '@/components/HeroSlider';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedSpotlight from '@/components/FeaturedSpotlight';
import PhotographerBio from '@/components/PhotographerBio';
import PrintCTA from '@/components/PrintCTA';
import { getGalleriesData } from '@/lib/galleries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getGalleriesWithPreviews() {
  const data = await getGalleriesData();
  return data.galleries.map((gallery) => ({
    ...gallery,
    preview: gallery.images[0]?.image || null,
  }));
}

export default async function HomePage() {
  const galleries = await getGalleriesWithPreviews();

  // Construct hero slides from top preview image of each gallery
  const heroSlides: HeroSlide[] = [];
  galleries.forEach((gallery) => {
    const topImage = gallery.images[0];
    if (topImage && topImage.image) {
      heroSlides.push({
        image: topImage.image,
        title: topImage.caption || gallery.title,
        galleryTitle: gallery.title,
        galleryId: gallery.id,
        location: gallery.title,
      });
    }
  });


  return (
    <main className="min-h-dvh bg-background text-foreground flex flex-col items-center justify-start overflow-x-hidden">
      {/* ===== HERO SLIDER SECTION ===== */}
      <HeroSlider slides={heroSlides} />

      {/* ===== ASYMMETRIC CATEGORIES SECTION ===== */}
      <CategoryGrid galleries={galleries} />

      {/* ===== FEATURED MASTERPIECE SPOTLIGHT SECTION ===== */}
      <FeaturedSpotlight galleries={galleries} />

      {/* ===== BEHIND THE LENS / PHOTOGRAPHER BIO SECTION ===== */}
      <PhotographerBio />

      {/* ===== HIGH-RESOLUTION DIGITAL STORE CTA SECTION ===== */}
      <PrintCTA />
    </main>
  );
}

