"use client";
import { useEffect } from "react";

export default function MailerLite() {
  useEffect(() => {
    // Inject MailerLite Universal script once on client mount
    if (document.querySelector('script[src*="mailerlite.com/js/universal"]')) {
      return; // already loaded
    }

    (function (w: any, d: Document, e: string, u: string, f: string, l?: HTMLScriptElement, r?: Element | null) {
      w[f] = w[f] || function () {
        (w[f].q = w[f].q || []).push(arguments);
      };
      l = d.createElement(e) as HTMLScriptElement;
      l.async = true;
      l.src = u;
      l.onload = function () {
        w[f]("account", "2297236");
      };
      r = d.getElementsByTagName(e)[0];
      if (r && r.parentNode) r.parentNode.insertBefore(l, r);
    })(window, document, "script", "https://assets.mailerlite.com/js/universal.js", "ml");
  }, []);

  return null;
}
