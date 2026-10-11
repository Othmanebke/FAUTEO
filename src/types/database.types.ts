
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "amenities": {
                  Row: {
                    "code": string,"label": string,"scope": string,"trades": (Database["public"]['Enums']["trade"])[]
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"label": string,"scope": string,"trades"?: (Database["public"]['Enums']["trade"])[]
                  }
                  Update: {
                    "code"?: string,"label"?: string,"scope"?: string,"trades"?: (Database["public"]['Enums']["trade"])[]
                  }
                  Relationships: [
                    
                  ]
                },"audit_log": {
                  Row: {
                    "action": string,"actor_id": string | null,"created_at": string,"data": NonNullable<Json>,"entity": string,"entity_id": string | null,"id": number
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_id"?: string | null,"created_at"?: string,"data"?: NonNullable<Json>,"entity": string,"entity_id"?: string | null,"id"?: never
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"created_at"?: string,"data"?: NonNullable<Json>,"entity"?: string,"entity_id"?: string | null,"id"?: never
                  }
                  Relationships: [
                    {
      foreignKeyName: "audit_log_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"availability_blocks": {
                  Row: {
                    "created_at": string,"id": string,"period": unknown,"reason": string | null,"station_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"period": unknown,"reason"?: string | null,"station_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"period"?: unknown,"reason"?: string | null,"station_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "availability_blocks_station_id_fkey"
      columns: ["station_id"]
isOneToOne: false
      referencedRelation: "stations"
      referencedColumns: ["id"]
    }
                  ]
                },"availability_rules": {
                  Row: {
                    "created_at": string,"end_time": string,"id": string,"start_time": string,"station_id": string,"valid_from": string,"valid_until": string | null,"weekday": number
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"end_time": string,"id"?: string,"start_time": string,"station_id": string,"valid_from"?: string,"valid_until"?: string | null,"weekday": number
                  }
                  Update: {
                    "created_at"?: string,"end_time"?: string,"id"?: string,"start_time"?: string,"station_id"?: string,"valid_from"?: string,"valid_until"?: string | null,"weekday"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "availability_rules_station_id_fkey"
      columns: ["station_id"]
isOneToOne: false
      referencedRelation: "stations"
      referencedColumns: ["id"]
    }
                  ]
                },"bookings": {
                  Row: {
                    "base_cents": number,"booking_mode": Database["public"]['Enums']["booking_mode"],"cancellation_policy": Database["public"]['Enums']["cancellation_policy"],"cancellation_reason": string | null,"cancelled_at": string | null,"cancelled_by": Database["public"]['Enums']["actor"] | null,"completed_at": string | null,"confirmed_at": string | null,"created_at": string,"currency": string,"declined_at": string | null,"deposit_cents": number,"deposit_strategy": Database["public"]['Enums']["deposit_strategy"] | null,"hold_expires_at": string | null,"host_fee_bps": number,"host_fee_cents": number,"host_id": string,"host_payout_cents": number,"house_rules_accepted_at": string,"id": string,"period": unknown,"pro_fee_bps": number,"pro_fee_cents": number,"pro_id": string,"pro_message": string | null,"quantity": number,"reference": string,"refund_cents": number,"request_expires_at": string | null,"station_id": string,"status": Database["public"]['Enums']["booking_status"],"subtotal_cents": number,"surcharge_cents": number,"total_cents": number,"unit": Database["public"]['Enums']["price_unit"],"updated_at": string,"venue_id": string,"schedule_booking_money": undefined | null
                  }
                  ComputedFields: "schedule_booking_money"
                  Insert: {
                    "base_cents": number,"booking_mode": Database["public"]['Enums']["booking_mode"],"cancellation_policy": Database["public"]['Enums']["cancellation_policy"],"cancellation_reason"?: string | null,"cancelled_at"?: string | null,"cancelled_by"?: Database["public"]['Enums']["actor"] | null,"completed_at"?: string | null,"confirmed_at"?: string | null,"created_at"?: string,"currency"?: string,"declined_at"?: string | null,"deposit_cents"?: number,"deposit_strategy"?: Database["public"]['Enums']["deposit_strategy"] | null,"hold_expires_at"?: string | null,"host_fee_bps": number,"host_fee_cents": number,"host_id": string,"host_payout_cents": number,"house_rules_accepted_at": string,"id"?: string,"period": unknown,"pro_fee_bps": number,"pro_fee_cents": number,"pro_id": string,"pro_message"?: string | null,"quantity": number,"reference"?: string,"refund_cents"?: number,"request_expires_at"?: string | null,"station_id": string,"status"?: Database["public"]['Enums']["booking_status"],"subtotal_cents": number,"surcharge_cents": number,"total_cents": number,"unit": Database["public"]['Enums']["price_unit"],"updated_at"?: string,"venue_id": string
                  }
                  Update: {
                    "base_cents"?: number,"booking_mode"?: Database["public"]['Enums']["booking_mode"],"cancellation_policy"?: Database["public"]['Enums']["cancellation_policy"],"cancellation_reason"?: string | null,"cancelled_at"?: string | null,"cancelled_by"?: Database["public"]['Enums']["actor"] | null,"completed_at"?: string | null,"confirmed_at"?: string | null,"created_at"?: string,"currency"?: string,"declined_at"?: string | null,"deposit_cents"?: number,"deposit_strategy"?: Database["public"]['Enums']["deposit_strategy"] | null,"hold_expires_at"?: string | null,"host_fee_bps"?: number,"host_fee_cents"?: number,"host_id"?: string,"host_payout_cents"?: number,"house_rules_accepted_at"?: string,"id"?: string,"period"?: unknown,"pro_fee_bps"?: number,"pro_fee_cents"?: number,"pro_id"?: string,"pro_message"?: string | null,"quantity"?: number,"reference"?: string,"refund_cents"?: number,"request_expires_at"?: string | null,"station_id"?: string,"status"?: Database["public"]['Enums']["booking_status"],"subtotal_cents"?: number,"surcharge_cents"?: number,"total_cents"?: number,"unit"?: Database["public"]['Enums']["price_unit"],"updated_at"?: string,"venue_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "bookings_host_id_fkey"
      columns: ["host_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "bookings_pro_id_fkey"
      columns: ["pro_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "bookings_station_id_fkey"
      columns: ["station_id"]
isOneToOne: false
      referencedRelation: "stations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "bookings_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: false
      referencedRelation: "venues"
      referencedColumns: ["id"]
    }
                  ]
                },"contracts": {
                  Row: {
                    "booking_id": string,"created_at": string,"host_signed_at": string | null,"host_signed_ip": unknown,"id": string,"pdf_path": string | null,"pro_signed_at": string | null,"pro_signed_ip": unknown,"sha256": string | null,"template_version": string
                  }
                  ComputedFields: never
                  Insert: {
                    "booking_id": string,"created_at"?: string,"host_signed_at"?: string | null,"host_signed_ip"?: unknown,"id"?: string,"pdf_path"?: string | null,"pro_signed_at"?: string | null,"pro_signed_ip"?: unknown,"sha256"?: string | null,"template_version": string
                  }
                  Update: {
                    "booking_id"?: string,"created_at"?: string,"host_signed_at"?: string | null,"host_signed_ip"?: unknown,"id"?: string,"pdf_path"?: string | null,"pro_signed_at"?: string | null,"pro_signed_ip"?: unknown,"sha256"?: string | null,"template_version"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "contracts_booking_id_fkey"
      columns: ["booking_id"]
isOneToOne: true
      referencedRelation: "bookings"
      referencedColumns: ["id"]
    }
                  ]
                },"conversations": {
                  Row: {
                    "created_at": string,"host_id": string,"id": string,"last_message_at": string | null,"pro_id": string,"station_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"host_id": string,"id"?: string,"last_message_at"?: string | null,"pro_id": string,"station_id": string
                  }
                  Update: {
                    "created_at"?: string,"host_id"?: string,"id"?: string,"last_message_at"?: string | null,"pro_id"?: string,"station_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "conversations_host_id_fkey"
      columns: ["host_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_pro_id_fkey"
      columns: ["pro_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_station_id_fkey"
      columns: ["station_id"]
isOneToOne: false
      referencedRelation: "stations"
      referencedColumns: ["id"]
    }
                  ]
                },"deposits": {
                  Row: {
                    "amount_cents": number,"booking_id": string,"captured_cents": number,"created_at": string,"hold_at": string | null,"id": string,"release_at": string,"status": Database["public"]['Enums']["deposit_status"],"strategy": Database["public"]['Enums']["deposit_strategy"],"stripe_payment_intent_id": string | null,"stripe_payment_method_id": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_cents": number,"booking_id": string,"captured_cents"?: number,"created_at"?: string,"hold_at"?: string | null,"id"?: string,"release_at": string,"status"?: Database["public"]['Enums']["deposit_status"],"strategy": Database["public"]['Enums']["deposit_strategy"],"stripe_payment_intent_id"?: string | null,"stripe_payment_method_id"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "amount_cents"?: number,"booking_id"?: string,"captured_cents"?: number,"created_at"?: string,"hold_at"?: string | null,"id"?: string,"release_at"?: string,"status"?: Database["public"]['Enums']["deposit_status"],"strategy"?: Database["public"]['Enums']["deposit_strategy"],"stripe_payment_intent_id"?: string | null,"stripe_payment_method_id"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "deposits_booking_id_fkey"
      columns: ["booking_id"]
isOneToOne: true
      referencedRelation: "bookings"
      referencedColumns: ["id"]
    }
                  ]
                },"disputes": {
                  Row: {
                    "attachments": (string)[],"booking_id": string,"created_at": string,"deposit_capture_cents": number,"description": string,"id": string,"opened_by": string,"refund_cents": number,"resolution_note": string | null,"resolved_at": string | null,"resolved_by": string | null,"status": Database["public"]['Enums']["dispute_status"]
                  }
                  ComputedFields: never
                  Insert: {
                    "attachments"?: (string)[],"booking_id": string,"created_at"?: string,"deposit_capture_cents"?: number,"description": string,"id"?: string,"opened_by": string,"refund_cents"?: number,"resolution_note"?: string | null,"resolved_at"?: string | null,"resolved_by"?: string | null,"status"?: Database["public"]['Enums']["dispute_status"]
                  }
                  Update: {
                    "attachments"?: (string)[],"booking_id"?: string,"created_at"?: string,"deposit_capture_cents"?: number,"description"?: string,"id"?: string,"opened_by"?: string,"refund_cents"?: number,"resolution_note"?: string | null,"resolved_at"?: string | null,"resolved_by"?: string | null,"status"?: Database["public"]['Enums']["dispute_status"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "disputes_booking_id_fkey"
      columns: ["booking_id"]
isOneToOne: false
      referencedRelation: "bookings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "disputes_opened_by_fkey"
      columns: ["opened_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "disputes_resolved_by_fkey"
      columns: ["resolved_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"documents": {
                  Row: {
                    "created_at": string,"expires_at": string | null,"id": string,"owner_id": string,"rejection_reason": string | null,"reviewed_at": string | null,"reviewed_by": string | null,"status": Database["public"]['Enums']["document_status"],"storage_path": string,"type": Database["public"]['Enums']["document_type"],"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"expires_at"?: string | null,"id"?: string,"owner_id": string,"rejection_reason"?: string | null,"reviewed_at"?: string | null,"reviewed_by"?: string | null,"status"?: Database["public"]['Enums']["document_status"],"storage_path": string,"type": Database["public"]['Enums']["document_type"],"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"expires_at"?: string | null,"id"?: string,"owner_id"?: string,"rejection_reason"?: string | null,"reviewed_at"?: string | null,"reviewed_by"?: string | null,"status"?: Database["public"]['Enums']["document_status"],"storage_path"?: string,"type"?: Database["public"]['Enums']["document_type"],"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "documents_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "documents_reviewed_by_fkey"
      columns: ["reviewed_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"host_profiles": {
                  Row: {
                    "billing_address": string | null,"billing_city": string | null,"billing_postal_code": string | null,"birth_date": string | null,"cancellation_count": number,"created_at": string,"legal_name": string,"profile_id": string,"siret": string,"stripe_account_id": string | null,"stripe_ready": boolean,"tax_id": string | null,"updated_at": string,"vat_number": string | null,"vat_regime": Database["public"]['Enums']["vat_regime"]
                  }
                  ComputedFields: never
                  Insert: {
                    "billing_address"?: string | null,"billing_city"?: string | null,"billing_postal_code"?: string | null,"birth_date"?: string | null,"cancellation_count"?: number,"created_at"?: string,"legal_name": string,"profile_id": string,"siret": string,"stripe_account_id"?: string | null,"stripe_ready"?: boolean,"tax_id"?: string | null,"updated_at"?: string,"vat_number"?: string | null,"vat_regime"?: Database["public"]['Enums']["vat_regime"]
                  }
                  Update: {
                    "billing_address"?: string | null,"billing_city"?: string | null,"billing_postal_code"?: string | null,"birth_date"?: string | null,"cancellation_count"?: number,"created_at"?: string,"legal_name"?: string,"profile_id"?: string,"siret"?: string,"stripe_account_id"?: string | null,"stripe_ready"?: boolean,"tax_id"?: string | null,"updated_at"?: string,"vat_number"?: string | null,"vat_regime"?: Database["public"]['Enums']["vat_regime"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "host_profiles_profile_id_fkey"
      columns: ["profile_id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"invoice_sequences": {
                  Row: {
                    "last_number": number,"series": string,"year": number
                  }
                  ComputedFields: never
                  Insert: {
                    "last_number"?: number,"series": string,"year": number
                  }
                  Update: {
                    "last_number"?: number,"series"?: string,"year"?: number
                  }
                  Relationships: [
                    
                  ]
                },"invoices": {
                  Row: {
                    "amount_ht_cents": number,"amount_ttc_cents": number,"booking_id": string,"credit_for": string | null,"id": string,"issued_at": string,"issuer_profile_id": string | null,"kind": Database["public"]['Enums']["invoice_kind"],"number": string,"pdf_path": string | null,"recipient_profile_id": string,"vat_cents": number,"vat_mention": string | null,"vat_rate_bps": number
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_ht_cents": number,"amount_ttc_cents": number,"booking_id": string,"credit_for"?: string | null,"id"?: string,"issued_at"?: string,"issuer_profile_id"?: string | null,"kind": Database["public"]['Enums']["invoice_kind"],"number": string,"pdf_path"?: string | null,"recipient_profile_id": string,"vat_cents": number,"vat_mention"?: string | null,"vat_rate_bps": number
                  }
                  Update: {
                    "amount_ht_cents"?: number,"amount_ttc_cents"?: number,"booking_id"?: string,"credit_for"?: string | null,"id"?: string,"issued_at"?: string,"issuer_profile_id"?: string | null,"kind"?: Database["public"]['Enums']["invoice_kind"],"number"?: string,"pdf_path"?: string | null,"recipient_profile_id"?: string,"vat_cents"?: number,"vat_mention"?: string | null,"vat_rate_bps"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "invoices_booking_id_fkey"
      columns: ["booking_id"]
isOneToOne: false
      referencedRelation: "bookings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "invoices_credit_for_fkey"
      columns: ["credit_for"]
isOneToOne: false
      referencedRelation: "invoices"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "invoices_issuer_profile_id_fkey"
      columns: ["issuer_profile_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "invoices_recipient_profile_id_fkey"
      columns: ["recipient_profile_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"messages": {
                  Row: {
                    "attachments": (string)[],"body": string,"conversation_id": string,"created_at": string,"id": string,"read_at": string | null,"sender_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "attachments"?: (string)[],"body"?: string,"conversation_id": string,"created_at"?: string,"id"?: string,"read_at"?: string | null,"sender_id": string
                  }
                  Update: {
                    "attachments"?: (string)[],"body"?: string,"conversation_id"?: string,"created_at"?: string,"id"?: string,"read_at"?: string | null,"sender_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "messages_conversation_id_fkey"
      columns: ["conversation_id"]
isOneToOne: false
      referencedRelation: "conversations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "messages_sender_id_fkey"
      columns: ["sender_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"notifications": {
                  Row: {
                    "body": string | null,"created_at": string,"data": NonNullable<Json>,"email_sent_at": string | null,"id": string,"push_sent_at": string | null,"read_at": string | null,"sms_sent_at": string | null,"title": string,"type": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body"?: string | null,"created_at"?: string,"data"?: NonNullable<Json>,"email_sent_at"?: string | null,"id"?: string,"push_sent_at"?: string | null,"read_at"?: string | null,"sms_sent_at"?: string | null,"title": string,"type": string,"user_id": string
                  }
                  Update: {
                    "body"?: string | null,"created_at"?: string,"data"?: NonNullable<Json>,"email_sent_at"?: string | null,"id"?: string,"push_sent_at"?: string | null,"read_at"?: string | null,"sms_sent_at"?: string | null,"title"?: string,"type"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notifications_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"payments": {
                  Row: {
                    "amount_cents": number,"booking_id": string,"created_at": string,"id": string,"kind": Database["public"]['Enums']["payment_kind"],"status": Database["public"]['Enums']["payment_status"],"stripe_charge_id": string | null,"stripe_payment_intent_id": string | null,"stripe_refund_id": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_cents": number,"booking_id": string,"created_at"?: string,"id"?: string,"kind": Database["public"]['Enums']["payment_kind"],"status"?: Database["public"]['Enums']["payment_status"],"stripe_charge_id"?: string | null,"stripe_payment_intent_id"?: string | null,"stripe_refund_id"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "amount_cents"?: number,"booking_id"?: string,"created_at"?: string,"id"?: string,"kind"?: Database["public"]['Enums']["payment_kind"],"status"?: Database["public"]['Enums']["payment_status"],"stripe_charge_id"?: string | null,"stripe_payment_intent_id"?: string | null,"stripe_refund_id"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "payments_booking_id_fkey"
      columns: ["booking_id"]
isOneToOne: false
      referencedRelation: "bookings"
      referencedColumns: ["id"]
    }
                  ]
                },"payouts": {
                  Row: {
                    "amount_cents": number,"booking_id": string,"created_at": string,"failure_reason": string | null,"host_id": string,"id": string,"installment": number,"paid_at": string | null,"scheduled_for": string,"status": Database["public"]['Enums']["payout_status"],"stripe_transfer_id": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_cents": number,"booking_id": string,"created_at"?: string,"failure_reason"?: string | null,"host_id": string,"id"?: string,"installment"?: number,"paid_at"?: string | null,"scheduled_for": string,"status"?: Database["public"]['Enums']["payout_status"],"stripe_transfer_id"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "amount_cents"?: number,"booking_id"?: string,"created_at"?: string,"failure_reason"?: string | null,"host_id"?: string,"id"?: string,"installment"?: number,"paid_at"?: string | null,"scheduled_for"?: string,"status"?: Database["public"]['Enums']["payout_status"],"stripe_transfer_id"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "payouts_booking_id_fkey"
      columns: ["booking_id"]
isOneToOne: false
      referencedRelation: "bookings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "payouts_host_id_fkey"
      columns: ["host_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"platform_settings": {
                  Row: {
                    "deposit_hold_max_days": number,"deposit_release_hours": number,"half_day_hours": number,"host_fee_bps": number,"id": boolean,"max_deposit_cents": number,"payment_hold_minutes": number,"payout_delay_hours": number,"pro_fee_bps": number,"request_expiry_hours": number,"review_window_days": number,"suspension_report_threshold": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "deposit_hold_max_days"?: number,"deposit_release_hours"?: number,"half_day_hours"?: number,"host_fee_bps"?: number,"id"?: boolean,"max_deposit_cents"?: number,"payment_hold_minutes"?: number,"payout_delay_hours"?: number,"pro_fee_bps"?: number,"request_expiry_hours"?: number,"review_window_days"?: number,"suspension_report_threshold"?: number,"updated_at"?: string
                  }
                  Update: {
                    "deposit_hold_max_days"?: number,"deposit_release_hours"?: number,"half_day_hours"?: number,"host_fee_bps"?: number,"id"?: boolean,"max_deposit_cents"?: number,"payment_hold_minutes"?: number,"payout_delay_hours"?: number,"pro_fee_bps"?: number,"request_expiry_hours"?: number,"review_window_days"?: number,"suspension_report_threshold"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"portfolio_images": {
                  Row: {
                    "created_at": string,"id": string,"position": number,"pro_id": string,"storage_path": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"position"?: number,"pro_id": string,"storage_path": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"position"?: number,"pro_id"?: string,"storage_path"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "portfolio_images_pro_id_fkey"
      columns: ["pro_id"]
isOneToOne: false
      referencedRelation: "pro_profiles"
      referencedColumns: ["profile_id"]
    }
                  ]
                },"pro_profiles": {
                  Row: {
                    "company_name": string | null,"created_at": string,"experience_years": number | null,"instagram_url": string | null,"profile_id": string,"rating_avg": number | null,"rating_count": number,"siret": string | null,"specialties": (string)[],"trades": (Database["public"]['Enums']["trade"])[],"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "company_name"?: string | null,"created_at"?: string,"experience_years"?: number | null,"instagram_url"?: string | null,"profile_id": string,"rating_avg"?: number | null,"rating_count"?: number,"siret"?: string | null,"specialties"?: (string)[],"trades": (Database["public"]['Enums']["trade"])[],"updated_at"?: string
                  }
                  Update: {
                    "company_name"?: string | null,"created_at"?: string,"experience_years"?: number | null,"instagram_url"?: string | null,"profile_id"?: string,"rating_avg"?: number | null,"rating_count"?: number,"siret"?: string | null,"specialties"?: (string)[],"trades"?: (Database["public"]['Enums']["trade"])[],"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "pro_profiles_profile_id_fkey"
      columns: ["profile_id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "active_role": Database["public"]['Enums']["app_role"] | null,"avatar_path": string | null,"bio": string | null,"city": string | null,"created_at": string,"first_name": string,"id": string,"is_admin": boolean,"is_host": boolean,"is_pro": boolean,"last_name": string,"stripe_customer_id": string | null,"suspended_at": string | null,"suspension_reason": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active_role"?: Database["public"]['Enums']["app_role"] | null,"avatar_path"?: string | null,"bio"?: string | null,"city"?: string | null,"created_at"?: string,"first_name"?: string,"id": string,"is_admin"?: boolean,"is_host"?: boolean,"is_pro"?: boolean,"last_name"?: string,"stripe_customer_id"?: string | null,"suspended_at"?: string | null,"suspension_reason"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "active_role"?: Database["public"]['Enums']["app_role"] | null,"avatar_path"?: string | null,"bio"?: string | null,"city"?: string | null,"created_at"?: string,"first_name"?: string,"id"?: string,"is_admin"?: boolean,"is_host"?: boolean,"is_pro"?: boolean,"last_name"?: string,"stripe_customer_id"?: string | null,"suspended_at"?: string | null,"suspension_reason"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"reports": {
                  Row: {
                    "created_at": string,"details": string | null,"handled_at": string | null,"handled_by": string | null,"id": string,"reason": Database["public"]['Enums']["report_reason"],"reporter_id": string,"resolution_note": string | null,"status": Database["public"]['Enums']["report_status"],"target_id": string,"target_profile_id": string | null,"target_type": Database["public"]['Enums']["report_target"]
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"details"?: string | null,"handled_at"?: string | null,"handled_by"?: string | null,"id"?: string,"reason": Database["public"]['Enums']["report_reason"],"reporter_id": string,"resolution_note"?: string | null,"status"?: Database["public"]['Enums']["report_status"],"target_id": string,"target_profile_id"?: string | null,"target_type": Database["public"]['Enums']["report_target"]
                  }
                  Update: {
                    "created_at"?: string,"details"?: string | null,"handled_at"?: string | null,"handled_by"?: string | null,"id"?: string,"reason"?: Database["public"]['Enums']["report_reason"],"reporter_id"?: string,"resolution_note"?: string | null,"status"?: Database["public"]['Enums']["report_status"],"target_id"?: string,"target_profile_id"?: string | null,"target_type"?: Database["public"]['Enums']["report_target"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "reports_handled_by_fkey"
      columns: ["handled_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_reporter_id_fkey"
      columns: ["reporter_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_target_profile_id_fkey"
      columns: ["target_profile_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"reviews": {
                  Row: {
                    "author_id": string,"author_role": Database["public"]['Enums']["review_role"],"booking_id": string,"comment": string | null,"created_at": string,"hidden_at": string | null,"id": string,"published_at": string | null,"rating": number,"station_id": string,"target_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "author_id": string,"author_role": Database["public"]['Enums']["review_role"],"booking_id": string,"comment"?: string | null,"created_at"?: string,"hidden_at"?: string | null,"id"?: string,"published_at"?: string | null,"rating": number,"station_id": string,"target_id": string
                  }
                  Update: {
                    "author_id"?: string,"author_role"?: Database["public"]['Enums']["review_role"],"booking_id"?: string,"comment"?: string | null,"created_at"?: string,"hidden_at"?: string | null,"id"?: string,"published_at"?: string | null,"rating"?: number,"station_id"?: string,"target_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "reviews_author_id_fkey"
      columns: ["author_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reviews_booking_id_fkey"
      columns: ["booking_id"]
isOneToOne: false
      referencedRelation: "bookings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reviews_station_id_fkey"
      columns: ["station_id"]
isOneToOne: false
      referencedRelation: "stations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reviews_target_id_fkey"
      columns: ["target_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"station_photos": {
                  Row: {
                    "created_at": string,"id": string,"position": number,"station_id": string,"storage_path": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"position"?: number,"station_id": string,"storage_path": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"position"?: number,"station_id"?: string,"storage_path"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "station_photos_station_id_fkey"
      columns: ["station_id"]
isOneToOne: false
      referencedRelation: "stations"
      referencedColumns: ["id"]
    }
                  ]
                },"stations": {
                  Row: {
                    "amenities": (string)[],"booking_mode": Database["public"]['Enums']["booking_mode"],"cancellation_policy": Database["public"]['Enums']["cancellation_policy"],"created_at": string,"deposit_cents": number,"description": string | null,"host_id": string,"id": string,"price_day_cents": number | null,"price_half_day_cents": number | null,"price_hour_cents": number | null,"price_month_cents": number | null,"price_week_cents": number | null,"published_at": string | null,"rating_avg": number | null,"rating_count": number,"status": Database["public"]['Enums']["station_status"],"surface_m2": number | null,"title": string,"trades": (Database["public"]['Enums']["trade"])[],"type": Database["public"]['Enums']["station_type"],"updated_at": string,"venue_id": string,"weekend_surcharge_bps": number
                  }
                  ComputedFields: never
                  Insert: {
                    "amenities"?: (string)[],"booking_mode"?: Database["public"]['Enums']["booking_mode"],"cancellation_policy"?: Database["public"]['Enums']["cancellation_policy"],"created_at"?: string,"deposit_cents"?: number,"description"?: string | null,"host_id": string,"id"?: string,"price_day_cents"?: number | null,"price_half_day_cents"?: number | null,"price_hour_cents"?: number | null,"price_month_cents"?: number | null,"price_week_cents"?: number | null,"published_at"?: string | null,"rating_avg"?: number | null,"rating_count"?: number,"status"?: Database["public"]['Enums']["station_status"],"surface_m2"?: number | null,"title": string,"trades"?: (Database["public"]['Enums']["trade"])[],"type": Database["public"]['Enums']["station_type"],"updated_at"?: string,"venue_id": string,"weekend_surcharge_bps"?: number
                  }
                  Update: {
                    "amenities"?: (string)[],"booking_mode"?: Database["public"]['Enums']["booking_mode"],"cancellation_policy"?: Database["public"]['Enums']["cancellation_policy"],"created_at"?: string,"deposit_cents"?: number,"description"?: string | null,"host_id"?: string,"id"?: string,"price_day_cents"?: number | null,"price_half_day_cents"?: number | null,"price_hour_cents"?: number | null,"price_month_cents"?: number | null,"price_week_cents"?: number | null,"published_at"?: string | null,"rating_avg"?: number | null,"rating_count"?: number,"status"?: Database["public"]['Enums']["station_status"],"surface_m2"?: number | null,"title"?: string,"trades"?: (Database["public"]['Enums']["trade"])[],"type"?: Database["public"]['Enums']["station_type"],"updated_at"?: string,"venue_id"?: string,"weekend_surcharge_bps"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "stations_host_id_fkey"
      columns: ["host_id"]
isOneToOne: false
      referencedRelation: "host_profiles"
      referencedColumns: ["profile_id"]
    },{
      foreignKeyName: "stations_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: false
      referencedRelation: "venues"
      referencedColumns: ["id"]
    }
                  ]
                },"venue_photos": {
                  Row: {
                    "created_at": string,"id": string,"position": number,"storage_path": string,"venue_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"position"?: number,"storage_path": string,"venue_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"position"?: number,"storage_path"?: string,"venue_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "venue_photos_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: false
      referencedRelation: "venues"
      referencedColumns: ["id"]
    }
                  ]
                },"venues": {
                  Row: {
                    "address_line": string,"amenities": (string)[],"city": string,"created_at": string,"description": string | null,"host_id": string,"house_rules": string | null,"id": string,"latitude": number,"location": unknown,"longitude": number,"name": string,"postal_code": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "address_line": string,"amenities"?: (string)[],"city": string,"created_at"?: string,"description"?: string | null,"host_id": string,"house_rules"?: string | null,"id"?: string,"latitude": number,"location"?: never,"longitude": number,"name": string,"postal_code": string,"updated_at"?: string
                  }
                  Update: {
                    "address_line"?: string,"amenities"?: (string)[],"city"?: string,"created_at"?: string,"description"?: string | null,"host_id"?: string,"house_rules"?: string | null,"id"?: string,"latitude"?: number,"location"?: never,"longitude"?: number,"name"?: string,"postal_code"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "venues_host_id_fkey"
      columns: ["host_id"]
isOneToOne: false
      referencedRelation: "host_profiles"
      referencedColumns: ["profile_id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "advance_booking_statuses":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"apply_bps":
{ Args: { "amount": number,"bps": number }; Returns: number
                           },
"booking_payment_authorized":
{ Args: { "p_booking": string }; Returns: {
              "base_cents": number,
"booking_mode": Database["public"]['Enums']["booking_mode"],
"cancellation_policy": Database["public"]['Enums']["cancellation_policy"],
"cancellation_reason": string | null,
"cancelled_at": string | null,
"cancelled_by": Database["public"]['Enums']["actor"] | null,
"completed_at": string | null,
"confirmed_at": string | null,
"created_at": string,
"currency": string,
"declined_at": string | null,
"deposit_cents": number,
"deposit_strategy": Database["public"]['Enums']["deposit_strategy"] | null,
"hold_expires_at": string | null,
"host_fee_bps": number,
"host_fee_cents": number,
"host_id": string,
"host_payout_cents": number,
"house_rules_accepted_at": string,
"id": string,
"period": unknown,
"pro_fee_bps": number,
"pro_fee_cents": number,
"pro_id": string,
"pro_message": string | null,
"quantity": number,
"reference": string,
"refund_cents": number,
"request_expires_at": string | null,
"station_id": string,
"status": Database["public"]['Enums']["booking_status"],
"subtotal_cents": number,
"surcharge_cents": number,
"total_cents": number,
"unit": Database["public"]['Enums']["price_unit"],
"updated_at": string,
"venue_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "bookings"
        isOneToOne: true
        isSetofReturn: false
      } },
"booking_period":
{ Args: { "p_quantity": number,"p_start": string,"p_unit": Database["public"]['Enums']["price_unit"] }; Returns: unknown
                           },
"cancel_booking":
{ Args: { "p_booking": string,"p_reason"?: string }; Returns: {
              "base_cents": number,
"booking_mode": Database["public"]['Enums']["booking_mode"],
"cancellation_policy": Database["public"]['Enums']["cancellation_policy"],
"cancellation_reason": string | null,
"cancelled_at": string | null,
"cancelled_by": Database["public"]['Enums']["actor"] | null,
"completed_at": string | null,
"confirmed_at": string | null,
"created_at": string,
"currency": string,
"declined_at": string | null,
"deposit_cents": number,
"deposit_strategy": Database["public"]['Enums']["deposit_strategy"] | null,
"hold_expires_at": string | null,
"host_fee_bps": number,
"host_fee_cents": number,
"host_id": string,
"host_payout_cents": number,
"house_rules_accepted_at": string,
"id": string,
"period": unknown,
"pro_fee_bps": number,
"pro_fee_cents": number,
"pro_id": string,
"pro_message": string | null,
"quantity": number,
"reference": string,
"refund_cents": number,
"request_expires_at": string | null,
"station_id": string,
"status": Database["public"]['Enums']["booking_status"],
"subtotal_cents": number,
"surcharge_cents": number,
"total_cents": number,
"unit": Database["public"]['Enums']["price_unit"],
"updated_at": string,
"venue_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "bookings"
        isOneToOne: true
        isSetofReturn: false
      } },
"cancellation_refund_cents":
{ Args: { "p_at": string,"p_by": Database["public"]['Enums']["actor"],"p_policy": Database["public"]['Enums']["cancellation_policy"],"p_start": string,"p_subtotal": number,"p_total": number }; Returns: number
                           },
"create_booking":
{ Args: { "p_accept_house_rules": boolean,"p_message"?: string,"p_quantity": number,"p_start": string,"p_station": string,"p_unit": Database["public"]['Enums']["price_unit"] }; Returns: {
              "base_cents": number,
"booking_mode": Database["public"]['Enums']["booking_mode"],
"cancellation_policy": Database["public"]['Enums']["cancellation_policy"],
"cancellation_reason": string | null,
"cancelled_at": string | null,
"cancelled_by": Database["public"]['Enums']["actor"] | null,
"completed_at": string | null,
"confirmed_at": string | null,
"created_at": string,
"currency": string,
"declined_at": string | null,
"deposit_cents": number,
"deposit_strategy": Database["public"]['Enums']["deposit_strategy"] | null,
"hold_expires_at": string | null,
"host_fee_bps": number,
"host_fee_cents": number,
"host_id": string,
"host_payout_cents": number,
"house_rules_accepted_at": string,
"id": string,
"period": unknown,
"pro_fee_bps": number,
"pro_fee_cents": number,
"pro_id": string,
"pro_message": string | null,
"quantity": number,
"reference": string,
"refund_cents": number,
"request_expires_at": string | null,
"station_id": string,
"status": Database["public"]['Enums']["booking_status"],
"subtotal_cents": number,
"surcharge_cents": number,
"total_cents": number,
"unit": Database["public"]['Enums']["price_unit"],
"updated_at": string,
"venue_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "bookings"
        isOneToOne: true
        isSetofReturn: false
      } },
"default_trades_for":
{ Args: { "t": Database["public"]['Enums']["station_type"] }; Returns: (Database["public"]['Enums']["trade"])[]
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"is_booking_party":
{ Args: { "p_booking": string }; Returns: boolean
                           },
"is_conversation_member":
{ Args: { "conv": string }; Returns: boolean
                           },
"is_conversation_member_text":
{ Args: { "p_conversation": string }; Returns: boolean
                           },
"is_suspended":
{ Args: { "uid": string }; Returns: boolean
                           },
"is_verified":
{ Args: { "role": Database["public"]['Enums']["app_role"],"uid": string }; Returns: boolean
                           },
"issue_booking_invoices":
{ Args: { "p_booking": string }; Returns: {
              "amount_ht_cents": number,
"amount_ttc_cents": number,
"booking_id": string,
"credit_for": string | null,
"id": string,
"issued_at": string,
"issuer_profile_id": string | null,
"kind": Database["public"]['Enums']["invoice_kind"],
"number": string,
"pdf_path": string | null,
"recipient_profile_id": string,
"vat_cents": number,
"vat_mention": string | null,
"vat_rate_bps": number
            }[]
                          SetofOptions: {
        from: "*"
        to: "invoices"
        isOneToOne: false
        isSetofReturn: true
      } },
"local_midnight":
{ Args: { "d": string }; Returns: string
                           },
"missing_documents":
{ Args: { "role": Database["public"]['Enums']["app_role"],"uid": string }; Returns: (Database["public"]['Enums']["document_type"])[]
                           },
"next_invoice_number":
{ Args: { "p_series": string }; Returns: string
                           },
"notify":
{ Args: { "p_body": string,"p_data"?: Json,"p_title": string,"p_type": string,"p_user": string }; Returns: undefined
                           },
"open_conversation":
{ Args: { "p_pro"?: string,"p_station": string }; Returns: {
              "created_at": string,
"host_id": string,
"id": string,
"last_message_at": string | null,
"pro_id": string,
"station_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "conversations"
        isOneToOne: true
        isSetofReturn: false
      } },
"open_dispute":
{ Args: { "p_attachments"?: (string)[],"p_booking": string,"p_description": string }; Returns: {
              "attachments": (string)[],
"booking_id": string,
"created_at": string,
"deposit_capture_cents": number,
"description": string,
"id": string,
"opened_by": string,
"refund_cents": number,
"resolution_note": string | null,
"resolved_at": string | null,
"resolved_by": string | null,
"status": Database["public"]['Enums']["dispute_status"]
            }
                          SetofOptions: {
        from: "*"
        to: "disputes"
        isOneToOne: true
        isSetofReturn: false
      } },
"preview_cancellation":
{ Args: { "p_booking": string }; Returns: number
                           },
"publish_due_reviews":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"quote_booking":
{ Args: { "p_quantity": number,"p_start": string,"p_station": string,"p_unit": Database["public"]['Enums']["price_unit"] }; Returns: Database["public"]['CompositeTypes']["booking_quote"]
                          SetofOptions: {
        from: "*"
        to: "booking_quote"
        isOneToOne: true
        isSetofReturn: false
      } },
"refresh_rating_aggregates":
{ Args: { "p_pro": string,"p_station": string }; Returns: undefined
                           },
"required_documents":
{ Args: { "role": Database["public"]['Enums']["app_role"],"uid": string }; Returns: (Database["public"]['Enums']["document_type"])[]
                           },
"resolve_dispute":
{ Args: { "p_deposit_capture_cents": number,"p_dispute": string,"p_note": string,"p_refund_cents": number,"p_status": Database["public"]['Enums']["dispute_status"] }; Returns: {
              "attachments": (string)[],
"booking_id": string,
"created_at": string,
"deposit_capture_cents": number,
"description": string,
"id": string,
"opened_by": string,
"refund_cents": number,
"resolution_note": string | null,
"resolved_at": string | null,
"resolved_by": string | null,
"status": Database["public"]['Enums']["dispute_status"]
            }
                          SetofOptions: {
        from: "*"
        to: "disputes"
        isOneToOne: true
        isSetofReturn: false
      } },
"resolve_report":
{ Args: { "p_note"?: string,"p_report": string,"p_upheld": boolean }; Returns: {
              "created_at": string,
"details": string | null,
"handled_at": string | null,
"handled_by": string | null,
"id": string,
"reason": Database["public"]['Enums']["report_reason"],
"reporter_id": string,
"resolution_note": string | null,
"status": Database["public"]['Enums']["report_status"],
"target_id": string,
"target_profile_id": string | null,
"target_type": Database["public"]['Enums']["report_target"]
            }
                          SetofOptions: {
        from: "*"
        to: "reports"
        isOneToOne: true
        isSetofReturn: false
      } },
"respond_to_booking":
{ Args: { "p_accept": boolean,"p_booking": string,"p_reason"?: string }; Returns: {
              "base_cents": number,
"booking_mode": Database["public"]['Enums']["booking_mode"],
"cancellation_policy": Database["public"]['Enums']["cancellation_policy"],
"cancellation_reason": string | null,
"cancelled_at": string | null,
"cancelled_by": Database["public"]['Enums']["actor"] | null,
"completed_at": string | null,
"confirmed_at": string | null,
"created_at": string,
"currency": string,
"declined_at": string | null,
"deposit_cents": number,
"deposit_strategy": Database["public"]['Enums']["deposit_strategy"] | null,
"hold_expires_at": string | null,
"host_fee_bps": number,
"host_fee_cents": number,
"host_id": string,
"host_payout_cents": number,
"house_rules_accepted_at": string,
"id": string,
"period": unknown,
"pro_fee_bps": number,
"pro_fee_cents": number,
"pro_id": string,
"pro_message": string | null,
"quantity": number,
"reference": string,
"refund_cents": number,
"request_expires_at": string | null,
"station_id": string,
"status": Database["public"]['Enums']["booking_status"],
"subtotal_cents": number,
"surcharge_cents": number,
"total_cents": number,
"unit": Database["public"]['Enums']["price_unit"],
"updated_at": string,
"venue_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "bookings"
        isOneToOne: true
        isSetofReturn: false
      } },
"review_document":
{ Args: { "approve": boolean,"document_id": string,"reason"?: string }; Returns: {
              "created_at": string,
"expires_at": string | null,
"id": string,
"owner_id": string,
"rejection_reason": string | null,
"reviewed_at": string | null,
"reviewed_by": string | null,
"status": Database["public"]['Enums']["document_status"],
"storage_path": string,
"type": Database["public"]['Enums']["document_type"],
"updated_at": string
            }
                          SetofOptions: {
        from: "*"
        to: "documents"
        isOneToOne: true
        isSetofReturn: false
      } },
"schedule_booking_money":
{ Args: { "b": Omit<Database["public"]['Tables']["bookings"]['Row'], Database["public"]['Tables']["bookings"]['ComputedFields']> }; Returns: undefined
                           },
"search_stations":
{ Args: { "p_amenities"?: (string)[],"p_lat"?: number,"p_limit"?: number,"p_lng"?: number,"p_max_price_cents"?: number,"p_min_rating"?: number,"p_offset"?: number,"p_quantity"?: number,"p_radius_m"?: number,"p_sort"?: string,"p_start"?: string,"p_trade"?: Database["public"]['Enums']["trade"],"p_unit"?: Database["public"]['Enums']["price_unit"],"p_verified_only"?: boolean }; Returns: {
              "booking_mode": Database["public"]['Enums']["booking_mode"],"city": string,"cover_photo_path": string,"deposit_cents": number,"distance_m": number,"host_verified": boolean,"latitude": number,"longitude": number,"price_cents": number,"price_unit": Database["public"]['Enums']["price_unit"],"rating_avg": number,"rating_count": number,"station_id": string,"title": string,"total_count": number,"trades": (Database["public"]['Enums']["trade"])[],"type": Database["public"]['Enums']["station_type"],"venue_id": string,"venue_name": string
            }[]
                           },
"set_account_suspension":
{ Args: { "reason"?: string,"suspend": boolean,"target": string }; Returns: undefined
                           },
"split_vat":
{ Args: { "rate_bps": number,"ttc": number }; Returns: Record<string, unknown>
                           },
"station_unavailability":
{ Args: { "p_ignore_booking"?: string,"p_period": unknown,"p_station": string,"p_unit": Database["public"]['Enums']["price_unit"] }; Returns: string
                           },
"submit_review":
{ Args: { "p_booking": string,"p_comment"?: string,"p_rating": number }; Returns: {
              "author_id": string,
"author_role": Database["public"]['Enums']["review_role"],
"booking_id": string,
"comment": string | null,
"created_at": string,
"hidden_at": string | null,
"id": string,
"published_at": string | null,
"rating": number,
"station_id": string,
"target_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "reviews"
        isOneToOne: true
        isSetofReturn: false
      } },
"valid_document_types":
{ Args: { "uid": string }; Returns: (Database["public"]['Enums']["document_type"])[]
                           }
          }
          Enums: {
            "actor": "pro"|"host"|"admin"|"system","app_role": "pro"|"host","booking_mode": "request"|"instant","booking_status": "awaiting_payment"|"requested"|"confirmed"|"in_progress"|"completed"|"cancelled"|"declined"|"expired","cancellation_policy": "flexible"|"moderate"|"strict","deposit_status": "scheduled"|"held"|"released"|"captured"|"failed"|"cancelled","deposit_strategy": "hold"|"saved_card","dispute_status": "open"|"resolved_refund"|"resolved_release"|"resolved_partial"|"rejected","document_status": "pending"|"approved"|"rejected","document_type": "identity"|"siret"|"rc_pro"|"hygiene_training"|"ars_declaration"|"premises_insurance","invoice_kind": "rental"|"pro_service_fee"|"host_commission","payment_kind": "charge"|"refund","payment_status": "pending"|"requires_capture"|"succeeded"|"cancelled"|"failed","payout_status": "scheduled"|"held"|"processing"|"paid"|"cancelled"|"failed","price_unit": "hour"|"half_day"|"day"|"week"|"month","report_reason": "fraud"|"inappropriate"|"hygiene"|"no_show"|"damage"|"harassment"|"other","report_status": "open"|"upheld"|"dismissed","report_target": "profile"|"station"|"venue"|"message"|"review","review_role": "pro"|"host","station_status": "draft"|"published"|"paused"|"suspended","station_type": "fauteuil_coiffure"|"poste_barber"|"cabine_soins"|"table_onglerie"|"box_tatouage","trade": "coiffure"|"barbier"|"esthetique"|"onglerie"|"tatouage","vat_regime": "franchise"|"assujetti"
          }
          CompositeTypes: {
            "booking_quote": {
                        "period": unknown,"unit": Database["public"]['Enums']["price_unit"] | null,"quantity": number | null,"base_cents": number | null,"surcharge_cents": number | null,"subtotal_cents": number | null,"pro_fee_cents": number | null,"host_fee_cents": number | null,"total_cents": number | null,"host_payout_cents": number | null,"deposit_cents": number | null,"deposit_strategy": Database["public"]['Enums']["deposit_strategy"] | null
                      }
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "actor": ["pro", "host", "admin", "system"],"app_role": ["pro", "host"],"booking_mode": ["request", "instant"],"booking_status": ["awaiting_payment", "requested", "confirmed", "in_progress", "completed", "cancelled", "declined", "expired"],"cancellation_policy": ["flexible", "moderate", "strict"],"deposit_status": ["scheduled", "held", "released", "captured", "failed", "cancelled"],"deposit_strategy": ["hold", "saved_card"],"dispute_status": ["open", "resolved_refund", "resolved_release", "resolved_partial", "rejected"],"document_status": ["pending", "approved", "rejected"],"document_type": ["identity", "siret", "rc_pro", "hygiene_training", "ars_declaration", "premises_insurance"],"invoice_kind": ["rental", "pro_service_fee", "host_commission"],"payment_kind": ["charge", "refund"],"payment_status": ["pending", "requires_capture", "succeeded", "cancelled", "failed"],"payout_status": ["scheduled", "held", "processing", "paid", "cancelled", "failed"],"price_unit": ["hour", "half_day", "day", "week", "month"],"report_reason": ["fraud", "inappropriate", "hygiene", "no_show", "damage", "harassment", "other"],"report_status": ["open", "upheld", "dismissed"],"report_target": ["profile", "station", "venue", "message", "review"],"review_role": ["pro", "host"],"station_status": ["draft", "published", "paused", "suspended"],"station_type": ["fauteuil_coiffure", "poste_barber", "cabine_soins", "table_onglerie", "box_tatouage"],"trade": ["coiffure", "barbier", "esthetique", "onglerie", "tatouage"],"vat_regime": ["franchise", "assujetti"]
          }
        }
} as const
