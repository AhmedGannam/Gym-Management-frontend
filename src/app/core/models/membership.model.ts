// src/app/core/models/membership.model.ts

import { MembershipPlan } from "./membership-plan.model";

export interface Membership {
  membership_id: number;
  member_id: number;
  plan_id: number;
  gym_id: number;
  start_date: string; // DATEONLY format (YYYY-MM-DD)
  end_date: string;   // DATEONLY format (YYYY-MM-DD)
  actual_price_paid: number;
  payment_status: 'paid' | 'due' | 'partially_paid' | 'refunded';
  status: 'active' | 'expired' | 'cancelled'; // Overall status of the membership term
  created_at: string; // ISO string date
  updated_at: string; // ISO string date

  // Optional: For frontend convenience when including related models
  MembershipPlan?: MembershipPlan;
}