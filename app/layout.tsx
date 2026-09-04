import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Clarity from "@/app/clarity";
import MailerLite from "@/app/mailerlite";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  title: "Joe Rey Photography",
  description: "Photography portfolio by Joe Rey — landscapes, macro, and creative portraits.",
  metadataBase: new URL("https://joereyphotography.com"),
  openGraph: {
    title: "Joe Rey Photography",
    description: "Explore the photography portfolio of Joe Rey — nature, macro, and landscapes.",
    url: "https://joereyphotography.com",
    siteName: "Joe Rey Photography",
    images: [
      {
        url: "/photos/joe-rey-portrait.jpg",
        alt: "Joe Rey Photography portfolio cover",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Umami Cloud Analytics */}
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="c497ce05-8146-4b84-bd17-164820bb26fa"
        ></script>
      </head>
      <body className="antialiased">
        <Clarity />
        <MailerLite />
        <Header />
        {children}
        <Footer />
        <SpeedInsights />
        {GTM_ID ? <GoogleTagManager gtmId={GTM_ID} /> : null}
        {GA_ID && !GTM_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}

