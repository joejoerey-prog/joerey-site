'use client';

import React, { useEffect, useMemo } from 'react';
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
  const [items, setItems] = React.useState<GalleryImage[]>([]);
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    fetch(url, { cache: 'no-store', signal: controller.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then((arr: GalleryImage[]) => {
        if (alive && Array.isArray(arr)) setItems(arr);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        // minimal safe fallback so the page is never empty
        setItems([
          {
            src: '/photos/leaf-macro.jpg',
            page: 'https://www.clickasnap.com/',
            alt: 'Leaf macro',
          },
        ]);
      });
    return () => {
      alive = false;
      controller.abort();
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
    image: '/photos/Gap.jpg', // keep this in /public/photos
    logo: '/photos/logo.png', // top-left logo
    headline: 'UK landscapes, cityscapes, macro, prints',
    sub: 'A hand-picked set of favourites from my Clickasnap portfolio.',
    ctaPrimary: { label: 'View portfolio', href: '#portfolio' },
    ctaSecondary: { label: 'Book a shoot', href: '#contact' },
  },
};

export default function Page() {
  const gallery = useRemoteGallery('/gallery.json');

  // strictly pick the first 9 valid local images
  const topNine = useMemo(() => {
    return gallery
      .filter(g => g && g.src && g.page && g.alt)
      .slice(0, 9);
  }, [gallery]);

  return (
    <main className="min-h-dvh bg-neutral-950 text-neutral-100">
      <Header />

     {/* ===== HERO ===== */}
<section
  id="hero"
  className="relative w-full h-[72vh] sm:h-[78vh] md:h-[82vh] flex flex-col items-center justify-center text-center text-white"
  style={{
    backgroundImage: `url(${site.hero.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* dark overlay */}
  <div className="absolute inset-0 bg-black/50" />

  {/* logo top-left */}
  <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-10">
    <Image
      src="/photos/logo.png"
      alt="Joe Rey Photography"
      width={260}
      height={60}
      className="w-[140px] sm:w-[200px] md:w-[260px] h-auto"
      priority
    />
  </div>

  {/* hero text + buttons */}
  <div className="relative z-10 max-w-3xl px-6 pt-24 sm:pt-0">
    <h1 className="text-3xl sm:text-5xl font-bold">
      <span className="block">{site.name}</span>
      <span className="block">{site.hero.headline}</span>
    </h1>
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

      {/* ===== PORTFOLIO (3×3 squares) ===== */}
      <section
        id="portfolio"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">Featured portfolio</h2>
       

        {/* 3x3: on laptop/desktop 3 columns; on tablet 2; on phone 1 */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topNine.map((img, i) => (
            <a
              key={i}
              href={img.page}
              target="_blank"
              rel="noreferrer"
              className="group block relative w-full pb-[100%] overflow-hidden rounded-2xl ring-1 ring-neutral-800"
              title="Open on Clickasnap"
            >
              {/* square via pb-[100%], image fills via fill */}
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
          {/* If fewer than 9 items, we just render what we have. No blank boxes, no lies. */}
        </div>

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

      {/* ===== ABOUT ===== */}
      <section
        id="about"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">About Joe</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-4 text-neutral-300">
            <p>
              Picked up a camera in 2015, got serious in 2016 with a photography diploma.
              What started as a hobby turned into a full-blown obsession.
            </p>
            <p>
              I chase light, landscapes, macro worlds, and the occasional dog portrait.
              No single genre holds me down — nature, architecture, wildlife, macro —
              if it looks good, it’s fair game.
            </p>
            <p>
              My aim? To pause time. A dew-covered petal, mist rolling over Cambridge,
              a split-second that vanishes before you even notice it.
            </p>
            <p>
              Want something on your walls or screens? Prints, canvases, and downloads are ready.
              Browse the feed, pick a favourite, or surprise yourself.
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

          <div className="relative w-full h-96">
            <Image
              src="/photos/me.jpg"
              alt="Portrait of Joe Rey"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover rounded-2xl ring-1 ring-neutral-800"
              priority={false}
            />
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section
        id="contact"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-800"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">Let’s make something good</h2>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* no backend: just opens mail client */}
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
            <input name="name" placeholder="Your name" required className="px-3 py-2 rounded-lg bg-neutral-900 ring-1 ring-neutral-800" />
            <input name="email" type="email" placeholder="Email address" required className="px-3 py-2 rounded-lg bg-neutral-900 ring-1 ring-neutral-800" />
            <input name="subject" placeholder="Subject" className="sm:col-span-2 px-3 py-2 rounded-lg bg-neutral-900 ring-1 ring-neutral-800" />
            <textarea name="message" rows={5} placeholder="Tell me about the shoot…" className="sm:col-span-2 px-3 py-2 rounded-lg bg-neutral-900 ring-1 ring-neutral-800" />
            <div className="sm:col-span-2">
              <button type="submit" className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200">
                Send inquiry
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <div className="rounded-2xl ring-1 ring-neutral-800 p-4">
              <p className="text-sm text-neutral-400">Email</p>
              <a href={`mailto:${site.email}`} className="underline">{site.email}</a>
            </div>
            <div className="rounded-2xl ring-1 ring-neutral-800 p-4">
              <p className="text-sm text-neutral-400">Based in</p>
              <p className="text-lg">{site.location}</p>
            </div>
            <div className="rounded-2xl ring-1 ring-neutral-800 p-4">
              <p className="text-sm text-neutral-400 mb-1">Links</p>
              <div className="flex flex-col gap-2">
                <a href={site.social.instagram} target="_blank" rel="noreferrer" className="underline">Instagram</a>
                <a href={site.social.clickasnap} target="_blank" rel="noreferrer" className="underline">Clickasnap</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}