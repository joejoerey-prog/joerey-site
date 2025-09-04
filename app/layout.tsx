// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-M4MY7K2G4B" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-M4MY7K2G4B');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
