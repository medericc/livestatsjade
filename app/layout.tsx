import './globals.css';
import { Analytics } from "@vercel/analytics/react";

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


export const metadata = {
  title: "LiveStats de Jade - Dodge City",
  description: "Les livestats des matchs de Jade.",
   manifest: "/manifest.json",
  appleWebApp: {
    title: "Jade LiveStats",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "LiveStats de Jade - Dodge City",
    description: "Les livestats des matchs de Jade.",
    url: "https://jade-livestats.vercel.app/",
    siteName: "Jade Celerier LiveStats",
    images: [
      {
        url: "https://jade-livestats.vercel.app/preview.jpg",
        width: 1200,
        height: 630,
        alt: "LiveStats de Jade - Dodge City",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiveStats de Jade - Dodge City",
    description: "Le livestats des matchs de Jade.",
    images: ["https://jade-livestats.vercel.app/preview.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
          <Analytics />
      </body>
    </html>
  );
}
