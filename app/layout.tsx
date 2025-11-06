import type { Metadata } from "next";
import "./globals.css";
import Clarity from "../clarity";

export const metadata: Metadata = {
  title: "Joe Rey Photography",
  description: "Photography portfolio by Joe Rey — landscapes, macro, and creative portrait work.",
  metadataBase: new URL("https://joereyphotography.com"),
  openGraph: {
    title: "Joe Rey Photography",
    description: "Explore the photography portfolio of Joe Rey — nature, macro, and landscape shots.",
    url: "https://joereyphotography.com",
    siteName: "Joe Rey Photography",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Joe Rey Photography portfolio cover",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
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
        {/* Microsoft Clarity script */}
        <Clarity />
      </head>
      <body>{children}</body>
    </html>
  );
}
