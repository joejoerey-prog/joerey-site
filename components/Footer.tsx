'use client';

import React from "react";
import { Instagram, Facebook, Mail } from "lucide-react";
import Link from "next/link";
import { event as gaEvent } from "@/lib/gtag";

export default function Footer() {
  return (
    <footer className="py-12 text-center flex flex-col items-center gap-6 border-t border-border bg-background">
      {/* Social Links */}
      <div className="flex items-center gap-6">
        <Link
          href="https://instagram.com/joe.rey.photography"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-muted hover:text-accent transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={20} />
        </Link>
        <Link
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-muted hover:text-accent transition-colors"
          aria-label="Facebook"
        >
          <Facebook size={20} />
        </Link>
        <Link
          href="mailto:joereyphotography@hotmail.com"
          className="text-foreground-muted hover:text-accent transition-colors"
          aria-label="Email"
          onClick={() => gaEvent("email_click", { location: "footer" })}
        >
          <Mail size={20} />
        </Link>
      </div>

      <div className="text-foreground-muted text-sm">
        © {new Date().getFullYear()} Joe Rey Photography. All rights reserved.
      </div>
      <div className="text-foreground-muted text-xs">
        Built with passion for nature and light.
      </div>
    </footer>
  );
}
