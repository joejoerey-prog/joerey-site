"use client";
import { useEffect } from "react";

export default function Clarity() {
  useEffect(() => {
    type ClarityFunction = (...args: unknown[]) => void;

    interface ClarityWindow extends Window {
      clarity?: {
        q: unknown[][];
      };
      [key: string]: unknown;
    }

    (function (c: ClarityWindow, l: Document, a: string, r: string, i: string) {
      c[a] =
        (c[a] as ClarityFunction) ||
        function (...args: unknown[]) {
          if (!c.clarity) {
            c.clarity = { q: [] };
          }
          c.clarity.q.push(args);
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
