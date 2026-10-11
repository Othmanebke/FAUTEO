import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fauteo — Louez un poste équipé près de chez vous",
    template: "%s · Fauteo",
  },
  description:
    "Fauteo met en relation salons, barbershops, instituts, ongleries et shops de tatouage avec des professionnels indépendants qui louent un poste équipé à l'heure, à la journée, à la semaine ou au mois.",
  applicationName: "Fauteo",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1917" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} h-full scroll-smooth`}>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
