"use client";
import { useEffect } from "react";

export default function MailerLite() {
  useEffect(() => {
    // Guard against double-injection on React hot reload
    if (document.querySelector('script[src*="mailerlite.com/js/universal"]')) {
      return;
    }

    // Pre-populate the ml queue so processQueue() has the account call
    // ready before universal.js runs its init() → fetchPopupsAndPromotions()
    (window as any).ml =
      (window as any).ml ||
      function (...args: unknown[]) {
        ((window as any).ml.q = (window as any).ml.q || []).push(args);
      };
    (window as any).ml("account", "2297236");

    // Inject universal.js — the #account= fragment also lets
    // parseAccountIdFromSrcAttribute() pick it up synchronously during init()
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://assets.mailerlite.com/js/universal.js#account=2297236";
    const first = document.getElementsByTagName("script")[0];
    if (first && first.parentNode) {
      first.parentNode.insertBefore(script, first);
    } else {
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
