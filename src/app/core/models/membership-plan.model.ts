// src/app/core/models/membership-plan.model.ts

export interface MembershipPlan {
  plan_id: number;
  gym_id: number;
  plan_name: string;
  description: string | null;
  duration_months: number;
  price: number; // Use number for currency
  plan_type: string; // e.g., 'monthly', 'quarterly', 'annual', 'session_based'
  is_active: boolean;
  created_at: string; // ISO string date
  updated_at: string; // ISO string date
}