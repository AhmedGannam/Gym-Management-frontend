// src/app/core/models/auth.model.ts

export interface DecodedToken {
  user_id: number;
  role: 'owner' | 'member' | 'staff';
  gym_id?: number; // Optional for super-admin if you add that later
  iat: number;
  exp: number;
}

export interface LoginResponse {
  token: string;
  role: 'owner' | 'member' | 'staff';
  gym_id?: number; // Added as per backend response
}

export interface RegisterOwnerResponse {
  success: boolean;
  gym_join_code: string;
}

export interface RegisterMemberResponse {
  success: boolean;
  gym_name: string;
  message: string;
}

export interface UserProfile {
  user_id: number;
  role: 'owner' | 'member' | 'staff' | 'admin';
  gym_id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

export interface ApiSuccessResponse {
  success: boolean;
  message?: string;
  gym_join_code?: string;
}

export interface ApiErrorResponse {
  error: string;
}