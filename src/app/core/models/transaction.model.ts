// src/app/core/models/transaction.model.ts

export interface Transaction {
  transaction_id: number;
  gym_id: number;
  member_id: number;
  membership_id: number | null; // Can be NULL if transaction is not for a membership payment
  amount: number;
  payment_method: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'online_gateway';
  transaction_type: 'membership_payment' | 'admission_fee' | 'merchandise' | 'personal_training' | 'other_fee';
  description: string | null;
  transaction_date: string; // DATETIME format (ISO string)
  created_at: string; // ISO string date
  updated_at: string; // ISO string date
}