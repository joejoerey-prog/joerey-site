'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="flex flex-wrap items-center justify-between px-8 py-5 border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/logo.svg"
            alt="Joe Rey Photography"
            width={64}
            height={64}
            className="h-auto"
            priority
          />
          <h1 className="text-2xl md:text-3xl text-foreground tracking-wide font-pacifico">
            Joe Rey Photography
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex gap-6 text-sm font-medium mt-4 md:mt-0">
        <Link 
          href="/" 
          className={`transition-colors ${isActive('/') ? 'text-foreground border-b border-foreground' : 'text-foreground-muted hover:text-foreground'}`}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className={`transition-colors ${isActive('/about') ? 'text-foreground border-b border-foreground' : 'text-foreground-muted hover:text-foreground'}`}
        >
          About
        </Link>
        <Link 
          href="/contact" 
          className={`transition-colors ${isActive('/contact') ? 'text-foreground border-b border-foreground' : 'text-foreground-muted hover:text-foreground'}`}
        >
          Contact
        </Link>
        <Link
          href="https://payhip.com/JRPhotoStore"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-muted hover:text-foreground transition-colors"
        >
          Store
        </Link>
      </nav>
    </header>
  );
}
