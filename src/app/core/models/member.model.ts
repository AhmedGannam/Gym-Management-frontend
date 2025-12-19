// src/app/core/models/member.model.ts

import { User } from "./user.model";
import { Membership } from "./membership.model";

export interface Member {
  member_id: number;
  gym_id: number;
  user_id: number;
  email: string;
  phone: string;
  first_name: string;
  last_name: string | null;
  join_date: string; // DATEONLY format (YYYY-MM-DD)
  member_status: 'pending' | 'active' | 'inactive' | 'suspended';
  photo: string | null; // URL string for the photo
  notes: string | null;
  created_at: string; // ISO string date
  updated_at: string; // ISO string date

  // Optional: For frontend convenience when including related models
  User?: User;
  Memberships?: Membership[]; // A member can have multiple membership records
  current_membership?: Membership & { plan_name?: string }; // For the formatted member list from backend
}

// This interface is specific to the payload for adding a new member
// It might include fields that are not directly on the Member model, but
// are needed for the backend's `addMember` process.
export interface AddMemberPayload {
  first_name: string;
  last_name?: string;
  email: string;
  password: string; // Only for new user creation
  phone: string;
  gym_id: number;

  selected_plan_id?: number | null;
  admission_fee?: number; // Made optional as it might be 0
  paid_amount?: number; // Amount paid for membership, made optional
  payment_method: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'online_gateway'; // Explicit enum values
  transaction_type: 'membership_payment' | 'admission_fee' | 'merchandise' | 'personal_training' | 'other_fee'; // Explicit enum values
  payment_status: 'paid' | 'due' | 'partially_paid' | 'refunded'; // Explicit enum values for frontend form

  start_date?: string; // DATEONLY format, for membership
  end_date?: string;   // DATEONLY format, for membership
  photo?: string | null; // Base64 or URL for initial photo upload
}

export interface MemberDashboardData {
  gym_name: string;
  join_date: string;
  member_status: 'pending' | 'active' | 'inactive' | 'suspended';
  unique_join_code: string;
}

export interface MembershipHistory {
  id: number;
  planName: string;
  startDate: Date;
  expiryDate: Date;
  duration: number; // in months
  amount: number;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
}

export interface TransactionHistory {
  id: number;
  description: string;
  amount: number;
  date: Date;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  status: 'completed' | 'pending' | 'failed';
  type: 'membership' | 'water' | 'supplement' | 'locker' | 'other' | 'event' | 'personalTraining'| 'Cardio' | 'Credit';
}

// export interface MembershipPlan {
//   id: number;
//   name: string;
//   duration: number; // in months
//   price: number;
//   features: string[];
// }

// export interface Payment {
//   id: number;
//   memberId: number;
//   amount: number;
//   date: Date;
//   method: 'cash' | 'card' | 'upi' | 'bank_transfer';
//   status: 'completed' | 'pending' | 'failed';
// }