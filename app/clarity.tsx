"use client";
import { useEffect } from "react";

export default function Clarity() {
  useEffect(() => {
    (function (c: any, l: Document, a: string, r: string, i: string) {
      (c[a] =
        c[a] ||
        function (...args: any[]) {
          (c[a].q = c[a].q || []).push(args);
        });
      const t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = "https://www.clarity.ms/tag/" + i + "?ref=bwt";
      const y = l.getElementsByTagName(r)[0];
      if (y && y.parentNode) y.parentNode.insertBefore(t, y);
    })(window as any, document, "clarity", "script", "u1v9a1h2ti");
  }, []);

  return null;
}
