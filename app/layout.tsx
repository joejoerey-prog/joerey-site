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
  title: "Joe Rey Photography | UK & Europe landscapes, cityscapes, macro, prints",
  description:
    "Photography across the UK & Europe: landscapes, cityscapes, and macro. Browse galleries, order prints, or book a session.",
  metadataBase: new URL("https://www.joereyphotography.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Joe Rey Photography | UK & Europe landscapes, cityscapes, macro, prints",
    description:
      "Photography across the UK & Europe: landscapes, cityscapes, and macro. Browse galleries, order prints, or book a session.",
    url: "https://www.joereyphotography.com",
    siteName: "Joe Rey Photography",
    images: [{ url: "/photos/logo.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joe Rey Photography | UK & Europe landscapes, cityscapes, macro, prints",
    description:
      "Photography across the UK & Europe: landscapes, cityscapes, and macro. Browse galleries, order prints, or book a session.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}