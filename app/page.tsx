"use client";

import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Mail, MapPin } from "lucide-react";
import JRLogo from "@/components/ui/JRLogo";

/* -----------------------------
   Helpers
------------------------------ */

const FALLBACK_IMG =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src !== FALLBACK_IMG) {
    img.src = FALLBACK_IMG;
    img.style.background =
      "linear-gradient(135deg,#222 0%, #333 100%)";
    img.style.objectFit = "cover";
  }
}

/* -----------------------------
   Site data
------------------------------ */

const site = {
  name: "Joe Rey Photography",
  location: "Cambridgeshire, UK",
  email: "joereyphotography@hotmail.com",
  social: {
    instagram: "https://instagram.com/joe.rey.photography",
    clickasnap: "https://www.clickasnap.com/profile/joereyphotos",
  },
  hero: {
    image: "/photos/Gap.jpg",
    headline: "Story-driven images that actually feel like the moment",
    sub: "A tight selection from my Clickasnap uploads — refreshed as I add more.",
    ctaPrimary: { label: "View portfolio", href: "#portfolio" },
    ctaSecondary: { label: "Book a shoot", href: "#contact" },
  },
};

/* -----------------------------
   Page
------------------------------ */

export default function Page() {
  return (
    <main className="bg-neutral-950 text-neutral-100 min-h-dvh">
      {/* Fixed header with logo */}
      <Header />

      {/* Hero */}
   <section
  id="hero"
  className="relative w-full h-screen flex flex-col items-center justify-center pt-24"
> 
        <img
          src={site.hero.image}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={onImgError}
        />
       <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="relative z-10 max-w-3xl px-4">
          <h1 className="text-4xl sm:text-6xl font-bold text-white">
            {site.hero.headline}
          </h1>
          <p className="mt-4 text-lg text-neutral-200">{site.hero.sub}</p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href={site.hero.ctaPrimary.href}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow hover:bg-neutral-200"
            >
              {site.hero.ctaPrimary.label}
            </a>
            <a
              href={site.hero.ctaSecondary.href}
              className="px-6 py-3 bg-neutral-800 text-white font-semibold rounded-lg shadow hover:bg-neutral-700"
            >
              {site.hero.ctaSecondary.label}
            </a>
          </div>
        </div>
      </section>

      {/* Portfolio placeholder so the hero buttons work.
          You can replace this with your grid later. */}
      <section
        id="portfolio"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">Featured portfolio</h2>
        <p className="text-neutral-400 mt-2">
          Linking out to your Clickasnap shop for now.
        </p>

        <div className="mt-6">
          <a
            href={site.social.clickasnap}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
          >
            <ExternalLink className="h-4 w-4" />
            View full Clickasnap
          </a>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">About Joe</h2>
            <div className="text-neutral-300 mt-4 space-y-4 leading-relaxed">
              <p>
                Picked up a camera in 2015, got serious in 2016 with a photography
                diploma. What started as a hobby turned into a full-blown obsession.
              </p>
              <p>
                I chase light, landscapes, macro worlds, and the occasional dog portrait.
                No single genre holds me down — nature, architecture, wildlife, macro —
                if it looks good, it’s fair game.
              </p>
              <p>
                My aim? To pause time. A dew-covered petal, mist rolling over Cambridge,
                a split-second you’d otherwise miss. Tiny worlds, big feelings, and
                sometimes just a good excuse to step away from a screen.
              </p>
              <p>
                Prints, canvases, and downloads are ready. Browse the feed, pick a
                favourite, or surprise yourself. Dreaming of a gallery show someday —
                and stubborn enough to make it happen.
              </p>
            </div>

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

            <a
              href={site.social.clickasnap}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-6"
            >
              <Button variant="secondary" className="gap-2">
                View full Clickasnap <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>

          {/* Portrait + small logo */}
          <div className="flex md:justify-end justify-center">
            <div className="flex flex-col items-center gap-3">
              <img
                src="/photos/me.jpg"
                alt="Portrait of Joe Rey"
                className="w-40 h-40 object-cover rounded-full ring-2 ring-neutral-700"
                referrerPolicy="no-referrer"
                onError={onImgError}
              />
              <JRLogo className="h-8 w-auto text-neutral-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="scroll-mt-24 bg-neutral-900/40 border-t border-neutral-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-semibold">
                Let’s make something good
              </h2>
              <p className="text-neutral-400 mt-2 max-w-2xl">
                Drop your idea, dates, and any reference images. I’ll reply within 24 hours.
              </p>

              <form
                className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <Input placeholder="Your name" required />
                <Input type="email" placeholder="Email address" required />
                <Input className="sm:col-span-2" placeholder="Subject" />
                <Textarea
                  className="sm:col-span-2"
                  rows={5}
                  placeholder="Tell me about the shoot…"
                />
                <div className="sm:col-span-2 flex items-center gap-4">
                  <Button type="submit">Send inquiry</Button>
                  <p className="text-neutral-400 text-sm">
                    or email{" "}
                    <a className="underline" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </p>
                </div>
              </form>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-neutral-300">
                <Mail className="h-4 w-4" />
                <a className="underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin className="h-4 w-4" />
                <span>{site.location}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <ExternalLink className="h-4 w-4" />
                <a
                  className="underline"
                  href={site.social.clickasnap}
                  target="_blank"
                  rel="noreferrer"
                >
                  Clickasnap
                </a>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <ExternalLink className="h-4 w-4" />
                <a
                  className="underline"
                  href={site.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}