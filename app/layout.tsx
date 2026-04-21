import type { Metadata } from "next";
import { Pacifico } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Clarity from "@/app/clarity";
import { SpeedInsights } from "@vercel/speed-insights/next";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

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
        url: "/photos/land-light/rapeseed-gold.jpg",
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
      <body className={`${pacifico.variable} antialiased`}>
        <Clarity />
        <Header />
        {children}
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
