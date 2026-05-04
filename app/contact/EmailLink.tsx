"use client";

import Link from "next/link";
import { event as gaEvent } from "@/lib/gtag";

export default function EmailLink() {
  return (
    <Link
      href="mailto:joereyphotography@hotmail.com"
      onClick={() => gaEvent("email_click", { location: "contact_page" })}
      className="text-foreground-muted hover:text-foreground underline decoration-border underline-offset-4"
    >
      joereyphotography@hotmail.com
    </Link>
  );
}
