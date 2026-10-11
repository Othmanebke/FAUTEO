import { NextRequest, NextResponse } from "next/server";
import { SearchTarget, BeautyCategory } from "@/types";

// Mock backend database for immediate reactive responses
const mockChairs = [
  {
    id: "l-1",
    type: "chair",
    title: "Fauteuil Barber Cuir & Miroir Atelier",
    salonName: "Maison Barber Bastille",
    city: "Paris 11e",
    category: "barbier",
    pricePerDay: 50,
    depositAmount: 200,
    rating: 4.96,
    isVerified: true,
  },
  {
    id: "l-2",
    type: "chair",
    title: "Poste Coiffure Haute Gamme & Bac Ergonomique",
    salonName: "Atelier Saint-Honoré",
    city: "Paris 1er",
    category: "coiffure",
    pricePerDay: 65,
    depositAmount: 250,
    rating: 4.98,
    isVerified: true,
  },
  {
    id: "l-3",
    type: "chair",
    title: "Cabine Tatouage Stérile & DASRI Dédié",
    salonName: "Atelier Encre Noire",
    city: "Paris 10e",
    category: "tatouage",
    pricePerDay: 80,
    depositAmount: 350,
    rating: 5.0,
    isVerified: true,
  },
];

const mockPros = [
  {
    id: "pro-1",
    type: "pro",
    name: "Alexandre Tremblay",
    specialty: "Maître Barbier & Dégradés Précision",
    category: "barbier",
    city: "Paris 11e",
    currentSalon: "Maison Barber Bastille",
    rating: 4.98,
    reviewsCount: 142,
    startingPrice: 35,
    services: [
      { name: "Coupe & Dégradé Signature", price: 35, duration: "45 min" },
      { name: "Taille de Barbe & Soin serviette chaude", price: 28, duration: "30 min" },
    ],
  },
  {
    id: "pro-2",
    type: "pro",
    name: "Éléonore Rossi",
    specialty: "Coloriste Experte & Balayage Ombré",
    category: "coiffure",
    city: "Paris 1er",
    currentSalon: "Atelier Saint-Honoré",
    rating: 4.99,
    reviewsCount: 189,
    startingPrice: 65,
    services: [
      { name: "Balayage Haute Couture & Gloss", price: 140, duration: "2h30" },
      { name: "Coupe Créateur & Coiffage", price: 65, duration: "1h00" },
    ],
  },
  {
    id: "pro-3",
    type: "pro",
    name: "Damien 'Kuro' Vane",
    specialty: "Tatoueur Fineline & Gravure Noire",
    category: "tatouage",
    city: "Paris 10e",
    currentSalon: "Atelier Encre Noire",
    rating: 5.0,
    reviewsCount: 97,
    startingPrice: 120,
    services: [
      { name: "Flash Fineline (Pièce unique)", price: 120, duration: "1h30" },
      { name: "Projet personnalisé sur mesure (l'heure)", price: 100, duration: "Sur devis" },
    ],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = (searchParams.get("target") as SearchTarget) || "chair";
  const category = searchParams.get("category");
  const city = searchParams.get("city")?.toLowerCase();

  if (target === "pro") {
    let results = mockPros;
    if (category && category !== "all") {
      results = results.filter((p) => p.category === category);
    }
    if (city) {
      results = results.filter((p) => p.city.toLowerCase().includes(city));
    }
    return NextResponse.json({
      target: "pro",
      count: results.length,
      data: results,
    });
  }

  // Otherwise chair search
  let results = mockChairs;
  if (category && category !== "all") {
    results = results.filter((c) => c.category === category);
  }
  if (city) {
    results = results.filter((c) => c.city.toLowerCase().includes(city));
  }

  return NextResponse.json({
    target: "chair",
    count: results.length,
    data: results,
  });
}
