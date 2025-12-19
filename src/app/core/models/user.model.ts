// src/app/core/models/user.model.ts

export interface User {
  user_id: number;
  phone: string | null;
  gym_id: number | null; // Can be null for super-admin or before gym creation
  email: string;
  password_hash: string; // Used internally for registration, not typically exposed directly to frontend after login
  role: 'owner' | 'member' | 'trainer' | 'staff' | 'admin';
  first_name: string;
  last_name: string | null;
  created_at: string; // ISO string date
  updated_at: string; // ISO string date
}