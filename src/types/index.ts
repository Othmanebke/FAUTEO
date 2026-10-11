import { Database, UserRole, KYCStatus, DocumentType, BookingStatus } from "./database.types";

export type { UserRole, KYCStatus, DocumentType, BookingStatus };
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Listing = Database["public"]["Tables"]["listings"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type KYCDocument = Database["public"]["Tables"]["kyc_documents"]["Row"];

export type BeautyCategory =
  | "all"
  | "coiffure"
  | "barbier"
  | "esthetique"
  | "onglerie"
  | "tatouage"
  | "massage"
  | "maquillage";

export interface CategoryInfo {
  id: BeautyCategory;
  name: string;
  description: string;
  iconName: string;
}

export interface SearchFilters {
  query?: string;
  city?: string;
  category?: BeautyCategory;
  maxPrice?: number;
  date?: string;
  verifiedOnly?: boolean;
}

export interface VerificationRequirement {
  type: DocumentType;
  label: string;
  description: string;
  mandatoryFor: string[];
  isUploaded?: boolean;
  status?: KYCStatus;
}
