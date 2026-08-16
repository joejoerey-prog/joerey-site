'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Download, Sparkles } from 'lucide-react';
import ShopButton from '@/components/ShopButton';

export interface HeroSlide {
  image: string;
  title: string;
  galleryTitle: string;
  galleryId: string;
  location?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section 
      className="relative w-full h-[92vh] min-h-[600px] max-h-[1080px] flex items-center justify-center overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 z-0"
        >
          {currentSlide.image && (
            <Image
              src={currentSlide.image}
              alt={currentSlide.title || "Joe Rey Photography Hero"}
              fill
              className="object-cover animate-kenburns"
              priority
              sizes="100vw"
            />
          )}
          {/* Multi-layer Dark Gradient Overlay for Maximum Legibility & Mood */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-black/60" />
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Photo Location Pill (Top Right on Hero) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-24 right-4 sm:right-8 z-20 hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs tracking-wider text-foreground-muted"
      >
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-foreground font-medium">{currentSlide.galleryTitle}</span>
        {currentSlide.location && <span className="opacity-60">• {currentSlide.location}</span>}
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center">
        {/* Eyebrow Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-[0.25em] mb-6 backdrop-blur-md"
        >
          <Sparkles size={13} className="text-accent" />
          <span>Fine Art Photography & Digital Downloads</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          key={`title-${currentIndex}`}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-6 tracking-tight leading-[1.1] text-drop-shadow"
        >
          Capturing Light.
          <br />
          <span className="italic font-normal text-foreground-muted">Preserving Atmosphere.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base sm:text-xl text-foreground-muted mb-10 max-w-2xl mx-auto leading-relaxed font-light"
        >
          A curated collection of British landscapes, storm weather, macro nature, and aviation storytelling. Available in high-resolution digital licenses.
        </motion.p>

        {/* Dual Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="#collections"
            className="w-full sm:w-auto px-8 py-4 bg-accent text-background font-semibold rounded-full hover:bg-accent/90 transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-accent/20 flex items-center justify-center gap-2 group"
          >
            <span>Explore Collections</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <ShopButton
            href="https://payhip.com/JRPhotoStore"
            className="w-full sm:w-auto px-8 py-4 glass-card text-foreground font-medium rounded-full hover:bg-white/10 hover:border-accent/60 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Download size={17} className="text-accent group-hover:scale-110 transition-transform" />
            <span>Digital Store on Payhip</span>
          </ShopButton>
        </motion.div>
      </div>

      {/* Manual Slide Controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 right-6 sm:right-12 z-20 flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-full glass-pill text-foreground/80 hover:text-foreground hover:bg-white/10 transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-foreground-muted/40 hover:bg-foreground-muted'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2.5 rounded-full glass-pill text-foreground/80 hover:text-foreground hover:bg-white/10 transition-all"
            aria-label="Next image"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Floating Animated Scroll Down Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-6 sm:left-12 z-20 hidden sm:flex items-center gap-3 text-xs tracking-widest text-foreground-muted uppercase"
      >
        <div className="w-5 h-9 rounded-full border border-foreground-muted/30 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-accent"
          />
        </div>
        <span className="font-mono text-[11px] opacity-75">Scroll Down</span>
      </motion.div>
    </section>
  );
}
