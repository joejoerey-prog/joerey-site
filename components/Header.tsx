'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between px-8 py-5 border-b border-[#856c67] bg-[#6b5550]/95 backdrop-blur-md sticky top-0 z-50">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image
            src="/photos/logo.png"
            alt="Joe Rey Photography"
            width={80}
            height={80}
            className="h-auto"
            priority
            unoptimized
          />
        </Link>
        <h1
          className="text-3xl text-[#f5efe7] tracking-wide"
          style={{ fontFamily: 'var(--font-pacifico)' }}
        >
          Joe Rey Photography
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex gap-6 text-[#f5efe7b3] text-sm">
        <Link href="/" className="hover:text-[#f5efe7] transition">Home</Link>
        <Link href="/about" className="hover:text-[#f5efe7] transition">About</Link>
        <Link href="/contact" className="hover:text-[#f5efe7] transition">Contact</Link>
        <Link
          href="https://payhip.com/JRPhotoStore"
          target="_blank"
          className="hover:text-[#f5efe7] transition"
        >
          Store
        </Link>
      </nav>
    </header>
  );
}