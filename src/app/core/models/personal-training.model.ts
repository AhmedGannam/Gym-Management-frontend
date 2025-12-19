import { Staff } from "./staff.model";
export interface PersonalTraining {
  pt_id: number;
  gym_id: number;
  member_id: number;
  staff_id?: number;
  duration_months: number;
  price: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  notes?: string;
  Trainer?: Staff; // Optional, if you want to include
}