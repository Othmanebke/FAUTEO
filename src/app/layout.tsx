import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
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

// Mode clair forcé : les maquettes sont en clair, quel que soit le réglage du système
export const viewport: Viewport = {
  themeColor: "#fff9f5",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} light h-full scroll-smooth`} style={{ colorScheme: "light" }}>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink antialiased">
        <FavoritesProvider>{children}</FavoritesProvider>
      </body>
    </html>
  );
}
