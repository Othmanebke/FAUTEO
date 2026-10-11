import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FAUTEO | Marketplace de location de postes beauté & bien-être",
  description:
    "La marketplace de référence pour louer un fauteuil ou une cabine équipée. Destinée aux coiffeurs, barbiers, tatoueurs et praticiens bien-être. Cautions sécurisées, contrats instantanés et vérification KYC.",
  keywords: [
    "location fauteuil coiffure",
    "coworking beaute",
    "cabine tatouage sterile",
    "poste barbier a louer",
    "location salon esthetique",
    "fauteo",
  ],
  authors: [{ name: "Fauteo France" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${sansFont.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-[#090a0d] text-gray-950 dark:text-gray-100 selection:bg-[#b58e6d]/30 selection:text-black">
        {children}
      </body>
    </html>
  );
}
