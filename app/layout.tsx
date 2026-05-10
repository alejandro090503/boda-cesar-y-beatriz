import type { Metadata } from "next";
import { Cormorant_Garamond, Inter_Tight, Great_Vibes } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "César & Beatriz · 10 Octubre 2026 · Tapaxco",
  description: "Nos casamos · Sábado 10 de octubre de 2026 · Tapaxco, El Oro, Estado de México",
  openGraph: {
    title: "César & Beatriz · 10 Octubre 2026",
    description: "Nuestra boda · Sábado 10 de octubre de 2026 · Tapaxco, Estado de México",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${interTight.variable} ${greatVibes.variable}`}>
      <body>{children}</body>
    </html>
  );
}
