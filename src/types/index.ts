import type { Database, Enums, Tables } from "./database.types";

export type { Database };

// ---------------------------------------------------------------------
// Types dérivés du schéma Supabase (source de vérité : supabase/migrations).
// Régénérer après chaque migration : `npm run db:types`.
// ---------------------------------------------------------------------
export type Trade = Enums<"trade">;
export type StationType = Enums<"station_type">;
export type AppRole = Enums<"app_role">;
export type DocumentType = Enums<"document_type">;
export type DocumentStatus = Enums<"document_status">;
export type BookingMode = Enums<"booking_mode">;
export type BookingStatus = Enums<"booking_status">;
export type CancellationPolicy = Enums<"cancellation_policy">;
export type PriceUnit = Enums<"price_unit">;
export type StationStatus = Enums<"station_status">;

export type Profile = Tables<"profiles">;
export type ProProfile = Tables<"pro_profiles">;
export type HostProfile = Tables<"host_profiles">;
export type KycDocument = Tables<"documents">;
export type Venue = Tables<"venues">;
export type Station = Tables<"stations">;
export type AvailabilityRule = Tables<"availability_rules">;
export type Booking = Tables<"bookings">;
export type Payout = Tables<"payouts">;
export type Invoice = Tables<"invoices">;
export type Conversation = Tables<"conversations">;
export type Message = Tables<"messages">;
export type Review = Tables<"reviews">;
export type Notification = Tables<"notifications">;
export type PlatformSettings = Tables<"platform_settings">;

export type BookingQuote = Database["public"]["CompositeTypes"]["booking_quote"];
export type StationSearchResult = Database["public"]["Functions"]["search_stations"]["Returns"][number];

// ---------------------------------------------------------------------
// Types d'interface encore utilisés par les écrans maquettés.
// À supprimer quand les écrans seront branchés sur la base (étape 2 :
// retrait du parcours B2C hors périmètre du CDC).
// ---------------------------------------------------------------------
/** @deprecated Utiliser AppRole (le rôle admin n'est pas un rôle actif). */
export type UserRole = AppRole | "admin";
/** @deprecated Utiliser DocumentStatus et is_verified(). */
export type KYCStatus = "pending" | "approved" | "rejected" | "missing_documents";

export type SearchTarget = "chair" | "pro";

export type BeautyCategory =
  | "all"
  | "coiffure"
  | "barbier"
  | "esthetique"
  | "onglerie"
  | "tatouage"
  | "massage"
  | "maquillage";

export interface ProfessionalWithServices {
  id: string;
  name: string;
  specialty: string;
  category: BeautyCategory;
  city: string;
  currentSalon: string;
  avatarUrl: string;
  portfolio: string[];
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  services: {
    id: string;
    name: string;
    price: number;
    duration: string;
  }[];
}
