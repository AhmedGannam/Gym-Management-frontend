// src/app/core/models/gym.model.ts

export interface Gym {
  gym_id: number;
  gym_name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contact_email: string;
  contact_phone: string;
  unique_join_code: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface OwnerDashboardData {
  active_memberships: number;
  total_revenue: number;
  todays_revenue: number;
  monthly_revenue: MonthlyRevenue[]; // <--- array of objects
  gym_info: {
    gym_name: string;
    unique_join_code: string;
    contact_email: string;
    contact_phone: string;
  };
  counts: {
    total_members: number;
    active_members: number;
    pending_members: number;
    expired_memberships: number; // 
    total_staffs: number;
    revenue_this_month: string; // <--- (backend uses .toFixed(2) so it's a string)
  };
}