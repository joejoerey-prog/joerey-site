'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { ExternalLink } from 'lucide-react';

/* ---------- types ---------- */
type GalleryImage = { src: string; page: string; alt: string };

/* ---------- tiny helper ---------- */
function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

/* ---------- fetch gallery.json (client-side) ---------- */
function useRemoteGallery(url: string) {
  const [items, setItems] = useState<GalleryImage[]>([]);
  useEffect(() => {
    let alive = true;
    fetch(url, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then((arr: GalleryImage[]) => {
        if (alive && Array.isArray(arr)) setItems(arr);
      })
      .catch(() => {
        // minimal safe fallback so the page is never empty
        setItems([
          {
            src: '/photos/leaf-macro.jpg',
            page: 'https://www.clickasnap.com/',
            alt: 'Dew on leaf, UK, close-up detail',
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
    image: '/photos/Gap.jpg',
    logo: '/photos/logo.png',
    headline: 'Photography across the UK & Europe',
    sub: 'Landscapes, cityscapes, and macro — curated favourites. Prints and downloads available.',
    ctaPrimary: { label: 'View portfolio', href: '#portfolio' },
    ctaSecondary: { label: 'Book a shoot', href: '#contact' },
  },
};

export default function Page() {
  const gallery = useRemoteGallery('/gallery.json');

  // exactly first 9 valid items
  const topNine = useMemo(
    () => gallery.filter(g => g && g.src && g.page && g.alt).slice(0, 9),
    [gallery]
  );

  return (
    <main className="min-h-dvh bg-neutral-950 text-neutral-100">
      <Header />

      {/* ===== HERO ===== */}
      <section
        id="hero"
        className="relative w-full h-[72vh] sm:h-[78vh] md:h-[82vh] flex flex-col items-center justify-center text-center text-white"
        aria-label="Hero"
        style={{
          backgroundImage: `url(${site.hero.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        {/* logo top-left */}
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-10">
          <Image
            src={site.hero.logo}
            alt="Joe Rey Photography logo"
            width={260}
            height={60}
            className="w-[140px] sm:w-[200px] md:w-[260px] h-auto"
            priority
          />
        </div>

        {/* hero text + buttons */}
        <div className="relative z-10 max-w-3xl px-6 pt-24 sm:pt-0">
          <h1 className="text-3xl sm:text-5xl font-bold">{site.hero.headline}</h1>
          <p className="mt-3 text-lg text-neutral-300">{site.hero.sub}</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              className="btn bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-neutral-200"
              href={site.hero.ctaPrimary.href}
            >
              {site.hero.ctaPrimary.label}
            </a>
            <a
              className="btn bg-neutral-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-800"
              href={site.hero.ctaSecondary.href}
            >
              {site.hero.ctaSecondary.label}
            </a>
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO (exact 3×3, tidy spacing) ===== */}
      <section
        id="portfolio"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        aria-label="Featured portfolio"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">Featured portfolio</h2>
        <p className="text-neutral-400 mt-2">Three rows of three. Click a tile to view on Clickasnap.</p>

        {/* fixed 3 columns at all sizes for a strict 3×3 */}
        <div className="mt-8 grid grid-cols-3 gap-5">
          {topNine.map((img, i) => (
            <a
              key={i}
              href={img.page}
              target="_blank"
              rel="noreferrer"
              className="group relative block w-full pb-[100%] overflow-hidden rounded-2xl ring-1 ring-neutral-800"
              title="Open on Clickasnap"
            >
              {/* square via padding trick; image fills via fill */}
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="33vw"
                priority={i < 3}
              />
              <span
                className={classNames(
                  'pointer-events-none absolute inset-x-0 bottom-0 p-3 text-sm',
                  'bg-gradient-to-t from-black/60 to-transparent text-neutral-200'
                )}
              >
                {img.alt}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section
        id="about"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        aria-label="About Joe"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">About Joe</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-4 text-neutral-300">
            <p>
              I’m Joe Rey, a UK photographer travelling across the UK and Europe. I started in 2015,
              earned a photography diploma in 2016, and never looked back.
            </p>
            <p>
              My work covers landscapes, cityscapes, macro, architecture, animals, and the occasional
              dog portrait. If it looks good, it’s fair game.
            </p>
            <p>
              I aim to capture moments that would otherwise disappear: dawn light on mountain lakes,
              mist on city streets, or a dew-covered flower.
            </p>
            <p>
              This site is my portfolio and print shop. You’ll find galleries of landscapes, macro studies,
              and city views — available as prints, canvases, and downloads.
            </p>

            {/* info cards: bigger "Based in" box and even card heights */}
            <div className="grid grid-cols-2 gap-4 items-stretch">
              <div className="col-span-2 sm:col-span-1 rounded-2xl ring-1 ring-neutral-800 p-5 min-h-[96px] flex flex-col justify-center">
                <p className="text-sm text-neutral-400">Based in</p>
                <p className="text-xl leading-tight">{site.location}</p>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-2xl ring-1 ring-neutral-800 p-5 min-h-[96px] flex flex-col justify-center">
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

          <div className="relative w-full h-96">
            <Image
              src="/photos/me.jpg"
              alt="Portrait of Joe Rey"
              fill
              className="object-cover rounded-2xl ring-1 ring-neutral-800"
            />
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section
        id="contact"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-800"
        aria-label="Contact"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">Let’s make something good</h2>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* form left, cards right — make cards tidy and even */}
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
              const subjectEnc = encodeURIComponent(subject || 'Enquiry from joereyphotography.com');
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

          {/* tidy, even-height cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 items-stretch">
            <div className="rounded-2xl ring-1 ring-neutral-800 p-5 h-full flex flex-col justify-between">
              <div>
                <p className="text-sm text-neutral-400">Email</p>
                <a href={`mailto:${site.email}`} className="underline break-all">{site.email}</a>
              </div>
            </div>

            <div className="rounded-2xl ring-1 ring-neutral-800 p-5 h-full flex flex-col justify-center">
              <p className="text-sm text-neutral-400">Based in</p>
              <p className="text-lg">{site.location}</p>
            </div>

            <div className="rounded-2xl ring-1 ring-neutral-800 p-5 h-full flex flex-col">
              <p className="text-sm text-neutral-400 mb-1">Links</p>
              <div className="flex flex-col gap-2 mt-auto">
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
    </main>
  );
}