"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
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

import JRLogo from "@/components/JRLogo";

/* --------------------------------------------------------
   Image fallback for grumpy CDNs
---------------------------------------------------------*/
const FALLBACK_IMG =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.src !== FALLBACK_IMG) {
    img.src = FALLBACK_IMG;
    img.style.background =
      "linear-gradient(135deg,#222 0%, #333 100%)";
    img.style.objectFit = "cover";
  }
};

/* --------------------------------------------------------
   Site config (adjust anytime)
---------------------------------------------------------*/
const site = {
  name: "Joe Rey Photography",
  location: "Cambridgeshire, UK",
  email: "joereyphotography@hotmail.com",
  hero: {
    image: "/photos/Gap.jpg",
    kicker: "", // removed per request
    headline: "Story-driven images that actually feel like the moment",
    sub: "A tight selection from my Clickasnap uploads — refreshed as I add more.",
    ctaPrimary: { label: "View portfolio", href: "#portfolio" },
    ctaSecondary: { label: "Book a shoot", href: "#contact" },
  },
  social: {
    instagram: "https://instagram.com/joe.rey.photos",
    clickasnap: "https://www.clickasnap.com/profile/joereyphotos",
  },
};

/* --------------------------------------------------------
   Gallery data (mix of remote and local)
---------------------------------------------------------*/
type Category = "All" | "Landscapes" | "Nature" | "Macro" | "Wildlife" | "Transport" | "Still Life";

type GalleryImage = {
  src: string;
  page: string;
  alt: string;
  category: Category;
};

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
    page: "https://www.clickasnap.com/image/1068880",
    alt: "P–38 Lightning banking",
    category: "Transport",
  },
];

/* --------------------------------------------------------
   Helpers
---------------------------------------------------------*/
const categories: Category[] = [
  "All",
  "Landscapes",
  "Nature",
  "Macro",
  "Wildlife",
  "Transport",
  "Still Life",
];

function useFilteredImages(all: GalleryImage[], active: Category, query: string) {
  return useMemo(() => {
    let list = all;
    if (active !== "All") list = list.filter((i) => i.category === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) => i.alt.toLowerCase().includes(q));
    }
    return list;
  }, [all, active, query]);
}

/* --------------------------------------------------------
   Page
---------------------------------------------------------*/
export default function Page() {
  // lightbox
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // gallery state
  const [active, setActive] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const images = useFilteredImages(initialImages, active, query);

  // keyboard nav in lightbox
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <div>
      {/* Header with logo */}
      <header className="w-full flex items-center justify-start p-4">
        <JRLogo className="h-12 w-auto text-white" />
      </header>

      {/* Hero */}
      <section
        id="hero"
        className="relative min-h-[72vh] flex items-center"
      >
        <img
          src={site.hero.image}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
          onError={onImgError}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {site.hero.kicker ? (
            <p className="tracking-widest text-neutral-200/80 text-xs mb-2">{site.hero.kicker}</p>
          ) : null}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight text-white drop-shadow">
            {site.hero.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-200">
            {site.hero.sub}
          </p>
          <div className="mt-6 flex gap-3">
            <a href={site.hero.ctaPrimary.href}>
              <Button size="lg">{site.hero.ctaPrimary.label}</Button>
            </a>
            <a href={site.hero.ctaSecondary.href}>
              <Button size="lg" variant="secondary">
                {site.hero.ctaSecondary.label}
              </Button>
            </a>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold">Featured portfolio</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Search captions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-48 sm:w-64"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={active === c ? "default" : "secondary"}
              onClick={() => setActive(c)}
            >
              {c}
            </Button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-64 object-cover rounded-2xl"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={onImgError}
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
              />
              <div className="mt-2 flex items-center justify-between text-sm text-neutral-400">
                <Badge variant="secondary">{img.category}</Badge>
                <a
                  href={img.page}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                  title="View on Clickasnap"
                >
                  View <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold">Services & pricing</h2>
        <p className="text-neutral-400 mt-1 text-sm">
          Simple packages. Travel quoted case-by-case. Prints are available via Clickasnap.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Brand/Content <Badge>Popular</Badge></CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-neutral-300 text-sm space-y-1">
                <li>Half-day shoot</li>
                <li>Short-form video clips</li>
                <li>Usage license for socials</li>
              </ul>
              <p className="mt-4 text-neutral-200">£450</p>
              <Button variant="secondary" className="mt-4">Enquire</Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Aviation & Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-neutral-300 text-sm space-y-1">
                <li>2–4 hours on site</li>
                <li>Next-day selects</li>
                <li>Online gallery + downloads</li>
              </ul>
              <p className="mt-4 text-neutral-200">From £300</p>
              <Button variant="secondary" className="mt-4">Enquire</Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Prints</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300 text-sm">All prints available via my Clickasnap shop.</p>
              <a href={site.social.clickasnap} target="_blank" rel="noreferrer">
                <Button className="mt-4" variant="secondary">
                  Shop prints on Clickasnap
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">About Joe</h2>
            <p className="text-neutral-300 mt-3 leading-relaxed">
              Picked up a camera in 2015, got serious in 2016 with a photography diploma. What started as a hobby turned into a full-blown obsession.
              <br /><br />
              I chase light, landscapes, macro worlds, and the occasional dog portrait. No single genre holds me down—nature, architecture, wildlife, macro—if it looks good, it’s fair game.
              <br /><br />
              My aim? To pause time. A dew-covered petal, mist rolling over Cambridge, a split-second that vanishes before you even notice it. Tiny worlds, big feelings, and sometimes just a good excuse to step away from the screen.
              <br /><br />
              Want something on your walls or screens? Prints, canvases, and downloads are ready. Browse the feed, pick a favourite, or surprise yourself. Dreaming of a gallery show someday—and stubborn enough to make it happen.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Card className="rounded-2xl">
                <CardContent className="p-4">
                  <p className="text-sm text-neutral-400">Based in</p>
                  <p className="text-lg">{site.location}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-4">
                  <p className="text-sm text-neutral-400">Turnaround</p>
                  <p className="text-lg">3–7 days</p>
                </CardContent>
              </Card>
            </div>

            <a href={site.social.clickasnap} target="_blank" rel="noreferrer" className="inline-block mt-6">
              <Button variant="secondary" className="gap-2">
                View full Clickasnap <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>

          {/* Portrait + small wordmark */}
          <div className="flex md:justify-end justify-center">
            <div className="flex flex-col items-center gap-3">
              <img
                src="/photos/me.jpg"
                alt="Portrait of Joe Rey"
                className="portrait"
                referrerPolicy="no-referrer"
                onError={onImgError}
              />
              <JRLogo className="h-8 w-auto text-neutral-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 bg-neutral-900/40 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-semibold">Let’s make something good</h2>
              <p className="text-neutral-400 mt-2 max-w-2xl">
                Drop your idea, dates, and any reference images. I’ll reply within 24 hours.
              </p>

              <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="Your name" required />
                <Input type="email" placeholder="Email address" required />
                <Input className="sm:col-span-2" placeholder="Subject" />
                <Textarea className="sm:col-span-2" rows={5} placeholder="Tell me about the shoot…" />
                <Button type="submit">Send inquiry</Button>
                <p className="text-neutral-400 text-sm sm:col-span-2">
                  Or email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>
                </p>
              </form>
            </div>

            <div className="sm:col-span-2 lg:col-span-1 flex items-center gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Mail className="h-4 w-4" />
                  <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <MapPin className="h-4 w-4" />
                  <span>{site.location}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <ExternalLink className="h-4 w-4" />
                  <a className="underline" href={site.social.clickasnap} target="_blank" rel="noreferrer">
                    Clickasnap
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-base">{images[index]?.alt}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <img
              src={images[index]?.src ?? FALLBACK_IMG}
              alt={images[index]?.alt ?? ""}
              className="w-full max-h-[70vh] object-contain"
              referrerPolicy="no-referrer"
              onError={onImgError}
            />
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIndex((i) => (i + 1) % images.length)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-sm text-neutral-400">
            <span>{images[index]?.category}</span>
            <a
              href={images[index]?.page}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              View on Clickasnap <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}