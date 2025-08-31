'use client';

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Image as ImageIcon,
  Instagram,
  Calendar as CalendarIcon,
  ShoppingCart,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ───────────────────────────────
// Fallback for broken images
// ───────────────────────────────
const FALLBACK_IMG =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="; // 1x1 transparent

const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.src !== FALLBACK_IMG) {
    img.src = FALLBACK_IMG;
    img.style.background = "linear-gradient(135deg,#222 0%,#333 100%)";
    img.style.objectFit = "cover";
  }
};

// ───────────────────────────────
// Logo
// ───────────────────────────────
function JRLogo({ className = "h-6 w-auto" }) {
  return (
    <svg className={className} viewBox="0 0 420 80" aria-label="Joe Rey Photography" role="img">
      <title>Joe Rey Photography</title>
      <rect width="420" height="80" rx="12" fill="none" />
      <text x="20" y="52" fontFamily="ui-sans-serif, system-ui" fontWeight="700" fontSize="40" letterSpacing="2" fill="currentColor">
        JOE REY
      </text>
      <circle cx="360" cy="40" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M360 26 l6 10 -6 10 -6 -10z" fill="currentColor" />
    </svg>
  );
}

// ───────────────────────────────
// Site config
// ───────────────────────────────
const site = {
  name: "Joe Rey Photography",
  location: "Cambridgeshire, UK",
  email: "joereyphotography@hotmail.com",
  hero: {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop",
    kicker: "JOE REY PHOTOGRAPHY",
    headline: "Story-driven images that actually feel like the moment",
    sub: "A tight selection from my Clickasnap uploads — refreshed as I add more.",
    ctaPrimary: { label: "View portfolio", href: "#portfolio" },
    ctaSecondary: { label: "Book a shoot", href: "#contact" },
  },
  social: {
    instagram: "https://instagram.com/joe.rey.photography",
    clickasnap: "https://www.clickasnap.com/profile/joereyphotos",
  },
};

// ───────────────────────────────
// Data
// ───────────────────────────────
const categories = ["Landscapes", "Nature", "Macro", "Wildlife", "Transport", "Still Life"] as const;
type Category = typeof categories[number];

type GalleryImage = { src: string; page: string; alt: string; category: Category };

const initialImages: GalleryImage[] = [
  {
    src: "https://cdn.clickasnap.com/0x1000/73611/nor-24.jpg",
    page: "https://www.clickasnap.com/image/51671",
    alt: "Sycamore Gap tree at Hadrian’s Wall",
    category: "Landscapes",
  },
  {
    src: "https://cdn.clickasnap.com/0x1000/73611/a-256.jpg",
    page: "https://www.clickasnap.com/image/1068786",
    alt: "Moss-covered tree base in autumn",
    category: "Nature",
  },
  {
    src: "/photos/leaf-macro.jpg",
    page: "https://www.clickasnap.com/image/11925045",
    alt: "Leaf in detail — macro venation",
    category: "Macro",
  },
  {
    src: "/photos/insect-thistle.jpg",
    page: "https://www.clickasnap.com/image/11956423",
    alt: "Macro insect on thistle bloom",
    category: "Wildlife",
  },
  {
    src: "https://cdn.clickasnap.com/0x1000/73611/ac-22-1.jpg",
    page: "https://www.clickasnap.com/image/1068830",
    alt: "P-38 Lightning banking",
    category: "Transport",
  },
  {
    src: "https://cdn.clickasnap.com/0x1000/73611/ac-104.jpg",
    page: "https://www.clickasnap.com/image/1068823",
    alt: "B-17 Sally B on approach",
    category: "Transport",
  },
  {
    src: "https://cdn.clickasnap.com/0x1000/73611/m-17.jpg",
    page: "https://www.clickasnap.com/image/1068813",
    alt: "Mersea Island beach hut gable with green trim and boat emblem",
    category: "Still Life",
  },
  {
    src: "https://cdn.clickasnap.com/0x1000/73611/a-127.jpg",
    page: "https://www.clickasnap.com/image/1068876",
    alt: "Black-and-white ornate door knocker on weathered timber",
    category: "Still Life",
  },
];

// ───────────────────────────────
// Hooks
// ───────────────────────────────
function useFilteredImages(all: GalleryImage[], active: Category | "All", query: string) {
  return useMemo(() => {
    return all.filter((g) => {
      const catOK = active === "All" || g.category === active;
      const q = query.trim().toLowerCase();
      const qOK = !q || g.alt.toLowerCase().includes(q);
      return catOK && qOK;
    });
  }, [all, active, query]);
}

// ───────────────────────────────
// Lightbox
// ───────────────────────────────
function Lightbox({ open, onOpenChange, images, index, setIndex }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  images: GalleryImage[]; index: number; setIndex: (n: number) => void;
}) {
  const img = images[index];
  if (!img) return null;
  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl bg-neutral-950 border-neutral-800">
        <DialogHeader><DialogTitle className="text-neutral-200 text-sm">{img.alt}</DialogTitle></DialogHeader>
        <div className="relative">
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-[70vh] object-contain rounded-xl"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={onImgError}
          />
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-2">
            <Button variant="secondary" size="icon" className="rounded-full" onClick={prev}><ChevronLeft className="h-5 w-5" /></Button>
            <a href={img.page} target="_blank" rel="noreferrer">
              <Button variant="secondary" className="rounded-full gap-2">View on Clickasnap <ExternalLink className="h-4 w-4" /></Button>
            </a>
            <Button variant="secondary" size="icon" className="rounded-full" onClick={next}><ChevronRight className="h-5 w-5" /></Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ───────────────────────────────
// Main
// ───────────────────────────────
export default function JoeReyPhotographySite() {
  const [active, setActive] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [allImages, setAllImages] = useState<GalleryImage[]>(initialImages);

  useEffect(() => {
    fetch("/gallery.json").then(r => (r.ok ? r.json() : null)).then((data) => {
      if (Array.isArray(data) && data.length) setAllImages(data);
    }).catch(() => {});
  }, []);

  const images = useFilteredImages(allImages, active, query);

  return (
    <div className="bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-neutral-950/75 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <JRLogo className="h-6 w-auto" />
            <Badge className="ml-2" variant="secondary">{site.location}</Badge>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#portfolio">Portfolio</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href={site.social.clickasnap} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /> Shop</a>
            <a href={site.social.instagram} target="_blank" rel="noreferrer"><Instagram className="h-4 w-4" /> Instagram</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={site.hero.image}
          alt="Hero"
          className="w-full h-[70vh] object-cover opacity-60"
          referrerPolicy="no-referrer"
          onError={onImgError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <h1 className="text-4xl sm:text-6xl font-bold">{site.hero.headline}</h1>
          <p className="mt-4 text-neutral-300">{site.hero.sub}</p>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-64 object-cover rounded-2xl"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={onImgError}
                onClick={() => { setIndex(i); setOpen(true); }}
              />
            </motion.div>
          ))}
        </div>
        <Lightbox open={open} onOpenChange={setOpen} images={images} index={index} setIndex={setIndex} />
      </section>

      {/* Services (no portraits) */}
      <section id="services" className="bg-neutral-900/40 border-y border-neutral-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold flex items-center gap-3"><CalendarIcon className="h-6 w-6" /> Services & pricing</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardHeader><CardTitle>Landscape & Travel Licensing</CardTitle></CardHeader>
              <CardContent><p>From £60</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Brand / Content <Badge>Popular</Badge></CardTitle></CardHeader>
              <CardContent><p>£450</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Aviation & Events</CardTitle></CardHeader>
              <CardContent><p>From £300</p></CardContent></Card>
          </div>
        </div>
      </section>
    </div>
  );
}