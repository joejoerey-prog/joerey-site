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
  weight: "400",
  variable: "--font-pacifico",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://joereyphotography.com"),
  title: {
    default: "Joe Rey Photography",
    template: "%s | Joe Rey Photography",
  },
  description:
    "Photography by Joe Rey — landscapes, light, and stillness captured across the UK. Explore galleries and digital downloads.",
  openGraph: {
    title: "Joe Rey Photography",
    description:
      "Photography by Joe Rey — landscapes, light, and stillness captured across the UK. Explore galleries and digital downloads.",
    url: "https://joereyphotography.com",
    siteName: "Joe Rey Photography",
    images: [
      {
        url: "/photos/logo.png",
        width: 800,
        height: 800,
        alt: "Joe Rey Photography Logo",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Joe Rey Photography",
    description:
      "Photography by Joe Rey — landscapes, light, and stillness captured across the UK. Explore galleries and digital downloads.",
    images: ["/photos/logo.png"],
  },
  icons: {
    icon: "/photos/logo.png",
  },
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} bg-[#3b2f2f] text-[#f5efe7] min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <footer className="py-10 text-center text-[#f5efe7b3] text-sm border-t border-[#6b5550] w-full">
          © {new Date().getFullYear()} Joe Rey Photography
        </footer>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M4MY7K2G4B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M4MY7K2G4B');
          `}
        </Script>
      </body>
    </html>
  );
}