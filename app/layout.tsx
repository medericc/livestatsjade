import './globals.css';
import { Analytics } from "@vercel/analytics/react";
import Head from 'next/head';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from './ServiceWorkerRegister'; // 👈 ajoute cette ligne

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
    <html lang="fr">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-title" content="Jade LiveStats" />
        <meta name="theme-color" content="#1e40af" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white`}
      >
        {/* 🔴 Bandeau LIVESTATS */}
        <header className="bg-linear-to-r from-purple-700 to-purple-800 text-white p-8 text-4xl font-extrabold text-center shadow-md tracking-wider">
          LIVESTATS
        </header>

        {/* Contenu principal */}
        <main className="container mx-auto mt-4">{children}</main>

        {/* Analytics */}
        <Analytics />

        {/* ✅ Enregistrement du Service Worker */}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
