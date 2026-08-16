'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, FileCheck2, Camera } from 'lucide-react';

export default function PhotographerBio() {
  const trustPoints = [
    {
      icon: <Zap size={18} className="text-accent" />,
      title: "Instant Digital Delivery",
      description: "Direct secure file downloads processed immediately via Payhip upon purchase."
    },
    {
      icon: <FileCheck2 size={18} className="text-accent" />,
      title: "Uncompressed Full Resolution",
      description: "Original high-res JPEG image files ready for fine art display or digital projects."
    },
    {
      icon: <ShieldCheck size={18} className="text-accent" />,
      title: "Flexible Licensing Options",
      description: "Personal display and commercial rights available across all collections."
    }
  ];

  return (
    <section className="w-full py-28 px-4 sm:px-6 lg:px-8 bg-background relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Showcase Frame */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden glass-card p-3">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src="/photos/joe-rey-portrait.jpg"
                  alt="Joe Rey"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                
                {/* Floating Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-pill flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                    <Camera size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-semibold text-foreground">Joe Rey</h4>
                    <p className="text-xs text-foreground-muted font-light">UK Fine-Art Photographer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Decorative Glow Background */}
            <div className="absolute -inset-4 bg-accent/10 rounded-3xl blur-2xl -z-10" />
          </motion.div>

          {/* Right Column: Editorial Text & Values */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="eyebrow-label mb-3 flex items-center gap-2">
              <Sparkles size={13} />
              <span>Behind The Lens</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-[1.15]">
              Capturing Quiet Atmosphere & Storm Drama
            </h2>

            <p className="text-foreground-muted text-base sm:text-lg font-light leading-relaxed mb-6">
              My work focuses on patient observation — capturing the shifting light across open fields, the charged silence before a rainstorm, aviation history in motion, and the hidden macro geometry of nature.
            </p>

            <p className="text-foreground-muted text-base sm:text-lg font-light leading-relaxed mb-10">
              Every photograph in these galleries is made available as an uncompressed high-resolution digital download, licensed directly for art lovers, designers, and collectors worldwide.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-border/50">
              {trustPoints.map((point, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-1">
                    {point.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{point.title}</h4>
                  <p className="text-xs text-foreground-muted font-light leading-normal">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
