"use client";
import { useEffect } from "react";

export default function Clarity() {
  useEffect(() => {
    interface ClarityWindow extends Window {
      clarity?: {
        q: any[][];
      };
      [key: string]: any;
    }

    (function (c: ClarityWindow, l: Document, a: string, r: string, i: string) {
      c[a] =
        c[a] ||
        function (...args: any[]) {
          (c[a].q = c[a].q || []).push(args);
        };
      const t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = "https://www.clarity.ms/tag/" + i + "?ref=bwt";
      const y = l.getElementsByTagName(r)[0];
      if (y && y.parentNode) y.parentNode.insertBefore(t, y);
    })(window as unknown as ClarityWindow, document, "clarity", "script", "u1v9a1h2ti");
  }, []);

  return null;
}
