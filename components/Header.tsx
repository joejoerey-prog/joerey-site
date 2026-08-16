'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { event as gaEvent } from '@/lib/gtag';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: 'https://payhip.com/JRPhotoStore', label: 'Digital Store', external: true },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl border border-accent/40 bg-accent/15 text-accent font-serif font-bold text-lg group-hover:scale-105 group-hover:bg-accent group-hover:text-background transition-all duration-300 shadow-sm">
              JR
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-foreground tracking-tight group-hover:text-accent transition-colors">
                Joe Rey Photography
              </span>
              <span className="text-[10px] font-mono tracking-widest text-foreground-muted uppercase">
                Fine Art & Digital Licenses
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={
                  item.external && item.href.includes('payhip.com')
                    ? () => gaEvent('payhip_click', { location: 'header' })
                    : undefined
                }
                className={`text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  item.external
                    ? 'px-4 py-2 rounded-full glass-pill border-accent/30 text-accent hover:bg-accent hover:text-background font-semibold'
                    : isActive(item.href)
                    ? 'text-foreground font-semibold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent after:rounded-full'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {item.external && <ShoppingBag size={14} />}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-xl border border-border bg-background-alt text-foreground hover:bg-foreground/10 transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-border/60 bg-background-alt/95 backdrop-blur-xl rounded-b-2xl mb-4 overflow-hidden">
            <div className="px-3 pt-3 pb-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    item.external
                      ? 'text-accent bg-accent/15 border border-accent/30 font-semibold'
                      : isActive(item.href)
                      ? 'text-foreground bg-white/10 font-semibold'
                      : 'text-foreground-muted hover:text-foreground hover:bg-white/5'
                  }`}
                  onClick={() => {
                    if (!item.external) {
                      setIsMenuOpen(false);
                    } else if (item.href.includes('payhip.com')) {
                      gaEvent('payhip_click', { location: 'header_mobile' });
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.external && <ShoppingBag size={16} className="text-accent" />}
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}


