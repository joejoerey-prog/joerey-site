export const GA_ID: string = process.env.NEXT_PUBLIC_GA_ID ?? "";

if (!GA_ID && process.env.NODE_ENV === "development") {
  console.warn("NEXT_PUBLIC_GA_ID is not set");
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export const pageview = (url: string) => {
  if (!GA_ID || typeof window === "undefined") return;
  window.gtag("config", GA_ID, { page_path: url });
};
