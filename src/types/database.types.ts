export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "pro" | "host" | "admin";
export type KYCStatus = "pending" | "approved" | "rejected" | "missing_documents";
export type DocumentType = "siret" | "identity" | "rc_pro" | "hygiene_cert";
export type BookingStatus =
  | "pending_approval"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          is_host: boolean;
          is_pro: boolean;
          active_role: UserRole;
          kyc_status: KYCStatus;
          siret_number: string | null;
          company_name: string | null;
          stripe_account_id: string | null;
          stripe_customer_id: string | null;
          charges_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_host?: boolean;
          is_pro?: boolean;
          active_role?: UserRole;
          kyc_status?: KYCStatus;
          siret_number?: string | null;
          company_name?: string | null;
          stripe_account_id?: string | null;
          stripe_customer_id?: string | null;
          charges_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_host?: boolean;
          is_pro?: boolean;
          active_role?: UserRole;
          kyc_status?: KYCStatus;
          siret_number?: string | null;
          company_name?: string | null;
          stripe_account_id?: string | null;
          stripe_customer_id?: string | null;
          charges_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      kyc_documents: {
        Row: {
          id: string;
          user_id: string;
          document_type: DocumentType;
          file_url: string;
          status: KYCStatus;
          rejection_reason: string | null;
          verified_at: string | null;
          verified_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_type: DocumentType;
          file_url: string;
          status?: KYCStatus;
          rejection_reason?: string | null;
          verified_at?: string | null;
          verified_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          document_type?: DocumentType;
          file_url?: string;
          status?: KYCStatus;
          rejection_reason?: string | null;
          verified_at?: string | null;
          verified_by?: string | null;
          created_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          slug: string;
          description: string;
          category: string;
          address: string;
          city: string;
          postal_code: string;
          latitude: number;
          longitude: number;
          price_per_half_day: number | null;
          price_per_day: number;
          price_per_month: number | null;
          deposit_amount: number; // Montant de la caution (empreinte bancaire)
          amenities: string[];
          images: string[];
          is_verified: boolean;
          is_published: boolean;
          min_duration_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          title: string;
          slug: string;
          description: string;
          category: string;
          address: string;
          city: string;
          postal_code: string;
          latitude: number;
          longitude: number;
          price_per_half_day?: number | null;
          price_per_day: number;
          price_per_month?: number | null;
          deposit_amount: number;
          amenities?: string[];
          images?: string[];
          is_verified?: boolean;
          is_published?: boolean;
          min_duration_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          host_id?: string;
          title?: string;
          slug?: string;
          description?: string;
          category?: string;
          address?: string;
          city?: string;
          postal_code?: string;
          latitude?: number;
          longitude?: number;
          price_per_half_day?: number | null;
          price_per_day?: number;
          price_per_month?: number | null;
          deposit_amount?: number;
          amenities?: string[];
          images?: string[];
          is_verified?: boolean;
          is_published?: boolean;
          min_duration_days?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          listing_id: string;
          pro_id: string;
          host_id: string;
          start_date: string;
          end_date: string;
          total_price: number;
          service_fee: number;
          deposit_amount: number;
          status: BookingStatus;
          stripe_payment_intent_id: string | null;
          stripe_deposit_intent_id: string | null;
          contract_pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          pro_id: string;
          host_id: string;
          start_date: string;
          end_date: string;
          total_price: number;
          service_fee: number;
          deposit_amount: number;
          status?: BookingStatus;
          stripe_payment_intent_id?: string | null;
          stripe_deposit_intent_id?: string | null;
          contract_pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          pro_id?: string;
          host_id?: string;
          start_date?: string;
          end_date?: string;
          total_price?: number;
          service_fee?: number;
          deposit_amount?: number;
          status?: BookingStatus;
          stripe_payment_intent_id?: string | null;
          stripe_deposit_intent_id?: string | null;
          contract_pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
