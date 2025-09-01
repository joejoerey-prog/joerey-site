'use client';

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
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

/* ─────────────────────────────────────────────────────────────
   Image fallback for grumpy CDNs
   ──────────────────────────────────────────────────────────── */
const FALLBACK_IMG =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.src !== FALLBACK_IMG) {
    img.src = FALLBACK_IMG;
    img.style.background = "linear-gradient(135deg,#222 0%,#333 100%)";
    img.style.objectFit = "cover";
  }
};

/* ─────────────────────────────────────────────────────────────
   Logo (simple wordmark + camera ring)
   ──────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────
   Site config
   ──────────────────────────────────────────────────────────── */
const site = {
  name: "Joe Rey Photography",
  location: "Cambridgeshire, UK",
  email: "joereyphotography@hotmail.com",
  hero: {
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop",
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

const categories = ["Landscapes", "Nature", "Macro", "Wildlife", "Transport", "Still Life"] as const;
type Category = typeof categories[number];

type GalleryImage = {
  src: string;
  page: string;
  alt: string;
  category: Category;
};

/* Featured set — leaf & thistle load locally from /public/photos */
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

/* ─────────────────────────────────────────────────────────────
   Lightbox
   ──────────────────────────────────────────────────────────── */
function Lightbox({
  open,
  onOpenChange,
  images,
  index,
  setIndex,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  images: GalleryImage[];
  index: number;
  setIndex: (n: number) => void;
}) {
  const img = images[index];
  if (!img) return null;
  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl bg-neutral-950 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-sm">{img.alt}</DialogTitle>
        </DialogHeader>
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
            <Button variant="secondary" size="icon" className="rounded-full" onClick={prev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <a href={img.page} target="_blank" rel="noreferrer">
              <Button variant="secondary" className="rounded-full gap-2">
                View on Clickasnap <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <Button variant="secondary" size="icon" className="rounded-full" onClick={next}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main page
   ──────────────────────────────────────────────────────────── */
export default function JoeReyPhotographySite() {
  const [active, setActive] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [allImages, setAllImages] = useState<GalleryImage[]>(initialImages);

  // Optional JSON feed (silenced if not present)
  useEffect(() => {
    fetch("/gallery.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length) setAllImages(data);
      })
      .catch(() => {});
  }, []);

  const images = useFilteredImages(allImages, active, query);

  return (
    <div className="bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 bg-neutral-950/75 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <JRLogo className="h-6 w-auto" />
            <Badge className="ml-2" variant="secondary">{site.location}</Badge>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#portfolio" className="hover:text-white/90">Portfolio</a>
            <a href="#services" className="hover:text-white/90">Services</a>
            <a href="#about" className="hover:text-white/90">About</a>
            <a href="#contact" className="hover:text-white/90">Contact</a>
            <a href={site.social.clickasnap} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> Shop
            </a>
            <a href={site.social.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
          </nav>
          <a href="#contact" className="hidden sm:inline-block"><Button size="sm">Book a shoot</Button></a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={site.hero.image}
            alt="Hero"
            className="w-full h-[70vh] object-cover opacity-60"
            referrerPolicy="no-referrer"
            onError={onImgError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <p className="uppercase tracking-widest text-xs text-neutral-300">{site.hero.kicker}</p>
          <h1 className="text-4xl sm:text-6xl font-bold mt-3 max-w-3xl">{site.hero.headline}</h1>
          <p className="text-neutral-300 mt-4 max-w-2xl">{site.hero.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={site.hero.ctaPrimary.href}><Button size="lg">{site.hero.ctaPrimary.label}</Button></a>
            <a href={site.hero.ctaSecondary.href}><Button size="lg" variant="secondary">{site.hero.ctaSecondary.label}</Button></a>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">Featured portfolio</h2>
            <p className="text-neutral-400 mt-1">Browse by category or search captions. Each image links back to Clickasnap.</p>
          </div>
          <div className="w-56 hidden sm:block">
            <Input
              placeholder="Search captions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant={active === "All" ? "default" : "secondary"} size="sm" onClick={() => setActive("All")}>All</Button>
          {categories.map((c) => (
            <Button key={c} variant={active === c ? "default" : "secondary"} size="sm" onClick={() => setActive(c)}>
              {c}
            </Button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.src + i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group relative"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-64 object-cover rounded-2xl ring-1 ring-neutral-800/60 group-hover:ring-neutral-400/40 transition"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={onImgError}
                onClick={() => { setIndex(i); setOpen(true); }}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <Badge variant="secondary">{img.category}</Badge>
                <div className="flex items-center gap-2">
                  <a href={img.page} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition">
                      <ExternalLink className="h-4 w-4 mr-2" /> Page
                    </Button>
                  </a>
                  <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition" onClick={() => { setIndex(i); setOpen(true); }}>
                    <ImageIcon className="h-4 w-4 mr-2" /> View
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Lightbox open={open} onOpenChange={setOpen} images={images} index={index} setIndex={setIndex} />
      </section>

      {/* Services (no portraits) */}
      <section id="services" className="scroll-mt-24 bg-neutral-900/40 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6" />
            <h2 className="text-2xl sm:text-3xl font-semibold">Services & pricing</h2>
          </div>
          <p className="text-neutral-400 mt-2 max-w-2xl">Simple packages. Travel quoted case-by-case. Prints available via Clickasnap.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Landscape & Travel Licensing</CardTitle></CardHeader>
              <CardContent className="text-neutral-300 space-y-3">
                <ul className="list-disc list-inside">
                  <li>Editorial & commercial use</li>
                  <li>High-res delivery</li>
                  <li>Fast turnaround</li>
                </ul>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-semibold">From £60</span>
                  <Button variant="secondary" asChild><a href="#contact">Enquire</a></Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl ring-1 ring-yellow-400/30">
              <CardHeader><CardTitle className="flex items-center gap-2">Brand / Content <Badge>Popular</Badge></CardTitle></CardHeader>
              <CardContent className="text-neutral-300 space-y-3">
                <ul className="list-disc list-inside">
                  <li>Half-day shoot</li>
                  <li>Short-form video clips</li>
                  <li>Usage license for socials</li>
                </ul>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-semibold">£450</span>
                  <Button variant="secondary" asChild><a href="#contact">Enquire</a></Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Aviation & Events</CardTitle></CardHeader>
              <CardContent className="text-neutral-300 space-y-3">
                <ul className="list-disc list-inside">
                  <li>2–4 hours on site</li>
                  <li>Next-day selects</li>
                  <li>Online gallery + downloads</li>
                </ul>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-semibold">From £300</span>
                  <Button variant="secondary" asChild><a href="#contact">Enquire</a></Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-10 bg-neutral-800" />

          <h3 className="text-xl font-semibold flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Prints</h3>
          <p className="text-neutral-400 mt-3">For now, all prints are available via my Clickasnap shop.</p>
          <a href={site.social.clickasnap} target="_blank" rel="noreferrer" className="inline-block mt-4">
            <Button className="gap-2" variant="secondary">Shop prints on Clickasnap <ExternalLink className="h-4 w-4" /></Button>
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">About Joe</h2>
            <p className="text-neutral-300 mt-3 leading-relaxed">
              I don’t stick to one genre — landscapes, macro, architecture, aviation — if it looks good, it’s fair game.
              Here’s a curated set from my Clickasnap uploads. For the full archive, visit my profile.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-sm text-neutral-400">Based in</p><p className="text-lg">{site.location}</p></CardContent></Card>
              <Card className="rounded-2xl"><CardContent className="p-4"><p className="text-sm text-neutral-400">Turnaround</p><p className="text-lg">3–7 days</p></CardContent></Card>
            </div>
            <a href={site.social.clickasnap} target="_blank" rel="noreferrer" className="inline-block mt-6">
              <Button variant="secondary" className="gap-2">View full Clickasnap <ExternalLink className="h-4 w-4" /></Button>
            </a>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1526178613552-2b45c6c302f1?q=80&w=1400&auto=format&fit=crop"
              alt="Behind the scenes — Joe shooting on location"
              className="w-full h-96 object-cover rounded-2xl ring-1 ring-neutral-800"
              referrerPolicy="no-referrer"
              onError={onImgError}
            />
            <Badge className="absolute top-3 left-3">BTS</Badge>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 bg-neutral-900/40 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-semibold">Let’s make something good</h2>
              <p className="text-neutral-400 mt-2 max-w-2xl">Drop your idea, dates, and any reference images. I’ll reply within 24 hours.</p>
              <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="Your name" required />
                <Input type="email" placeholder="Email address" required />
                <Input className="sm:col-span-2" placeholder="Subject" />
                <Textarea className="sm:col-span-2" rows={5} placeholder="Tell me about the shoot…" />
                <div className="sm:col-span-2 flex items-center gap-3">
                  <Button type="submit">Send inquiry</Button>
                  <p className="text-neutral-400 text-sm">Or email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
                </div>
              </form>
            </div>

            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Contact details</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-neutral-300">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
                {false && (<p className="flex items-center gap-2"><Phone className="h-4 w-4" /> <a className="underline" href="tel:">{""}</a></p>)}
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {site.location}</p>
                <Separator className="bg-neutral-800" />
                <p className="flex items-center gap-2"><Instagram className="h-4 w-4" /> <a className="underline" href={site.social.instagram} target="_blank" rel="noreferrer">Instagram</a></p>
                <p className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> <a className="underline" href={site.social.clickasnap} target="_blank" rel="noreferrer">Clickasnap</a></p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="#portfolio" className="hover:text-neutral-200">Portfolio</a>
            <a href="#services" className="hover:text-neutral-200">Services</a>
            <a href="#about" className="hover:text-neutral-200">About</a>
            <a href="#contact" className="hover:text-neutral-200">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}