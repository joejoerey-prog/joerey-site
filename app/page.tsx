'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { ExternalLink } from 'lucide-react';

/* ---------- types ---------- */
type GalleryImage = { src: string; page: string; alt: string };

/* ---------- helpers ---------- */
const FALLBACK_IMG =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src !== FALLBACK_IMG) {
    img.src = FALLBACK_IMG;
    img.style.background = 'linear-gradient(135deg,#222,#333)';
    img.style.objectFit = 'cover';
  }
}

/** Fetch gallery.json (client-side). If anything fails, return a tiny fallback. */
function useRemoteGallery(url: string) {
  const [items, setItems] = useState<GalleryImage[]>([]);

  useEffect(() => {
    let alive = true;
    fetch(url, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((arr: GalleryImage[]) => {
        if (alive && Array.isArray(arr)) setItems(arr);
      })
      .catch(() => {
        // single safe fallback item so the grid never renders empty
        setItems([
          {
            src: '/photos/leaf-macro.jpg',
            page: 'https://www.clickasnap.com/image/11925045',
            alt: 'Leaf in detail — macro venation',
          },
        ]);
      });
    return () => {
      alive = false;
    };
  }, [url]);

  return items;
}

/* ---------- site data ---------- */
const site = {
  name: 'Joe Rey Photography',
  location: 'Cambridgeshire, UK',
  email: 'joereyphotography@hotmail.com',
  social: {
    instagram: 'https://instagram.com/joe.rey.photography',
    clickasnap: 'https://www.clickasnap.com/profile/joereyphotos',
  },
  hero: {
    image: '/photos/Gap.jpg', // make sure this file exists
    headline: 'Story-driven images that actually feel like the moment',
    sub: 'A tight selection from my Clickasnap uploads — refreshed as I add more.',
    ctaPrimary: { label: 'View portfolio', href: '#portfolio' },
    ctaSecondary: { label: 'Book a shoot', href: '#contact' },
  },
};

export default function Page() {
  const gallery = useRemoteGallery('/gallery.json');

  // lightbox state
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // keyboard close / next / prev when lightbox is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowRight')
        setIndex((i) => (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft')
        setIndex((i) => (i - 1 + gallery.length) % gallery.length);
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, gallery.length]);

  return (
    <main className="min-h-dvh bg-neutral-950 text-neutral-100">
      {/* Fixed header (nav) */}
      <Header />

      {/* Hero */}
      <section id="hero" className="relative w-full h-[72vh] sm:h-[78vh] md:h-[82vh] flex items-center justify-center">
        {/* hero image */}
        <img
          src={site.hero.image}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={onImgError}
        />
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* BIG logo on the photo (top-left on the image area) */}
        <img
          src="/photos/logo.png"            // <- put your PNG at public/photos/logo.png
          alt="Joe Rey Photography logo"
          className="absolute top-16 left-6 sm:left-10 w-[180px] sm:w-[220px] md:w-[260px] drop-shadow-lg"
          referrerPolicy="no-referrer"
          onError={onImgError}
        />

   <section
  className="hero"
  style={{
    backgroundImage: `url(${site.hero.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* optional logo */}
  {/* <img src="/file.svg" alt="Joe Rey Photography" className="logo" /> */}

  <div className="text-wrap">
    <h1>{site.hero.headline}</h1>
    <p>{site.hero.sub}</p>
  </div>

  <div className="cta-row">
    <a className="btn" href={site.hero.ctaPrimary.href}>
      {site.hero.ctaPrimary.label}
    </a>
    <a className="btn" href={site.hero.ctaSecondary.href}>
      {site.hero.ctaSecondary.label}
    </a>
  </div>
</section>

      {/* ---- PORTFOLIO ---- */}
      <section
        id="portfolio"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">Featured portfolio</h2>
        <p className="text-neutral-400 mt-2">
          A small selection. Each image opens a larger preview; click through to
          Clickasnap for the full post.
        </p>

        <div className="portfolio-grid">
          {Array.isArray(gallery) &&
            gallery.map((img, i) => (
              <a
                key={i}
                href={img.page}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-xl ring-1 ring-neutral-800"
                onClick={(e) => {
                  e.preventDefault();
                  setIndex(i);
                  setOpen(true);
                }}
                title="Open larger preview (then view on Clickasnap)"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                  onError={onImgError}
                  loading="lazy"
                />
                <div className="px-3 py-2 text-sm text-neutral-300">
                  {img.alt}
                </div>
              </a>
            ))}
        </div>

        {/* View full profile button */}
        <div className="mt-8">
          <a
            href={site.social.clickasnap}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white"
          >
            View full Clickasnap profile
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ---- ABOUT ---- */}
      <section
        id="about"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">About Joe</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-4 text-neutral-300">
            <p>
              Picked up a camera in 2015, got serious in 2016 with a photography
              diploma. What started as a hobby turned into a full-blown
              obsession.
            </p>
            <p>
              I chase light, landscapes, macro worlds, and the occasional dog
              portrait. No single genre holds me down—nature, architecture,
              wildlife, macro—if it looks good, it’s fair game.
            </p>
            <p>
              My aim? To pause time. A dew-covered petal, mist rolling over
              Cambridge, a split-second that vanishes before you even notice it.
              Tiny worlds, big feelings, and sometimes just a good excuse to
              step away from the screen.
            </p>
            <p>
              Want something on your walls or screens? Prints, canvases, and
              downloads are ready. Browse the feed, pick a favourite, or surprise
              yourself. Dreaming of a gallery show someday—and stubborn enough to
              make it happen.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl ring-1 ring-neutral-800 p-4">
                <p className="text-sm text-neutral-400">Based in</p>
                <p className="text-lg">{site.location}</p>
              </div>
              <div className="rounded-2xl ring-1 ring-neutral-800 p-4">
                <p className="text-sm text-neutral-400">Turnaround</p>
                <p className="text-lg">3–7 days</p>
              </div>
            </div>

            <a
              href={site.social.clickasnap}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white"
            >
              View full Clickasnap profile
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Portrait / BTS */}
          <div className="relative">
            <img
              src="/photos/me.jpg" // put a portrait at public/photos/me.jpg
              alt="Portrait of Joe Rey"
              className="w-full h-96 object-cover rounded-2xl ring-1 ring-neutral-800"
              referrerPolicy="no-referrer"
              onError={onImgError}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ---- CONTACT ---- */}
      <section
        id="contact"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-800"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">Let’s make something good</h2>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* simple “send inquiry” form (no backend; it’s just UI) */}
          <form
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const name = (form.elements.namedItem('name') as HTMLInputElement)?.value || '';
              const email = (form.elements.namedItem('email') as HTMLInputElement)?.value || '';
              const subject = (form.elements.namedItem('subject') as HTMLInputElement)?.value || '';
              const msg = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || '';
              const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
              const subjectEnc = encodeURIComponent(subject || 'Enquiry from joerey-site');
              window.location.href = `mailto:${site.email}?subject=${subjectEnc}&body=${body}`;
            }}
          >
            <input
              name="name"
              placeholder="Your name"
              required
              className="px-3 py-2 rounded-lg bg-neutral-900 ring-1 ring-neutral-800"
            />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
              className="px-3 py-2 rounded-lg bg-neutral-900 ring-1 ring-neutral-800"
            />
            <input
              name="subject"
              placeholder="Subject"
              className="sm:col-span-2 px-3 py-2 rounded-lg bg-neutral-900 ring-1 ring-neutral-800"
            />
            <textarea
              name="message"
              rows={5}
              placeholder="Tell me about the shoot…"
              className="sm:col-span-2 px-3 py-2 rounded-lg bg-neutral-900 ring-1 ring-neutral-800"
            />
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200"
              >
                Send inquiry
              </button>
            </div>
          </form>

          {/* quick contact cards */}
          <div className="space-y-3">
            <div className="rounded-2xl ring-1 ring-neutral-800 p-4">
              <p className="text-sm text-neutral-400">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="underline"
              >
                {site.email}
              </a>
            </div>
            <div className="rounded-2xl ring-1 ring-neutral-800 p-4">
              <p className="text-sm text-neutral-400">Based in</p>
              <p className="text-lg">{site.location}</p>
            </div>
            <div className="rounded-2xl ring-1 ring-neutral-800 p-4">
              <p className="text-sm text-neutral-400 mb-1">Links</p>
              <div className="flex flex-col gap-2">
                <a href={site.social.instagram} target="_blank" rel="noreferrer" className="underline">
                  Instagram
                </a>
                <a href={site.social.clickasnap} target="_blank" rel="noreferrer" className="underline">
                  Clickasnap
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Lightbox overlay ---- */}
      {open && gallery[index] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <img
            src={gallery[index].src}
            alt={gallery[index].alt}
            className="max-w-[90vw] max-h-[80vh] object-contain"
            referrerPolicy="no-referrer"
            onError={onImgError}
          />
        </div>
  )}
</main>
);
}