// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Analytics from "@/components/Analytics";
import * as gtag from "@/lib/gtag";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Joe Rey Photography",
  description: "Joe Rey Photography | UK landscapes, cityscapes, macro, prints",
  metadataBase: new URL("https://www.joereyphotography.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Joe Rey Photography",
    description: "Joe Rey Photography | UK landscapes, cityscapes, macro, prints",
    url: "https://www.joereyphotography.com",
    siteName: "Joe Rey Photography",
    // your logo as the preview image
    images: [{ url: "/photos/logo.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joe Rey Photography",
    description: "Joe Rey Photography | UK landscapes, cityscapes, macro, prints",
    images: ["/photos/logo.png"],
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
        {gtag.GA_ID && (
          <>
            <Script
              id="ga-loader"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_ID}`}
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gtag.GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {gtag.GA_ID && <Analytics />}
        {children}
      </body>
    </html>
  );
}
