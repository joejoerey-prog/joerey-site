'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download, Sparkles, Shield, CheckCircle2 } from 'lucide-react';
import ShopButton from '@/components/ShopButton';

export default function PrintCTA() {
  const highlights = [
    "Full-resolution original JPEG files",
    "Instant secure download upon checkout",
    "Commercial & personal licensing options",
    "All sales powered securely by Payhip"
  ];

  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-background relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden glass-card border border-accent/30 p-8 sm:p-12 lg:p-16 text-center flex flex-col items-center"
        >
          {/* Background Ambient Glow & Image Overlay */}
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src="/gallery-images/2025_06_06250048.jpg"
              alt="Digital Download Background"
              fill
              className="object-cover filter blur-sm scale-105 opacity-40"
            />
            <div className="absolute inset-0 bg-background/90" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
              <Sparkles size={13} />
              <span>Digital Store • Powered by Payhip</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
              Ready to Collect & License High-Res Photography?
            </h2>

            <p className="text-foreground-muted text-base sm:text-xl font-light leading-relaxed mb-10 max-w-2xl">
              Browse the complete digital download store on Payhip for instant access to high-resolution image files, commercial license options, and full collections.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-left max-w-xl mx-auto w-full">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-foreground/90 font-light">
                  <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Payhip CTA Button */}
            <ShopButton
              href="https://payhip.com/JRPhotoStore"
              className="px-10 py-5 bg-accent text-background font-semibold rounded-full hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-accent/20 flex items-center justify-center gap-3 text-base sm:text-lg group"
            >
              <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
              <span>Visit Digital Store on Payhip</span>
            </ShopButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
