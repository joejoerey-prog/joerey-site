// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  description: "Story-driven images that actually feel like the moment.",
  metadataBase: new URL("https://www.joereyphotography.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Joe Rey Photography",
    description: "Story-driven images that actually feel like the moment.",
    url: "https://www.joereyphotography.com",
    siteName: "Joe Rey Photography",
    // your logo as the preview image
    images: [{ url: "/photos/logo.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joe Rey Photography",
    description: "Story-driven images that actually feel like the moment.",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}