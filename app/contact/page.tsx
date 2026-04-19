import { Metadata } from "next";
import Link from "next/link";
import { Mail, Instagram, Globe } from "lucide-react";
import { FaPinterestP } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contact – Joe Rey Photography",
  description: "Get in touch with Joe Rey Photography via email or social media.",
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-foreground">
      <h1 className="text-3xl font-semibold mb-6">Contact</h1>

      <p className="mb-6 text-lg">
        If you’d like to get in touch, you can reach me directly at{" "}
        <Link
          href="mailto:joereyphotography@hotmail.com"
          className="text-foreground-muted hover:text-foreground underline decoration-border underline-offset-4"
        >
          joereyphotography@hotmail.com
        </Link>
        .
      </p>

      <p className="mb-4 text-lg">You can also find me here:</p>

      <ul className="space-y-3 text-lg">
        <li>
          <Link
            href="https://www.instagram.com/joe.rey.photography/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-foreground-muted hover:text-foreground"
          >
            <Instagram size={22} />
            Instagram
          </Link>
        </li>

        <li>
          <Link
            href="https://bsky.app/profile/joereyphotos.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-foreground-muted hover:text-foreground"
          >
            <Globe size={22} />
            Bluesky
          </Link>
        </li>

        <li>
          <Link
            href="https://uk.pinterest.com/joesphotos1968/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-foreground-muted hover:text-foreground"
          >
            <FaPinterestP size={22} />
            Pinterest
          </Link>
        </li>
      </ul>
    </main>
  );
}
