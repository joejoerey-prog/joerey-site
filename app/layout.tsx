import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Joe Rey Photography",
  description:
    "Photography by Joe Rey — landscapes, stillness, weather, and memory.",
  metadataBase: new URL("https://www.joereyphotography.com"),
};

export const viewport: Viewport = {
  themeColor: "#3b2f2f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable}`}>
      <head>
        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M4MY7K2G4B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M4MY7K2G4B', {
              page_path: window.location.pathname,
            });
            console.log("✅ Google Analytics loaded and tracking page:", window.location.pathname);
          `}
        </Script>
      </head>
      <body className="min-h-dvh bg-[#3b2f2f] text-[#f5efe7] flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}