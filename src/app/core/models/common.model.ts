// src/app/core/models/common.model.ts

export interface ApiSuccessResponse {
  success: boolean;
  message: string;
  // Generic optional fields that might appear in various success responses
  member_id?: number;
  membership_id?: number | null;
  // Add other common success response fields as needed
}