import type { DocumentType, PriceUnit, StationType, Trade } from "@/types";

export const TRADE_LABELS: Record<Trade, string> = {
  coiffure: "Coiffure",
  barbier: "Barbier",
  esthetique: "Esthétique",
  onglerie: "Onglerie",
  tatouage: "Tatouage",
};

export const STATION_TYPE_LABELS: Record<StationType, string> = {
  fauteuil_coiffure: "Fauteuil de coiffure",
  poste_barber: "Poste barber",
  cabine_soins: "Cabine de soins",
  table_onglerie: "Table d'onglerie",
  box_tatouage: "Box de tatouage",
};

export const PRICE_UNIT_LABELS: Record<PriceUnit, { short: string; long: string }> = {
  hour: { short: "heure", long: "À l'heure" },
  half_day: { short: "demi-journée", long: "À la demi-journée" },
  day: { short: "jour", long: "À la journée" },
  week: { short: "semaine", long: "À la semaine" },
  month: { short: "mois", long: "Au mois" },
};

export const DOCUMENT_LABELS: Record<DocumentType, { title: string; description: string; needsExpiry: boolean }> = {
  identity: {
    title: "Pièce d'identité",
    description: "Carte d'identité ou passeport en cours de validité, recto et verso.",
    needsExpiry: false,
  },
  siret: {
    title: "Justificatif SIRET",
    description: "Avis de situation INSEE ou extrait Kbis de moins de 3 mois.",
    needsExpiry: false,
  },
  rc_pro: {
    title: "Attestation RC professionnelle",
    description: "Assurance responsabilité civile professionnelle couvrant votre activité.",
    needsExpiry: true,
  },
  hygiene_training: {
    title: "Formation hygiène et salubrité",
    description: "Attestation de formation obligatoire pour le tatouage et le perçage.",
    needsExpiry: false,
  },
  ars_declaration: {
    title: "Déclaration ARS",
    description: "Récépissé de déclaration d'activité de tatouage auprès de l'ARS.",
    needsExpiry: false,
  },
  premises_insurance: {
    title: "Assurance du local",
    description: "Attestation d'assurance multirisque de votre établissement.",
    needsExpiry: true,
  },
};
