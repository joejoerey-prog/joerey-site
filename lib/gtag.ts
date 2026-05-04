export const GA_ID: string = process.env.NEXT_PUBLIC_GA_ID ?? "";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const pageview = (url: string) => {
  if (!GA_ID || typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("config", GA_ID, { page_path: url });
};

type EventParams = Record<string, string | number | boolean | undefined>;

export const event = (name: string, params: EventParams = {}) => {
  if (!GA_ID || typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
};
